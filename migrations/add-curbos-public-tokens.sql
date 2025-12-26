-- CurbOS Public Display Tokens
-- Allows Business tier users to share read-only display view with customers
CREATE TABLE IF NOT EXISTS curbos_public_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR(255) NOT NULL UNIQUE,
  public_token VARCHAR(64) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_regenerated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  created_by_user_email VARCHAR(255) NOT NULL
);

-- Index for fast token lookups
CREATE INDEX IF NOT EXISTS idx_curbos_public_tokens_token ON curbos_public_tokens(public_token);
CREATE INDEX IF NOT EXISTS idx_curbos_public_tokens_user_email ON curbos_public_tokens(user_email);
CREATE INDEX IF NOT EXISTS idx_curbos_public_tokens_is_active ON curbos_public_tokens(is_active);

-- Enable RLS (Row Level Security)
ALTER TABLE curbos_public_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Service role can do everything (for API routes)
CREATE POLICY "Service role full access" ON curbos_public_tokens
  FOR ALL USING (auth.role() = 'service_role');
