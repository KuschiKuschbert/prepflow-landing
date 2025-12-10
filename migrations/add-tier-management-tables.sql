-- Tier Management Tables for Admin Panel
-- These tables allow admins to manage tier configurations and feature mappings without code changes

-- Tier configurations table
CREATE TABLE IF NOT EXISTS tier_configurations (
  tier_slug VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price_monthly DECIMAL(10,2),
  price_yearly DECIMAL(10,2),
  features JSONB NOT NULL DEFAULT '{}',
  limits JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feature tier mapping table
CREATE TABLE IF NOT EXISTS feature_tier_mapping (
  feature_key VARCHAR(100) PRIMARY KEY,
  required_tier VARCHAR(50) NOT NULL,
  description TEXT,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tier config cache table for cache invalidation
CREATE TABLE IF NOT EXISTS tier_config_cache (
  cache_key VARCHAR(100) PRIMARY KEY,
  invalidated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tier_configurations_is_active ON tier_configurations(is_active);
CREATE INDEX IF NOT EXISTS idx_tier_configurations_display_order ON tier_configurations(display_order);
CREATE INDEX IF NOT EXISTS idx_feature_tier_mapping_required_tier ON feature_tier_mapping(required_tier);
CREATE INDEX IF NOT EXISTS idx_feature_tier_mapping_is_premium ON feature_tier_mapping(is_premium);

-- Insert default tier configurations (can be overridden by admin)
INSERT INTO tier_configurations (tier_slug, name, features, limits, display_order)
VALUES
  ('starter', 'Starter',
   '{"cogs": true, "recipes": true, "analytics": true, "temperature": true, "cleaning": true, "compliance": true, "ai_specials": false, "export_csv": false, "export_pdf": false, "recipe_sharing": false, "advanced_analytics": false, "multi_user": false, "api_access": false}'::jsonb,
   '{"recipes": 50, "ingredients": 200}'::jsonb,
   1),
  ('pro', 'Pro',
   '{"cogs": true, "recipes": true, "analytics": true, "temperature": true, "cleaning": true, "compliance": true, "ai_specials": true, "export_csv": true, "export_pdf": true, "recipe_sharing": true, "advanced_analytics": true, "multi_user": false, "api_access": false}'::jsonb,
   '{}'::jsonb,
   2),
  ('business', 'Business',
   '{"cogs": true, "recipes": true, "analytics": true, "temperature": true, "cleaning": true, "compliance": true, "ai_specials": true, "export_csv": true, "export_pdf": true, "recipe_sharing": true, "advanced_analytics": true, "multi_user": true, "api_access": true}'::jsonb,
   '{}'::jsonb,
   3)
ON CONFLICT (tier_slug) DO NOTHING;

-- Insert default feature tier mappings (can be overridden by admin)
INSERT INTO feature_tier_mapping (feature_key, required_tier, description, is_premium)
VALUES
  ('cogs', 'starter', 'COGS Calculator', false),
  ('recipes', 'starter', 'Recipe Management', false),
  ('analytics', 'starter', 'Basic Analytics', false),
  ('temperature', 'starter', 'Temperature Monitoring', false),
  ('cleaning', 'starter', 'Cleaning Management', false),
  ('compliance', 'starter', 'Compliance Records', false),
  ('ai_specials', 'pro', 'AI Specials Generation', true),
  ('export_csv', 'pro', 'CSV Export', true),
  ('export_pdf', 'pro', 'PDF Export', true),
  ('recipe_sharing', 'pro', 'Recipe Sharing', true),
  ('advanced_analytics', 'pro', 'Advanced Analytics', true),
  ('multi_user', 'business', 'Multi-User Support', true),
  ('api_access', 'business', 'API Access', true)
ON CONFLICT (feature_key) DO NOTHING;

-- Enable RLS (Row Level Security)
ALTER TABLE tier_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_tier_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier_config_cache ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow service role access (admin panel uses service role)
DROP POLICY IF EXISTS "Service role can access tier_configurations" ON tier_configurations;
CREATE POLICY "Service role can access tier_configurations" ON tier_configurations
  FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role can access feature_tier_mapping" ON feature_tier_mapping;
CREATE POLICY "Service role can access feature_tier_mapping" ON feature_tier_mapping
  FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role can access tier_config_cache" ON tier_config_cache;
CREATE POLICY "Service role can access tier_config_cache" ON tier_config_cache
  FOR ALL USING (true);



