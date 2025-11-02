# Auth0 Localhost Configuration Guide

## Quick Setup Instructions

To enable Auth0 authentication on localhost, you need to configure your Auth0 application to allow localhost URLs.

### 1. Auth0 Dashboard Configuration

1. Go to https://manage.auth0.com
2. Navigate to **Applications** > **Applications**
3. Select your application (or create a new one if needed)
4. Go to **Settings** tab

### 2. Configure Allowed URLs

Add these URLs to your Auth0 application:

#### Allowed Callback URLs:

```
http://localhost:3000/api/auth/callback/auth0
http://localhost:3001/api/auth/callback/auth0
```

#### Allowed Logout URLs:

```
http://localhost:3000
http://localhost:3000/
http://localhost:3001
http://localhost:3001/
```

**⚠️ CRITICAL:** These URLs MUST be added to "Allowed Logout URLs" or logout will fail with `redirect_uri_mismatch` error.

#### Allowed Web Origins:

```
http://localhost:3000
http://localhost:3001
```

### 3. Save Changes

Click **Save Changes** at the bottom of the Settings page.

### 4. Environment Variables

Your `.env.local` is already configured:

```bash
AUTH0_ISSUER_BASE_URL=https://dev-7myakdl4itf644km.us.auth0.com
AUTH0_CLIENT_ID=CO3Vl37SuZ4e9wke1PitgWvAUyMR2HfL
AUTH0_CLIENT_SECRET=zlbcaViOHPG27NhE1KwcQjUp8aiOTILCgVAX0kR1IzSM0bxs1BVpv8KL9uIeqgX_
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=dev-secret-change-me
ALLOWED_EMAILS=derkusch@gmail.com
```

### 5. Test Authentication

```bash
# Start the dev server
npm run dev

# Navigate to http://localhost:3001/webapp
# You should be redirected to Auth0 login
# After login, you'll be redirected back to /webapp
```

### 6. Test Logout

```bash
# After logging in, navigate to /not-authorized or any protected route
# Click the "Logout" button
# Verify:
#   - You're redirected to landing page
#   - Session is cleared
#   - Next login shows fresh login screen (not remembered account)
```

**Troubleshooting Logout:**

- If logout doesn't work, check that `http://localhost:3000` and `http://localhost:3001` are in "Allowed Logout URLs"
- If using Auth0 developer keys with social connections, federated logout won't work (see [AUTH0_LOGOUT_SETUP.md](../docs/AUTH0_LOGOUT_SETUP.md))

---

## Alternative: Development Mode Bypass

If you want to bypass authentication for local testing, we can create a development-only bypass. However, this is **NOT recommended for production** and should only be used for rapid development.

Would you like me to implement a development mode authentication bypass for localhost?
