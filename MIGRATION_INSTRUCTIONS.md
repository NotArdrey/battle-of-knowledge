# System Content Migration Instructions

## Overview
System questions and lessons are now stored in the database, making them fully editable and deletable through the teacher interface.

## Step 1: Update Database Schema

Run this SQL in your Supabase SQL Editor:

```sql
-- Add source_id columns to track migrated system content
ALTER TABLE custom_questions 
ADD COLUMN IF NOT EXISTS source_id TEXT UNIQUE;

CREATE INDEX IF NOT EXISTS idx_questions_source_id ON custom_questions(source_id);

ALTER TABLE custom_lessons 
ADD COLUMN IF NOT EXISTS source_id TEXT UNIQUE;

CREATE INDEX IF NOT EXISTS idx_lessons_source_id ON custom_lessons(source_id);

COMMENT ON COLUMN custom_questions.source_id IS 'Tracks migrated system content (e.g., system-early-spanish-0)';
COMMENT ON COLUMN custom_lessons.source_id IS 'Tracks migrated system content (e.g., system-early-spanish-1)';
```

Or run the file: `database/add_source_id_columns.sql`

## Step 2: First Login

1. Open teacher.html in your browser
2. Log in as a teacher
3. The system will automatically:
   - Migrate all questions from questions.js to the database
   - Migrate all lessons from learningData.js to the database
   - This happens only once (tracked in localStorage)

## What Changed

### Before
- **System content**: Read-only from .js files, couldn't be edited or deleted
- **Custom content**: Editable in database
- Two separate tabs (System vs Custom)

### After
- **All content**: Stored in database and fully editable/deletable
- System questions/lessons are marked with `is_system = true`
- Same tabs but all content is in database

## Features

✅ **Edit System Content**: Click Edit on any question/lesson to modify it
✅ **Delete System Content**: Click Delete to permanently remove from database  
✅ **Full Database Persistence**: All changes save directly to Supabase
✅ **No More Read-Only**: Everything is editable

## Migration Details

The migration functions:
- Check `localStorage` to avoid re-migrating
- Copy questions from `questions.js` → `custom_questions` table
- Copy lessons from `learningData.js` → `custom_lessons` table
- Mark migrated content with `is_system = true`
- Store original ID in `source_id` to prevent duplicates

## Reset Migration (if needed)

To re-run the migration:
1. Open browser console on teacher.html
2. Run: `localStorage.removeItem('questions_migrated_v1')`
3. Run: `localStorage.removeItem('lessons_migrated_v1')`
4. Refresh the page

Note: This will create duplicates if you already have migrated content!
