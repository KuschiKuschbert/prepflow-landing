-- Add CurbOS feature to Business tier configuration and feature tier mapping
-- CurbOS is available exclusively for Business tier subscribers

-- Add curbos feature to Business tier configuration
UPDATE tier_configurations
SET features = jsonb_set(
  features,
  '{curbos}',
  'true'::jsonb
),
updated_at = NOW()
WHERE tier_slug = 'business';

-- Add curbos to feature tier mapping (Business tier required)
INSERT INTO feature_tier_mapping (feature_key, required_tier, description, is_premium)
VALUES (
  'curbos',
  'business',
  'CurbOS Admin Console - Advanced restaurant management system',
  true
)
ON CONFLICT (feature_key) DO UPDATE
SET required_tier = 'business',
    description = 'CurbOS Admin Console - Advanced restaurant management system',
    is_premium = true,
    updated_at = NOW();
