-- ============================================
-- BATTLE OF KNOWLEDGE - SEED DATA
-- Run AFTER schema.sql and creating users via Dashboard
-- ============================================
--
-- PREREQUISITE: Create these users first in Supabase Dashboard
-- (Authentication > Users > Add User)
--
-- When creating users, use this User Metadata format:
-- {"full_name": "User Name", "role": "admin"}
--
-- ============================================

-- ============================================
-- STEP 1: Update user roles
-- (Profiles are auto-created by the trigger)
-- ============================================

UPDATE profiles SET role = 'admin', is_verified = true 
WHERE email = 'admin@battleofknowledge.com';

UPDATE profiles SET role = 'teacher', is_verified = true 
WHERE email IN ('teacher1@school.edu', 'teacher2@school.edu');

UPDATE profiles SET role = 'student', is_verified = true 
WHERE email LIKE 'student%@school.edu';

-- ============================================
-- STEP 2: Insert sample data
-- ============================================

DO $$
DECLARE
    v_admin_id UUID;
    v_teacher1_id UUID;
    v_teacher2_id UUID;
    v_student1_id UUID;
    v_student2_id UUID;
    v_student3_id UUID;
    v_student4_id UUID;
    v_student5_id UUID;
    v_class1_id UUID := uuid_generate_v4();
    v_class2_id UUID := uuid_generate_v4();
    v_class3_id UUID := uuid_generate_v4();
