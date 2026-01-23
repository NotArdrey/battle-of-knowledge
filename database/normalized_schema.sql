-- ============================================
-- BATTLE OF KNOWLEDGE - NORMALIZED 3NF SCHEMA
-- Run this ENTIRE script in Supabase SQL Editor
-- ============================================

-- ============================================
-- STEP 1: CLEANUP EVERYTHING
-- ============================================

-- Drop views
DROP VIEW IF EXISTS teacher_student_progress CASCADE;
DROP VIEW IF EXISTS admin_user_stats CASCADE;

-- Drop tables (order matters due to foreign keys)
DROP TABLE IF EXISTS student_lesson_progress CASCADE;
DROP TABLE IF EXISTS student_unlocked_heroes CASCADE;
DROP TABLE IF EXISTS question_choices CASCADE;
DROP TABLE IF EXISTS game_sessions CASCADE;
DROP TABLE IF EXISTS custom_lessons CASCADE;
DROP TABLE IF EXISTS custom_questions CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS achievement_definitions CASCADE;
DROP TABLE IF EXISTS progress CASCADE;
DROP TABLE IF EXISTS class_enrollments CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS registered_students CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS eras CASCADE;
DROP TABLE IF EXISTS app_settings CASCADE;

-- Drop functions and triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS generate_class_code() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS is_teacher() CASCADE;
DROP FUNCTION IF EXISTS is_admin() CASCADE;
DROP FUNCTION IF EXISTS get_user_role() CASCADE;

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- STEP 2: LOOKUP TABLES (Eras, Achievements)
-- ============================================

CREATE TABLE eras (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    era_key TEXT UNIQUE NOT NULL, -- e.g., 'early-spanish'
    title_en TEXT NOT NULL,
    title_tl TEXT,
    description_en TEXT,
    description_tl TEXT,
    sort_order INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE achievement_definitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    achievement_key TEXT UNIQUE NOT NULL,
    title_en TEXT NOT NULL,
    description_en TEXT NOT NULL,
    icon TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STEP 3: MAIN USER TABLES
-- ============================================

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'teacher', 'student')),
    teacher_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- specific to students
    is_verified BOOLEAN DEFAULT FALSE,
    student_id_number TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_teacher_id ON profiles(teacher_id);

CREATE TABLE registered_students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id_number TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT,
    grade_level TEXT,
    section TEXT,
    is_claimed BOOLEAN DEFAULT FALSE,
    claimed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    uploaded_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STEP 4: CLASS MANAGEMENT
-- ============================================

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

-- ============================================
-- STEP 5: CONTENT (Questions & Lessons)
-- ============================================

CREATE TABLE custom_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    era_id UUID NOT NULL REFERENCES eras(id) ON DELETE CASCADE,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL, -- Null for system questions
    question_text_en TEXT NOT NULL,
    question_text_tl TEXT,
    difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    is_active BOOLEAN DEFAULT TRUE,
    is_approved BOOLEAN DEFAULT FALSE,
    is_system BOOLEAN DEFAULT FALSE,
    source_id TEXT UNIQUE, -- For tracking migrated system content (e.g., 'system-early-spanish-0')
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_questions_era ON custom_questions(era_id);
CREATE INDEX idx_questions_creator ON custom_questions(created_by);

CREATE TABLE question_choices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES custom_questions(id) ON DELETE CASCADE,
    content_en TEXT NOT NULL,
    content_tl TEXT,
    is_correct BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_choices_question ON question_choices(question_id);

CREATE TABLE custom_lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    era_id UUID NOT NULL REFERENCES eras(id) ON DELETE CASCADE,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    lesson_order INTEGER NOT NULL,
    title_en TEXT NOT NULL,
    title_tl TEXT,
    content_en TEXT NOT NULL,
    content_tl TEXT,
    icon TEXT DEFAULT '📖',
    is_active BOOLEAN DEFAULT TRUE,
    is_approved BOOLEAN DEFAULT FALSE,
    is_system BOOLEAN DEFAULT FALSE,
    source_id TEXT UNIQUE, -- For tracking migrated system content (e.g., 'system-early-spanish-1')
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lessons_era ON custom_lessons(era_id);

-- ============================================
-- STEP 6: PROGRESS & GAMEPLAY
-- ============================================

CREATE TABLE progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    era_id UUID NOT NULL REFERENCES eras(id) ON DELETE CASCADE,
    is_era_completed BOOLEAN DEFAULT FALSE,
    boss_defeated BOOLEAN DEFAULT FALSE,
    current_lesson_index INTEGER DEFAULT 0,
    battle_score INTEGER DEFAULT 0,
    enemies_defeated INTEGER DEFAULT 0,
    highest_streak INTEGER DEFAULT 0,
    time_spent_seconds INTEGER DEFAULT 0,
    last_played_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, era_id)
);

