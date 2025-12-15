-- Enhance billing_customers table with subscription tracking
-- This migration adds fields for better subscription management and sync tracking

-- Add stripe_subscription_id column for direct subscription lookups
ALTER TABLE billing_customers ADD COLUMN IF NOT EXISTS stripe_subscription_id VARCHAR(255);

-- Add subscription_status column (cached from Stripe for quick lookups)
ALTER TABLE billing_customers ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50);

-- Add last_synced_at timestamp for sync tracking
ALTER TABLE billing_customers ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMP WITH TIME ZONE;

-- Add unique constraint on stripe_subscription_id (one subscription per customer)
CREATE UNIQUE INDEX IF NOT EXISTS idx_billing_customers_stripe_subscription_id_unique
  ON billing_customers(stripe_subscription_id)
  WHERE stripe_subscription_id IS NOT NULL;

-- Add index on subscription_status for filtering
CREATE INDEX IF NOT EXISTS idx_billing_customers_subscription_status
  ON billing_customers(subscription_status);

-- Add index on last_synced_at for sync operations
CREATE INDEX IF NOT EXISTS idx_billing_customers_last_synced_at
  ON billing_customers(last_synced_at);

-- Add comments for documentation
COMMENT ON COLUMN billing_customers.stripe_subscription_id IS 'Current active Stripe subscription ID';
COMMENT ON COLUMN billing_customers.subscription_status IS 'Cached subscription status from Stripe (active, cancelled, past_due, etc.)';
COMMENT ON COLUMN billing_customers.last_synced_at IS 'Last time subscription data was synced from Stripe';





