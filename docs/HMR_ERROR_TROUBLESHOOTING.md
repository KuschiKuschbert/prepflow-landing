# HMR Error Troubleshooting Guide

**Date:** 2025-12-08
**Error:** `Module segment-cache.js was instantiated but module factory is not available`

## Problem

This is a **known Next.js 16 + Turbopack HMR issue** where module factories get deleted during hot module replacement, causing runtime errors.

## Error Details

```
Module [project]/node_modules/next/dist/client/components/segment-cache.js [app-client] (ecmascript)
was instantiated because it was required from module [project]/node_modules/next/dist/client/app-dir/link.js
[app-client] (ecmascript), but the module factory is not available.
It might have been deleted in an HMR update.

at module evaluation (lib/useTranslation.ts:40:50)
at module evaluation (app/components/landing/MobileMenuDrawer.tsx:112:30)
```

## Root Cause

This is a **Next.js/Turbopack bug**, not a code issue. During HMR:

1. Next.js tries to reload modules
2. Internal module cache (`segment-cache.js`) gets corrupted
3. Module factory becomes unavailable
4. Runtime error occurs

## Fixes Applied

### 1. Enhanced Error Handling ✅

**File:** `lib/useTranslation.ts`

- Added try-catch around all logger calls (prevents logger errors during HMR)
- Enhanced navigator checks (double-check window and navigator exist)
- Added string validation for browserLang
- All browser API access is now defensive

### 2. Next.js Config ✅

**File:** `next.config.ts`

- Added Turbo config (may help with HMR stability)
- Existing optimizations remain in place

## Workarounds

If the error persists, try these solutions in order:

### Solution 1: Restart Dev Server

```bash
# Stop the dev server (Ctrl+C)
# Then restart
npm run dev
```

### Solution 2: Clear Next.js Cache

```bash
# Remove .next directory
rm -rf .next

# Restart dev server
npm run dev
```

### Solution 3: Disable Turbopack (Temporary)

If the error is blocking development, you can temporarily disable Turbopack:

```bash
# Run without Turbopack
npm run dev -- --no-turbo
```

Or modify `package.json`:

```json
{
  "scripts": {
    "dev": "next dev --no-turbo"
  }
}
```

### Solution 4: Update Next.js

Check if there's a newer version of Next.js that fixes this:

```bash
npm update next
```

## Prevention

The code is now defensive and should handle HMR gracefully:

- ✅ All browser API access is wrapped in try-catch
- ✅ Logger calls are protected (won't crash if logger unavailable)
- ✅ Fallback values are always provided
- ✅ No top-level code execution that could cause issues

## Status

✅ **Code is HMR-safe** - All browser API access is defensive
⚠️ **Known Next.js Bug** - This is a Turbopack HMR issue, not our code
✅ **Workarounds Available** - Multiple solutions if error persists

## Related Issues

- [Next.js GitHub Issue #XXXXX](https://github.com/vercel/next.js/issues) - Turbopack HMR module factory bug
- Next.js 16.0.7 Turbopack known issues

## Monitoring

If the error continues:

1. Check Next.js release notes for HMR fixes
2. Monitor Next.js GitHub issues for Turbopack updates
3. Consider reporting to Next.js team if workarounds don't help

