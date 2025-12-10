-- Add subscription_tier column to users table
-- This migration adds the subscription_tier field and ensures billing_customers table exists

-- Add subscription_tier column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(50) DEFAULT 'starter';

-- Add index on subscription_tier for performance
CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON users(subscription_tier);

-- Ensure billing_customers table exists (referenced in lib/billing.ts)
CREATE TABLE IF NOT EXISTS billing_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR(255) UNIQUE NOT NULL,
  stripe_customer_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index on billing_customers for lookups
CREATE INDEX IF NOT EXISTS idx_billing_customers_user_email ON billing_customers(user_email);
CREATE INDEX IF NOT EXISTS idx_billing_customers_stripe_customer_id ON billing_customers(stripe_customer_id);

-- Update existing users to have 'starter' tier if null
UPDATE users SET subscription_tier = 'starter' WHERE subscription_tier IS NULL;



