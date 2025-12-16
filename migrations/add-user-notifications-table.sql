-- Create user_notifications table for storing subscription and system notifications
-- This table stores notifications that users can view and dismiss

CREATE TABLE IF NOT EXISTS user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'subscription', 'system', 'billing', etc.
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  action_url VARCHAR(500), -- Optional URL for action button
  action_label VARCHAR(100), -- Optional label for action button
  read BOOLEAN DEFAULT FALSE,
  dismissed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE,
  dismissed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE, -- Optional expiration date
  metadata JSONB -- Additional data for the notification
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_email ON user_notifications(user_email);
CREATE INDEX IF NOT EXISTS idx_user_notifications_type ON user_notifications(type);
CREATE INDEX IF NOT EXISTS idx_user_notifications_read ON user_notifications(read);
CREATE INDEX IF NOT EXISTS idx_user_notifications_dismissed ON user_notifications(dismissed);
CREATE INDEX IF NOT EXISTS idx_user_notifications_created_at ON user_notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_notifications_expires_at ON user_notifications(expires_at) WHERE expires_at IS NOT NULL;

-- Add composite index for common queries
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_unread ON user_notifications(user_email, read, dismissed) WHERE read = FALSE AND dismissed = FALSE;

-- Add comments for documentation
COMMENT ON TABLE user_notifications IS 'Stores user notifications for subscription events, system alerts, and billing updates';
COMMENT ON COLUMN user_notifications.type IS 'Notification type: subscription, system, billing, etc.';
COMMENT ON COLUMN user_notifications.metadata IS 'Additional notification data stored as JSONB';
COMMENT ON COLUMN user_notifications.expires_at IS 'Optional expiration date - notifications older than this are automatically cleaned up';









