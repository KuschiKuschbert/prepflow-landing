-- Navigation Optimization Tables
-- These tables support adaptive navigation optimization based on user usage patterns

-- =====================================================
-- NAVIGATION USAGE LOGS
-- =====================================================
CREATE TABLE IF NOT EXISTS navigation_usage_logs (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  href TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  day_of_week INTEGER NOT NULL, -- 0-6 (Sunday = 0)
  hour_of_day INTEGER NOT NULL, -- 0-23
  time_spent INTEGER, -- milliseconds
  return_frequency INTEGER, -- visits per week
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_nav_logs_user_time ON navigation_usage_logs(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_nav_logs_href ON navigation_usage_logs(href);
CREATE INDEX IF NOT EXISTS idx_nav_logs_user_href_time ON navigation_usage_logs(user_id, href, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_nav_logs_day_hour ON navigation_usage_logs(day_of_week, hour_of_day);

-- =====================================================
-- NAVIGATION OPTIMIZATION PREFERENCES
-- =====================================================
CREATE TABLE IF NOT EXISTS navigation_optimization_preferences (
  user_id TEXT PRIMARY KEY,
  enabled BOOLEAN DEFAULT false,
  selected_sections TEXT[], -- Array of category names
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_nav_prefs_enabled ON navigation_optimization_preferences(enabled);
