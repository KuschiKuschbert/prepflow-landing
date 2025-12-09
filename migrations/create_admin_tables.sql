-- Admin Panel Database Tables
-- Run this migration in Supabase SQL Editor

-- Admin error logs table
CREATE TABLE IF NOT EXISTS admin_error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  endpoint VARCHAR(255),
  error_message TEXT NOT NULL,
  stack_trace TEXT,
  context JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feature flags table
CREATE TABLE IF NOT EXISTS feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_key VARCHAR(100) UNIQUE NOT NULL,
  enabled BOOLEAN DEFAULT false,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- NULL for global flags
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin audit log table
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  admin_user_email VARCHAR(255), -- Store email for reference even if user is deleted
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(50), -- 'user', 'subscription', 'data', etc.
  target_id UUID,
  details JSONB,
  ip_address VARCHAR(45), -- IPv6 compatible
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_error_logs_user_id ON admin_error_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_error_logs_created_at ON admin_error_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_error_logs_endpoint ON admin_error_logs(endpoint);

CREATE INDEX IF NOT EXISTS idx_feature_flags_key ON feature_flags(flag_key);
CREATE INDEX IF NOT EXISTS idx_feature_flags_user_id ON feature_flags(user_id);
CREATE INDEX IF NOT EXISTS idx_feature_flags_enabled ON feature_flags(enabled);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_admin_user_id ON admin_audit_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created_at ON admin_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_action ON admin_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_target_type ON admin_audit_logs(target_type);

-- Enable Row Level Security (RLS) - admins only
ALTER TABLE admin_error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow admin service role to access all (middleware handles auth)
-- These tables are admin-only, so we allow service role access
-- Drop existing policies if they exist (for idempotent migrations)
DROP POLICY IF EXISTS "Service role can access admin_error_logs" ON admin_error_logs;
CREATE POLICY "Service role can access admin_error_logs" ON admin_error_logs
  FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role can access feature_flags" ON feature_flags;
CREATE POLICY "Service role can access feature_flags" ON feature_flags
  FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role can access admin_audit_logs" ON admin_audit_logs;
CREATE POLICY "Service role can access admin_audit_logs" ON admin_audit_logs
  FOR ALL USING (true);
