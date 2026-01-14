-- ============================================
-- BATTLE OF KNOWLEDGE - SUPABASE DATABASE SCHEMA
-- Role-Based Access Control (RBAC) System
-- ============================================

-- ============================================
-- CLEANUP: Drop existing objects if they exist
-- ============================================

-- Drop views first (they depend on tables)
DROP VIEW IF EXISTS teacher_student_progress;
DROP VIEW IF EXISTS admin_user_stats;

-- Drop tables in reverse order (CASCADE will handle triggers and policies)
DROP TABLE IF EXISTS game_sessions CASCADE;
DROP TABLE IF EXISTS custom_lessons CASCADE;
DROP TABLE IF EXISTS custom_questions CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS progress CASCADE;
DROP TABLE IF EXISTS class_enrollments CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS registered_students CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop the auth trigger separately (auth.users always exists)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop functions
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS generate_class_code() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS is_teacher() CASCADE;
DROP FUNCTION IF EXISTS is_admin() CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROFILES TABLE (Links to Supabase Auth)
-- ============================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'teacher', 'student')),
    teacher_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    student_id_number TEXT, -- For student validation
    class_id UUID,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_teacher_id ON profiles(teacher_id);
CREATE INDEX idx_profiles_student_id ON profiles(student_id_number);

-- ============================================
-- 2. REGISTERED STUDENTS TABLE (Admin Uploaded)
-- For validating student registrations
-- ============================================
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

CREATE INDEX idx_registered_students_id ON registered_students(student_id_number);

-- ============================================
-- 3. CLASSES TABLE (Teacher Class Management)
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

-- ============================================
-- 4. CLASS ENROLLMENTS (Students in Classes)
-- ============================================
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
-- 5. PROGRESS TABLE (Replaces localStorage)
-- ============================================
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
    unlocked_heroes JSONB DEFAULT '[0]'::jsonb, -- Array of hero indices unlocked for this era (first hero always unlocked)
    last_played_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, era_key)
);

CREATE INDEX idx_progress_user ON progress(user_id);
CREATE INDEX idx_progress_era ON progress(era_key);

-- ============================================
-- 6. ACHIEVEMENTS TABLE
-- ============================================
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    achievement_key TEXT NOT NULL,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_key)
);

CREATE INDEX idx_achievements_user ON achievements(user_id);

-- ============================================
-- 7. CUSTOM QUESTIONS TABLE (Teacher Created)
-- ============================================
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
CREATE INDEX idx_questions_class ON custom_questions(class_id);

-- ============================================
-- 7B. CUSTOM LESSONS TABLE (Teacher Created)
-- ============================================
CREATE TABLE custom_lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    era_key TEXT NOT NULL,
    lesson_order INTEGER NOT NULL, -- Position in the lesson sequence (1, 2, 3, etc.)
    title_en TEXT NOT NULL,
    title_tl TEXT,
    content_en TEXT NOT NULL,
    content_tl TEXT,
    icon TEXT DEFAULT '📖', -- Emoji or icon identifier
    is_active BOOLEAN DEFAULT TRUE,
    is_approved BOOLEAN DEFAULT FALSE,
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lessons_creator ON custom_lessons(created_by);
CREATE INDEX idx_lessons_era ON custom_lessons(era_key);
CREATE INDEX idx_lessons_class ON custom_lessons(class_id);
CREATE INDEX idx_lessons_order ON custom_lessons(era_key, lesson_order);

-- ============================================
-- 8. GAME SESSIONS TABLE (Analytics)
-- ============================================
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
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
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
-- HELPER FUNCTIONS (Must be created before policies)
-- ============================================

-- Helper function to check if current user is admin (prevents infinite recursion in RLS)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Helper function to check if current user is teacher
CREATE OR REPLACE FUNCTION is_teacher()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'teacher'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================
-- PROFILES POLICIES
-- ============================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile (except role)
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
USING (is_admin());

-- Admins can update any profile
CREATE POLICY "Admins can update any profile"
ON profiles FOR UPDATE
USING (is_admin());

