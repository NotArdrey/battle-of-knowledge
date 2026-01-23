-- Add source_id columns to track migrated system content
-- Run this in Supabase SQL Editor

-- Add source_id to custom_questions table
ALTER TABLE custom_questions 
ADD COLUMN IF NOT EXISTS source_id TEXT UNIQUE;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_questions_source_id ON custom_questions(source_id);

-- Add source_id to custom_lessons table
ALTER TABLE custom_lessons 
ADD COLUMN IF NOT EXISTS source_id TEXT UNIQUE;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_lessons_source_id ON custom_lessons(source_id);

-- Add comments
COMMENT ON COLUMN custom_questions.source_id IS 'Tracks migrated system content (e.g., system-early-spanish-0)';
COMMENT ON COLUMN custom_lessons.source_id IS 'Tracks migrated system content (e.g., system-early-spanish-1)';