BEGIN
    -- Get user IDs from profiles
    SELECT id INTO v_admin_id FROM profiles WHERE email = 'admin@battleofknowledge.com';
    SELECT id INTO v_teacher1_id FROM profiles WHERE email = 'teacher1@school.edu';
    SELECT id INTO v_teacher2_id FROM profiles WHERE email = 'teacher2@school.edu';
    SELECT id INTO v_student1_id FROM profiles WHERE email = 'student1@school.edu';
    SELECT id INTO v_student2_id FROM profiles WHERE email = 'student2@school.edu';
    SELECT id INTO v_student3_id FROM profiles WHERE email = 'student3@school.edu';
    SELECT id INTO v_student4_id FROM profiles WHERE email = 'student4@school.edu';
    SELECT id INTO v_student5_id FROM profiles WHERE email = 'student5@school.edu';

    -- Check if required users exist
    IF v_teacher1_id IS NULL THEN
        RAISE NOTICE 'Teacher 1 not found. Please create users first via Supabase Dashboard.';
        RETURN;
    END IF;

    -- ========================================
    -- REGISTERED STUDENTS
    -- ========================================
    INSERT INTO registered_students (student_id_number, full_name, email, grade_level, section, is_claimed, claimed_by, uploaded_by)
    VALUES 
        ('STU-2024-001', 'Ana Garcia', 'student1@school.edu', 'Grade 7', 'Section A', true, v_student1_id, v_admin_id),
        ('STU-2024-002', 'Pedro Reyes', 'student2@school.edu', 'Grade 7', 'Section A', true, v_student2_id, v_admin_id),
        ('STU-2024-003', 'Sofia Cruz', 'student3@school.edu', 'Grade 7', 'Section B', true, v_student3_id, v_admin_id),
        ('STU-2024-004', 'Miguel Torres', 'student4@school.edu', 'Grade 8', 'Section A', true, v_student4_id, v_admin_id),
        ('STU-2024-005', 'Isabella Luna', 'student5@school.edu', 'Grade 8', 'Section B', true, v_student5_id, v_admin_id),
        ('STU-2024-006', 'Carlos Mendoza', 'carlos@school.edu', 'Grade 7', 'Section C', false, NULL, v_admin_id),
        ('STU-2024-007', 'Elena Fernandez', 'elena@school.edu', 'Grade 8', 'Section A', false, NULL, v_admin_id)
    ON CONFLICT (student_id_number) DO NOTHING;

    -- ========================================
    -- CLASSES
    -- ========================================
    INSERT INTO classes (id, teacher_id, class_name, class_code, description, grade_level, section, is_active)
    VALUES 
        (v_class1_id, v_teacher1_id, 'Philippine History - Grade 7A', 'PH7A01', 'Learn about Philippine history', 'Grade 7', 'Section A', true),
        (v_class2_id, v_teacher1_id, 'Philippine History - Grade 7B', 'PH7B02', 'Philippine history for Section B', 'Grade 7', 'Section B', true),
        (v_class3_id, v_teacher2_id, 'Kasaysayan ng Pilipinas - Grade 8', 'KP8A03', 'Advanced Philippine history', 'Grade 8', 'Section A', true)
    ON CONFLICT (class_code) DO NOTHING;

    -- ========================================
    -- CLASS ENROLLMENTS
    -- ========================================
    IF v_student1_id IS NOT NULL THEN
        INSERT INTO class_enrollments (class_id, student_id, status)
        VALUES 
            (v_class1_id, v_student1_id, 'active'),
            (v_class1_id, v_student2_id, 'active'),
            (v_class2_id, v_student3_id, 'active'),
            (v_class3_id, v_student4_id, 'active'),
            (v_class3_id, v_student5_id, 'active')
        ON CONFLICT (class_id, student_id) DO NOTHING;
    END IF;

    -- ========================================
    -- STUDENT PROGRESS
    -- ========================================
    IF v_student1_id IS NOT NULL THEN
        INSERT INTO progress (user_id, era_key, lessons_completed, lessons_complete, boss_defeated, battle_score, enemies_defeated, highest_streak)
        VALUES 
            (v_student1_id, 'early-spanish', '[1,2,3,4,5]', true, true, 2500, 15, 8),
            (v_student1_id, 'late-spanish', '[1,2,3]', false, false, 800, 5, 4)
        ON CONFLICT (user_id, era_key) DO NOTHING;
    END IF;
    
    IF v_student2_id IS NOT NULL THEN
        INSERT INTO progress (user_id, era_key, lessons_completed, lessons_complete, boss_defeated, battle_score, enemies_defeated, highest_streak)
        VALUES (v_student2_id, 'early-spanish', '[1,2]', false, false, 300, 3, 2)
        ON CONFLICT (user_id, era_key) DO NOTHING;
    END IF;
    
    IF v_student3_id IS NOT NULL THEN
        INSERT INTO progress (user_id, era_key, lessons_completed, lessons_complete, boss_defeated, battle_score, enemies_defeated, highest_streak)
        VALUES 
            (v_student3_id, 'early-spanish', '[1,2,3,4,5]', true, true, 3000, 20, 12),
            (v_student3_id, 'late-spanish', '[1,2,3,4,5]', true, true, 2800, 18, 10),
            (v_student3_id, 'american-colonial', '[1,2,3,4,5]', true, true, 2600, 16, 9),
            (v_student3_id, 'ww2', '[1,2,3,4,5]', true, true, 3200, 22, 15)
        ON CONFLICT (user_id, era_key) DO NOTHING;
    END IF;

    -- ========================================
    -- ACHIEVEMENTS
    -- ========================================
    IF v_student1_id IS NOT NULL THEN
        INSERT INTO achievements (user_id, achievement_key)
        VALUES 
            (v_student1_id, 'first_victory'),
            (v_student1_id, 'early_spanish_complete'),
            (v_student1_id, 'streak_5')
        ON CONFLICT (user_id, achievement_key) DO NOTHING;
    END IF;

    IF v_student3_id IS NOT NULL THEN
        INSERT INTO achievements (user_id, achievement_key)
        VALUES 
            (v_student3_id, 'first_victory'),
            (v_student3_id, 'early_spanish_complete'),
            (v_student3_id, 'late_spanish_complete'),
            (v_student3_id, 'american_complete'),
            (v_student3_id, 'ww2_complete'),
            (v_student3_id, 'streak_5'),
            (v_student3_id, 'streak_10'),
            (v_student3_id, 'master_historian')
        ON CONFLICT (user_id, achievement_key) DO NOTHING;
    END IF;

    -- ========================================
    -- CUSTOM QUESTIONS
    -- ========================================
    IF v_teacher1_id IS NOT NULL THEN
        INSERT INTO custom_questions (created_by, era_key, question_text_en, question_text_tl, correct_answer_en, correct_answer_tl, wrong_answers_en, wrong_answers_tl, difficulty, is_active, is_approved, class_id)
        VALUES 
            (v_teacher1_id, 'early-spanish', 
             'What year did Magellan arrive in the Philippines?', 
             'Anong taon dumating si Magellan sa Pilipinas?',
             '1521', '1521',
             '["1565", "1492", "1571"]'::jsonb, '["1565", "1492", "1571"]'::jsonb,
             'easy', true, true, v_class1_id),
            
            (v_teacher1_id, 'early-spanish', 
             'Who was the chieftain of Mactan who defeated Magellan?', 
             'Sino ang pinuno ng Mactan na tumalo kay Magellan?',
             'Lapu-Lapu', 'Lapu-Lapu',
             '["Raja Humabon", "Raja Soliman", "Rajah Tupas"]'::jsonb, '["Raja Humabon", "Raja Soliman", "Rajah Tupas"]'::jsonb,
             'easy', true, true, v_class1_id);
    END IF;

    RAISE NOTICE 'Seed data inserted successfully!';
END $$;

-- ============================================
-- VERIFICATION
-- ============================================

SELECT email, full_name, role, is_verified FROM profiles ORDER BY role, email;
