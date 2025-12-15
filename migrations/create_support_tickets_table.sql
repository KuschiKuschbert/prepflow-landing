-- Create support_tickets table for user-reported issues
-- Run this migration in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  user_email VARCHAR(255) NOT NULL, -- Store email for reference even if user is deleted
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'other' CHECK (type IN ('bug', 'feature', 'question', 'other')),
  severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('safety', 'critical', 'high', 'medium', 'low')),
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
  related_error_id UUID REFERENCES admin_error_logs(id) ON DELETE SET NULL,
  admin_notes TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_severity ON support_tickets(severity);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON support_tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_tickets_type ON support_tickets(type);
CREATE INDEX IF NOT EXISTS idx_support_tickets_related_error_id ON support_tickets(related_error_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_support_tickets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_support_tickets_updated_at
BEFORE UPDATE ON support_tickets
FOR EACH ROW
EXECUTE FUNCTION update_support_tickets_updated_at();

-- Enable Row Level Security (RLS) - admins only
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- RLS Policy - Allow admin service role to access all (middleware handles auth)
DROP POLICY IF EXISTS "Service role can access support_tickets" ON support_tickets;
CREATE POLICY "Service role can access support_tickets" ON support_tickets
  FOR ALL USING (true);





