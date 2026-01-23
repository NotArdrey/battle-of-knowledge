-- ============================================
-- BATTLE OF KNOWLEDGE - COMPLETE SCHEMA RESET
-- Run this ENTIRE script in Supabase SQL Editor
-- ============================================

-- ============================================
-- STEP 1: CLEANUP EVERYTHING
-- ============================================

DROP VIEW IF EXISTS teacher_student_progress CASCADE;
DROP VIEW IF EXISTS admin_user_stats CASCADE;
DROP TABLE IF EXISTS game_sessions CASCADE;
DROP TABLE IF EXISTS custom_lessons CASCADE;
DROP TABLE IF EXISTS custom_questions CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS progress CASCADE;
DROP TABLE IF EXISTS class_enrollments CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS registered_students CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS generate_class_code() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS is_teacher() CASCADE;
DROP FUNCTION IF EXISTS is_admin() CASCADE;
DROP FUNCTION IF EXISTS get_user_role() CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- STEP 2: CREATE TABLES
-- ============================================

-- Unified profiles table that handles both pre-registered students and active users
-- Pre-registered students have is_registered = FALSE and no auth.users reference
-- When a pre-registered student signs up, their profile is linked to auth.users
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'teacher', 'student')),
    teacher_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_registered BOOLEAN DEFAULT FALSE,
    student_id_number TEXT UNIQUE,
    grade_level TEXT,
    section TEXT,
    class_id UUID,
    avatar_url TEXT,
    uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_teacher_id ON profiles(teacher_id);
CREATE INDEX idx_profiles_student_id ON profiles(student_id_number);
CREATE INDEX idx_profiles_auth_id ON profiles(auth_id);
CREATE INDEX idx_profiles_registered ON profiles(is_registered);

CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    class_name TEXT NOT NULL,
    class_code TEXT UNIQUE NOT NULL,
    description TEXT,
    grade_level TEXT,
    section TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    max_students INTEGER DEFAULT 50,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_classes_teacher ON classes(teacher_id);
CREATE INDEX idx_classes_code ON classes(class_code);

CREATE TABLE class_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'removed')),
    UNIQUE(class_id, student_id)
);

CREATE INDEX idx_enrollments_class ON class_enrollments(class_id);
CREATE INDEX idx_enrollments_student ON class_enrollments(student_id);

CREATE TABLE progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    era_key TEXT NOT NULL,
    lessons_completed JSONB DEFAULT '[]'::jsonb,
    lessons_complete BOOLEAN DEFAULT FALSE,
    boss_defeated BOOLEAN DEFAULT FALSE,
    current_lesson_index INTEGER DEFAULT 0,
    battle_score INTEGER DEFAULT 0,
    enemies_defeated INTEGER DEFAULT 0,
    highest_streak INTEGER DEFAULT 0,
    time_spent_seconds INTEGER DEFAULT 0,
    unlocked_heroes JSONB DEFAULT '[0]'::jsonb,
    last_played_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, era_key)
);

CREATE INDEX idx_progress_user ON progress(user_id);
CREATE INDEX idx_progress_era ON progress(era_key);

CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    achievement_key TEXT NOT NULL,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_key)
);

CREATE INDEX idx_achievements_user ON achievements(user_id);

CREATE TABLE custom_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    era_key TEXT NOT NULL,
    question_text_en TEXT NOT NULL,
    question_text_tl TEXT,
    correct_answer_en TEXT NOT NULL,
    correct_answer_tl TEXT,
    wrong_answers_en JSONB NOT NULL DEFAULT '[]'::jsonb,
    wrong_answers_tl JSONB DEFAULT '[]'::jsonb,
    difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    is_active BOOLEAN DEFAULT TRUE,
    is_approved BOOLEAN DEFAULT FALSE,
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_questions_creator ON custom_questions(created_by);
CREATE INDEX idx_questions_era ON custom_questions(era_key);

CREATE TABLE custom_lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    era_key TEXT NOT NULL,
    lesson_order INTEGER NOT NULL,
    title_en TEXT NOT NULL,
    title_tl TEXT,
    content_en TEXT NOT NULL,
    content_tl TEXT,
    icon TEXT DEFAULT '📖',
    is_active BOOLEAN DEFAULT TRUE,
    is_approved BOOLEAN DEFAULT FALSE,
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lessons_creator ON custom_lessons(created_by);
CREATE INDEX idx_lessons_era ON custom_lessons(era_key);

CREATE TABLE game_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    era_key TEXT NOT NULL,
    session_type TEXT NOT NULL CHECK (session_type IN ('learning', 'battle')),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    questions_answered INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    score INTEGER DEFAULT 0
);

CREATE INDEX idx_sessions_user ON game_sessions(user_id);

-- ============================================
-- STEP 3: ROW LEVEL SECURITY
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 4: HELPER FUNCTIONS (SECURITY DEFINER)
-- ============================================

CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role FROM profiles WHERE auth_id = auth.uid();
    RETURN COALESCE(user_role, 'student');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_role() = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_teacher()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_role() = 'teacher';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Get the profile ID for the current auth user
CREATE OR REPLACE FUNCTION get_profile_id()
RETURNS UUID AS $$
DECLARE
    profile_uuid UUID;
BEGIN
    SELECT id INTO profile_uuid FROM profiles WHERE auth_id = auth.uid();
    RETURN profile_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================
-- STEP 5: RLS POLICIES
-- ============================================

