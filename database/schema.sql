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

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'teacher', 'student')),
    teacher_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    student_id_number TEXT,
    class_id UUID,
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
ALTER TABLE registered_students ENABLE ROW LEVEL SECURITY;
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

-- ============================================
-- STEP 5: RLS POLICIES
-- ============================================

-- PROFILES
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update any profile" ON profiles FOR UPDATE USING (is_admin());
CREATE POLICY "Teachers can view direct students" ON profiles FOR SELECT USING (is_teacher() AND teacher_id = auth.uid());
CREATE POLICY "Teachers can view all student profiles" ON profiles FOR SELECT USING (is_teacher() AND role = 'student');
CREATE POLICY "Teachers can update student assignments" ON profiles FOR UPDATE USING (is_teacher() AND role = 'student');
CREATE POLICY "Enable insert for signup" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- REGISTERED STUDENTS
CREATE POLICY "Admins can manage registered students" ON registered_students FOR ALL USING (is_admin());
CREATE POLICY "Anyone can validate student ID" ON registered_students FOR SELECT USING (true);

-- CLASSES
CREATE POLICY "Teachers can manage own classes" ON classes FOR ALL USING (teacher_id = auth.uid());
CREATE POLICY "Admins can view all classes" ON classes FOR SELECT USING (is_admin());
CREATE POLICY "Students can view active classes" ON classes FOR SELECT USING (is_active = true);

-- CLASS ENROLLMENTS
CREATE POLICY "Teachers can manage class enrollments" ON class_enrollments FOR ALL 
    USING (EXISTS (SELECT 1 FROM classes WHERE classes.id = class_enrollments.class_id AND classes.teacher_id = auth.uid()));
CREATE POLICY "Students can view own enrollments" ON class_enrollments FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Students can enroll themselves" ON class_enrollments FOR INSERT WITH CHECK (student_id = auth.uid());
CREATE POLICY "Admins can manage all enrollments" ON class_enrollments FOR ALL USING (is_admin());

-- PROGRESS
CREATE POLICY "Users can manage own progress" ON progress FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Admins can view all progress" ON progress FOR SELECT USING (is_admin());
CREATE POLICY "Teachers can view student progress" ON progress FOR SELECT 
    USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = progress.user_id AND profiles.teacher_id = auth.uid()));

-- ACHIEVEMENTS
CREATE POLICY "Users can manage own achievements" ON achievements FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Admins can view all achievements" ON achievements FOR SELECT USING (is_admin());

-- CUSTOM QUESTIONS
CREATE POLICY "Teachers can manage own questions" ON custom_questions FOR ALL USING (created_by = auth.uid());
CREATE POLICY "Admins can manage all questions" ON custom_questions FOR ALL USING (is_admin());
CREATE POLICY "Anyone can view approved questions" ON custom_questions FOR SELECT USING (is_active = true AND is_approved = true);

-- CUSTOM LESSONS
CREATE POLICY "Teachers can manage own lessons" ON custom_lessons FOR ALL USING (created_by = auth.uid());
CREATE POLICY "Admins can manage all lessons" ON custom_lessons FOR ALL USING (is_admin());
CREATE POLICY "Anyone can view approved lessons" ON custom_lessons FOR SELECT USING (is_active = true AND is_approved = true);

-- GAME SESSIONS
CREATE POLICY "Users can manage own sessions" ON game_sessions FOR ALL USING (user_id = auth.uid());
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

-- Auth trigger to create profile on signup
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
-- STEP 7: VIEWS
-- ============================================

CREATE OR REPLACE VIEW teacher_student_progress AS
SELECT 
    p.id AS student_id,
    p.full_name AS student_name,
    p.email AS student_email,
    p.teacher_id,
    pr.era_key,
    pr.lessons_complete,
    pr.boss_defeated,
    pr.battle_score,
    pr.last_played_at
FROM profiles p
LEFT JOIN progress pr ON p.id = pr.user_id
WHERE p.role = 'student';

CREATE OR REPLACE VIEW admin_user_stats AS
SELECT
    role,
    COUNT(*) AS user_count,
    COUNT(*) FILTER (WHERE is_verified = true) AS verified_count
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

INSERT INTO profiles (id, email, full_name, role, is_verified)
SELECT 
    id,
    email,
    COALESCE(raw_user_meta_data->>'full_name', 'User'),
    COALESCE(raw_user_meta_data->>'role', 'student'),
    true
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 10: SET CORRECT ROLES
-- ============================================

UPDATE profiles SET role = 'admin', is_verified = true WHERE email = 'admin@battleofknowledge.com';
UPDATE profiles SET role = 'teacher', is_verified = true WHERE email IN ('teacher1@school.edu', 'teacher2@school.edu');
UPDATE profiles SET role = 'student', is_verified = true WHERE email LIKE 'student%@school.edu';

-- ============================================
-- DONE! Verify with:
-- SELECT email, role, is_verified FROM profiles ORDER BY role, email;
-- ============================================
UPDATE auth.users SET email_confirmed_at = NOW() WHERE email_confirmed_at IS NULL;