-- Migration: Add square_application_secret_encrypted field to square_configurations table
-- Purpose: Store Square Application Secret for OAuth token refresh
-- Date: January 2025

-- Add square_application_secret_encrypted column (nullable - existing manual tokens won't have it)
ALTER TABLE square_configurations
ADD COLUMN IF NOT EXISTS square_application_secret_encrypted TEXT;

-- Add comment explaining the field
COMMENT ON COLUMN square_configurations.square_application_secret_encrypted IS 'Encrypted Square Application Secret. Used for OAuth token refresh. Only present for OAuth-connected accounts.';