CREATE INDEX idx_progress_user ON progress(user_id);
CREATE INDEX idx_progress_era ON progress(era_id);

-- Normalized Lesson Progress
CREATE TABLE student_lesson_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES custom_lessons(id) ON DELETE CASCADE,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- Normalized Unlocked Heroes (assuming heroes are associated with eras or simple IDs)
-- Since heroes were JSONB indices often, we might strictly define them later.
-- For now, we will track them by a simple integer ID or text key if we had a proper heroes table.
-- Given previous schema used JSON 'unlocked_heroes', we will create a simple table.
CREATE TABLE student_unlocked_heroes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    hero_index INTEGER NOT NULL, -- Corresponds to client-side hero array index or ID
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, hero_index)
);

CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievement_definitions(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

CREATE TABLE game_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    era_id UUID NOT NULL REFERENCES eras(id) ON DELETE CASCADE,
    session_type TEXT NOT NULL CHECK (session_type IN ('learning', 'battle')),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    questions_answered INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    score INTEGER DEFAULT 0
);

CREATE TABLE app_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key TEXT UNIQUE NOT NULL,
    setting_value JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STEP 7: ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE registered_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Helper Functions
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role FROM profiles WHERE id = auth.uid();
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

-- Policies

-- Profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update any profile" ON profiles FOR UPDATE USING (is_admin());
CREATE POLICY "Teachers can view all student profiles" ON profiles FOR SELECT USING (is_teacher() AND role = 'student');
CREATE POLICY "Teachers can update student profiles" ON profiles FOR UPDATE USING (is_teacher() AND role = 'student');

-- Registered Students
CREATE POLICY "Admins can manage registered students" ON registered_students FOR ALL USING (is_admin());
CREATE POLICY "Anyone can validate student ID" ON registered_students FOR SELECT USING (true);

-- Classes
CREATE POLICY "Teachers can manage own classes" ON classes FOR ALL USING (teacher_id = auth.uid());
CREATE POLICY "Admins can view all classes" ON classes FOR SELECT USING (is_admin());
CREATE POLICY "Students can view active classes" ON classes FOR SELECT USING (is_active = true);

-- Enrollments
CREATE POLICY "Teachers can manage class enrollments" ON class_enrollments FOR ALL 
    USING (EXISTS (SELECT 1 FROM classes WHERE classes.id = class_enrollments.class_id AND classes.teacher_id = auth.uid()));
CREATE POLICY "Students can view own enrollments" ON class_enrollments FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Students can enroll themselves" ON class_enrollments FOR INSERT WITH CHECK (student_id = auth.uid());
CREATE POLICY "Admins can manage all enrollments" ON class_enrollments FOR ALL USING (is_admin());

-- Progress
CREATE POLICY "Users can manage own progress" ON progress FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Admins can view all progress" ON progress FOR SELECT USING (is_admin());
CREATE POLICY "Teachers can view student progress" ON progress FOR SELECT 
    USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = progress.user_id AND profiles.teacher_id = auth.uid()));

-- Lessons/Heroes Progress (New Tables)
CREATE POLICY "Users can manage own lesson progress" ON student_lesson_progress FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage own heroes" ON student_unlocked_heroes FOR ALL USING (user_id = auth.uid());

-- Achievements
CREATE POLICY "Users can manage own achievements" ON achievements FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Admins can view all achievements" ON achievements FOR SELECT USING (is_admin());

-- Questions & Lessons (Content)
CREATE POLICY "Teachers can manage all questions" ON custom_questions FOR ALL USING (is_teacher() OR is_admin());
CREATE POLICY "Admins can manage all questions" ON custom_questions FOR ALL USING (is_admin());
CREATE POLICY "Anyone can view approved questions" ON custom_questions FOR SELECT USING (is_active = true AND is_approved = true);

CREATE POLICY "Teachers can manage all lessons" ON custom_lessons FOR ALL USING (is_teacher() OR is_admin());
CREATE POLICY "Admins can manage all lessons" ON custom_lessons FOR ALL USING (is_admin());
CREATE POLICY "Anyone can view approved lessons" ON custom_lessons FOR SELECT USING (is_active = true AND is_approved = true);

-- App Settings
CREATE POLICY "Anyone can read app settings" ON app_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage app settings" ON app_settings FOR ALL USING (is_admin());

-- ============================================
-- STEP 8: TRIGGERS & PLUMBING
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

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role, student_id_number, is_verified)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
        NEW.raw_user_meta_data->>'student_id_number',
        true
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- STEP 9: DATA SEEDING (Lookup Data)
-- ============================================

-- Seed Eras
INSERT INTO eras (era_key, title_en, title_tl, sort_order) VALUES
('early-spanish', 'Early Spanish Era', 'Unang Panahon ng Kastila', 1),
('late-spanish', 'Late Spanish Era', 'Huling Panahon ng Kastila', 2),
('american-colonial', 'American Colonial Era', 'Panahon ng Amerikano', 3),
('ww2', 'World War II', 'Ikalawang Digmaang Pandaigdig', 4);

