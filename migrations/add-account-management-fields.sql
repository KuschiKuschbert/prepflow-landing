-- Add account management fields to users table
-- This migration adds fields needed for comprehensive account management

-- Notification preferences (JSONB for flexible structure)
ALTER TABLE users ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{}'::jsonb;

-- Deletion tracking
ALTER TABLE users ADD COLUMN IF NOT EXISTS deletion_requested_at TIMESTAMP WITH TIME ZONE;

-- Last login tracking
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_deletion_requested ON users(deletion_requested_at) WHERE deletion_requested_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login);

-- Add comments
COMMENT ON COLUMN users.notification_preferences IS 'User notification preferences stored as JSON: { email: { weeklyReports: boolean, securityAlerts: boolean, ... }, inApp: { ... } }';
COMMENT ON COLUMN users.deletion_requested_at IS 'Timestamp when user requested account deletion. Account will be permanently deleted after grace period.';
COMMENT ON COLUMN users.last_login IS 'Timestamp of user last login for security tracking.';

-- Create login_logs table for tracking login attempts
CREATE TABLE IF NOT EXISTS login_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user_email VARCHAR(255) NOT NULL, -- Store email separately for audit trail even if user deleted
  ip_address VARCHAR(45),
  user_agent TEXT,
  location VARCHAR(255), -- Optional, from IP geolocation
  successful BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for login_logs
CREATE INDEX IF NOT EXISTS idx_login_logs_user_id ON login_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_login_logs_user_email ON login_logs(user_email);
CREATE INDEX IF NOT EXISTS idx_login_logs_created_at ON login_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_login_logs_successful ON login_logs(successful);

-- Add comment
COMMENT ON TABLE login_logs IS 'Audit log of user login attempts for security tracking.';

-- Create account_activity table for tracking user actions
CREATE TABLE IF NOT EXISTS account_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  action_type VARCHAR(50) NOT NULL, -- e.g., 'ingredient_created', 'recipe_updated', etc.
  entity_type VARCHAR(50) NOT NULL, -- e.g., 'ingredient', 'recipe', etc.
  entity_id UUID,
  metadata JSONB, -- Optional additional data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for account_activity
CREATE INDEX IF NOT EXISTS idx_account_activity_user_id ON account_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_account_activity_created_at ON account_activity(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_account_activity_action_type ON account_activity(action_type);
CREATE INDEX IF NOT EXISTS idx_account_activity_entity ON account_activity(entity_type, entity_id);

-- Add comment
COMMENT ON TABLE account_activity IS 'Audit log of user actions for activity tracking and compliance.';

-- Create import_export_logs table for tracking data operations
CREATE TABLE IF NOT EXISTS import_export_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  operation_type VARCHAR(20) NOT NULL CHECK (operation_type IN ('export', 'import', 'backup', 'restore')),
  format VARCHAR(20), -- e.g., 'json', 'csv'
  source VARCHAR(255), -- e.g., 'google_drive', 'local_file', 'api'
  records_count INTEGER,
  file_size_bytes BIGINT,
  file_path TEXT, -- Optional, for re-download if stored
  metadata JSONB, -- Optional additional data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for import_export_logs
CREATE INDEX IF NOT EXISTS idx_import_export_logs_user_id ON import_export_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_import_export_logs_created_at ON import_export_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_import_export_logs_operation_type ON import_export_logs(operation_type);

-- Add comment
COMMENT ON TABLE import_export_logs IS 'Audit log of data import/export operations for compliance and user history.';













