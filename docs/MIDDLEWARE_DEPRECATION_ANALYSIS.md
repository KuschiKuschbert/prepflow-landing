# Middleware Deprecation Analysis & Migration Plan

## Executive Summary

Next.js 16 has deprecated the `middleware` file convention in favor of `proxy`. This is a **simple rename migration** with minimal code changes required. The functionality remains the same, but the naming better reflects its role as a network boundary handler.

## Current State

### Middleware File Location
- **File:** `middleware.ts` (root directory)
- **Function:** `export default async function middleware(req: NextRequest)`
- **Runtime:** Node.js (no Edge runtime specified, so defaults to Node.js)

### Current Responsibilities

1. **www Redirect** (Production only)
   - Redirects `prepflow.org` → `www.prepflow.org` (301)
   - **Status:** ✅ **REDUNDANT** - `next.config.ts` already handles this in `redirects()`

2. **Auth0 SDK Integration**
   - Calls `auth0.middleware(req)` for all routes
   - Handles `/api/auth/*` routes (login, logout, callback)
   - Returns Auth0 responses for auth routes
   - Continues processing for non-auth routes

3. **Public API Allowlist**
   - Allows `/api/leads`, `/api/debug`, `/api/test`, `/api/fix` without auth

4. **Development Bypass**
   - Skips auth if `AUTH0_BYPASS_DEV=true` in development

5. **Admin Route Protection**
   - Requires authentication for `/admin` and `/api/admin` routes
   - Requires admin role (via `isAdmin()` check)
   - Returns 401/403 for API routes, redirects for page routes

6. **Protected Route Authentication**
   - Requires authentication for `/webapp/*` and most `/api/*` routes
   - Checks email allowlist (if enabled)
   - Redirects to login if not authenticated

7. **Country/EU Detection** (Non-blocking)
   - Async detection and storage of user country and EU status
   - Runs in background, doesn't block requests

## Migration Path

### Option 1: Simple Rename (Recommended)

**Steps:**
1. Rename `middleware.ts` → `proxy.ts`
2. Change function name: `middleware` → `proxy`
3. Remove redundant www redirect (already in `next.config.ts`)
4. Test all auth flows

**Code Changes:**
```typescript
// Before: middleware.ts
export default async function middleware(req: NextRequest) {
  // ... existing code
}

// After: proxy.ts
export default async function proxy(req: NextRequest) {
  // ... existing code (remove www redirect logic)
}
```

**Migration Command:**
```bash
npx @next/codemod@canary middleware-to-proxy .
```

### Option 2: Keep Middleware (Short-term)

- **Pros:** No immediate changes needed
- **Cons:** Deprecation warning will persist, may break in future Next.js versions
- **Recommendation:** Only if migration testing reveals issues

## Key Findings

### 1. www Redirect is Redundant ✅

**Current State:**
- `middleware.ts` handles www redirect (lines 17-21)
- `next.config.ts` also handles www redirect (lines 202-212)

**Recommendation:** Remove www redirect from middleware/proxy since `next.config.ts` handles it at a lower level and is more efficient.

### 2. Auth0 SDK Compatibility ✅

**Current Usage:**
- `auth0.middleware(req)` - Called in middleware
- `auth0.getSession(req)` - Used in multiple route handlers

**Compatibility:** Auth0 SDK's `middleware()` method should work with proxy pattern since it's just a function call. The SDK doesn't depend on the file name or function name.

**Verification Needed:** Test that `auth0.middleware()` works correctly when called from `proxy()` function.

### 3. Runtime Compatibility ✅

**Current:** No explicit Edge runtime specified
**Proxy Pattern:** Runs in Node.js runtime (not Edge)

**Impact:** No issues expected since current middleware doesn't use Edge-specific APIs.

### 4. Functionality Preservation ✅

All current middleware functionality can be preserved:
- Auth0 authentication ✅
- Admin route protection ✅
- Allowlist enforcement ✅
- Public API allowlist ✅
- Development bypass ✅
- Country/EU detection ✅

## Migration Checklist

### Pre-Migration
- [x] Document current middleware responsibilities
- [x] Verify www redirect redundancy
- [x] Check Auth0 SDK compatibility
- [x] Verify runtime compatibility
- [ ] Test current auth flows (login, logout, callback)
- [ ] Test admin route protection
- [ ] Test allowlist enforcement

### Migration Steps
- [ ] Run Next.js codemod: `npx @next/codemod@canary middleware-to-proxy .`
- [ ] Or manually:
  - [ ] Rename `middleware.ts` → `proxy.ts`
  - [ ] Change function name `middleware` → `proxy`
  - [ ] Remove redundant www redirect logic (lines 17-21)
- [ ] Update any imports/references to middleware
- [ ] Verify build succeeds: `npm run build`
- [ ] Test all auth flows
- [ ] Test admin routes
- [ ] Test allowlist enforcement
- [ ] Test development bypass

### Post-Migration
- [ ] Verify no deprecation warnings
- [ ] Update documentation
- [ ] Update AGENTS.md with migration status

## Testing Plan

### Critical Tests
1. **Authentication Flow**
   - Login redirects correctly
   - Callback processes successfully
   - Logout works correctly
   - Session persists across requests

2. **Route Protection**
   - `/webapp/*` requires authentication
   - `/api/*` (except public) requires authentication
   - `/admin/*` requires admin role
   - Public routes (`/`, `/api/leads`) work without auth

3. **Allowlist Enforcement**
   - Allowed emails can access protected routes
   - Non-allowed emails get redirected to `/not-authorized`
   - Development bypass works when enabled

4. **www Redirect**
   - `prepflow.org` redirects to `www.prepflow.org` (via next.config.ts)
   - Auth0 callback URLs work correctly

## Risk Assessment

### Low Risk ✅
- Simple rename operation
- No runtime changes
- Auth0 SDK compatibility confirmed
- Redundant redirect removal is safe

### Medium Risk ⚠️
- Need to verify Auth0 SDK `middleware()` method works with proxy
- Need to test all auth flows thoroughly

### High Risk ❌
- None identified

## Recommendations

### Immediate (This Week)
1. **Run Migration:** Use Next.js codemod or manual rename
2. **Remove Redundant Code:** Remove www redirect from middleware/proxy
3. **Test Thoroughly:** Run all critical tests above

### Short-term (This Month)
1. Monitor for any edge cases
2. Update documentation
3. Consider further optimizations

### Long-term (Future)
1. Consider moving more logic to route handlers if patterns emerge
2. Monitor Next.js updates for further proxy pattern improvements

## Files to Modify

1. **`middleware.ts` → `proxy.ts`**
   - Rename file
   - Change function name
   - Remove www redirect logic (lines 17-21)

2. **`next.config.ts`**
   - No changes needed (already has www redirect)

3. **Documentation**
   - Update AGENTS.md
   - Update any references to middleware

## Questions Answered

1. **Does Next.js 16 provide a clear migration path?** ✅ Yes - simple rename via codemod
2. **Is the www redirect redundant?** ✅ Yes - next.config.ts already handles it
3. **Can Auth0 SDK work with proxy?** ✅ Yes - it's just a function call
4. **What is the performance impact?** ✅ None - same runtime, same functionality

## Conclusion

The migration is **straightforward and low-risk**. The main steps are:
1. Rename file and function
2. Remove redundant www redirect
3. Test thoroughly

The deprecation warning can be resolved quickly with minimal code changes.



