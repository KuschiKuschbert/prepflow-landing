# Login Flow Testing Guide

**Date:** December 12, 2025
**Purpose:** Step-by-step guide for testing the complete login flow

## 🧪 Testing Checklist

### Step 1: Test Sign-In Page Load ✅

**Action:** Navigate to `https://www.prepflow.org/webapp`

**Expected:**

- ✅ Redirects to `/api/auth/signin/auth0?callbackUrl=%2Fwebapp`
- ✅ Sign-in page displays correctly
- ✅ "Sign in with Auth0" button is visible

**Status:** ✅ **PASSED** - Sign-in page loads correctly

### Step 2: Test Auth0 Redirect ✅

**Action:** Click "Sign in with Auth0" button

**Expected:**

- ✅ Redirects to Auth0 login page
- ✅ URL contains correct callback: `redirect_uri=https://www.prepflow.org/api/auth/callback/auth0`
- ✅ No console errors (except expected SSO warning)

**Status:** ✅ **PASSED** - Redirects to Auth0 correctly

**Observations:**

- Auth0 login page loads: `https://dev-7myakdl4itf644km.us.auth0.com/login`
- Callback URL is correct: `https://www.prepflow.org/api/auth/callback/auth0`
- Only expected SSO warning in console (non-critical)

### Step 3: Test Email/Password Login ⏳

**Action:** Complete login with email/password on Auth0 login page

**Expected:**

- ✅ Auth0 processes authentication
- ✅ Redirects back to `/api/auth/callback/auth0`
- ✅ NextAuth processes callback
- ✅ Creates session
- ✅ Redirects to `/webapp`
- ✅ No redirect loops
- ✅ User sees webapp dashboard

**Status:** ⏳ **AWAITING USER TEST** - Requires actual login credentials

**What to Monitor:**

- Browser network tab for callback request
- Browser console for any errors
- Vercel logs for structured error messages
- Final redirect destination (should be `/webapp`)

### Step 4: Test Google Login ⏳

**Prerequisites:**

- Google connection must be created in Auth0 Dashboard
- Google OAuth credentials must be configured
- Management API permissions granted (`read:connections`, `update:connections`)

**Action:** Select "Continue with Google" on Auth0 login page

**Expected:**

- ✅ Redirects to Google OAuth consent screen
- ✅ User authorizes
- ✅ Google redirects back to Auth0
- ✅ Auth0 processes callback
- ✅ Redirects to `/api/auth/callback/auth0`
- ✅ NextAuth processes callback (with Management API fallback if needed)
- ✅ Creates session
- ✅ Redirects to `/webapp`
- ✅ No redirect loops

**Status:** ⏳ **AWAITING SETUP** - Google connection not yet configured

### Step 5: Test Error Scenarios ⏳

**Error Pages to Test:**

- `/api/auth/error?error=MissingEmail` ✅ (Already tested - working)
- `/api/auth/error?error=MissingAccountOrUser`
- `/api/auth/error?error=MissingToken`
- `/api/auth/error?error=InvalidCallbackUrl`
- `/api/auth/error?error=auth0`

**Expected:**

- ✅ Error page displays correct message
- ✅ Troubleshooting steps visible
- ✅ Diagnostic links work
- ✅ "Try Again" button redirects correctly

**Status:** ⏳ **PARTIALLY TESTED** - MissingEmail tested, others pending

### Step 6: Monitor Error Logs ⏳

**What to Check:**

- Vercel logs for structured error messages
- Look for `[Auth0 JWT]`, `[Auth0 Session]`, `[Auth0 SignIn]` prefixes
- Check for error context objects
- Verify Management API timeout/retry logs

**How to Access:**

- Vercel Dashboard → Project → Deployments → Latest → Functions → View Logs
- Or use Vercel CLI: `vercel logs`

**Status:** ⏳ **AWAITING LOGIN ATTEMPT** - No logs to check yet

## 🔍 Diagnostic Endpoints

### Before Login

**Check Status:**

```bash
# Google connection status
curl https://www.prepflow.org/api/fix/enable-google-connection

# Social connections
curl https://www.prepflow.org/api/test/auth0-social-connections

# Sign-in flow diagnostic
curl https://www.prepflow.org/api/test/auth0-signin-flow
```

### After Login

**Check Session:**

```bash
# Callback diagnostic
curl https://www.prepflow.org/api/test/auth0-callback-diagnostic

# Sign-in flow diagnostic (should show active session)
curl https://www.prepflow.org/api/test/auth0-signin-flow
```

## 🐛 Troubleshooting

### Issue: Redirect Loop

**Symptoms:**

- User redirected back to sign-in page repeatedly
- URL shows `error=auth0` parameter

**Diagnosis:**

1. Check Vercel logs for callback errors
2. Run `/api/test/auth0-signin-flow` diagnostic
3. Check callback URL configuration
4. Verify `NEXTAUTH_URL` environment variable

**Solutions:**

- Verify callback URLs in Auth0 Dashboard
- Check `NEXTAUTH_URL` matches production URL
- Review error logs for specific failure point

### Issue: Missing Email Error

**Symptoms:**

- Error page shows "Missing Email"
- Login fails after Auth0 authentication

**Diagnosis:**

1. Check Vercel logs for `[Auth0 JWT] MissingEmail` error
2. Verify Management API fallback is working
3. Check if user profile has email

**Solutions:**

- Management API fallback should handle this automatically
- Check Auth0 user profile for email
- Verify Management API permissions

### Issue: Google Login Not Available

**Symptoms:**

- No "Continue with Google" button on Auth0 login page
- Google connection status shows disabled

**Solutions:**

1. Create Google connection in Auth0 Dashboard
2. Configure Google OAuth credentials
3. Grant Management API permissions
4. Run `POST /api/fix/enable-google-connection` to auto-enable

## 📊 Test Results Template

```markdown
## Test Date: [DATE]

### Email/Password Login

- [ ] Sign-in page loads
- [ ] Auth0 redirect works
- [ ] Login successful
- [ ] Callback processed
- [ ] Session created
- [ ] Redirect to /webapp works
- [ ] No redirect loops
- [ ] Error logs clean

### Google Login (if enabled)

- [ ] Google button visible
- [ ] Google OAuth works
- [ ] Callback processed
- [ ] Session created
- [ ] Redirect to /webapp works
- [ ] No redirect loops
- [ ] Error logs clean

### Error Handling

- [ ] MissingEmail error page works
- [ ] MissingAccountOrUser error page works
- [ ] MissingToken error page works
- [ ] InvalidCallbackUrl error page works
- [ ] auth0 error page works

### Logs

- [ ] Structured error messages present
- [ ] Error context objects logged
- [ ] Management API calls logged
- [ ] No unexpected errors
```

## ✅ Current Status

**Completed:**

- ✅ Sign-in page loads correctly
- ✅ Auth0 redirect works correctly
- ✅ Callback URLs configured correctly
- ✅ Error page (MissingEmail) works correctly
- ✅ Diagnostic endpoints working

**Pending:**

- ⏳ Complete email/password login flow
- ⏳ Google login (requires setup)
- ⏳ Error scenario testing
- ⏳ Log monitoring

**Next Action:** Complete email/password login and monitor results
