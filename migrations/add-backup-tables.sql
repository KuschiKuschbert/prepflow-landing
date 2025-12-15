-- Backup and Restore System Database Schema
-- Run this in Supabase SQL Editor

-- User Google OAuth tokens
CREATE TABLE IF NOT EXISTS user_google_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  encrypted_refresh_token TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Backup schedules
CREATE TABLE IF NOT EXISTS backup_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  interval_hours INTEGER NOT NULL DEFAULT 24,
  last_backup_at TIMESTAMP WITH TIME ZONE,
  next_backup_at TIMESTAMP WITH TIME ZONE,
  enabled BOOLEAN DEFAULT true,
  auto_upload_to_drive BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Backup metadata (for tracking backups)
CREATE TABLE IF NOT EXISTS backup_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  backup_type VARCHAR(50) NOT NULL, -- 'manual' | 'scheduled'
  format VARCHAR(10) NOT NULL, -- 'json' | 'sql' | 'encrypted'
  encryption_mode VARCHAR(20), -- 'user-password' | 'prepflow-only'
  file_size_bytes BIGINT,
  record_count INTEGER,
  google_drive_file_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_backup_metadata_user_id ON backup_metadata(user_id);
CREATE INDEX IF NOT EXISTS idx_backup_metadata_created_at ON backup_metadata(created_at);
CREATE INDEX IF NOT EXISTS idx_backup_metadata_user_created ON backup_metadata(user_id, created_at);

-- Create index for backup schedules
CREATE INDEX IF NOT EXISTS idx_backup_schedules_user_id ON backup_schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_backup_schedules_enabled ON backup_schedules(enabled);
CREATE INDEX IF NOT EXISTS idx_backup_schedules_next_backup ON backup_schedules(next_backup_at) WHERE enabled = true;

-- Create index for Google tokens
CREATE INDEX IF NOT EXISTS idx_user_google_tokens_user_id ON user_google_tokens(user_id);





















