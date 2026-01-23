-- Fix RLS policies to allow teachers to manage all questions and lessons
-- Run this in Supabase SQL Editor

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Teachers can manage own questions" ON custom_questions;
DROP POLICY IF EXISTS "Teachers can manage own lessons" ON custom_lessons;

-- Create new policies that allow teachers to manage all questions (including system ones)
CREATE POLICY "Teachers can manage all questions" ON custom_questions 
    FOR ALL USING (is_teacher() OR is_admin());

CREATE POLICY "Teachers can manage all lessons" ON custom_lessons 
    FOR ALL USING (is_teacher() OR is_admin());

-- Also add policy for question_choices so teachers can delete choices
DROP POLICY IF EXISTS "Teachers can manage question choices" ON question_choices;
CREATE POLICY "Teachers can manage question choices" ON question_choices 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM custom_questions 
            WHERE custom_questions.id = question_choices.question_id 
            AND (is_teacher() OR is_admin())
        )
    );
