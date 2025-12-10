# Auth0 Management API Setup Guide

**Purpose:** Guide for setting up Auth0 Management API access to enable automated configuration management and validation.

## Why Management API Access?

The Auth0 Management API allows you to:
- ✅ **Validate** application settings programmatically (`check-auth0-config.js`)
- ✅ **Update** application settings programmatically (`update-auth0-config.js`)
- ✅ **Fix** configuration issues without manual dashboard changes
- ✅ **Sync** configuration across environments
- ✅ **Automate** Auth0 configuration in CI/CD pipelines

## Required Scopes

**For Reading Configuration (check-auth0-config.js):**
- `read:clients` - Read application settings

**For Updating Configuration (update-auth0-config.js):**
- `read:clients` - Read application settings
- `update:clients` - Update application settings

**⚠️ IMPORTANT:** Both scopes are required for full programmatic management.

## Setup Options

### Option 1: Machine-to-Machine (M2M) Application (Recommended)

**Why:** More secure, dedicated credentials for API access, easier to manage.

**Steps:**

1. **Create M2M Application:**
   - Go to https://manage.auth0.com
   - Navigate to **Applications** → **Applications**
   - Click **Create Application**
   - Name: `PrepFlow Management API` (or similar)
   - Type: **Machine to Machine Applications**
   - Click **Create**

2. **Authorize Management API:**
   - After creation, you'll see **APIs** section
   - Select **Auth0 Management API**
   - Toggle **Authorize**
   - Under **Permissions**, select:
     - ✅ `read:clients` (required for reading application settings)
     - ✅ `update:clients` (required for updating application settings)
   - Click **Authorize**

3. **Get Credentials:**
   - Copy the **Client ID** (starts with something like `abc123...`)
   - Copy the **Client Secret** (long string)

4. **Set Environment Variables:**
   ```bash
   # Add to .env.local
   AUTH0_M2M_CLIENT_ID=your-m2m-client-id-here
   AUTH0_M2M_CLIENT_SECRET=your-m2m-client-secret-here
   ```

5. **Test:**
   ```bash
   # Validate current configuration
   npm run auth0:check-config

   # Update configuration programmatically
   npm run auth0:update-config
   ```

### Option 2: Grant Your Application Management API Access

**Why:** Use existing application credentials (less secure, but simpler).

**Steps:**

1. **Authorize Your Application:**
   - Go to https://manage.auth0.com
   - Navigate to **APIs** → **Auth0 Management API**
   - Click **Machine to Machine Applications** tab
   - Find your application (the one with `AUTH0_CLIENT_ID`)
   - Toggle **Authorize** if not already authorized

2. **Grant Required Scopes:**
   - Under **Permissions**, select:
     - ✅ `read:clients` (required for reading application settings)
     - ✅ `update:clients` (required for updating application settings)
   - Click **Update**

3. **Test:**
   ```bash
   npm run auth0:check-config
   ```

**Note:** Your existing `AUTH0_CLIENT_ID` and `AUTH0_CLIENT_SECRET` will be used automatically.

## Management API Endpoint

The script uses the Management API endpoint:
```
https://dev-7myakdl4itf644km.us.auth0.com/api/v2/
```

This is automatically constructed from your `AUTH0_ISSUER_BASE_URL` environment variable.

## Security Best Practices

1. **Never commit credentials to git** - Always use `.env.local` (gitignored)
2. **Use M2M credentials** - More secure than regular application credentials
3. **Minimal scopes** - Only grant `read:clients` (not write permissions)
4. **Rotate secrets regularly** - Update credentials every 90 days
5. **Use different credentials** - Separate M2M app for production vs development

## Troubleshooting

### Error: "Insufficient scope"

**Cause:** Credentials don't have `read:clients` scope.

**Solution:**
- Verify the application is authorized for Auth0 Management API
- Check that `read:clients` scope is granted
- Wait 1-2 minutes after granting scope (propagation delay)

### Error: "Invalid credentials"

**Cause:** Client ID or Secret is incorrect.

**Solution:**
- Verify environment variables are set correctly
- Check for typos or extra spaces
- Ensure you're using the correct credentials (M2M vs regular app)

### Error: "Management API Access Denied"

**Cause:** Application not authorized or wrong credentials.

**Solution:**
- Follow Option 1 or Option 2 above
- Verify credentials match the authorized application
- Check Auth0 Dashboard → APIs → Auth0 Management API → Authorized Applications

## Verification

After setup, run:

```bash
# Validate environment variables
npm run auth0:validate-env

# Check Auth0 dashboard configuration (requires Management API access)
npm run auth0:check-config

# Check for code issues
npm run auth0:check-issues
```

All three scripts should pass without errors.

## Next Steps

Once Management API access is configured:

1. Run `npm run auth0:check-config` regularly to validate configuration
2. Add to CI/CD pipeline for automated validation
3. Use before deployments to catch configuration issues early