-- PROFILES
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth_id = auth.uid());
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth_id = auth.uid());
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update any profile" ON profiles FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can insert profiles" ON profiles FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can delete profiles" ON profiles FOR DELETE USING (is_admin());
CREATE POLICY "Teachers can view direct students" ON profiles FOR SELECT USING (is_teacher() AND teacher_id = get_profile_id());
CREATE POLICY "Enable insert for signup" ON profiles FOR INSERT WITH CHECK (auth_id = auth.uid());
CREATE POLICY "Teachers can view all student profiles" ON profiles FOR SELECT USING (is_teacher() AND role = 'student');
CREATE POLICY "Teachers can update student assignments" ON profiles FOR UPDATE USING (is_teacher() AND role = 'student');
CREATE POLICY "Teachers can insert pre-registered students" ON profiles FOR INSERT WITH CHECK (is_teacher() AND role = 'student' AND is_registered = FALSE);
-- Anyone can validate student ID for registration
CREATE POLICY "Anyone can validate student ID" ON profiles FOR SELECT USING (role = 'student' AND is_registered = FALSE);

DROP POLICY IF EXISTS "Teachers can view all student profiles" ON profiles;
DROP POLICY IF EXISTS "Teachers can update student assignments" ON profiles;

CREATE POLICY "Teachers can view all student profiles" ON profiles 
FOR SELECT USING (is_teacher() AND role = 'student');

CREATE POLICY "Teachers can update student assignments" ON profiles 
FOR UPDATE USING (is_teacher() AND role = 'student');




-- FIX RLS POLICIES FOR TEACHER-STUDENT ACCESS

-- Ensure helper functions exist
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role FROM profiles WHERE id = auth.uid();
    RETURN COALESCE(user_role, 'student');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_teacher()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_role() = 'teacher';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Drop and recreate teacher policies
DROP POLICY IF EXISTS "Teachers can view direct students" ON profiles;
DROP POLICY IF EXISTS "Teachers can view all student profiles" ON profiles;
DROP POLICY IF EXISTS "Teachers can update student assignments" ON profiles;

CREATE POLICY "Teachers can view all student profiles" ON profiles 
FOR SELECT USING (is_teacher() AND role = 'student');

CREATE POLICY "Teachers can update student assignments" ON profiles 
FOR UPDATE USING (is_teacher() AND role = 'student');

-- CLASSES
CREATE POLICY "Teachers can manage own classes" ON classes FOR ALL USING (teacher_id = get_profile_id());
CREATE POLICY "Admins can view all classes" ON classes FOR SELECT USING (is_admin());
CREATE POLICY "Students can view active classes" ON classes FOR SELECT USING (is_active = true);

-- CLASS ENROLLMENTS
CREATE POLICY "Teachers can manage class enrollments" ON class_enrollments FOR ALL 
    USING (EXISTS (SELECT 1 FROM classes WHERE classes.id = class_enrollments.class_id AND classes.teacher_id = get_profile_id()));
CREATE POLICY "Students can view own enrollments" ON class_enrollments FOR SELECT USING (student_id = get_profile_id());
CREATE POLICY "Students can enroll themselves" ON class_enrollments FOR INSERT WITH CHECK (student_id = get_profile_id());
CREATE POLICY "Admins can manage all enrollments" ON class_enrollments FOR ALL USING (is_admin());

-- PROGRESS
CREATE POLICY "Users can manage own progress" ON progress FOR ALL USING (user_id = get_profile_id());
CREATE POLICY "Admins can view all progress" ON progress FOR SELECT USING (is_admin());
CREATE POLICY "Teachers can view student progress" ON progress FOR SELECT 
    USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = progress.user_id AND profiles.teacher_id = get_profile_id()));

-- ACHIEVEMENTS
CREATE POLICY "Users can manage own achievements" ON achievements FOR ALL USING (user_id = get_profile_id());
CREATE POLICY "Admins can view all achievements" ON achievements FOR SELECT USING (is_admin());

-- CUSTOM QUESTIONS
CREATE POLICY "Teachers can manage own questions" ON custom_questions FOR ALL USING (created_by = get_profile_id());
CREATE POLICY "Admins can manage all questions" ON custom_questions FOR ALL USING (is_admin());
CREATE POLICY "Anyone can view approved questions" ON custom_questions FOR SELECT USING (is_active = true AND is_approved = true);

-- CUSTOM LESSONS
CREATE POLICY "Teachers can manage own lessons" ON custom_lessons FOR ALL USING (created_by = get_profile_id());
CREATE POLICY "Admins can manage all lessons" ON custom_lessons FOR ALL USING (is_admin());
CREATE POLICY "Anyone can view approved lessons" ON custom_lessons FOR SELECT USING (is_active = true AND is_approved = true);

-- GAME SESSIONS
CREATE POLICY "Users can manage own sessions" ON game_sessions FOR ALL USING (user_id = get_profile_id());
CREATE POLICY "Admins can view all sessions" ON game_sessions FOR SELECT USING (is_admin());

-- ============================================
-- STEP 6: TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_progress_updated_at BEFORE UPDATE ON progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON custom_questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON custom_lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION generate_class_code()
RETURNS TEXT AS $$
DECLARE
    new_code TEXT;
    code_exists BOOLEAN;
BEGIN
    LOOP
        new_code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
        SELECT EXISTS(SELECT 1 FROM classes WHERE class_code = new_code) INTO code_exists;
        EXIT WHEN NOT code_exists;
    END LOOP;
    RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- Auth trigger to handle new user signup
