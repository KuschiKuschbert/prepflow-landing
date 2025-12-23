-- Migration: Add refresh_token_encrypted field to square_configurations table
-- Purpose: Store Square OAuth refresh tokens for automatic token refresh
-- Date: January 2025

-- Add refresh_token_encrypted column (nullable - existing manual tokens won't have refresh tokens)
ALTER TABLE square_configurations
ADD COLUMN IF NOT EXISTS refresh_token_encrypted TEXT;

-- Add index for faster lookups (if needed)
-- Note: We already have index on user_id, which is sufficient

-- Add comment explaining the field
COMMENT ON COLUMN square_configurations.refresh_token_encrypted IS 'Encrypted Square OAuth refresh token. Used to automatically refresh expired access tokens. Only present for OAuth-connected accounts.';


