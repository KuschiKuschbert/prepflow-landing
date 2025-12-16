-- Security Breaches Table
-- Tracks data breaches and ensures 72-hour notification compliance

CREATE TABLE IF NOT EXISTS security_breaches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  detected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  reported_at TIMESTAMP WITH TIME ZONE,
  breach_type VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  affected_users TEXT[] NOT NULL DEFAULT '{}',
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, notified, failed, resolved
  notification_sent_at TIMESTAMP WITH TIME ZONE,
  notification_failed_at TIMESTAMP WITH TIME ZONE,
  notification_failure_reason TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Index for querying pending breaches
CREATE INDEX IF NOT EXISTS idx_security_breaches_status ON security_breaches(status);
CREATE INDEX IF NOT EXISTS idx_security_breaches_detected_at ON security_breaches(detected_at);

-- Index for querying breaches by affected user
CREATE INDEX IF NOT EXISTS idx_security_breaches_affected_users ON security_breaches USING GIN(affected_users);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_security_breaches_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_security_breaches_updated_at
  BEFORE UPDATE ON security_breaches
  FOR EACH ROW
  EXECUTE FUNCTION update_security_breaches_updated_at();

-- Comments
COMMENT ON TABLE security_breaches IS 'Tracks security breaches and ensures 72-hour notification compliance';
COMMENT ON COLUMN security_breaches.breach_type IS 'Type of breach: unauthorized_access, data_leak, system_compromise, etc.';
COMMENT ON COLUMN security_breaches.affected_users IS 'Array of user emails affected by the breach';
COMMENT ON COLUMN security_breaches.status IS 'Status: pending (not yet notified), notified (users notified), failed (notification failed), resolved (breach resolved)';
COMMENT ON COLUMN security_breaches.notification_sent_at IS 'Timestamp when notifications were sent to affected users';
COMMENT ON COLUMN security_breaches.detected_at IS 'Timestamp when breach was detected (used for 72-hour compliance check)';