-- If a pre-registered profile exists with matching student_id_number, link it
-- Otherwise create a new profile
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    student_id TEXT;
    existing_profile_id UUID;
BEGIN
    student_id := NEW.raw_user_meta_data->>'student_id_number';
    
    -- Check if there's a pre-registered profile with this student ID
    IF student_id IS NOT NULL AND student_id != '' THEN
        SELECT id INTO existing_profile_id 
        FROM public.profiles 
        WHERE student_id_number = student_id 
          AND is_registered = FALSE 
          AND role = 'student';
        
        IF existing_profile_id IS NOT NULL THEN
            -- Link the existing pre-registered profile to this auth user
            UPDATE public.profiles 
            SET auth_id = NEW.id,
                email = NEW.email,
                full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', full_name),
                is_registered = TRUE,
                is_verified = TRUE,
                updated_at = NOW()
            WHERE id = existing_profile_id;
            RETURN NEW;
        END IF;
    END IF;
    
    -- No pre-registered profile found, create a new one
    INSERT INTO public.profiles (auth_id, email, full_name, role, student_id_number, is_verified, is_registered)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
        student_id,
        TRUE,
        TRUE
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- STEP 7: VIEWS
-- ============================================

CREATE OR REPLACE VIEW teacher_student_progress AS
SELECT 
    p.id AS student_id,
    p.full_name AS student_name,
    p.email AS student_email,
    p.teacher_id,
    p.is_registered,
    p.student_id_number,
    p.grade_level,
    p.section,
    pr.era_key,
    pr.lessons_complete,
    pr.boss_defeated,
    pr.battle_score,
    pr.last_played_at
FROM profiles p
LEFT JOIN progress pr ON p.id = pr.user_id
WHERE p.role = 'student';

-- View for pre-registered students (not yet signed up)
CREATE OR REPLACE VIEW pre_registered_students AS
SELECT 
    id,
    student_id_number,
    full_name,
    email,
    grade_level,
    section,
    uploaded_by,
    created_at,
    updated_at
FROM profiles
WHERE role = 'student' AND is_registered = FALSE;

CREATE OR REPLACE VIEW admin_user_stats AS
SELECT
    role,
    COUNT(*) FILTER (WHERE is_registered = true) AS user_count,
    COUNT(*) FILTER (WHERE is_verified = true AND is_registered = true) AS verified_count,
    COUNT(*) FILTER (WHERE is_registered = false) AS pre_registered_count
FROM profiles
GROUP BY role;

-- ============================================
-- STEP 8: GRANTS
-- ============================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL ROUTINES IN SCHEMA public TO anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON SEQUENCES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON ROUTINES TO anon, authenticated;

-- ============================================
-- STEP 9: CREATE PROFILES FOR EXISTING AUTH USERS
-- ============================================

INSERT INTO profiles (auth_id, email, full_name, role, is_verified, is_registered)
SELECT 
    id,
    email,
    COALESCE(raw_user_meta_data->>'full_name', 'User'),
    COALESCE(raw_user_meta_data->>'role', 'student'),
    true,
    true
FROM auth.users
WHERE id NOT IN (SELECT auth_id FROM profiles WHERE auth_id IS NOT NULL)
ON CONFLICT (auth_id) DO NOTHING;

-- ============================================
-- STEP 10: SET CORRECT ROLES
-- ============================================

UPDATE profiles SET role = 'admin', is_verified = true, is_registered = true WHERE email = 'admin@battleofknowledge.com';
UPDATE profiles SET role = 'teacher', is_verified = true, is_registered = true WHERE email IN ('teacher1@school.edu', 'teacher2@school.edu');
UPDATE profiles SET role = 'student', is_verified = true, is_registered = true WHERE email LIKE 'student%@school.edu';

-- ============================================
-- DONE! Verify with:
-- SELECT email, role, is_verified, is_registered FROM profiles ORDER BY role, email;
-- ============================================
UPDATE auth.users SET email_confirmed_at = NOW() WHERE email_confirmed_at IS NULL;









-- ============================================
-- BATTLE OF KNOWLEDGE - COMPLETE DATABASE SETUP
-- Run this entire script in Supabase SQL Editor
-- ============================================

-- STEP 1: Add is_system column to custom_questions if not exists
ALTER TABLE custom_questions ADD COLUMN IF NOT EXISTS is_system BOOLEAN DEFAULT FALSE;

-- STEP 2: Add is_system column to custom_lessons if not exists  
ALTER TABLE custom_lessons ADD COLUMN IF NOT EXISTS is_system BOOLEAN DEFAULT FALSE;

-- STEP 3: Make created_by nullable (if not already)
ALTER TABLE custom_questions ALTER COLUMN created_by DROP NOT NULL;
ALTER TABLE custom_lessons ALTER COLUMN created_by DROP NOT NULL;

-- STEP 4: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_questions_system ON custom_questions(is_system);
CREATE INDEX IF NOT EXISTS idx_lessons_system ON custom_lessons(is_system);

-- STEP 5: Clear existing system content (safe to re-run)
DELETE FROM custom_questions WHERE is_system = true;
DELETE FROM custom_lessons WHERE is_system = true;

-- ============================================
-- SYSTEM QUESTIONS (40 total - 10 per era)
-- ============================================

