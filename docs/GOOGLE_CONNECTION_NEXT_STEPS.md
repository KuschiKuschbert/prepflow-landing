# Google Connection Next Steps

**Date:** December 12, 2025  
**Current Status:** ⚠️ **Connection Exists - Needs Configuration**

## What I See in Auth0 Dashboard

✅ **Google Connection Found:**

- Connection ID: `con_HJGfow8ztdHmTWfR`
- Strategy: `google-oauth2`
- Status: ⚠️ Using Auth0 development keys

## Immediate Next Steps

### Step 1: Configure Google OAuth Credentials

**In the Auth0 Dashboard (where you are now):**

1. **Get Google OAuth Credentials:**
   - Go to: https://console.cloud.google.com
   - Create OAuth 2.0 Client ID (if you don't have one)
   - **Authorized Redirect URI:** `https://dev-7myakdl4itf644km.us.auth0.com/login/callback`

2. **Enter Credentials in Auth0:**
   - **Client ID:** Paste your Google Client ID
   - **Client Secret:** Paste your Google Client Secret
   - Click **Save**

3. **Configure Permissions (Scopes):**
   - ✅ **Basic Profile** (Required) - Email and verified email flag
   - ✅ **Extended Profile** (Required) - Name, public profile URL, photo
   - **Optional:** Add other scopes as needed
   - **Note:** For login, Basic Profile and Extended Profile are sufficient

### Step 2: Enable Connection for PrepFlow Application

**In Auth0 Dashboard:**

1. Scroll down to find **"Applications"** tab (or section)
2. Find your PrepFlow application in the list
3. **Toggle it ON** to enable Google login for this app
4. Click **Save**

**Alternative:** Use our auto-enable endpoint (requires Management API permissions):

```bash
curl -X POST https://www.prepflow.org/api/fix/enable-google-connection
```

### Step 3: Test Configuration

**After saving:**

1. **Check Status:**

   ```bash
   curl https://www.prepflow.org/api/fix/enable-google-connection | jq '.enabled'
   ```

   Should return `true` if configured correctly

2. **Test Login:**
   - Navigate to `https://www.prepflow.org/webapp`
   - Click "Sign in with Auth0"
   - Look for "Continue with Google" button
   - Complete Google OAuth flow
   - Verify redirect to `/webapp`

## Quick Checklist

**In Auth0 Dashboard (Google Connection Page):**

- [ ] Enter Google Client ID (not blank, not Auth0 dev keys)
- [ ] Enter Google Client Secret (not blank, not Auth0 dev keys)
- [ ] Enable "Basic Profile" scope (Required)
- [ ] Enable "Extended Profile" scope (Required)
- [ ] Scroll to "Applications" section
- [ ] Enable connection for PrepFlow application
- [ ] Click "Save"

**After Configuration:**

- [ ] Test status endpoint: `GET /api/fix/enable-google-connection`
- [ ] Should show `enabled: true`
- [ ] Test login flow
- [ ] Verify "Continue with Google" button appears
- [ ] Complete Google login
- [ ] Verify redirect to `/webapp`

## Current Diagnostic Status

**From Our Tests:**

- ✅ Connection exists: `google-oauth2`
- ⚠️ Status: `disabled_or_misconfigured`
- ⚠️ Using Auth0 development keys (needs own credentials)
- ⚠️ May not be enabled for PrepFlow application

**After Configuration:**

- ✅ Should show `enabled: true`
- ✅ Should show `verified: true`
- ✅ "Continue with Google" button should appear on Auth0 login page

## Troubleshooting

### If "Continue with Google" Button Doesn't Appear

**Check:**

1. Connection is enabled for PrepFlow application (Applications tab)
2. OAuth credentials are configured (not using dev keys)
3. Basic Profile scope is enabled
4. Connection is saved

### If Auto-Enable Fails

**Error:** `Insufficient scope, expected any of: read:connections`

**Solution:**

- Grant Management API permissions (see `docs/AUTH0_MANAGEMENT_API_SETUP.md`)
- Or manually enable in Auth0 Dashboard → Applications tab

### If Google Login Fails

**Check:**

1. Google Cloud Console redirect URI is correct: `https://dev-7myakdl4itf644km.us.auth0.com/login/callback`
2. OAuth credentials match between Google Cloud Console and Auth0
3. Google+ API is enabled in Google Cloud Console
4. Connection is enabled for PrepFlow application

## What to Do Right Now

**In Auth0 Dashboard (Google Connection Page):**

1. **If you have Google OAuth credentials:**
   - Enter Client ID and Client Secret
   - Enable Basic Profile and Extended Profile scopes
   - Enable connection for PrepFlow application
   - Save

2. **If you don't have Google OAuth credentials:**
   - Follow `docs/GOOGLE_CONNECTION_SETUP_GUIDE.md` Step 1
   - Get credentials from Google Cloud Console
   - Then come back and configure in Auth0

3. **After Configuration:**
   - Test with: `curl https://www.prepflow.org/api/fix/enable-google-connection`
   - Should show `enabled: true`
   - Then test login flow

## Expected Result

**After Configuration:**

- ✅ Status endpoint shows `enabled: true`
- ✅ "Continue with Google" button appears on Auth0 login page
- ✅ Google OAuth flow works
- ✅ User redirected to `/webapp` after login
- ✅ No redirect loops