-- Teachers can view their students (students enrolled in their classes)
CREATE POLICY "Teachers can view their students"
ON profiles FOR SELECT
USING (
    is_teacher() AND (
        -- Check if student is enrolled in any of teacher's classes
        EXISTS (
            SELECT 1 FROM class_enrollments ce
            JOIN classes c ON ce.class_id = c.id
            WHERE ce.student_id = profiles.id 
            AND c.teacher_id = auth.uid()
        )
        -- OR student has teacher_id set directly (legacy/alternative method)
        OR teacher_id = auth.uid()
    )
);

-- Allow insert during signup
CREATE POLICY "Enable insert for signup"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- ============================================
-- REGISTERED STUDENTS POLICIES
-- ============================================

-- Admins can manage registered students
CREATE POLICY "Admins can manage registered students"
ON registered_students FOR ALL
USING (is_admin());

-- Anyone can check if student ID exists (for validation)
CREATE POLICY "Anyone can validate student ID"
ON registered_students FOR SELECT
USING (true);

-- ============================================
-- CLASSES POLICIES
-- ============================================

-- Teachers can manage their own classes
CREATE POLICY "Teachers can manage own classes"
ON classes FOR ALL
USING (teacher_id = auth.uid());

-- Students can view classes they're enrolled in
CREATE POLICY "Students can view enrolled classes"
ON classes FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM class_enrollments
        WHERE class_id = classes.id AND student_id = auth.uid()
    )
);

-- Admins can view all classes
CREATE POLICY "Admins can view all classes"
ON classes FOR SELECT
USING (is_admin());

-- ============================================
-- CLASS ENROLLMENTS POLICIES
-- ============================================

-- Teachers can manage enrollments in their classes
CREATE POLICY "Teachers can manage class enrollments"
ON class_enrollments FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM classes
        WHERE classes.id = class_enrollments.class_id 
        AND classes.teacher_id = auth.uid()
    )
);

-- Students can view their own enrollments
CREATE POLICY "Students can view own enrollments"
ON class_enrollments FOR SELECT
USING (student_id = auth.uid());

-- Admins can manage all enrollments
CREATE POLICY "Admins can manage all enrollments"
ON class_enrollments FOR ALL
USING (is_admin());

-- ============================================
-- PROGRESS POLICIES
-- ============================================

-- Users can manage their own progress
CREATE POLICY "Users can manage own progress"
ON progress FOR ALL
USING (user_id = auth.uid());

-- Teachers can view their students' progress (students enrolled in their classes)
CREATE POLICY "Teachers can view student progress"
ON progress FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM class_enrollments ce
        JOIN classes c ON ce.class_id = c.id
        WHERE ce.student_id = progress.user_id 
        AND c.teacher_id = auth.uid()
    )
    OR EXISTS (
        SELECT 1 FROM profiles
        WHERE id = progress.user_id AND teacher_id = auth.uid()
    )
);

-- Admins can view all progress
CREATE POLICY "Admins can view all progress"
ON progress FOR SELECT
USING (is_admin());

-- ============================================
-- ACHIEVEMENTS POLICIES
-- ============================================

-- Users can manage their own achievements
CREATE POLICY "Users can manage own achievements"
ON achievements FOR ALL
USING (user_id = auth.uid());

-- ============================================
-- CUSTOM QUESTIONS POLICIES
-- ============================================

-- Teachers can manage their own questions
CREATE POLICY "Teachers can manage own questions"
ON custom_questions FOR ALL
USING (created_by = auth.uid());

-- Admins can manage all questions
CREATE POLICY "Admins can manage all questions"
ON custom_questions FOR ALL
USING (is_admin());

-- Students can view approved questions
CREATE POLICY "Students can view approved questions"
ON custom_questions FOR SELECT
USING (is_active = true AND is_approved = true);

-- ============================================
-- CUSTOM LESSONS POLICIES
-- ============================================

-- Teachers can manage their own lessons
CREATE POLICY "Teachers can manage own lessons"
ON custom_lessons FOR ALL
USING (created_by = auth.uid());