-- EARLY SPANISH ERA QUESTIONS
INSERT INTO custom_questions (era_key, question_text_en, question_text_tl, correct_answer_en, correct_answer_tl, wrong_answers_en, wrong_answers_tl, difficulty, is_active, is_approved, is_system) VALUES
('early-spanish', 'Who was the first Filipino hero to resist Spanish colonization?', 'Sino ang unang bayaning Pilipino na lumaban sa pananakop ng Espanya?', 'Lapu-Lapu', 'Lapu-Lapu', '["Jose Rizal", "Andres Bonifacio", "Emilio Aguinaldo"]', '["Jose Rizal", "Andres Bonifacio", "Emilio Aguinaldo"]', 'easy', true, true, true),
('early-spanish', 'In what year did Ferdinand Magellan arrive in the Philippines?', 'Anong taon dumating si Ferdinand Magellan sa Pilipinas?', '1521', '1521', '["1565", "1898", "1896"]', '["1565", "1898", "1896"]', 'easy', true, true, true),
('early-spanish', 'Where did the Battle of Mactan take place?', 'Saan naganap ang Labanan sa Mactan?', 'Cebu', 'Cebu', '["Manila", "Bataan", "Mindanao"]', '["Maynila", "Bataan", "Mindanao"]', 'easy', true, true, true),
('early-spanish', 'Who was the chieftain of Mactan during the Spanish arrival?', 'Sino ang pinuno ng Mactan noong dumating ang mga Espanyol?', 'Lapu-Lapu', 'Lapu-Lapu', '["Raja Humabon", "Datu Sikatuna", "Datu Puti"]', '["Raja Humabon", "Datu Sikatuna", "Datu Puti"]', 'easy', true, true, true),
('early-spanish', 'Who was the chieftain who welcomed Magellan and converted to Christianity?', 'Sino ang pinunong tumanggap kay Magellan at naging Kristiyano?', 'Raja Humabon', 'Raja Humabon', '["Lapu-Lapu", "Datu Sikatuna", "Sultan Kudarat"]', '["Lapu-Lapu", "Datu Sikatuna", "Sultan Kudarat"]', 'medium', true, true, true),
('early-spanish', 'What was the original name of the Philippines before Spanish colonization?', 'Ano ang orihinal na pangalan ng Pilipinas bago sakupin ng Espanya?', 'Maharlika', 'Maharlika', '["Las Islas Filipinas", "Ophir", "Pearl of the Orient"]', '["Las Islas Filipinas", "Ophir", "Perlas ng Silangan"]', 'medium', true, true, true),
('early-spanish', 'How did Ferdinand Magellan die?', 'Paano namatay si Ferdinand Magellan?', 'Killed in Battle of Mactan', 'Napatay sa Labanan sa Mactan', '["Died of illness", "Drowned at sea", "Returned to Spain"]', '["Namatay sa sakit", "Nalunod sa dagat", "Bumalik sa Espanya"]', 'easy', true, true, true),
('early-spanish', 'What weapon was Lapu-Lapu famous for using?', 'Anong sandata ang ginagamit ni Lapu-Lapu?', 'Kampilan (sword)', 'Kampilan (espada)', '["Bow and arrow", "Spear", "Shield"]', '["Pana at palaso", "Sibat", "Kalasag"]', 'medium', true, true, true),
('early-spanish', 'What year did Spain officially colonize the Philippines?', 'Anong taon opisyal na sinakop ng Espanya ang Pilipinas?', '1565', '1565', '["1521", "1571", "1600"]', '["1521", "1571", "1600"]', 'medium', true, true, true),
('early-spanish', 'Who led the first successful Spanish expedition to colonize the Philippines?', 'Sino ang nanguna sa unang matagumpay na ekspedisyon ng Espanya sa Pilipinas?', 'Miguel Lopez de Legazpi', 'Miguel Lopez de Legazpi', '["Ferdinand Magellan", "Ruy Lopez de Villalobos", "Martin de Goiti"]', '["Ferdinand Magellan", "Ruy Lopez de Villalobos", "Martin de Goiti"]', 'hard', true, true, true);

