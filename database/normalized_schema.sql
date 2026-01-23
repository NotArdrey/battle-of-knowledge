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
CREATE POLICY "Teachers can manage own questions" ON custom_questions FOR ALL USING (created_by = auth.uid());
CREATE POLICY "Admins can manage all questions" ON custom_questions FOR ALL USING (is_admin());
CREATE POLICY "Anyone can view approved questions" ON custom_questions FOR SELECT USING (is_active = true AND is_approved = true);

CREATE POLICY "Teachers can manage own lessons" ON custom_lessons FOR ALL USING (created_by = auth.uid());
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
