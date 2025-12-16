-- Data Transfer Restrictions Table
-- Tracks user country and enforces restrictions on data transfers to restricted countries

CREATE TABLE IF NOT EXISTS data_transfer_restrictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR(255) NOT NULL UNIQUE,
  country_code VARCHAR(2) NOT NULL, -- ISO 3166-1 alpha-2 country code
  restricted BOOLEAN NOT NULL DEFAULT false, -- Whether user is in a restricted country
  consent_given_at TIMESTAMP WITH TIME ZONE,
  consent_revoked_at TIMESTAMP WITH TIME ZONE,
  last_updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Index for querying by country
CREATE INDEX IF NOT EXISTS idx_data_transfer_restrictions_country ON data_transfer_restrictions(country_code);
CREATE INDEX IF NOT EXISTS idx_data_transfer_restrictions_restricted ON data_transfer_restrictions(restricted);
CREATE INDEX IF NOT EXISTS idx_data_transfer_restrictions_user_email ON data_transfer_restrictions(user_email);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_data_transfer_restrictions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_data_transfer_restrictions_updated_at
  BEFORE UPDATE ON data_transfer_restrictions
  FOR EACH ROW
  EXECUTE FUNCTION update_data_transfer_restrictions_updated_at();

-- Comments
COMMENT ON TABLE data_transfer_restrictions IS 'Tracks user country and enforces restrictions on data transfers to restricted countries';
COMMENT ON COLUMN data_transfer_restrictions.country_code IS 'ISO 3166-1 alpha-2 country code (e.g., CN, RU, IR)';
COMMENT ON COLUMN data_transfer_restrictions.restricted IS 'Whether user is in a restricted country (China, Russia, Iran)';
COMMENT ON COLUMN data_transfer_restrictions.consent_given_at IS 'Timestamp when user gave explicit consent for restricted data transfer';



