-- Account Deletions Table
-- Tracks scheduled account deletions with 30-day retention period

CREATE TABLE IF NOT EXISTS account_deletions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR(255) NOT NULL UNIQUE,
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  scheduled_deletion_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'scheduled', -- scheduled, exported, deleted, cancelled
  exported_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Index for querying scheduled deletions
CREATE INDEX IF NOT EXISTS idx_account_deletions_status ON account_deletions(status);
CREATE INDEX IF NOT EXISTS idx_account_deletions_scheduled_deletion_at ON account_deletions(scheduled_deletion_at);
CREATE INDEX IF NOT EXISTS idx_account_deletions_user_email ON account_deletions(user_email);

-- Index for cron job queries (deletions due now)
-- Note: Cannot use NOW() in index predicate (not IMMUTABLE), so we filter by scheduled_deletion_at only
-- The query will filter by NOW() at runtime
CREATE INDEX IF NOT EXISTS idx_account_deletions_due_now ON account_deletions(scheduled_deletion_at)
  WHERE status IN ('scheduled', 'exported');

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_account_deletions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_account_deletions_updated_at
  BEFORE UPDATE ON account_deletions
  FOR EACH ROW
  EXECUTE FUNCTION update_account_deletions_updated_at();

-- Comments
COMMENT ON TABLE account_deletions IS 'Tracks scheduled account deletions with 30-day retention period';
COMMENT ON COLUMN account_deletions.status IS 'Status: scheduled (pending deletion), exported (user exported data), deleted (deletion completed), cancelled (deletion cancelled)';
COMMENT ON COLUMN account_deletions.scheduled_deletion_at IS 'Timestamp when account will be deleted (30 days after request)';
COMMENT ON COLUMN account_deletions.exported_at IS 'Timestamp when user exported their data (optional)';