-- Seed System Questions (Linked to Eras)
DO $$
DECLARE
    era_early UUID;
    era_late UUID;
    era_american UUID;
    era_ww2 UUID;
    q_id UUID;
BEGIN
    SELECT id INTO era_early FROM eras WHERE era_key = 'early-spanish';
    SELECT id INTO era_late FROM eras WHERE era_key = 'late-spanish';
    SELECT id INTO era_american FROM eras WHERE era_key = 'american-colonial';
    SELECT id INTO era_ww2 FROM eras WHERE era_key = 'ww2';

    -- Early Spanish Question 1
    INSERT INTO custom_questions (era_id, question_text_en, question_text_tl, is_system, is_approved, difficulty) 
    VALUES (era_early, 'Who was the first Filipino hero to resist Spanish colonization?', 'Sino ang unang bayaning Pilipino na lumaban sa pananakop ng Espanya?', true, true, 'easy')
    RETURNING id INTO q_id;

    INSERT INTO question_choices (question_id, content_en, content_tl, is_correct) VALUES
    (q_id, 'Lapu-Lapu', 'Lapu-Lapu', true),
    (q_id, 'Jose Rizal', 'Jose Rizal', false),
    (q_id, 'Andres Bonifacio', 'Andres Bonifacio', false),
    (q_id, 'Emilio Aguinaldo', 'Emilio Aguinaldo', false);

     -- Early Spanish Question 2
    INSERT INTO custom_questions (era_id, question_text_en, question_text_tl, is_system, is_approved, difficulty) 
    VALUES (era_early, 'In what year did Ferdinand Magellan arrive in the Philippines?', 'Anong taon dumating si Ferdinand Magellan sa Pilipinas?', true, true, 'easy')
    RETURNING id INTO q_id;

    INSERT INTO question_choices (question_id, content_en, content_tl, is_correct) VALUES
    (q_id, '1521', '1521', true),
    (q_id, '1565', '1565', false);

    -- (Add more questions similarly. For brevity, I am adding a sample)
END $$;

-- ============================================
-- SEED SYSTEM CONTENT (Normalized Schema)
-- Run this script in Supabase SQL Editor
-- ============================================

-- 1. CLEANUP SEED FUNCTIONS FIRST
DROP FUNCTION IF EXISTS seed_question(text, text, text, text, text, text[], text[], text);
DROP FUNCTION IF EXISTS seed_lesson(text, int, text, text, text, text, text);

-- 2. CREATE HELPER FUNCTION: Seed Question
CREATE OR REPLACE FUNCTION seed_question(
    p_era_key TEXT,
    p_text_en TEXT,
    p_text_tl TEXT,
    p_correct_en TEXT,
    p_correct_tl TEXT,
    p_wrong_en TEXT[],
    p_wrong_tl TEXT[],
    p_difficulty TEXT
) RETURNS VOID AS $$
DECLARE
    v_era_id UUID;
    v_q_id UUID;
    i INTEGER;
BEGIN
    -- Get Era ID
    SELECT id INTO v_era_id FROM eras WHERE era_key = p_era_key;
    
    IF v_era_id IS NULL THEN
        RAISE NOTICE 'Era not found: %', p_era_key;
        RETURN;
    END IF;

    -- Insert Question
    INSERT INTO custom_questions (era_id, question_text_en, question_text_tl, difficulty, is_system, is_approved, is_active)
    VALUES (v_era_id, p_text_en, p_text_tl, p_difficulty, true, true, true)
    RETURNING id INTO v_q_id;

    -- Insert Correct Answer
    INSERT INTO question_choices (question_id, content_en, content_tl, is_correct)
    VALUES (v_q_id, p_correct_en, p_correct_tl, true);

    -- Insert Wrong Answers (Loop through arrays)
    IF p_wrong_en IS NOT NULL THEN
        FOR i IN 1..array_length(p_wrong_en, 1) LOOP
            INSERT INTO question_choices (question_id, content_en, content_tl, is_correct)
            VALUES (v_q_id, p_wrong_en[i], p_wrong_tl[i], false);
        END LOOP;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 3. CREATE HELPER FUNCTION: Seed Lesson
CREATE OR REPLACE FUNCTION seed_lesson(
    p_era_key TEXT,
    p_order INTEGER,
    p_title_en TEXT,
    p_title_tl TEXT,
    p_content_en TEXT,
    p_content_tl TEXT,
    p_icon TEXT
) RETURNS VOID AS $$
DECLARE
    v_era_id UUID;