-- LATE SPANISH ERA QUESTIONS
INSERT INTO custom_questions (era_key, question_text_en, question_text_tl, correct_answer_en, correct_answer_tl, wrong_answers_en, wrong_answers_tl, difficulty, is_active, is_approved, is_system) VALUES
('late-spanish', 'Who wrote ''Noli Me Tangere''?', 'Sino ang sumulat ng ''Noli Me Tangere''?', 'Jose Rizal', 'Jose Rizal', '["Andres Bonifacio", "Emilio Aguinaldo", "Apolinario Mabini"]', '["Andres Bonifacio", "Emilio Aguinaldo", "Apolinario Mabini"]', 'easy', true, true, true),
('late-spanish', 'What year was Jose Rizal executed?', 'Anong taon binaril si Jose Rizal?', '1896', '1896', '["1898", "1899", "1900"]', '["1898", "1899", "1900"]', 'easy', true, true, true),
('late-spanish', 'Who founded the Katipunan?', 'Sino ang nagtatag ng Katipunan?', 'Andres Bonifacio', 'Andres Bonifacio', '["Emilio Aguinaldo", "Jose Rizal", "Apolinario Mabini"]', '["Emilio Aguinaldo", "Jose Rizal", "Apolinario Mabini"]', 'easy', true, true, true),
('late-spanish', 'When did the Philippines declare independence from Spain?', 'Kailan idineklara ang kalayaan ng Pilipinas mula sa Espanya?', 'June 12, 1898', 'Hunyo 12, 1898', '["June 12, 1896", "July 4, 1946", "December 30, 1896"]', '["Hunyo 12, 1896", "Hulyo 4, 1946", "Disyembre 30, 1896"]', 'easy', true, true, true),
('late-spanish', 'Who was known as the ''Brains of the Revolution''?', 'Sino ang kilala bilang ''Utak ng Rebolusyon''?', 'Apolinario Mabini', 'Apolinario Mabini', '["Emilio Aguinaldo", "Andres Bonifacio", "Antonio Luna"]', '["Emilio Aguinaldo", "Andres Bonifacio", "Antonio Luna"]', 'medium', true, true, true),
('late-spanish', 'What was the full name of the Katipunan?', 'Ano ang buong pangalan ng Katipunan?', 'Kataas-taasang Kagalang-galangang Katipunan ng mga Anak ng Bayan', 'Kataas-taasang Kagalang-galangang Katipunan ng mga Anak ng Bayan', '["Katipunan ng mga Bayani", "Katipunan ng Pilipinas", "Kataas-taasang Katipunan"]', '["Katipunan ng mga Bayani", "Katipunan ng Pilipinas", "Kataas-taasang Katipunan"]', 'hard', true, true, true),
('late-spanish', 'Where was Jose Rizal executed?', 'Saan binaril si Jose Rizal?', 'Bagumbayan (Luneta)', 'Bagumbayan (Luneta)', '["Fort Santiago", "Kawit, Cavite", "Calamba, Laguna"]', '["Fort Santiago", "Kawit, Cavite", "Calamba, Laguna"]', 'medium', true, true, true),
('late-spanish', 'Who was the first President of the Philippines?', 'Sino ang unang Pangulo ng Pilipinas?', 'Emilio Aguinaldo', 'Emilio Aguinaldo', '["Andres Bonifacio", "Manuel Quezon", "Sergio Osmeña"]', '["Andres Bonifacio", "Manuel Quezon", "Sergio Osmeña"]', 'easy', true, true, true),
('late-spanish', 'What was Jose Rizal''s second novel?', 'Ano ang pangalawang nobela ni Jose Rizal?', 'El Filibusterismo', 'El Filibusterismo', '["Mi Ultimo Adios", "Noli Me Tangere", "Sobre la Indolencia"]', '["Mi Ultimo Adios", "Noli Me Tangere", "Sobre la Indolencia"]', 'medium', true, true, true),
('late-spanish', 'What was the secret password of the Katipunan?', 'Ano ang lihim na password ng Katipunan?', 'Anak ng Bayan', 'Anak ng Bayan', '["Kalayaan", "Kapatiran", "Kagitingan"]', '["Kalayaan", "Kapatiran", "Kagitingan"]', 'hard', true, true, true);

-- AMERICAN COLONIAL ERA QUESTIONS
INSERT INTO custom_questions (era_key, question_text_en, question_text_tl, correct_answer_en, correct_answer_tl, wrong_answers_en, wrong_answers_tl, difficulty, is_active, is_approved, is_system) VALUES
('american-colonial', 'What battle marked the beginning of American-Philippine War?', 'Anong labanan ang nagsimula ng Digmaang Pilipino-Amerikano?', 'Battle of Manila Bay', 'Labanan sa Manila Bay', '["Battle of Mactan", "Battle of Bataan", "Battle of Tirad Pass"]', '["Labanan sa Mactan", "Labanan sa Bataan", "Labanan sa Tirad Pass"]', 'medium', true, true, true),
('american-colonial', 'Who was the American naval commander during the Battle of Manila Bay?', 'Sino ang Amerikanong naval commander sa Labanan sa Manila Bay?', 'George Dewey', 'George Dewey', '["Douglas MacArthur", "Arthur MacArthur", "William Howard Taft"]', '["Douglas MacArthur", "Arthur MacArthur", "William Howard Taft"]', 'medium', true, true, true),
('american-colonial', 'What year did the Spanish-American War begin?', 'Anong taon nagsimula ang Digmaang Espanyol-Amerikano?', '1898', '1898', '["1896", "1899", "1901"]', '["1896", "1899", "1901"]', 'easy', true, true, true),
('american-colonial', 'Who was the Filipino general who fought at Tirad Pass?', 'Sino ang heneral na nakipaglaban sa Tirad Pass?', 'Gregorio del Pilar', 'Gregorio del Pilar', '["Antonio Luna", "Emilio Aguinaldo", "Juan Luna"]', '["Antonio Luna", "Emilio Aguinaldo", "Juan Luna"]', 'medium', true, true, true),
('american-colonial', 'What treaty ended the Spanish-American War?', 'Anong kasunduan ang nagwakas sa Digmaang Espanyol-Amerikano?', 'Treaty of Paris', 'Kasunduan sa Paris', '["Treaty of Versailles", "Treaty of Manila", "Treaty of Biak-na-Bato"]', '["Kasunduan sa Versailles", "Kasunduan sa Manila", "Kasunduan sa Biak-na-Bato"]', 'medium', true, true, true),
('american-colonial', 'How much did the United States pay Spain for the Philippines?', 'Magkano ang binayad ng Estados Unidos sa Espanya para sa Pilipinas?', '$20 million', '$20 milyon', '["$10 million", "$50 million", "$100 million"]', '["$10 milyon", "$50 milyon", "$100 milyon"]', 'hard', true, true, true),
('american-colonial', 'Who was known as the ''Boy General'' of the Philippine Revolution?', 'Sino ang kilala bilang ''Batang Heneral'' ng Rebolusyong Pilipino?', 'Gregorio del Pilar', 'Gregorio del Pilar', '["Emilio Aguinaldo", "Antonio Luna", "Manuel Tinio"]', '["Emilio Aguinaldo", "Antonio Luna", "Manuel Tinio"]', 'medium', true, true, true),
('american-colonial', 'What was General Antonio Luna''s role in the Philippine-American War?', 'Ano ang tungkulin ni Heneral Antonio Luna sa Digmaang Pilipino-Amerikano?', 'Chief of War Operations', 'Hepe ng Operasyon sa Digmaan', '["President", "Naval Commander", "Foreign Minister"]', '["Pangulo", "Kumander ng Hukbong-Dagat", "Ministro ng Ugnayang Panlabas"]', 'hard', true, true, true),
('american-colonial', 'When did the Philippine-American War officially end?', 'Kailan opisyal na natapos ang Digmaang Pilipino-Amerikano?', '1902', '1902', '["1898", "1905", "1910"]', '["1898", "1905", "1910"]', 'medium', true, true, true),
('american-colonial', 'What American colonial policy introduced public education in the Philippines?', 'Anong patakaran ng Amerikano ang nagdala ng pampublikong edukasyon sa Pilipinas?', 'Thomasites Program', 'Programa ng Thomasites', '["Jones Law", "Tydings-McDuffie Act", "Philippine Bill"]', '["Batas Jones", "Batas Tydings-McDuffie", "Philippine Bill"]', 'hard', true, true, true);

