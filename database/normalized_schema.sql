-- ============================================
-- BATTLE OF KNOWLEDGE - FRONTEND COMPATIBLE v4
-- ============================================

-- [Step 1: Cleanup]
DROP VIEW IF EXISTS teacher_student_progress CASCADE;
DROP VIEW IF EXISTS admin_user_stats CASCADE;
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS generate_class_code() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS is_teacher() CASCADE;
DROP FUNCTION IF EXISTS is_admin() CASCADE;
DROP FUNCTION IF EXISTS get_user_role() CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- [Step 2: Lookup Tables]
CREATE TABLE eras (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    era_key TEXT UNIQUE NOT NULL, -- Kept for reference
    title_en TEXT NOT NULL,
    title_tl TEXT,
    sort_order INTEGER NOT NULL
);

-- [Step 3: Profiles - RESTORED class_id FOR TEACHER DASHBOARD COMPATIBILITY]
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student',
    teacher_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    class_id UUID, -- Kept for frontend compatibility (even if redundant with enrollments)
    is_verified BOOLEAN DEFAULT FALSE,
    student_id_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

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
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- [Step 4: Classes]
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    class_name TEXT NOT NULL,
    class_code TEXT UNIQUE NOT NULL,
    grade_level TEXT, 
    section TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE class_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active',
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(class_id, student_id)
);

-- [Step 5: Content]
CREATE TABLE custom_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    era_id UUID REFERENCES eras(id), -- Optional
    era_key TEXT, -- Added for frontend ease
    created_by UUID REFERENCES profiles(id),
    question_text_en TEXT NOT NULL,
    question_text_tl TEXT,
    difficulty TEXT DEFAULT 'medium',
    is_active BOOLEAN DEFAULT TRUE,
    is_approved BOOLEAN DEFAULT FALSE,
    is_system BOOLEAN DEFAULT FALSE,
    class_id UUID REFERENCES classes(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE question_choices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES custom_questions(id) ON DELETE CASCADE,
    content_en TEXT NOT NULL,
    content_tl TEXT,
    is_correct BOOLEAN DEFAULT FALSE
);

CREATE TABLE custom_lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    era_key TEXT, -- Frontend uses keys
    created_by UUID REFERENCES profiles(id),
    title_en TEXT NOT NULL,
    content_en TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_approved BOOLEAN DEFAULT FALSE,
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- [Step 6: Progress - HYBRID FIX FOR FRONTEND]
CREATE TABLE progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    era_key TEXT NOT NULL, -- FRONTEND REQUIRES THIS (not era_id UUID)
    
    -- Frontend specifically looks for these exact column names:
    lessons_complete BOOLEAN DEFAULT FALSE, 
    boss_defeated BOOLEAN DEFAULT FALSE,
    current_lesson_index INTEGER DEFAULT 0,
    battle_score INTEGER DEFAULT 0,
    enemies_defeated INTEGER DEFAULT 0,
    highest_streak INTEGER DEFAULT 0,
    
    -- Arrays required by progress-sync.js
    lessons_completed JSONB DEFAULT '[]'::jsonb, 
    unlocked_heroes JSONB DEFAULT '[0]'::jsonb,
    
    last_played_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, era_key)
);

CREATE TABLE app_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key TEXT UNIQUE NOT NULL,
    setting_value JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- [Step 7: Policies - INCLUDES SELF-REPAIR]

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE registered_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

-- Functions
CREATE OR REPLACE FUNCTION get_user_role() RETURNS TEXT AS $$
BEGIN
    RETURN (SELECT role FROM profiles WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
BEGIN
    RETURN (get_user_role() = 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_teacher() RETURNS BOOLEAN AS $$
BEGIN
    RETURN (get_user_role() = 'teacher');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- CRITICAL: Profiles Policies (Including Self-Repair)
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id); -- SELF REPAIR
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update any profile" ON profiles FOR UPDATE USING (is_admin());
CREATE POLICY "Teachers can view student profiles" ON profiles FOR SELECT USING (is_teacher() AND role = 'student');

-- Registered Students
CREATE POLICY "Admins can manage registered students" ON registered_students FOR ALL USING (is_admin());
CREATE POLICY "Anyone can validate ID" ON registered_students FOR SELECT USING (true);

-- Progress
CREATE POLICY "Users can manage own progress" ON progress FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Admins can view progress" ON progress FOR SELECT USING (is_admin());
CREATE POLICY "Teachers can view student progress" ON progress FOR SELECT 
    USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = progress.user_id AND profiles.teacher_id = auth.uid()));

-- Classes & Enrollments (Simplified/Permissive for compatibility)
CREATE POLICY "Public read classes" ON classes FOR SELECT USING (true);
CREATE POLICY "Teachers manage classes" ON classes FOR ALL USING (teacher_id = auth.uid());
CREATE POLICY "Admins manage classes" ON classes FOR ALL USING (is_admin());

CREATE POLICY "Users view own enrollments" ON class_enrollments FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Users enroll themselves" ON class_enrollments FOR INSERT WITH CHECK (student_id = auth.uid());
CREATE POLICY "Teachers manage enrollments" ON class_enrollments FOR ALL USING (true); -- Simplified for now

-- [Step 8: Triggers]
CREATE OR REPLACE FUNCTION handle_new_user() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'), COALESCE(NEW.raw_user_meta_data->>'role', 'student'));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE OR REPLACE FUNCTION generate_class_code() RETURNS TEXT AS $$
BEGIN
    RETURN UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
END;
$$ LANGUAGE plpgsql;

-- [Step 9: Seed Eras]
INSERT INTO eras (era_key, title_en, sort_order) VALUES
('early-spanish', 'Early Spanish', 1),
('late-spanish', 'Late Spanish', 2),
('american-colonial', 'American', 3),
('ww2', 'World War II', 4);