BEGIN
    SELECT id INTO v_era_id FROM eras WHERE era_key = p_era_key;
    
    IF v_era_id IS NULL THEN
        RAISE NOTICE 'Era not found: %', p_era_key;
        RETURN;
    END IF;

    INSERT INTO custom_lessons (era_id, lesson_order, title_en, title_tl, content_en, content_tl, icon, is_system, is_approved, is_active)
    VALUES (v_era_id, p_order, p_title_en, p_title_tl, p_content_en, p_content_tl, p_icon, true, true, true);
END;
$$ LANGUAGE plpgsql;

-- 4. EXECUTE SEEDING (With Explicit Type Casting)
DO $$
BEGIN
    -- Clear existing system content to avoid duplicates
    DELETE FROM custom_questions WHERE is_system = true;
    DELETE FROM custom_lessons WHERE is_system = true;

    -- EARLY SPANISH
    PERFORM seed_question(
        'early-spanish'::text, 
        'Who was the first Filipino hero to resist Spanish colonization?'::text, 
        'Sino ang unang bayaning Pilipino na lumaban sa pananakop ng Espanya?'::text, 
        'Lapu-Lapu'::text, 
        'Lapu-Lapu'::text, 
        ARRAY['Jose Rizal', 'Andres Bonifacio', 'Emilio Aguinaldo']::text[], 
        ARRAY['Jose Rizal', 'Andres Bonifacio', 'Emilio Aguinaldo']::text[], 
        'easy'::text
    );

    PERFORM seed_question(
        'early-spanish'::text, 
        'In what year did Ferdinand Magellan arrive in the Philippines?'::text, 
        'Anong taon dumating si Ferdinand Magellan sa Pilipinas?'::text, 
        '1521'::text, 
        '1521'::text, 
        ARRAY['1565', '1898', '1896']::text[], 
        ARRAY['1565', '1898', '1896']::text[], 
        'easy'::text
    );

    PERFORM seed_question(
        'early-spanish'::text, 'Where did the Battle of Mactan take place?'::text, 'Saan naganap ang Labanan sa Mactan?'::text, 
        'Cebu'::text, 'Cebu'::text, 
        ARRAY['Manila', 'Bataan', 'Mindanao']::text[], ARRAY['Maynila', 'Bataan', 'Mindanao']::text[], 'easy'::text
    );

    PERFORM seed_question(
        'early-spanish'::text, 'Who was the chieftain of Mactan during the Spanish arrival?'::text, 'Sino ang pinuno ng Mactan noong dumating ang mga Espanyol?'::text, 
        'Lapu-Lapu'::text, 'Lapu-Lapu'::text, 
        ARRAY['Raja Humabon', 'Datu Sikatuna', 'Datu Puti']::text[], ARRAY['Raja Humabon', 'Datu Sikatuna', 'Datu Puti']::text[], 'easy'::text
    );

    PERFORM seed_question(
        'early-spanish'::text, 'Who was the chieftain who welcomed Magellan and converted to Christianity?'::text, 'Sino ang pinunong tumanggap kay Magellan at naging Kristiyano?'::text, 
        'Raja Humabon'::text, 'Raja Humabon'::text, 
        ARRAY['Lapu-Lapu', 'Datu Sikatuna', 'Sultan Kudarat']::text[], ARRAY['Lapu-Lapu', 'Datu Sikatuna', 'Sultan Kudarat']::text[], 'medium'::text
    );

    PERFORM seed_question(
        'early-spanish'::text, 'What was the original name of the Philippines before Spanish colonization?'::text, 'Ano ang orihinal na pangalan ng Pilipinas bago sakupin ng Espanya?'::text, 
        'Maharlika'::text, 'Maharlika'::text, 
        ARRAY['Las Islas Filipinas', 'Ophir', 'Pearl of the Orient']::text[], ARRAY['Las Islas Filipinas', 'Ophir', 'Perlas ng Silangan']::text[], 'medium'::text
    );

    PERFORM seed_question(
        'early-spanish'::text, 'How did Ferdinand Magellan die?'::text, 'Paano namatay si Ferdinand Magellan?'::text, 
        'Killed in Battle of Mactan'::text, 'Napatay sa Labanan sa Mactan'::text, 
        ARRAY['Died of illness', 'Drowned at sea', 'Returned to Spain']::text[], ARRAY['Namatay sa sakit', 'Nalunod sa dagat', 'Bumalik sa Espanya']::text[], 'easy'::text
    );

    PERFORM seed_question(
        'early-spanish'::text, 'What weapon was Lapu-Lapu famous for using?'::text, 'Anong sandata ang ginagamit ni Lapu-Lapu?'::text, 
        'Kampilan (sword)'::text, 'Kampilan (espada)'::text, 
        ARRAY['Bow and arrow', 'Spear', 'Shield']::text[], ARRAY['Pana at palaso', 'Sibat', 'Kalasag']::text[], 'medium'::text
    );

    PERFORM seed_question(
        'early-spanish'::text, 'What year did Spain officially colonize the Philippines?'::text, 'Anong taon opisyal na sinakop ng Espanya ang Pilipinas?'::text, 
        '1565'::text, '1565'::text, 
        ARRAY['1521', '1571', '1600']::text[], ARRAY['1521', '1571', '1600']::text[], 'medium'::text
    );

    PERFORM seed_question(
        'early-spanish'::text, 'Who led the first successful Spanish expedition to colonize the Philippines?'::text, 'Sino ang nanguna sa unang matagumpay na ekspedisyon ng Espanya sa Pilipinas?'::text, 
        'Miguel Lopez de Legazpi'::text, 'Miguel Lopez de Legazpi'::text, 
        ARRAY['Ferdinand Magellan', 'Ruy Lopez de Villalobos', 'Martin de Goiti']::text[], ARRAY['Ferdinand Magellan', 'Ruy Lopez de Villalobos', 'Martin de Goiti']::text[], 'hard'::text
    );

    -- LATE SPANISH
    PERFORM seed_question(
        'late-spanish'::text, 'Who wrote ''Noli Me Tangere''?'::text, 'Sino ang sumulat ng ''Noli Me Tangere''?'::text, 
        'Jose Rizal'::text, 'Jose Rizal'::text, 
        ARRAY['Andres Bonifacio', 'Emilio Aguinaldo', 'Apolinario Mabini']::text[], ARRAY['Andres Bonifacio', 'Emilio Aguinaldo', 'Apolinario Mabini']::text[], 'easy'::text
    );

    PERFORM seed_question(
        'late-spanish'::text, 'What year was Jose Rizal executed?'::text, 'Anong taon binaril si Jose Rizal?'::text, 
        '1896'::text, '1896'::text, 
        ARRAY['1898', '1899', '1900']::text[], ARRAY['1898', '1899', '1900']::text[], 'easy'::text
    );

    PERFORM seed_question(
        'late-spanish'::text, 'Who founded the Katipunan?'::text, 'Sino ang nagtatag ng Katipunan?'::text, 
        'Andres Bonifacio'::text, 'Andres Bonifacio'::text, 
        ARRAY['Emilio Aguinaldo', 'Jose Rizal', 'Apolinario Mabini']::text[], ARRAY['Emilio Aguinaldo', 'Jose Rizal', 'Apolinario Mabini']::text[], 'easy'::text
    );

    PERFORM seed_question(
        'late-spanish'::text, 'When did the Philippines declare independence from Spain?'::text, 'Kailan idineklara ang kalayaan ng Pilipinas mula sa Espanya?'::text, 
        'June 12, 1898'::text, 'Hunyo 12, 1898'::text, 
        ARRAY['June 12, 1896', 'July 4, 1946', 'December 30, 1896']::text[], ARRAY['Hunyo 12, 1896', 'Hulyo 4, 1946', 'Disyembre 30, 1896']::text[], 'easy'::text
    );

    PERFORM seed_question(
        'late-spanish'::text, 'Who was known as the ''Brains of the Revolution''?'::text, 'Sino ang kilala bilang ''Utak ng Rebolusyon''?'::text, 
        'Apolinario Mabini'::text, 'Apolinario Mabini'::text, 
        ARRAY['Emilio Aguinaldo', 'Andres Bonifacio', 'Antonio Luna']::text[], ARRAY['Emilio Aguinaldo', 'Andres Bonifacio', 'Antonio Luna']::text[], 'medium'::text
    );

    PERFORM seed_question(
        'late-spanish'::text, 'What was the full name of the Katipunan?'::text, 'Ano ang buong pangalan ng Katipunan?'::text, 
        'Kataas-taasang Kagalang-galangang Katipunan ng mga Anak ng Bayan'::text, 'Kataas-taasang Kagalang-galangang Katipunan ng mga Anak ng Bayan'::text, 
        ARRAY['Katipunan ng mga Bayani', 'Katipunan ng Pilipinas', 'Kataas-taasang Katipunan']::text[], ARRAY['Katipunan ng mga Bayani', 'Katipunan ng Pilipinas', 'Kataas-taasang Katipunan']::text[], 'hard'::text
    );

    -- AMERICAN COLONIAL
    PERFORM seed_question(
        'american-colonial'::text, 'What battle marked the beginning of American-Philippine War?'::text, 'Anong labanan ang nagsimula ng Digmaang Pilipino-Amerikano?'::text, 
        'Battle of Manila Bay'::text, 'Labanan sa Manila Bay'::text, 
        ARRAY['Battle of Mactan', 'Battle of Bataan', 'Battle of Tirad Pass']::text[], ARRAY['Labanan sa Mactan', 'Labanan sa Bataan', 'Labanan sa Tirad Pass']::text[], 'medium'::text
    );

    PERFORM seed_question(
        'american-colonial'::text, 'Who was the American naval commander during the Battle of Manila Bay?'::text, 'Sino ang Amerikanong naval commander sa Labanan sa Manila Bay?'::text, 
        'George Dewey'::text, 'George Dewey'::text, 
        ARRAY['Douglas MacArthur', 'Arthur MacArthur', 'William Howard Taft']::text[], ARRAY['Douglas MacArthur', 'Arthur MacArthur', 'William Howard Taft']::text[], 'medium'::text
    );

    PERFORM seed_question(
        'american-colonial'::text, 'What year did the Spanish-American War begin?'::text, 'Anong taon nagsimula ang Digmaang Espanyol-Amerikano?'::text, 
        '1898'::text, '1898'::text, 
        ARRAY['1896', '1899', '1901']::text[], ARRAY['1896', '1899', '1901']::text[], 'easy'::text
    );

    PERFORM seed_question(
        'american-colonial'::text, 'Who was the Filipino general who fought at Tirad Pass?'::text, 'Sino ang heneral na nakipaglaban sa Tirad Pass?'::text, 
        'Gregorio del Pilar'::text, 'Gregorio del Pilar'::text, 
        ARRAY['Antonio Luna', 'Emilio Aguinaldo', 'Juan Luna']::text[], ARRAY['Antonio Luna', 'Emilio Aguinaldo', 'Juan Luna']::text[], 'medium'::text
    );

    -- WW2
    PERFORM seed_question(
        'ww2'::text, 'Who promised to return to the Philippines during World War II?'::text, 'Sino ang nangakong babalik sa Pilipinas noong Ikalawang Digmaang Pandaigdig?'::text, 
        'Douglas MacArthur'::text, 'Douglas MacArthur'::text, 
        ARRAY['George Dewey', 'Franklin Roosevelt', 'Dwight Eisenhower']::text[], ARRAY['George Dewey', 'Franklin Roosevelt', 'Dwight Eisenhower']::text[], 'easy'::text
    );

    PERFORM seed_question(
        'ww2'::text, 'What year did Japan invade the Philippines?'::text, 'Anong taon sinakop ng Japan ang Pilipinas?'::text, 
        '1941'::text, '1941'::text, 
        ARRAY['1942', '1945', '1940']::text[], ARRAY['1942', '1945', '1940']::text[], 'easy'::text
    );

    PERFORM seed_question(
        'ww2'::text, 'Where did the Bataan Death March take place?'::text, 'Saan naganap ang Bataan Death March?'::text, 
        'Bataan Peninsula'::text, 'Bataan Peninsula'::text, 
        ARRAY['Manila', 'Cebu', 'Mindanao']::text[], ARRAY['Maynila', 'Cebu', 'Mindanao']::text[], 'easy'::text
    );

    PERFORM seed_question(
        'ww2'::text, 'When was the Philippines liberated from Japan?'::text, 'Kailan pinalaya ang Pilipinas mula sa Japan?'::text, 
        '1945'::text, '1945'::text, 
        ARRAY['1944', '1946', '1943']::text[], ARRAY['1944', '1946', '1943']::text[], 'easy'::text
    );

    PERFORM seed_question(
        'ww2'::text, 'What famous words did MacArthur say when he left the Philippines?'::text, 'Ano ang sikat na sinabi ni MacArthur nang umalis siya sa Pilipinas?'::text, 
        'I shall return'::text, 'I shall return'::text, 
        ARRAY['We will be back', 'Never surrender', 'Victory awaits']::text[], ARRAY['We will be back', 'Never surrender', 'Victory awaits']::text[], 'easy'::text
    );