-- Admins can manage all lessons
CREATE POLICY "Admins can manage all lessons"
ON custom_lessons FOR ALL
USING (is_admin());

-- Students can view approved lessons
CREATE POLICY "Students can view approved lessons"
ON custom_lessons FOR SELECT
USING (is_active = true AND is_approved = true);

-- ============================================
-- GAME SESSIONS POLICIES
-- ============================================

-- Users can manage their own sessions
CREATE POLICY "Users can manage own sessions"
ON game_sessions FOR ALL
USING (user_id = auth.uid());

-- Teachers can view student sessions (students enrolled in their classes)
CREATE POLICY "Teachers can view student sessions"
ON game_sessions FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM class_enrollments ce
        JOIN classes c ON ce.class_id = c.id
        WHERE ce.student_id = game_sessions.user_id 
        AND c.teacher_id = auth.uid()
    )
    OR EXISTS (
        SELECT 1 FROM profiles
        WHERE id = game_sessions.user_id AND teacher_id = auth.uid()
    )
);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_progress_updated_at
    BEFORE UPDATE ON progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_classes_updated_at
    BEFORE UPDATE ON classes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at
    BEFORE UPDATE ON custom_questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
    BEFORE UPDATE ON custom_lessons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate unique class code
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

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role, student_id_number)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
        NEW.raw_user_meta_data->>'student_id_number'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- HELPER VIEWS
-- ============================================

-- View for teacher dashboard - student progress summary
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

-- View for admin dashboard - user statistics
CREATE OR REPLACE VIEW admin_user_stats AS
SELECT
    role,
    COUNT(*) AS user_count,
    COUNT(*) FILTER (WHERE is_verified = true) AS verified_count
FROM profiles
GROUP BY role;

-- ============================================
-- DUMMY DATA FOR TESTING
-- ============================================

-- Note: In production, users are created via Supabase Auth signup
-- These test accounts are created directly for development/testing

-- ============================================
-- STEP 1: CREATE AUTH USERS (must be first - profiles depend on these)
-- ============================================

-- Delete existing test users first (if any)
DELETE FROM auth.users WHERE email IN (
    'admin@battleofknowledge.com',
    'teacher1@school.edu',
    'teacher2@school.edu',
    'student1@school.edu',
    'student2@school.edu',
    'student3@school.edu',
    'student4@school.edu',
    'student5@school.edu'
);

-- Create Admin User
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('a0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'admin@battleofknowledge.com', crypt('admin123', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"System Admin", "role":"admin"}', 'authenticated', 'authenticated', NOW(), NOW());

-- Create Teacher Users
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES 
    ('t0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'teacher1@school.edu', crypt('teacher123', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Maria Santos", "role":"teacher"}', 'authenticated', 'authenticated', NOW(), NOW()),
    ('t0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'teacher2@school.edu', crypt('teacher123', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Juan Dela Cruz", "role":"teacher"}', 'authenticated', 'authenticated', NOW(), NOW());

