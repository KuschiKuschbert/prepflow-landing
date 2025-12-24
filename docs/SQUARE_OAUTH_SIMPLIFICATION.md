# Square OAuth Simplification - Implementation Notes

**Date:** January 2025
**Purpose:** Document the simplified Square OAuth implementation where users just click "Connect with Square" and login - no credential entry needed.

---

## Overview

PrepFlow now uses **ONE Square Application** (like Google Drive) that all users connect through. Users simply click "Connect with Square", login with their Square account, and authorize PrepFlow. PrepFlow automatically retrieves and stores their access tokens.

**Key Point:** Users get access to **THEIR OWN Square accounts** (not PrepFlow's account). This is standard OAuth behavior - like connecting Google Drive, you authorize Google's app to access YOUR Google Drive account.

---

## Architecture

```
PrepFlow Square Application (one app for all users)
    ↓
Environment Variables:
- SQUARE_APPLICATION_ID (PrepFlow's app ID)
- SQUARE_APPLICATION_SECRET (PrepFlow's app secret)
    ↓
User clicks "Connect with Square"
    ↓
PrepFlow redirects to Square OAuth with PrepFlow's App ID
    ↓
User logs into Square (their own account)
    ↓
Square shows: "Authorize PrepFlow to access YOUR Square account?"
    ↓
User authorizes
    ↓
Square gives PrepFlow access token for USER's Square account ✅
    ↓
PrepFlow stores user's access token (encrypted)
```

---

## Environment Variables

**Required for PrepFlow Developers:**

```bash
# Square OAuth Application (PrepFlow's app - one for all users)
SQUARE_APPLICATION_ID=your-square-application-id
SQUARE_APPLICATION_SECRET=your-square-application-secret

# Square Token Encryption Key (MANDATORY - 64 hex characters)
SQUARE_TOKEN_ENCRYPTION_KEY=your-64-character-hex-encryption-key-here

# Square Webhook Secret (Optional - for webhook signature verification)
SQUARE_WEBHOOK_SECRET=your-webhook-secret-from-square-dashboard
```

**Setup Steps:**

1. Create ONE Square Application in [Square Developer Dashboard](https://developer.squareup.com/apps)
2. Get Application ID (`sq0idp-...`) and Application Secret (`sq0csb-...`)
3. Add to environment variables (`SQUARE_APPLICATION_ID`, `SQUARE_APPLICATION_SECRET`)
4. Configure redirect URL: `https://www.prepflow.org/api/square/callback`
5. Set required scopes: `ORDERS_READ`, `CATALOG_READ`, `CATALOG_WRITE`, `TEAM_READ`, `TEAM_WRITE`

---

## Implementation Files

### Core OAuth Files

- **`lib/square/oauth-client.ts`** - Singleton OAuth config utility (reads from env vars)
- **`lib/square/oauth-flow.ts`** - OAuth flow handling (uses PrepFlow's credentials from env)
- **`lib/square/oauth-state.ts`** - State token generation/verification (includes environment)

### API Routes

- **`app/api/square/oauth/route.ts`** - OAuth initiation (no query params needed)
- **`app/api/square/callback/route.ts`** - OAuth callback handling (uses env vars)

### UI Components

- **`app/webapp/square/components/sections/ConfigurationSection.tsx`** - Removed credential form, added simple Connect button
- **`app/webapp/square/components/sections/ConnectionWorkflow.tsx`** - Updated "How It Works" to reflect one-click connection

### Supporting Files

- **`lib/square/token-refresh.ts`** - Updated to use new refresh signature (no app secret param)
- **`lib/square/config.ts`** - Still supports `square_application_secret` for backward compatibility (deprecated)

---

## User Flow

### For Users (Simple)

1. Click "Connect with Square" in PrepFlow
2. Login with your Square account on Square's website
3. Authorize PrepFlow to access your Square account
4. Done! PrepFlow automatically retrieves and stores your access token

### What Users See

- **Before Connection:** Connection workflow with "Connect with Square" button
- **After Connection:** Configuration section showing "Connected" status with sync preferences

---

## Key Implementation Details

### OAuth Flow Functions

**`getSquareAuthUrl(userId, environment)`**

- Uses PrepFlow's Application ID from `getSquareOAuthConfig()`
- Generates state token with environment included
- Returns Square authorization URL

**`exchangeCodeForTokens(code, environment)`**

- Uses PrepFlow's Application ID/Secret from `getSquareOAuthConfig()`
- Exchanges authorization code for user's access token
- Returns token response with user's access token (for their Square account)

**`handleSquareCallback(code, stateToken, expectedUserId, environment?)`**

- Verifies state token (includes environment)
- Exchanges code for tokens using PrepFlow's credentials
- Stores user's access token (for their Square account) encrypted

**`refreshAccessToken(refreshToken, environment)`**

- Uses PrepFlow's Application ID/Secret from `getSquareOAuthConfig()`
- Refreshes user's access token using their refresh token

### State Token

State token now includes:

- `userId` - User ID for verification
- `environment` - Square environment (sandbox/production)
- `timestamp` - For expiration checking
- `nonce` - Random value for security

### Database Schema

**`square_configurations` table:**

- `square_application_id` - Stores PrepFlow's app ID (for reference)
- `square_access_token_encrypted` - User's access token (for their account) - encrypted
- `refresh_token_encrypted` - User's refresh token - encrypted
- `square_application_secret_encrypted` - **DEPRECATED** - No longer stored (PrepFlow uses env vars)

---

## Security Considerations

- ✅ PrepFlow's Application Secret stored in environment variables only (never in database)
- ✅ Users' access tokens encrypted before storage (AES-256-GCM)
- ✅ Each user gets access to their own Square account (OAuth ensures this)
- ✅ State token verification prevents CSRF attacks
- ✅ Environment included in state token for security

---

## Migration Notes

### For Existing Users

- Existing users with manual credentials will need to reconnect using OAuth
- No data migration needed - just reconnection
- Consider showing a migration notice for existing users

### Backward Compatibility

- `square_application_secret_encrypted` field still exists in database schema (for backward compatibility)
- New OAuth connections don't store application secret (uses env vars instead)
- Token refresh uses PrepFlow's credentials from env vars

---

## Testing Checklist

1. ✅ Set environment variables with PrepFlow's Square Application credentials
2. ✅ Click "Connect with Square" as a user
3. ✅ Login with user's Square account
4. ✅ Verify access token is for user's account (not PrepFlow's account)
5. ✅ Test sync operations to confirm user's data is accessed
6. ✅ Verify token refresh works automatically

---

## Troubleshooting

### "Square OAuth not configured" Error

**Cause:** Missing `SQUARE_APPLICATION_ID` or `SQUARE_APPLICATION_SECRET` environment variables.

**Solution:**

1. Verify your `.env.local` file contains both variables:
   ```bash
   SQUARE_APPLICATION_ID=your-actual-application-id
   SQUARE_APPLICATION_SECRET=your-actual-application-secret
   ```
2. Restart your development server after adding/updating environment variables
3. Check `/api/square/status` endpoint - it will show a clear error if OAuth is not configured

### Verifying Your Credentials Are Loaded

**Quick Check:**

1. Visit `/webapp/square` in your browser
2. Navigate to Configuration section
3. If you see "Connect with Square" button → OAuth is configured ✅
4. If you see an error about missing environment variables → Check your `.env.local` file

**API Check:**

- Call `/api/square/status` - it will return `503` with error `OAUTH_NOT_CONFIGURED` if environment variables are missing

### Users Getting Wrong Account Access

**This Should Not Happen:** OAuth ensures users authorize PrepFlow's app to access THEIR own Square account. If a user logs into Square with Account A, they get access tokens for Account A.

**Verification:** Check the `merchant_id` in the token response - it should match the user's Square account merchant ID.

### Token Refresh Failing

**Cause:** Missing `SQUARE_APPLICATION_SECRET` environment variable.

**Solution:** Ensure `SQUARE_APPLICATION_SECRET` is set in environment variables.

---

## Related Documentation

- **`docs/SQUARE_API_REFERENCE.md`** - Complete Square API reference guide
- **`AGENTS.md`** - Project documentation with Square POS Integration section
- **`lib/backup/google-drive/oauth-flow.ts`** - Reference implementation (Google Drive OAuth)

---

## Key Takeaways

1. **PrepFlow has ONE Square Application** - All users connect through the same app
2. **Users get access to THEIR own Square accounts** - Not PrepFlow's account (standard OAuth)
3. **No credential entry needed** - Users just click "Connect" and login
4. **Automatic token refresh** - Access tokens refresh automatically using refresh tokens
5. **Secure** - All tokens encrypted before storage, Application Secret in env vars only

---

## Files Modified

1. `env.example` - Added Square OAuth environment variables
2. `AGENTS.md` - Updated Square POS Integration section
3. `lib/square/oauth-client.ts` - **NEW** - OAuth config utility
4. `lib/square/oauth-flow.ts` - Updated to use env vars
5. `lib/square/oauth-state.ts` - Updated to include environment in state
6. `lib/square/token-refresh.ts` - Updated to use new refresh signature
7. `app/api/square/oauth/route.ts` - Simplified OAuth initiation
8. `app/api/square/callback/route.ts` - Updated to use env vars
9. `app/webapp/square/components/sections/ConfigurationSection.tsx` - Removed credential form
10. `app/webapp/square/components/sections/ConnectionWorkflow.tsx` - Updated instructions
11. `docs/SQUARE_API_REFERENCE.md` - Updated documentation

---

**Last Updated:** January 2025
**Status:** ✅ Complete - All todos finished
