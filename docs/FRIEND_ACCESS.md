# Friend Access Guide - PrepFlow Shared Workspace

## Overview

PrepFlow is currently configured as a **shared workspace** for testing purposes. This means all authenticated users can access the same data - ingredients, recipes, menu dishes, and all other features are shared between all users.

## Access Requirements

### Authentication

- All users must authenticate via Auth0
- Users can sign up or log in using their email address
- Authentication is required to access `/webapp` routes

### Allowlist Configuration

The allowlist can be configured in three ways:

#### Option 1: Development Mode (Default)

- In development mode (`NODE_ENV=development`), all authenticated users are automatically allowed
- No configuration needed
- Perfect for local testing

#### Option 2: Disable Allowlist

- Set `DISABLE_ALLOWLIST=true` in environment variables
- All authenticated users can access the app
- Useful for testing/friend access in production

#### Option 3: Email Allowlist

- Add friends' emails to `ALLOWED_EMAILS` environment variable
- Format: `email1@example.com,email2@example.com,email3@example.com`
- Only specified emails can access
- Most secure option for production

## Configuration

### Local Development

Add to `.env.local`:

```bash
# Option 1: Development mode (default - allowlist automatically bypassed)
NODE_ENV=development

# Option 2: Disable allowlist explicitly
DISABLE_ALLOWLIST=true

# Option 3: Add friends' emails to allowlist
ALLOWED_EMAILS=friend1@example.com,friend2@example.com,friend3@example.com
```

### Production (Vercel)

1. Go to Vercel project settings
2. Navigate to Environment Variables
3. Add `DISABLE_ALLOWLIST=true` or update `ALLOWED_EMAILS` with comma-separated emails
4. Redeploy the application

## Shared Workspace Behavior

### What is Shared

- **Ingredients**: All users see and can modify the same ingredients
- **Recipes**: All users see and can modify the same recipes
- **Menu Dishes**: All users see and can modify the same menu dishes
- **Temperature Logs**: All users see the same temperature logs
- **Cleaning Tasks**: All users see the same cleaning tasks
- **Compliance Records**: All users see the same compliance records
- **All Data**: Everything is shared between all users

### Important Notes

1. **Data Conflicts**: Multiple users editing simultaneously may cause conflicts
2. **No Isolation**: Users cannot have private data - everything is visible to everyone
3. **Testing Purpose**: This configuration is intended for testing and friend access only
4. **User Identification**: The current user's name/email is displayed in the navigation header (desktop only)

## How to Test

### For Friends

1. **Sign Up/Login**:
   - Visit the PrepFlow website
   - Click "Sign In" or "Register"
   - Use Auth0 to create an account or log in
   - You'll be redirected to the webapp after authentication

2. **Access Features**:
   - Navigate to `/webapp` to access the dashboard
   - Browse ingredients, recipes, menu dishes
   - Create, edit, and delete data (shared with all users)
   - Test all features normally

3. **User Identification**:
   - Your username/email is displayed in the top-right navigation (desktop)
   - Hover over your name to see your full email address

### For Administrators

1. **Enable Friend Access**:
   - Set `DISABLE_ALLOWLIST=true` in environment variables
   - Or add friends' emails to `ALLOWED_EMAILS`
   - Restart the application

2. **Monitor Usage**:
   - Check Auth0 dashboard for user activity
   - Monitor database for data changes
   - Review logs for any issues

3. **Disable Access**:
   - Remove `DISABLE_ALLOWLIST` or set it to `false`
   - Update `ALLOWED_EMAILS` to remove friend emails
   - Redeploy the application

## Limitations

### Current Limitations

- **No User Isolation**: All users share the same data
- **No Permissions**: All users have the same access level
- **No Audit Trail**: Cannot track which user made which changes (except via Auth0 logs)
- **Data Conflicts**: Simultaneous edits may cause conflicts

### Future Enhancements

- Multi-tenant architecture with user isolation (planned)
- User permissions and roles (planned)
- Audit trails for data changes (planned)
- Conflict resolution for simultaneous edits (planned)

## Troubleshooting

### User Cannot Access App

1. **Check Authentication**:
   - Ensure user is logged in via Auth0
   - Check Auth0 dashboard for user account status

2. **Check Allowlist**:
   - Verify `DISABLE_ALLOWLIST=true` is set (if using Option 2)
   - Verify user's email is in `ALLOWED_EMAILS` (if using Option 3)
   - Verify `NODE_ENV=development` is set (if using Option 1)

3. **Check Environment Variables**:
   - Ensure environment variables are set correctly
   - Restart the application after changing environment variables
   - Check Vercel environment variables for production

### User Sees "Not Authorized" Page

- User's email is not in the allowlist
- Allowlist is enabled but user's email is not configured
- Solution: Add user's email to `ALLOWED_EMAILS` or set `DISABLE_ALLOWLIST=true`

### User Cannot See Data

- Check if user is authenticated (should see username in navigation)
- Check if user has access to `/webapp` routes
- Verify database connection is working
- Check browser console for errors

## Security Considerations

### Current Security

- **Authentication Required**: All users must authenticate via Auth0
- **HTTPS Only**: All traffic should be over HTTPS in production
- **Session Management**: NextAuth handles session management securely
- **Environment Variables**: Sensitive data stored in environment variables

### Recommendations

1. **For Testing**: Use `DISABLE_ALLOWLIST=true` or development mode
2. **For Production**: Use email allowlist with `ALLOWED_EMAILS`
3. **For Friends**: Add friends' emails to allowlist for controlled access
4. **Monitor Access**: Regularly check Auth0 dashboard for user activity

## Support

For issues or questions:

- Check this documentation
- Review environment variable configuration
- Check Auth0 dashboard for authentication issues
- Review application logs for errors

## Next Steps

When ready for production with user isolation:

1. Implement multi-tenant architecture
2. Add user_id columns to all tables
3. Update API routes to filter by user_id
4. Migrate existing data to user-specific workspaces
5. Test user isolation thoroughly

---

**Last Updated**: January 2025
**Status**: Shared Workspace Configuration (Testing Phase)
