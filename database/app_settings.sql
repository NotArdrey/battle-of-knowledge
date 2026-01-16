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
