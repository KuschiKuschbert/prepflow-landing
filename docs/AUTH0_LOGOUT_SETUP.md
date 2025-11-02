# Auth0 Logout Configuration Guide

## Overview

Proper logout configuration is critical for ensuring users can fully log out of both NextAuth and Auth0 sessions. This guide covers setup requirements and troubleshooting.

## Critical Requirements

### 1. Allowed Logout URLs (REQUIRED)

The `returnTo` URL used in logout must be whitelisted in your Auth0 dashboard:

1. Go to https://manage.auth0.com
2. Navigate to **Applications** > **Applications**
3. Select your application
4. Go to **Settings** tab
5. Find **Allowed Logout URLs**
6. Add your logout return URLs:

```
http://localhost:3000
http://localhost:3001
https://yourdomain.com
```

**Important:** Auth0 will reject logout requests if the `returnTo` URL is not whitelisted, resulting in logout failures.

### 2. Auth0 Developer Keys Limitations

If you're using Auth0 developer keys (not your own Client ID/Secret from social providers), be aware of these limitations:

#### ❌ What WON'T Work with Developer Keys:

- **Federated Logout** (`?federated` parameter): Won't clear social provider sessions
- **Single Sign-On (SSO)**: May not function properly
- **Custom Domains**: Cannot be used with developer keys

#### ✅ What WILL Work:

- **Basic Logout** (`/v2/logout`): Should still clear Auth0 session
- **Session Clearing**: NextAuth session will be cleared
- **Redirect to Landing**: Should redirect properly if URLs are whitelisted

#### ⚠️ Common Issue:

If logout doesn't fully clear the session (user stays logged in), you're likely:

1. Using developer keys with social connections
2. Missing the `returnTo` URL in "Allowed Logout URLs"
3. Using a `returnTo` URL that's not an absolute URL

### 3. Production Setup

For production, **always use your own Client ID/Secret** from social providers:

1. Register your app with each social provider (Google, Facebook, etc.)
2. Obtain Client ID and Client Secret
3. Configure in Auth0 dashboard:
   - **Applications** > **Applications** > **Your App** > **Connections** tab
   - Enable social connections (Google, Facebook, etc.)
   - Enter your own Client ID and Secret for each

This enables:

- ✅ Proper federated logout
- ✅ Custom branding (your logo instead of Auth0's)
- ✅ Full SSO functionality
- ✅ Custom domains

## Logout Flow

### Current Implementation

```
1. User clicks "Logout"
2. Client: signOut({ redirect: false }) → Clears NextAuth session
3. Client: Redirects to /api/auth/logout?returnTo=...
4. Server: Constructs Auth0 logout URL
5. Server: Redirects to Auth0 /v2/logout endpoint
6. Auth0: Clears Auth0 session cookies
7. Auth0: Redirects back to returnTo URL (landing page)
```

### Expected Behavior

✅ **Success:**

- NextAuth session cleared
- Auth0 session cleared
- User redirected to landing page
- Next login shows fresh login screen (not remembered account)

❌ **Failure Signs:**

- User redirected but still logged in
- Auth0 error page appears
- User gets stuck in redirect loop
- Next login remembers last account

## Troubleshooting

### Issue: Logout doesn't clear session

**Check:**

1. ✅ Is `returnTo` URL whitelisted in Auth0 dashboard?
2. ✅ Is `returnTo` URL absolute (starts with `http://` or `https://`)?
3. ✅ Are you using developer keys? (Check if social connections show Auth0 branding)
4. ✅ Check browser console for errors

**Solution:**

1. Add all possible `returnTo` URLs to "Allowed Logout URLs"
2. Ensure `returnTo` is constructed as absolute URL in code
3. For production, switch to your own Client ID/Secret

### Issue: Auth0 error page on logout

**Error:** `invalid_request` or `redirect_uri_mismatch`

**Cause:** `returnTo` URL not whitelisted

**Solution:** Add the exact URL to "Allowed Logout URLs" in Auth0 dashboard

### Issue: User stays logged in after logout

**Possible Causes:**

1. Using developer keys + social connections → Federated logout won't work
2. Auth0 logout didn't complete → Check network tab for failed requests
3. Browser cookies not cleared → Clear cookies manually or use incognito

**Solution:**

1. For production: Use your own Client ID/Secret
2. Clear browser cookies manually: DevTools > Application > Cookies
3. Check Auth0 logout URL is being called correctly

### Issue: Developer keys warning

**Warning:** "One or more connections are using Auth0 development keys"

**Meaning:** You're using Auth0's generic keys, not your own

**Impact:**

- Federated logout won't work with social connections
- Some advanced features limited

**Solution:**

1. Register your app with social providers
2. Obtain your own Client ID/Secret
3. Configure in Auth0 dashboard

## Testing

### Local Testing

```bash
# 1. Start dev server
npm run dev

# 2. Navigate to /webapp (requires login)
# 3. After login, navigate to /not-authorized (or any protected page)
# 4. Click "Logout" button
# 5. Verify:
#    - Redirected to landing page
#    - No longer authenticated
#    - Next login shows fresh login screen
```

### Production Testing

1. Test logout on production domain
2. Verify `returnTo` URL matches production domain exactly
3. Check that production domain is in "Allowed Logout URLs"
4. Test with multiple browsers/devices
5. Verify social provider sessions are cleared (if using federated logout)

## Environment Variables

Required environment variables:

```bash
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
NEXTAUTH_URL=https://yourdomain.com
```

## Additional Resources

- [Auth0 Logout Documentation](https://auth0.com/docs/authenticate/login/logout)
- [Developer Keys Limitations](https://auth0.com/docs/authenticate/identity-providers/social-identity-providers/developer-keys)
- [Allowed Logout URLs Configuration](https://auth0.com/docs/get-started/applications/application-settings#allowed-logout-urls)
