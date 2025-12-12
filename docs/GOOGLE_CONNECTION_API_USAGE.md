# Google Connection API Usage Guide

**Date:** December 12, 2025
**Purpose:** Complete guide for using the API to configure and enable Google OAuth connection

## API Endpoints

### 1. Check Status

**Endpoint:** `GET /api/fix/enable-google-connection`

**Purpose:** Check if Google connection is enabled and configured

**Example:**

```bash
curl https://www.prepflow.org/api/fix/enable-google-connection
```

**Response:**

```json
{
  "success": true,
  "enabled": false,
  "message": "Google connection is not enabled or misconfigured"
}
```

### 2. Enable Existing Connection (No Credentials)

**Endpoint:** `POST /api/fix/enable-google-connection`

**Purpose:** Enable Google connection for the application (connection must already have OAuth credentials configured)

**Example:**

```bash
curl -X POST https://www.prepflow.org/api/fix/enable-google-connection
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Google connection enabled successfully for this application",
  "enabled": true,
  "action": "enabled"
}
```

**Response (Failure - No Credentials):**

```json
{
  "success": false,
  "message": "Google connection exists but isn't configured with OAuth credentials. Please configure it in Auth0 Dashboard > Connections > Social > Google",
  "action": "failed"
}
```

### 3. Configure and Enable (With Credentials) ⭐ **RECOMMENDED**

**Endpoint:** `POST /api/fix/enable-google-connection`

**Purpose:** Configure Google OAuth credentials AND enable connection in one call

**Request Body:**

```json
{
  "googleClientId": "your-google-client-id.apps.googleusercontent.com",
  "googleClientSecret": "GOCSPX-your-google-client-secret"
}
```

**Example:**

```bash
curl -X POST https://www.prepflow.org/api/fix/enable-google-connection \
  -H "Content-Type: application/json" \
  -d '{
    "googleClientId": "123456789-abcdefghijklmnop.apps.googleusercontent.com",
    "googleClientSecret": "GOCSPX-abcdefghijklmnopqrstuvwxyz"
  }'
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Google OAuth credentials configured and connection enabled successfully",
  "configured": true,
  "enabled": true,
  "action": "configured_and_enabled"
}
```

**Response (Partial Success - Configured but Not Enabled):**

```json
{
  "success": false,
  "message": "OAuth credentials configured, but failed to enable connection: Insufficient scope",
  "configured": true,
  "enabled": false,
  "action": "failed"
}
```

## Step-by-Step Usage

### Option 1: Configure via API (Recommended)

**1. Get Google OAuth Credentials:**

- Go to: https://console.cloud.google.com
- Create OAuth 2.0 Client ID
- **Authorized Redirect URI:** `https://dev-7myakdl4itf644km.us.auth0.com/login/callback`
- Copy Client ID and Client Secret

**2. Configure via API:**

```bash
curl -X POST https://www.prepflow.org/api/fix/enable-google-connection \
  -H "Content-Type: application/json" \
  -d '{
    "googleClientId": "YOUR_CLIENT_ID",
    "googleClientSecret": "YOUR_CLIENT_SECRET"
  }'
```

**3. Verify:**

```bash
curl https://www.prepflow.org/api/fix/enable-google-connection | jq '.enabled'
```

Should return: `true`

### Option 2: Configure Manually, Enable via API

**1. Configure in Auth0 Dashboard:**

- Go to Auth0 Dashboard → Connections → Social → Google
- Enter Google Client ID and Client Secret
- Save

**2. Enable via API:**

```bash
curl -X POST https://www.prepflow.org/api/fix/enable-google-connection
```

**3. Verify:**

```bash
curl https://www.prepflow.org/api/fix/enable-google-connection | jq '.enabled'
```

## Required Permissions

**For Configure and Enable:**

- `read:connections` - Read connection configuration
- `update:connections` - Update connection options and enabled_clients

**For Enable Only:**

- `read:connections` - Read connection configuration
- `update:connections` - Update enabled_clients

**Setup:** See `docs/AUTH0_MANAGEMENT_API_SETUP.md`

## Troubleshooting

### Error: "Insufficient scope"

**Problem:** Management API doesn't have required permissions

**Solution:**

1. Grant `read:connections` and `update:connections` scopes
2. See `docs/AUTH0_MANAGEMENT_API_SETUP.md` for setup instructions

### Error: "Google connection doesn't exist"

**Problem:** Google connection hasn't been created in Auth0

**Solution:**

1. Create Google connection in Auth0 Dashboard → Connections → Social → Google
2. Then use API to configure credentials

### Error: "Management API client not available"

**Problem:** Missing environment variables

**Solution:**

1. Ensure `AUTH0_ISSUER_BASE_URL` is set
2. Ensure `AUTH0_CLIENT_ID` and `AUTH0_CLIENT_SECRET` are set
3. Or set `AUTH0_M2M_CLIENT_ID` and `AUTH0_M2M_CLIENT_SECRET` for M2M credentials

### Error: "OAuth credentials configured, but failed to enable connection"

**Problem:** Credentials configured but connection not enabled for app

**Solution:**

1. Check Management API has `update:connections` scope
2. Or manually enable in Auth0 Dashboard → Connections → Social → Google → Applications tab

## Security Notes

⚠️ **Important:**

- Google Client Secret is sensitive data
- API endpoint should only be called from secure environments
- Consider using environment variables instead of passing secrets in request body
- For production, prefer M2M credentials (`AUTH0_M2M_CLIENT_ID` / `AUTH0_M2M_CLIENT_SECRET`)

## Example: Complete Setup Script

```bash
#!/bin/bash

# Set your Google OAuth credentials
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-your-client-secret"
API_URL="https://www.prepflow.org/api/fix/enable-google-connection"

# Configure and enable
echo "Configuring Google OAuth credentials..."
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"googleClientId\": \"$GOOGLE_CLIENT_ID\",
    \"googleClientSecret\": \"$GOOGLE_CLIENT_SECRET\"
  }")

# Check result
SUCCESS=$(echo "$RESPONSE" | jq -r '.success')
ENABLED=$(echo "$RESPONSE" | jq -r '.enabled')

if [ "$SUCCESS" = "true" ] && [ "$ENABLED" = "true" ]; then
  echo "✅ Google connection configured and enabled successfully!"
else
  echo "❌ Failed to configure/enable Google connection"
  echo "$RESPONSE" | jq '.'
fi
```

## Next Steps After Configuration

1. **Test Login:**
   - Navigate to `https://www.prepflow.org/webapp`
   - Click "Sign in with Auth0"
   - Look for "Continue with Google" button
   - Complete Google OAuth flow

2. **Verify Redirect:**
   - After Google login, should redirect to `/webapp`
   - Session should be created
   - User should see webapp dashboard

3. **Monitor Logs:**
   - Check Vercel logs for any errors
   - Check Auth0 logs for connection issues
   - Use diagnostic endpoints if issues occur
