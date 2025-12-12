# Google Connection Setup Guide

**Date:** December 12, 2025
**Status:** ⚠️ **Connection Exists but Needs Configuration**

## Current Status

**Connection Found:** ✅ Google connection exists in Auth0 Dashboard

- **Identifier:** `con_HJGfow8ztdHmTWfR`
- **Strategy:** `google-oauth2`
- **Status:** ⚠️ Using Auth0 development keys (not recommended for production)

## Setup Steps

### Step 1: Get Google OAuth Credentials

**1. Go to Google Cloud Console:**

- Navigate to: https://console.cloud.google.com
- Select your project (or create a new one)

**2. Enable Google+ API:**

- Go to: **APIs & Services** → **Library**
- Search for: "Google+ API" or "Google Identity"
- Click **Enable**

**3. Create OAuth 2.0 Credentials:**

- Go to: **APIs & Services** → **Credentials**
- Click **Create Credentials** → **OAuth client ID**
- Application type: **Web application**
- Name: `PrepFlow Auth0 Integration`

**4. Configure Authorized Redirect URIs:**
Add these redirect URIs:

```
https://dev-7myakdl4itf644km.us.auth0.com/login/callback
```

**5. Copy Credentials:**

- Copy the **Client ID** (looks like: `xxxxx.apps.googleusercontent.com`)
- Copy the **Client Secret** (looks like: `GOCSPX-xxxxx`)

### Step 2: Configure Auth0 Google Connection

**1. Go to Auth0 Dashboard:**

- Navigate to: https://manage.auth0.com
- Go to: **Authentication** → **Social** → **Google**

**2. Configure OAuth Credentials:**

- **Client ID:** Paste your Google Client ID
- **Client Secret:** Paste your Google Client Secret
- Click **Save**

**3. Configure Permissions (Scopes):**

- **Required:**
  - ✅ **Basic Profile** (Email and verified email flag) - Required
  - ✅ **Extended Profile** (Name, public profile URL, photo) - Required
- **Optional:** Add other scopes as needed
- **Note:** For login, you typically only need Basic Profile and Extended Profile

**4. Enable for PrepFlow Application:**

- Scroll down to **Applications** tab
- Find your PrepFlow application
- Toggle it **ON** to enable Google login for this app
- Click **Save**

### Step 3: Test Auto-Enable (Optional)

After configuring credentials, you can use our auto-enable endpoint:

```bash
# Check status
curl https://www.prepflow.org/api/fix/enable-google-connection

# Auto-enable (requires Management API permissions)
curl -X POST https://www.prepflow.org/api/fix/enable-google-connection
```

**Note:** Auto-enable requires Management API permissions (`read:connections`, `update:connections`). If you don't have these, manually enable in Auth0 Dashboard.

### Step 4: Verify Configuration

**1. Check Connection Status:**

```bash
curl https://www.prepflow.org/api/test/auth0-social-connections | jq '.googleConnection'
```

**Expected Response:**

```json
{
  "verified": true,
  "status": "enabled",
  "message": "Google connection is enabled and configured correctly"
}
```

**2. Test Login:**

- Navigate to `https://www.prepflow.org/webapp`
- Click "Sign in with Auth0"
- Look for "Continue with Google" button on Auth0 login page
- Complete Google OAuth flow
- Verify redirect to `/webapp`

## Troubleshooting

### Issue: "Using Auth0 development keys" Warning

**Solution:** Configure your own Google OAuth credentials (Step 1-2 above)

**Why:** Auth0 development keys are for testing only and have limitations:

- No SSO support
- No federated logout
- Rate limits
- Not recommended for production

### Issue: Auto-Enable Fails with "Insufficient scope"

**Error:** `Insufficient scope, expected any of: read:connections`

**Solution:**

1. Grant Management API permissions (see `docs/AUTH0_MANAGEMENT_API_SETUP.md`)
2. Or manually enable in Auth0 Dashboard → Connections → Social → Google → Applications tab

### Issue: Google Login Not Available

**Symptoms:**

- No "Continue with Google" button on Auth0 login page
- Connection status shows disabled

**Solutions:**

1. Verify connection is enabled for your application (Applications tab)
2. Verify OAuth credentials are configured correctly
3. Check that Google+ API is enabled in Google Cloud Console
4. Verify redirect URI is configured in Google Cloud Console

### Issue: "Invalid redirect_uri" Error

**Error:** Google returns "redirect_uri_mismatch"

**Solution:**

- Add `https://dev-7myakdl4itf644km.us.auth0.com/login/callback` to Authorized Redirect URIs in Google Cloud Console
- Ensure no trailing slashes or typos

## Quick Checklist

- [ ] Google Cloud Console project created
- [ ] Google+ API enabled
- [ ] OAuth 2.0 credentials created
- [ ] Redirect URI configured: `https://dev-7myakdl4itf644km.us.auth0.com/login/callback`
- [ ] Client ID and Secret copied
- [ ] Auth0 Google connection configured with credentials
- [ ] Basic Profile and Extended Profile scopes enabled
- [ ] Connection enabled for PrepFlow application
- [ ] Tested login flow
- [ ] Verified redirect to `/webapp`

## Current Configuration Status

**From Auth0 Dashboard:**

- ✅ Connection exists: `google-oauth2` (ID: `con_HJGfow8ztdHmTWfR`)
- ⚠️ Using Auth0 development keys (needs own credentials)
- ⚠️ Connection may not be enabled for PrepFlow application

**Next Steps:**

1. Configure Google OAuth credentials (Step 1-2)
2. Enable connection for PrepFlow app
3. Test login flow
4. Verify auto-enable endpoint works (if Management API permissions granted)

## References

- **Google Cloud Console:** https://console.cloud.google.com
- **Auth0 Dashboard:** https://manage.auth0.com
- **Google OAuth Scopes:** https://developers.google.com/identity/protocols/oauth2/scopes
- **Auth0 Social Connections:** https://auth0.com/docs/authenticate/identity-providers/social-identity-providers
