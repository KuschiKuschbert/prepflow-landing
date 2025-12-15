-- Add avatar column to users table
-- Stores avatar ID (e.g., "avatar-01") or NULL for default initials

ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar VARCHAR(50);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_users_avatar ON users(avatar);

-- Add comment
COMMENT ON COLUMN users.avatar IS 'User avatar ID (e.g., "avatar-01"). NULL means use initials fallback.';