END $$;

-- 5. EXECUTE LESSON SEEDING (With Explicit Type Casting)
DO $$
BEGIN
    -- EARLY SPANISH LESSONS
    PERFORM seed_lesson('early-spanish'::text, 1, 'Pre-Colonial Philippines'::text, 'Pilipinas Bago ang Kolonisasyon'::text, '<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Life Before the Spanish</h3><p class="mb-3">Before 1521, the Philippines was made up of independent communities called <strong>barangays</strong>, each led by a <strong>datu</strong> or chieftain.</p></div>'::text, '<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Buhay Bago ang mga Espanyol</h3><p class="mb-3">Bago ang 1521, ang Pilipinas ay binubuo ng mga independyenteng komunidad na tinatawag na <strong>barangay</strong>.</p></div>'::text, '1'::text);
    
    PERFORM seed_lesson('early-spanish'::text, 2, 'Magellan''s Arrival (1521)'::text, 'Pagdating ni Magellan (1521)'::text, '<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Ferdinand Magellan Arrives</h3><p class="mb-3">On <strong>March 16, 1521</strong>, Portuguese explorer Ferdinand Magellan arrived in the Philippines.</p></div>'::text, '<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Dumating si Ferdinand Magellan</h3><p class="mb-3">Noong <strong>Marso 16, 1521</strong>, dumating si Ferdinand Magellan sa Pilipinas.</p></div>'::text, '2'::text);
    
    PERFORM seed_lesson('early-spanish'::text, 3, 'Lapu-Lapu: The Hero'::text, 'Lapu-Lapu: Ang Bayani'::text, '<div class="space-y-4"><h3 class="text-xl font-bold mb-3">The Defender of Mactan</h3><p class="mb-3"><strong>Lapu-Lapu</strong> was the chieftain of Mactan Island who refused to submit to Spanish rule.</p></div>'::text, '<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Ang Tagapagtanggol ng Mactan</h3><p class="mb-3">Si <strong>Lapu-Lapu</strong> ang pinuno ng Pulo ng Mactan.</p></div>'::text, '3'::text);
    
    PERFORM seed_lesson('early-spanish'::text, 4, 'The Battle of Mactan'::text, 'Ang Labanan sa Mactan'::text, '<div class="space-y-4"><h3 class="text-xl font-bold mb-3">April 27, 1521</h3><p class="mb-3">The <strong>Battle of Mactan</strong> took place on April 27, 1521. Magellan was killed in the battle.</p></div>'::text, '<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Abril 27, 1521</h3><p class="mb-3">Ang <strong>Labanan sa Mactan</strong> ay naganap noong Abril 27, 1521.</p></div>'::text, '4'::text);
    
    PERFORM seed_lesson('early-spanish'::text, 5, 'Legacy of Resistance'::text, 'Pamana ng Paglaban'::text, '<div class="space-y-4"><h3 class="text-xl font-bold mb-3">The Spirit of Filipino Resistance</h3><p class="mb-3">The Battle of Mactan established a powerful legacy of Filipino resistance against foreign domination.</p></div>'::text, '<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Ang Diwa ng Paglaban</h3><p class="mb-3">Ang Labanan sa Mactan ay nagtatag ng malakas na pamana ng paglaban ng mga Pilipino.</p></div>'::text, '5'::text);

    -- LATE SPANISH LESSONS
    PERFORM seed_lesson('late-spanish'::text, 1, 'Spanish Colonial Rule'::text, 'Pamumuno ng Kolonyal na Espanyol'::text, '<div class="space-y-4"><h3 class="text-xl font-bold mb-3">333 Years of Spanish Rule</h3><p class="mb-3">Spain colonized the Philippines for 333 years (1565-1898).</p></div>'::text, '<div class="space-y-4"><h3 class="text-xl font-bold mb-3">333 Taon ng Pamumuno ng Espanya</h3><p class="mb-3">Sinakop ng Espanya ang Pilipinas sa loob ng 333 taon.</p></div>'::text, '1'::text);
    
    PERFORM seed_lesson('late-spanish'::text, 2, 'Jose Rizal: National Hero'::text, 'Jose Rizal: Pambansang Bayani'::text, '<div class="space-y-4"><h3 class="text-xl font-bold mb-3">The Pen is Mightier Than the Sword</h3><p class="mb-3"><strong>Jose Rizal</strong> (1861-1896) was a doctor, writer, and reformist.</p></div>'::text, '<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Ang Panulat ay Mas Makapangyarihan</h3><p class="mb-3">Si <strong>Jose Rizal</strong> (1861-1896) ay isang doktor at manunulat.</p></div>'::text, '2'::text);
    
    PERFORM seed_lesson('late-spanish'::text, 3, 'The Katipunan'::text, 'Ang Katipunan'::text, '<div class="space-y-4"><h3 class="text-xl font-bold mb-3">The Secret Revolutionary Society</h3><p class="mb-3">The <strong>Katipunan</strong> was founded by <strong>Andres Bonifacio</strong> on July 7, 1892.</p></div>'::text, '<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Ang Lihim na Samahan</h3><p class="mb-3">Ang <strong>Katipunan</strong> ay itinatag ni <strong>Andres Bonifacio</strong>.</p></div>'::text, '3'::text);
    
    PERFORM seed_lesson('late-spanish'::text, 4, 'The Philippine Revolution'::text, 'Ang Rebolusyong Pilipino'::text, '<div class="space-y-4"><h3 class="text-xl font-bold mb-3">The Cry of Pugad Lawin</h3><p class="mb-3">On August 23, 1896, the Philippine Revolution began.</p></div>'::text, '<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Ang Sigaw ng Pugad Lawin</h3><p class="mb-3">Noong Agosto 23, 1896, nagsimula ang Rebolusyong Pilipino.</p></div>'::text, '4'::text);
    
    PERFORM seed_lesson('late-spanish'::text, 5, 'Philippine Independence'::text, 'Kalayaan ng Pilipinas'::text, '<div class="space-y-4"><h3 class="text-xl font-bold mb-3">June 12, 1898</h3><p class="mb-3">On <strong>June 12, 1898</strong>, General <strong>Emilio Aguinaldo</strong> declared Philippine independence.</p></div>'::text, '<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Hunyo 12, 1898</h3><p class="mb-3">Noong <strong>Hunyo 12, 1898</strong>, idineklara ni <strong>Emilio Aguinaldo</strong> ang kalayaan.</p></div>'::text, '5'::text);

    -- AMERICAN COLONIAL LESSONS
    PERFORM seed_lesson('american-colonial'::text, 1, 'American Arrival'::text, 'Pagdating ng mga Amerikano'::text, '<div class="space-y-4"><h3 class="text-xl font-bold mb-3">A New Colonial Power</h3><p class="mb-3">In 1898, the United States defeated Spain in the Spanish-American War.</p></div>'::text, '<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Bagong Kapangyarihan</h3><p class="mb-3">Noong 1898, tinalo ng Estados Unidos ang Espanya.</p></div>'::text, '1'::text);
    
    PERFORM seed_lesson('american-colonial'::text, 2, 'Philippine-American War'::text, 'Digmaang Pilipino-Amerikano'::text, '<div class="space-y-4"><h3 class="text-xl font-bold mb-3">The Fight for True Independence</h3><p class="mb-3">The <strong>Philippine-American War</strong> (1899-1902) erupted on February 4, 1899.</p></div>'::text, '<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Laban para sa Kalayaan</h3><p class="mb-3">Ang <strong>Digmaang Pilipino-Amerikano</strong> ay nagsimula noong Pebrero 4, 1899.</p></div>'::text, '2'::text);
    
    PERFORM seed_lesson('american-colonial'::text, 3, 'American Colonial Policies'::text, 'Mga Patakaran ng Amerika'::text, '<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Education and Infrastructure</h3><p class="mb-3">The Americans introduced public education through the <strong>Thomasites</strong>.</p></div>'::text, '<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Edukasyon at Imprastruktura</h3><p class="mb-3">Ipinakilala ng mga Amerikano ang pampublikong edukasyon.</p></div>'::text, '3'::text);

    -- WW2 ERA LESSONS
    PERFORM seed_lesson('ww2'::text, 1, 'Japanese Invasion'::text, 'Pagsalakay ng mga Hapon'::text, '<div class="space-y-4"><h3 class="text-xl font-bold mb-3">December 8, 1941</h3><p class="mb-3">Japan invaded the Philippines on <strong>December 8, 1941</strong>.</p></div>'::text, '<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Disyembre 8, 1941</h3><p class="mb-3">Sinalakay ng Japan ang Pilipinas noong <strong>Disyembre 8, 1941</strong>.</p></div>'::text, '1'::text);
    
    PERFORM seed_lesson('ww2'::text, 2, 'Bataan Death March'::text, 'Martsa ng Kamatayan sa Bataan'::text, '<div class="space-y-4"><h3 class="text-xl font-bold mb-3">A Tragic Chapter</h3><p class="mb-3">The <strong>Bataan Death March</strong> claimed thousands of lives in April 1942.</p></div>'::text, '<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Masaklap na Kabanata</h3><p class="mb-3">Ang <strong>Bataan Death March</strong> ay kumitil ng libu-libong buhay.</p></div>'::text, '2'::text);
    
    PERFORM seed_lesson('ww2'::text, 3, 'Filipino Resistance'::text, 'Paglaban ng mga Pilipino'::text, '<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Guerrilla Warfare</h3><p class="mb-3">Filipino guerrilla fighters continued to resist Japanese occupation.</p></div>'::text, '<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Digmaang Gerilya</h3><p class="mb-3">Patuloy na lumaban ang mga Pilipinong gerilya.</p></div>'::text, '3'::text);
    
    PERFORM seed_lesson('ww2'::text, 4, 'MacArthur Returns'::text, 'Bumalik si MacArthur'::text, '<div class="space-y-4"><h3 class="text-xl font-bold mb-3">October 20, 1944</h3><p class="mb-3">General Douglas MacArthur returned to the Philippines on <strong>October 20, 1944</strong>.</p></div>'::text, '<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Oktubre 20, 1944</h3><p class="mb-3">Bumalik si MacArthur sa Pilipinas noong <strong>Oktubre 20, 1944</strong>.</p></div>'::text, '4'::text);
    
    PERFORM seed_lesson('ww2'::text, 5, 'Liberation and Independence'::text, 'Pagpapalaya at Kalayaan'::text, '<div class="space-y-4"><h3 class="text-xl font-bold mb-3">July 4, 1946</h3><p class="mb-3">On <strong>July 4, 1946</strong>, the Philippines gained full independence.</p></div>'::text, '<div class="space-y-4"><h3 class="text-xl font-bold mb-3">Hulyo 4, 1946</h3><p class="mb-3">Noong <strong>Hulyo 4, 1946</strong>, nakuha ng Pilipinas ang buong kalayaan.</p></div>'::text, '5'::text);

END $$;