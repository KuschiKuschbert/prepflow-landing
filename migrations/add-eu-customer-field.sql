-- Add EU Customer Field to Users Table
-- Tracks EU customer status for enhanced cancellation rights (EU Data Act compliance)

ALTER TABLE users ADD COLUMN IF NOT EXISTS is_eu_customer BOOLEAN DEFAULT false;

-- Index for querying EU customers
CREATE INDEX IF NOT EXISTS idx_users_is_eu_customer ON users(is_eu_customer) WHERE is_eu_customer = true;

-- Comment
COMMENT ON COLUMN users.is_eu_customer IS 'Whether user is an EU customer (for EU Data Act compliance - enhanced cancellation rights)';