-- WW2 ERA QUESTIONS
INSERT INTO custom_questions (era_key, question_text_en, question_text_tl, correct_answer_en, correct_answer_tl, wrong_answers_en, wrong_answers_tl, difficulty, is_active, is_approved, is_system) VALUES
('ww2', 'Who promised to return to the Philippines during World War II?', 'Sino ang nangakong babalik sa Pilipinas noong Ikalawang Digmaang Pandaigdig?', 'Douglas MacArthur', 'Douglas MacArthur', '["George Dewey", "Franklin Roosevelt", "Dwight Eisenhower"]', '["George Dewey", "Franklin Roosevelt", "Dwight Eisenhower"]', 'easy', true, true, true),
('ww2', 'What year did Japan invade the Philippines?', 'Anong taon sinakop ng Japan ang Pilipinas?', '1941', '1941', '["1942", "1945", "1940"]', '["1942", "1945", "1940"]', 'easy', true, true, true),
('ww2', 'Where did the Bataan Death March take place?', 'Saan naganap ang Bataan Death March?', 'Bataan Peninsula', 'Bataan Peninsula', '["Manila", "Cebu", "Mindanao"]', '["Maynila", "Cebu", "Mindanao"]', 'easy', true, true, true),
('ww2', 'When was the Philippines liberated from Japan?', 'Kailan pinalaya ang Pilipinas mula sa Japan?', '1945', '1945', '["1944", "1946", "1943"]', '["1944", "1946", "1943"]', 'easy', true, true, true),
('ww2', 'What famous words did MacArthur say when he left the Philippines?', 'Ano ang sikat na sinabi ni MacArthur nang umalis siya sa Pilipinas?', 'I shall return', 'I shall return', '["We will be back", "Never surrender", "Victory awaits"]', '["We will be back", "Never surrender", "Victory awaits"]', 'easy', true, true, true),
('ww2', 'Where did MacArthur land when he returned to the Philippines?', 'Saan bumalik si MacArthur sa Pilipinas?', 'Leyte', 'Leyte', '["Bataan", "Manila", "Corregidor"]', '["Bataan", "Maynila", "Corregidor"]', 'medium', true, true, true),
('ww2', 'What was the last stronghold of American and Filipino forces before surrender?', 'Ano ang huling kuta ng mga pwersa ng Amerikano at Pilipino bago sumuko?', 'Corregidor', 'Corregidor', '["Bataan", "Manila", "Fort Santiago"]', '["Bataan", "Maynila", "Fort Santiago"]', 'medium', true, true, true),
('ww2', 'What date did Japan attack the Philippines?', 'Anong petsa sinalakay ng Japan ang Pilipinas?', 'December 8, 1941', 'Disyembre 8, 1941', '["December 7, 1941", "January 2, 1942", "September 21, 1944"]', '["Disyembre 7, 1941", "Enero 2, 1942", "Setyembre 21, 1944"]', 'medium', true, true, true),
('ww2', 'Who was the Filipino general who fought alongside MacArthur?', 'Sino ang heneralng Pilipino na nakipaglaban kasama ni MacArthur?', 'General Vicente Lim', 'Heneral Vicente Lim', '["General Emilio Aguinaldo", "General Antonio Luna", "General Gregorio del Pilar"]', '["Heneral Emilio Aguinaldo", "Heneral Antonio Luna", "Heneral Gregorio del Pilar"]', 'hard', true, true, true),
('ww2', 'What battle is considered the largest naval battle in history during WWII?', 'Anong labanan ang itinuturing na pinakamalaking labanan sa dagat sa WWII?', 'Battle of Leyte Gulf', 'Labanan sa Leyte Gulf', '["Battle of Manila Bay", "Battle of Coral Sea", "Battle of Midway"]', '["Labanan sa Manila Bay", "Labanan sa Coral Sea", "Labanan sa Midway"]', 'hard', true, true, true);

