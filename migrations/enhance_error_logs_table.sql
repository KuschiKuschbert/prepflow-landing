-- Enhance admin_error_logs table with severity, status, and category tracking
-- Run this migration in Supabase SQL Editor

-- Add new columns to admin_error_logs table
ALTER TABLE admin_error_logs
ADD COLUMN IF NOT EXISTS severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('safety', 'critical', 'high', 'medium', 'low')),
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'investigating', 'resolved', 'ignored')),
ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'other' CHECK (category IN ('security', 'database', 'api', 'client', 'system', 'other')),
ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_error_logs_severity ON admin_error_logs(severity);
CREATE INDEX IF NOT EXISTS idx_admin_error_logs_status ON admin_error_logs(status);
CREATE INDEX IF NOT EXISTS idx_admin_error_logs_category ON admin_error_logs(category);
CREATE INDEX IF NOT EXISTS idx_admin_error_logs_severity_status ON admin_error_logs(severity, status);

-- Update existing records to have default values
UPDATE admin_error_logs
SET severity = 'medium', status = 'new', category = 'other'
WHERE severity IS NULL OR status IS NULL OR category IS NULL;



