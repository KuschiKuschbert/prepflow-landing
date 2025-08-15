# Memberstack Setup Guide

## Prerequisites
1. A Memberstack account (sign up at [memberstack.com](https://memberstack.com))
2. A project created in your Memberstack dashboard

## Environment Variables

Create a `.env.local` file in your project root with:

```bash
# Memberstack Configuration
NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY=your_memberstack_public_key_here
```

## Getting Your Public Key

1. Log into your Memberstack dashboard
2. Go to your project settings
3. Copy the "Public Key" from the API section
4. Paste it in your `.env.local` file

## Features Implemented

### Authentication Pages
- **Login**: `/auth` - Sign in with existing account
- **Signup**: `/auth` - Create new account (tabbed interface)

### Components
- `LoginForm` - Email/password login
- `SignupForm` - Email/password registration
- `ProtectedRoute` - Route protection for authenticated users
- `UserProfile` - Display user info and logout

### Integration
- MemberstackProvider wraps the entire app
- Authentication state available throughout the app
- Automatic redirects for unauthenticated users

## Usage Examples

### Protect a Route
```tsx
import ProtectedRoute from '../components/auth/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>Your protected content here</div>
    </ProtectedRoute>
  );
}
```

### Check Authentication Status
```tsx
import { useMemberstack } from '@memberstack/react';

export default function MyComponent() {
  const { member, isLoading } = useMemberstack();
  
  if (isLoading) return <div>Loading...</div>;
  if (!member) return <div>Please sign in</div>;
  
  return <div>Welcome, {member.email}!</div>;
}
```

## Next Steps

1. Set up your environment variables
2. Configure your Memberstack project settings
3. Test authentication flow
4. Customize the UI to match your brand
5. Add additional protected routes as needed

## Support

For Memberstack-specific issues, check their [documentation](https://docs.memberstack.com/).
For implementation questions, refer to the component code and this guide.