-- ============================================
-- SYSTEM LESSONS (18 total)
-- ============================================

-- EARLY SPANISH ERA LESSONS
INSERT INTO custom_lessons (era_key, lesson_order, title_en, title_tl, content_en, content_tl, icon, is_active, is_approved, is_system) VALUES
('early-spanish', 1, 'Pre-Colonial Philippines', 'Pilipinas Bago ang Kolonisasyon', 
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Life Before the Spanish</h3><p class="mb-3">Before 1521, the Philippines was made up of independent communities called <strong>barangays</strong>, each led by a <strong>datu</strong> or chieftain.</p></div>',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Buhay Bago ang mga Espanyol</h3><p class="mb-3">Bago ang 1521, ang Pilipinas ay binubuo ng mga independyenteng komunidad na tinatawag na <strong>barangay</strong>.</p></div>', '1', true, true, true),

('early-spanish', 2, 'Magellan''s Arrival (1521)', 'Pagdating ni Magellan (1521)',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Ferdinand Magellan Arrives</h3><p class="mb-3">On <strong>March 16, 1521</strong>, Portuguese explorer Ferdinand Magellan arrived in the Philippines.</p></div>',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Dumating si Ferdinand Magellan</h3><p class="mb-3">Noong <strong>Marso 16, 1521</strong>, dumating si Ferdinand Magellan sa Pilipinas.</p></div>', '2', true, true, true),

