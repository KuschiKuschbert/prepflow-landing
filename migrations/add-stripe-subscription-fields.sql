-- Add Stripe subscription management fields to users table
-- This migration adds fields needed for direct subscription management

-- Add stripe_subscription_id column for direct subscription lookups
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_subscription_id VARCHAR(255);

-- Add subscription_cancel_at_period_end to track scheduled cancellations
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_cancel_at_period_end BOOLEAN DEFAULT FALSE;

-- Add subscription_current_period_start for renewal calculations
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_current_period_start TIMESTAMP WITH TIME ZONE;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_stripe_subscription_id ON users(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_users_subscription_cancel_at_period_end ON users(subscription_cancel_at_period_end);

-- Add comment for documentation
COMMENT ON COLUMN users.stripe_subscription_id IS 'Stripe subscription ID for direct subscription management';
COMMENT ON COLUMN users.subscription_cancel_at_period_end IS 'True if subscription is scheduled to cancel at period end';
COMMENT ON COLUMN users.subscription_current_period_start IS 'Start date of current subscription billing period';