-- Create Student Users
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES 
    ('s0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'student1@school.edu', crypt('student123', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Ana Garcia", "role":"student", "student_id_number":"STU-2024-001"}', 'authenticated', 'authenticated', NOW(), NOW()),
    ('s0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'student2@school.edu', crypt('student123', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Pedro Reyes", "role":"student", "student_id_number":"STU-2024-002"}', 'authenticated', 'authenticated', NOW(), NOW()),
    ('s0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'student3@school.edu', crypt('student123', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Sofia Cruz", "role":"student", "student_id_number":"STU-2024-003"}', 'authenticated', 'authenticated', NOW(), NOW()),
    ('s0000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'student4@school.edu', crypt('student123', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Miguel Torres", "role":"student", "student_id_number":"STU-2024-004"}', 'authenticated', 'authenticated', NOW(), NOW()),
    ('s0000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000', 'student5@school.edu', crypt('student123', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Isabella Luna", "role":"student", "student_id_number":"STU-2024-005"}', 'authenticated', 'authenticated', NOW(), NOW());

-- ============================================
-- STEP 2: CREATE PROFILES AND OTHER DATA
-- ============================================

-- Create UUIDs for test users
DO $$
DECLARE
    admin_id UUID := 'a0000000-0000-0000-0000-000000000001';
    teacher1_id UUID := 't0000000-0000-0000-0000-000000000001';
    teacher2_id UUID := 't0000000-0000-0000-0000-000000000002';
    student1_id UUID := 's0000000-0000-0000-0000-000000000001';
    student2_id UUID := 's0000000-0000-0000-0000-000000000002';
    student3_id UUID := 's0000000-0000-0000-0000-000000000003';
    student4_id UUID := 's0000000-0000-0000-0000-000000000004';
    student5_id UUID := 's0000000-0000-0000-0000-000000000005';
    class1_id UUID := 'c0000000-0000-0000-0000-000000000001';
    class2_id UUID := 'c0000000-0000-0000-0000-000000000002';
    class3_id UUID := 'c0000000-0000-0000-0000-000000000003';
BEGIN
    -- ========================================
    -- INSERT TEST PROFILES
    -- ========================================
    
    -- Admin
    INSERT INTO profiles (id, email, full_name, role, is_verified)
    VALUES (admin_id, 'admin@battleofknowledge.com', 'System Admin', 'admin', true);
    
    -- Teachers
    INSERT INTO profiles (id, email, full_name, role, is_verified)
    VALUES 
        (teacher1_id, 'teacher1@school.edu', 'Maria Santos', 'teacher', true),
        (teacher2_id, 'teacher2@school.edu', 'Juan Dela Cruz', 'teacher', true);
    
    -- Students
    INSERT INTO profiles (id, email, full_name, role, is_verified, student_id_number)
    VALUES 
        (student1_id, 'student1@school.edu', 'Ana Garcia', 'student', true, 'STU-2024-001'),
        (student2_id, 'student2@school.edu', 'Pedro Reyes', 'student', true, 'STU-2024-002'),
        (student3_id, 'student3@school.edu', 'Sofia Cruz', 'student', true, 'STU-2024-003'),
        (student4_id, 'student4@school.edu', 'Miguel Torres', 'student', true, 'STU-2024-004'),
        (student5_id, 'student5@school.edu', 'Isabella Luna', 'student', true, 'STU-2024-005');

    -- ========================================
    -- INSERT REGISTERED STUDENTS (for validation)
    -- ========================================
    INSERT INTO registered_students (student_id_number, full_name, email, grade_level, section, is_claimed, claimed_by, uploaded_by)
    VALUES 
        ('STU-2024-001', 'Ana Garcia', 'student1@school.edu', 'Grade 7', 'Section A', true, student1_id, admin_id),
        ('STU-2024-002', 'Pedro Reyes', 'student2@school.edu', 'Grade 7', 'Section A', true, student2_id, admin_id),
        ('STU-2024-003', 'Sofia Cruz', 'student3@school.edu', 'Grade 7', 'Section B', true, student3_id, admin_id),
        ('STU-2024-004', 'Miguel Torres', 'student4@school.edu', 'Grade 8', 'Section A', true, student4_id, admin_id),
        ('STU-2024-005', 'Isabella Luna', 'student5@school.edu', 'Grade 8', 'Section B', true, student5_id, admin_id),
        ('STU-2024-006', 'Carlos Mendoza', 'carlos@school.edu', 'Grade 7', 'Section C', false, NULL, admin_id),
        ('STU-2024-007', 'Elena Fernandez', 'elena@school.edu', 'Grade 8', 'Section A', false, NULL, admin_id);

    -- ========================================
    -- INSERT CLASSES
    -- ========================================
    INSERT INTO classes (id, teacher_id, class_name, class_code, description, grade_level, section, is_active)
    VALUES 
        (class1_id, teacher1_id, 'Philippine History - Grade 7A', 'PH7A01', 'Learn about Philippine history from pre-colonial to modern times', 'Grade 7', 'Section A', true),
        (class2_id, teacher1_id, 'Philippine History - Grade 7B', 'PH7B02', 'Philippine history for Section B students', 'Grade 7', 'Section B', true),
        (class3_id, teacher2_id, 'Kasaysayan ng Pilipinas - Grade 8', 'KP8A03', 'Advanced Philippine history in Filipino', 'Grade 8', 'Section A', true);

    -- ========================================
    -- INSERT CLASS ENROLLMENTS
    -- ========================================
    INSERT INTO class_enrollments (class_id, student_id, status)
    VALUES 
        -- Class 1: Grade 7A (Teacher: Maria Santos)
        (class1_id, student1_id, 'active'),
        (class1_id, student2_id, 'active'),
        -- Class 2: Grade 7B (Teacher: Maria Santos)
        (class2_id, student3_id, 'active'),
        -- Class 3: Grade 8 (Teacher: Juan Dela Cruz)
        (class3_id, student4_id, 'active'),
        (class3_id, student5_id, 'active');

    -- ========================================
    -- INSERT STUDENT PROGRESS
    -- ========================================
    
    -- Ana Garcia - completed Early Spanish, working on Late Spanish
    INSERT INTO progress (user_id, era_key, lessons_completed, lessons_complete, boss_defeated, battle_score, enemies_defeated, highest_streak)
    VALUES 
        (student1_id, 'early-spanish', '[1,2,3,4,5]', true, true, 2500, 15, 8),
        (student1_id, 'late-spanish', '[1,2,3]', false, false, 800, 5, 4);
    
    -- Pedro Reyes - just started
    INSERT INTO progress (user_id, era_key, lessons_completed, lessons_complete, boss_defeated, battle_score, enemies_defeated, highest_streak)
    VALUES 
        (student2_id, 'early-spanish', '[1,2]', false, false, 300, 3, 2);
    
    -- Sofia Cruz - completed all eras!
    INSERT INTO progress (user_id, era_key, lessons_completed, lessons_complete, boss_defeated, battle_score, enemies_defeated, highest_streak)
    VALUES 
        (student3_id, 'early-spanish', '[1,2,3,4,5]', true, true, 3000, 20, 12),
        (student3_id, 'late-spanish', '[1,2,3,4,5]', true, true, 2800, 18, 10),
        (student3_id, 'american-colonial', '[1,2,3,4,5]', true, true, 2600, 16, 9),
        (student3_id, 'ww2', '[1,2,3,4,5]', true, true, 3200, 22, 15);
    
    -- Miguel Torres - moderate progress
    INSERT INTO progress (user_id, era_key, lessons_completed, lessons_complete, boss_defeated, battle_score, enemies_defeated, highest_streak)
    VALUES 
        (student4_id, 'early-spanish', '[1,2,3,4,5]', true, true, 2200, 14, 7),
        (student4_id, 'late-spanish', '[1,2,3,4,5]', true, true, 1900, 12, 6),
        (student4_id, 'american-colonial', '[1,2]', false, false, 400, 4, 3);
    
    -- Isabella Luna - good progress
    INSERT INTO progress (user_id, era_key, lessons_completed, lessons_complete, boss_defeated, battle_score, enemies_defeated, highest_streak)
    VALUES 
        (student5_id, 'early-spanish', '[1,2,3,4,5]', true, true, 2700, 17, 11),
        (student5_id, 'late-spanish', '[1,2,3,4]', false, false, 1200, 8, 5);

    -- ========================================
    -- INSERT ACHIEVEMENTS
    -- ========================================
    INSERT INTO achievements (user_id, achievement_key)
    VALUES 
        -- Ana's achievements
        (student1_id, 'first_victory'),
        (student1_id, 'early_spanish_complete'),
        (student1_id, 'streak_5'),
        -- Sofia's achievements (completed everything!)
        (student3_id, 'first_victory'),
        (student3_id, 'early_spanish_complete'),
        (student3_id, 'late_spanish_complete'),
        (student3_id, 'american_complete'),
        (student3_id, 'ww2_complete'),
        (student3_id, 'streak_5'),
        (student3_id, 'streak_10'),
        (student3_id, 'master_historian'),
        -- Miguel's achievements
        (student4_id, 'first_victory'),
        (student4_id, 'early_spanish_complete'),
        (student4_id, 'late_spanish_complete'),
        (student4_id, 'streak_5');

    -- ========================================
    -- INSERT CUSTOM QUESTIONS (Teacher Created)
    -- ========================================
    INSERT INTO custom_questions (created_by, era_key, question_text_en, question_text_tl, correct_answer_en, correct_answer_tl, wrong_answers_en, wrong_answers_tl, difficulty, is_active, is_approved, class_id)
    VALUES 
        -- Teacher 1's questions for Early Spanish
        (teacher1_id, 'early-spanish', 
         'What year did Magellan arrive in the Philippines?', 
         'Anong taon dumating si Magellan sa Pilipinas?',
         '1521', '1521',
         '["1565", "1492", "1571"]'::jsonb, '["1565", "1492", "1571"]'::jsonb,
         'easy', true, true, class1_id),
        
        (teacher1_id, 'early-spanish', 
         'Who was the chieftain of Mactan who defeated Magellan?', 
         'Sino ang pinuno ng Mactan na tumalo kay Magellan?',
         'Lapu-Lapu', 'Lapu-Lapu',
         '["Raja Humabon", "Raja Soliman", "Rajah Tupas"]'::jsonb, '["Raja Humabon", "Raja Soliman", "Rajah Tupas"]'::jsonb,
         'easy', true, true, class1_id),
        
        (teacher1_id, 'late-spanish', 
         'Who wrote the novel Noli Me Tangere?', 
         'Sino ang sumulat ng nobelang Noli Me Tangere?',
         'Jose Rizal', 'Jose Rizal',
         '["Andres Bonifacio", "Emilio Aguinaldo", "Apolinario Mabini"]'::jsonb, '["Andres Bonifacio", "Emilio Aguinaldo", "Apolinario Mabini"]'::jsonb,
         'easy', true, true, class1_id),
        
        -- Teacher 2's questions
        (teacher2_id, 'american-colonial', 
         'What battle marked the beginning of American colonization?', 
         'Anong labanan ang nagmarka ng simula ng kolonisasyon ng Amerika?',
         'Battle of Manila Bay', 'Labanan sa Manila Bay',
         '["Battle of Mactan", "Battle of Tirad Pass", "Battle of Balangiga"]'::jsonb, '["Labanan sa Mactan", "Labanan sa Tirad Pass", "Labanan sa Balangiga"]'::jsonb,
         'medium', true, true, class3_id),
        
        (teacher2_id, 'ww2', 
         'Who said "I shall return" during World War 2?', 
         'Sino ang nagsabing "I shall return" noong Ikalawang Digmaang Pandaigdig?',
         'General Douglas MacArthur', 'Heneral Douglas MacArthur',
         '["General Yamashita", "President Quezon", "General Homma"]'::jsonb, '["Heneral Yamashita", "Pangulong Quezon", "Heneral Homma"]'::jsonb,
         'easy', true, true, class3_id);

    -- ========================================
    -- INSERT CUSTOM LESSONS (Teacher Created)
    -- ========================================
    INSERT INTO custom_lessons (created_by, era_key, lesson_order, title_en, title_tl, content_en, content_tl, icon, is_active, is_approved, class_id)
    VALUES 
        -- Teacher 1's custom lesson for Early Spanish
        (teacher1_id, 'early-spanish', 6, 
         'Local Heroes of the Early Spanish Era', 
         'Mga Lokal na Bayani ng Maagang Panahon ng Espanyol',
         '<div class="space-y-4">
            <h3 class="text-xl font-bold mb-3">Unsung Heroes</h3>
            <p class="mb-3">While Lapu-Lapu is the most famous hero of the early Spanish era, there were many other local leaders who resisted colonization.</p>
            <p class="mb-3">Raja Humabon, though he initially allied with Magellan, later played a complex role in Filipino history. Other datus across the islands also defended their territories.</p>
            <div class="bg-blue-100 border-l-4 border-blue-500 p-4 mt-4">
                <p class="font-semibold">Discussion Question:</p>
                <p>Why do you think some local leaders chose to ally with the Spanish while others resisted?</p>
            </div>
         </div>',
         '<div class="space-y-4">
            <h3 class="text-xl font-bold mb-3">Mga Hindi Kilalang Bayani</h3>
            <p class="mb-3">Bagaman si Lapu-Lapu ang pinakasikat na bayani ng maagang panahon ng Espanyol, maraming ibang lokal na pinuno ang lumaban sa kolonisasyon.</p>
         </div>',
         '6', true, true, class1_id),
        
        -- Teacher 2's custom lesson for WW2
        (teacher2_id, 'ww2', 6, 
         'Filipino Guerrilla Resistance', 
         'Paglaban ng mga Gerilyang Pilipino',
         '<div class="space-y-4">
            <h3 class="text-xl font-bold mb-3">The Guerrilla Movement</h3>
            <p class="mb-3">When the Japanese occupied the Philippines, many Filipinos formed guerrilla units to resist. These brave fighters operated in the mountains and jungles.</p>
            <p class="mb-3">Notable guerrilla leaders included Colonel Macario Peralta in the Visayas and Captain Juan Pajota in Luzon.</p>
            <div class="bg-green-100 border-l-4 border-green-500 p-4 mt-4">
                <p class="font-semibold">Did You Know?</p>
                <p>Filipino guerrillas played a crucial role in helping American forces during the liberation of the Philippines.</p>
            </div>
         </div>',
         NULL,
         '🎖️', true, true, class3_id);

    -- ========================================
    -- INSERT GAME SESSIONS (Analytics)
    -- ========================================
    INSERT INTO game_sessions (user_id, era_key, session_type, started_at, ended_at, questions_answered, correct_answers, score)
    VALUES 
        -- Ana's sessions
        (student1_id, 'early-spanish', 'learning', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days' + INTERVAL '25 minutes', 0, 0, 0),
        (student1_id, 'early-spanish', 'battle', NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days' + INTERVAL '15 minutes', 20, 16, 2500),
        (student1_id, 'late-spanish', 'learning', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days' + INTERVAL '20 minutes', 0, 0, 0),
        
        -- Sofia's sessions (she plays a lot!)
        (student3_id, 'early-spanish', 'battle', NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days' + INTERVAL '18 minutes', 25, 22, 3000),
        (student3_id, 'late-spanish', 'battle', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days' + INTERVAL '20 minutes', 23, 19, 2800),
        (student3_id, 'american-colonial', 'battle', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days' + INTERVAL '17 minutes', 22, 18, 2600),
        (student3_id, 'ww2', 'battle', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days' + INTERVAL '22 minutes', 28, 25, 3200);

END $$;

-- ============================================
-- TEST ACCOUNTS SUMMARY
-- ============================================
-- 
-- +----------+------------------+-------------------------------+-------------+
-- | ROLE     | NAME             | EMAIL                         | PASSWORD    |
-- +----------+------------------+-------------------------------+-------------+
-- | Admin    | System Admin     | admin@battleofknowledge.com   | admin123    |
-- +----------+------------------+-------------------------------+-------------+
-- | Teacher  | Maria Santos     | teacher1@school.edu           | teacher123  |
-- | Teacher  | Juan Dela Cruz   | teacher2@school.edu           | teacher123  |
-- +----------+------------------+-------------------------------+-------------+
-- | Student  | Ana Garcia       | student1@school.edu           | student123  |
-- | Student  | Pedro Reyes      | student2@school.edu           | student123  |
-- | Student  | Sofia Cruz       | student3@school.edu           | student123  |
-- | Student  | Miguel Torres    | student4@school.edu           | student123  |
-- | Student  | Isabella Luna    | student5@school.edu           | student123  |
-- +----------+------------------+-------------------------------+-------------+
-- ============================================