('early-spanish', 3, 'Lapu-Lapu: The Hero', 'Lapu-Lapu: Ang Bayani',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">The Defender of Mactan</h3><p class="mb-3"><strong>Lapu-Lapu</strong> was the chieftain of Mactan Island who refused to submit to Spanish rule.</p></div>',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Ang Tagapagtanggol ng Mactan</h3><p class="mb-3">Si <strong>Lapu-Lapu</strong> ang pinuno ng Pulo ng Mactan.</p></div>', '3', true, true, true),

('early-spanish', 4, 'The Battle of Mactan', 'Ang Labanan sa Mactan',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">April 27, 1521</h3><p class="mb-3">The <strong>Battle of Mactan</strong> took place on April 27, 1521. Magellan was killed in the battle.</p></div>',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Abril 27, 1521</h3><p class="mb-3">Ang <strong>Labanan sa Mactan</strong> ay naganap noong Abril 27, 1521.</p></div>', '4', true, true, true),

('early-spanish', 5, 'Legacy of Resistance', 'Pamana ng Paglaban',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">The Spirit of Filipino Resistance</h3><p class="mb-3">The Battle of Mactan established a powerful legacy of Filipino resistance against foreign domination.</p></div>',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Ang Diwa ng Paglaban</h3><p class="mb-3">Ang Labanan sa Mactan ay nagtatag ng malakas na pamana ng paglaban ng mga Pilipino.</p></div>', '5', true, true, true);

-- LATE SPANISH ERA LESSONS
INSERT INTO custom_lessons (era_key, lesson_order, title_en, title_tl, content_en, content_tl, icon, is_active, is_approved, is_system) VALUES
('late-spanish', 1, 'Spanish Colonial Rule', 'Pamumuno ng Kolonyal na Espanyol',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">333 Years of Spanish Rule</h3><p class="mb-3">Spain colonized the Philippines for 333 years (1565-1898).</p></div>',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">333 Taon ng Pamumuno ng Espanya</h3><p class="mb-3">Sinakop ng Espanya ang Pilipinas sa loob ng 333 taon.</p></div>', '1', true, true, true),

('late-spanish', 2, 'Jose Rizal: National Hero', 'Jose Rizal: Pambansang Bayani',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">The Pen is Mightier Than the Sword</h3><p class="mb-3"><strong>Jose Rizal</strong> (1861-1896) was a doctor, writer, and reformist.</p></div>',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Ang Panulat ay Mas Makapangyarihan</h3><p class="mb-3">Si <strong>Jose Rizal</strong> (1861-1896) ay isang doktor at manunulat.</p></div>', '2', true, true, true),

('late-spanish', 3, 'The Katipunan', 'Ang Katipunan',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">The Secret Revolutionary Society</h3><p class="mb-3">The <strong>Katipunan</strong> was founded by <strong>Andres Bonifacio</strong> on July 7, 1892.</p></div>',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Ang Lihim na Samahan</h3><p class="mb-3">Ang <strong>Katipunan</strong> ay itinatag ni <strong>Andres Bonifacio</strong>.</p></div>', '3', true, true, true),

('late-spanish', 4, 'The Philippine Revolution', 'Ang Rebolusyong Pilipino',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">The Cry of Pugad Lawin</h3><p class="mb-3">On August 23, 1896, the Philippine Revolution began.</p></div>',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Ang Sigaw ng Pugad Lawin</h3><p class="mb-3">Noong Agosto 23, 1896, nagsimula ang Rebolusyong Pilipino.</p></div>', '4', true, true, true),

('late-spanish', 5, 'Philippine Independence', 'Kalayaan ng Pilipinas',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">June 12, 1898</h3><p class="mb-3">On <strong>June 12, 1898</strong>, General <strong>Emilio Aguinaldo</strong> declared Philippine independence.</p></div>',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Hunyo 12, 1898</h3><p class="mb-3">Noong <strong>Hunyo 12, 1898</strong>, idineklara ni <strong>Emilio Aguinaldo</strong> ang kalayaan.</p></div>', '5', true, true, true);

-- AMERICAN COLONIAL ERA LESSONS
INSERT INTO custom_lessons (era_key, lesson_order, title_en, title_tl, content_en, content_tl, icon, is_active, is_approved, is_system) VALUES
('american-colonial', 1, 'American Arrival', 'Pagdating ng mga Amerikano',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">A New Colonial Power</h3><p class="mb-3">In 1898, the United States defeated Spain in the Spanish-American War.</p></div>',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Bagong Kapangyarihan</h3><p class="mb-3">Noong 1898, tinalo ng Estados Unidos ang Espanya.</p></div>', '1', true, true, true),

('american-colonial', 2, 'Philippine-American War', 'Digmaang Pilipino-Amerikano',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">The Fight for True Independence</h3><p class="mb-3">The <strong>Philippine-American War</strong> (1899-1902) erupted on February 4, 1899.</p></div>',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Laban para sa Kalayaan</h3><p class="mb-3">Ang <strong>Digmaang Pilipino-Amerikano</strong> ay nagsimula noong Pebrero 4, 1899.</p></div>', '2', true, true, true),

('american-colonial', 3, 'American Colonial Policies', 'Mga Patakaran ng Amerika',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Education and Infrastructure</h3><p class="mb-3">The Americans introduced public education through the <strong>Thomasites</strong>.</p></div>',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Edukasyon at Imprastruktura</h3><p class="mb-3">Ipinakilala ng mga Amerikano ang pampublikong edukasyon.</p></div>', '3', true, true, true);

-- WW2 ERA LESSONS
INSERT INTO custom_lessons (era_key, lesson_order, title_en, title_tl, content_en, content_tl, icon, is_active, is_approved, is_system) VALUES
('ww2', 1, 'Japanese Invasion', 'Pagsalakay ng mga Hapon',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">December 8, 1941</h3><p class="mb-3">Japan invaded the Philippines on <strong>December 8, 1941</strong>.</p></div>',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Disyembre 8, 1941</h3><p class="mb-3">Sinalakay ng Japan ang Pilipinas noong <strong>Disyembre 8, 1941</strong>.</p></div>', '1', true, true, true),

('ww2', 2, 'Bataan Death March', 'Martsa ng Kamatayan sa Bataan',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">A Tragic Chapter</h3><p class="mb-3">The <strong>Bataan Death March</strong> claimed thousands of lives in April 1942.</p></div>',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Masaklap na Kabanata</h3><p class="mb-3">Ang <strong>Bataan Death March</strong> ay kumitil ng libu-libong buhay.</p></div>', '2', true, true, true),

('ww2', 3, 'Filipino Resistance', 'Paglaban ng mga Pilipino',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Guerrilla Warfare</h3><p class="mb-3">Filipino guerrilla fighters continued to resist Japanese occupation.</p></div>',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Digmaang Gerilya</h3><p class="mb-3">Patuloy na lumaban ang mga Pilipinong gerilya.</p></div>', '3', true, true, true),

('ww2', 4, 'MacArthur Returns', 'Bumalik si MacArthur',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">October 20, 1944</h3><p class="mb-3">General Douglas MacArthur returned to the Philippines on <strong>October 20, 1944</strong>.</p></div>',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Oktubre 20, 1944</h3><p class="mb-3">Bumalik si MacArthur sa Pilipinas noong <strong>Oktubre 20, 1944</strong>.</p></div>', '4', true, true, true),

('ww2', 5, 'Liberation and Independence', 'Pagpapalaya at Kalayaan',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">July 4, 1946</h3><p class="mb-3">On <strong>July 4, 1946</strong>, the Philippines gained full independence.</p></div>',
'<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Hulyo 4, 1946</h3><p class="mb-3">Noong <strong>Hulyo 4, 1946</strong>, nakuha ng Pilipinas ang buong kalayaan.</p></div>', '5', true, true, true);

-- ============================================
-- VERIFY INSERTED DATA
-- ============================================
SELECT 'System Questions' as type, COUNT(*) as count FROM custom_questions WHERE is_system = true
UNION ALL
SELECT 'System Lessons' as type, COUNT(*) as count FROM custom_lessons WHERE is_system = true;
















-- ============================================
-- APP SETTINGS TABLE (for guest unlock toggle)
-- Run this in Supabase SQL Editor
-- ============================================

-- Create app_settings table for storing application-wide settings
CREATE TABLE IF NOT EXISTS app_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key TEXT UNIQUE NOT NULL,
    setting_value JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for fast lookup by key
CREATE INDEX IF NOT EXISTS idx_app_settings_key ON app_settings(setting_key);

-- Enable RLS
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Allow all to read settings (needed for guests to check unlock status)
CREATE POLICY "Anyone can read app settings" ON app_settings
    FOR SELECT USING (true);

-- Only admins can insert/update settings
CREATE POLICY "Admins can insert app settings" ON app_settings
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins can update app settings" ON app_settings
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins can delete app settings" ON app_settings
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Create trigger for updated_at
CREATE TRIGGER update_app_settings_updated_at
    BEFORE UPDATE ON app_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default guest settings
INSERT INTO app_settings (setting_key, setting_value) 
VALUES ('guest_settings', '{"unlockProgress": false}'::jsonb)
ON CONFLICT (setting_key) DO NOTHING;
