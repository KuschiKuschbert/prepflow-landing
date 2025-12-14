# Fix Auth0 Profile Endpoint 404 and Verify Name Data Flow

## Problem

1. **404 Error:** `/auth/profile` endpoint doesn't exist, causing repeated 404 errors in console
2. **Name Display Issue:** Initials show "U" and greeting shows "Hi there!" despite name being in database

The 404 might be coming from Auth0 SDK or a library trying to fetch profile data from a default endpoint.

## Root Cause Investigation

The `/auth/profile` 404 is likely harmless but creates noise. The real issue is that name data isn't flowing through correctly. With the logging we added, we should be able to see:

- Is `/api/me` returning name data?
- Is `useUserProfile` receiving it?
- Is `NavigationHeader` getting the profile?
- What values are passed to `getDefaultAvatar` and `getUserGreeting`?

## Solution

1. Check browser console for our debug logs to see where data flow breaks
2. Create a stub `/auth/profile` endpoint to silence the 404 (optional)
3. Fix any issues found in the data flow

## Implementation Steps

### 1. Check Browser Console Logs

**Action:** User should check browser console (F12) for our debug logs:

- `[API /me]` logs - Should show `first_name: "Daniel"`, `last_name: "Kuschmierz"`
- `[useUserProfile]` logs - Should show profile data being set
- `[NavigationHeader]` logs - Should show profile received and computed values
- `[getDefaultAvatar]` logs - Should show `first_name: "Daniel"`, `last_name: "Kuschmierz"` and return "DK"
- `[getUserGreeting]` logs - Should show `first_name: "Daniel"` and return "Hi, Daniel!"

### 2. Create /auth/profile Endpoint (Optional - to silence 404)

**File:** `app/auth/profile/route.ts` (new file)

**Purpose:** Stub endpoint that returns user info or redirects to `/api/me` to prevent 404 errors.

**Implementation:**

```typescript
import { getUserFromRequest } from '@/lib/auth0-api-helpers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Redirect to /api/me which is our actual profile endpoint
  // Or return basic user info from session
  const authUser = await getUserFromRequest(req);
  if (!authUser) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Return basic user info (or redirect to /api/me)
  return NextResponse.json({
    user: {
      email: authUser.email,
      name: authUser.name,
    },
  });
}
```

### 3. Fix Based on Logs

Once we see the console logs, we can identify where the data flow breaks and fix it.

## Data Flow to Verify

```
/api/me → Returns { user: { first_name: "Daniel", last_name: "Kuschmierz" } }
    ↓
useUserProfile → Receives data, sets profile state
    ↓
NavigationHeader → Receives profile, computes userName and defaultInitials
    ↓
getDefaultAvatar({ first_name: "Daniel", last_name: "Kuschmierz" }) → Returns "DK"
    ↓
getUserGreeting({ first_name: "Daniel" }) → Returns "Hi, Daniel!"
    ↓
UserAvatarButton/UserMenu → Displays initials and greeting
```

## Testing Checklist

- [ ] Check browser console for `[API /me]` logs showing name data
- [ ] Check `[useUserProfile]` logs showing profile state updates
- [ ] Check `[NavigationHeader]` logs showing computed values
- [ ] Check `[getDefaultAvatar]` logs showing input and return value
- [ ] Check `[getUserGreeting]` logs showing input and return value
- [ ] Identify where data is null/undefined
- [ ] Fix the identified issue
- [ ] Create `/auth/profile` endpoint to silence 404 (optional)

## Files to Modify

1. `app/auth/profile/route.ts` - New stub endpoint (optional, to silence 404)
2. Fix any issues found based on console logs

## Notes

- The `/auth/profile` 404 is likely harmless but creates console noise
- The real issue is the name data not displaying correctly
- Our logging should reveal where the data flow breaks
- Once we see the logs, we can fix the actual issue
- The 404 might be coming from Auth0 SDK trying to fetch profile from a default endpoint
