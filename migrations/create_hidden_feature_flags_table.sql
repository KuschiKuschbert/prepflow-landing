-- Create hidden_feature_flags table if it doesn't exist
CREATE TABLE IF NOT EXISTS hidden_feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_key TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  is_unlocked BOOLEAN DEFAULT false,
  is_enabled BOOLEAN DEFAULT false,
  unlocked_by TEXT,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_hidden_flags_unlocked ON hidden_feature_flags(is_unlocked);
CREATE INDEX IF NOT EXISTS idx_hidden_flags_key ON hidden_feature_flags(feature_key);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_hidden_feature_flags_updated_at ON hidden_feature_flags;
CREATE TRIGGER update_hidden_feature_flags_updated_at
  BEFORE UPDATE ON hidden_feature_flags
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();










