-- Migration: Add Error Reporting Preferences Documentation
-- This migration documents the error reporting preference structure in users.notification_preferences JSONB column
-- No schema changes needed - using existing notification_preferences column

-- The error reporting preferences are stored in users.notification_preferences JSONB column:
-- {
--   "errorReporting": {
--     "autoReport": boolean  -- If true, automatically create support tickets for critical/safety errors
--   }
-- }

-- Example usage:
-- UPDATE users
-- SET notification_preferences = jsonb_set(
--   COALESCE(notification_preferences, '{}'::jsonb),
--   '{errorReporting,autoReport}',
--   'true'::jsonb
-- )
-- WHERE email = 'user@example.com';

-- The auto-report feature:
-- 1. Checks user preference when a critical/safety error occurs
-- 2. If enabled, automatically creates a support ticket via /api/user/errors/auto-report
-- 3. Links the ticket to the error via related_error_id
-- 4. Only applies to authenticated users with critical/safety severity errors

COMMENT ON COLUMN users.notification_preferences IS 'User notification preferences including error reporting settings. Structure: { "errorReporting": { "autoReport": boolean } }';








