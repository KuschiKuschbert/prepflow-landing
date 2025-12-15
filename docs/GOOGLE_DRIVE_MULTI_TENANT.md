# Google Drive Multi-Tenant Implementation

## Overview

The Google Drive backup system has been enhanced for multi-tenant support, ensuring each user's data is properly isolated and secured.

## Key Multi-Tenant Features

### 1. **Secure OAuth State Verification**

**Problem:** Previously, the OAuth callback used the `state` parameter directly as the user ID, which could be manipulated.

**Solution:**

- Generate secure state tokens with user ID, timestamp, and nonce
- Verify state token matches authenticated user session
- Prevent state token replay attacks with expiration (10 minutes)

**Implementation:**

- `generateSecureState()` - Creates encrypted state token
- `verifySecureState()` - Validates and extracts user ID
- Callback endpoint verifies state matches authenticated session

### 2. **Per-User Folder Organization**

**Problem:** All backups were uploaded to root folder, making it hard to organize and potentially exposing user data.

**Solution:**

- Create folder structure: `PrepFlow Backups/User: {userId}/`
- Each user's backups are isolated in their own folder
- Automatic folder creation on first backup

**Folder Structure:**

```
PrepFlow Backups/
├── User: user1@example.com/
│   ├── prepflow-backup-2025-01-20.pfbk
│   └── prepflow-backup-2025-01-21.pfbk
├── User: user2@example.com/
│   └── prepflow-backup-2025-01-20.pfbk
└── ...
```

### 3. **Token Encryption**

**Problem:** Refresh tokens were stored as plaintext in the database.

**Solution:**

- AES-256-GCM encryption for all refresh tokens
- Separate encryption key (`GOOGLE_TOKEN_ENCRYPTION_KEY`)
- Automatic encryption/decryption on storage/retrieval

**Security:**

- Tokens encrypted at rest in database
- Uses Web Crypto API (AES-256-GCM)
- Separate key from backup encryption key

### 4. **User Isolation**

**All operations are user-scoped:**

- ✅ Tokens stored per user (`user_id` column)
- ✅ Authentication verified per user
- ✅ Backups uploaded to user-specific folders
- ✅ Backup listing filtered by user folder
- ✅ Disconnect only affects current user

## Implementation Details

### Token Encryption

**File:** `lib/backup/token-encryption.ts`

- `encryptToken()` - Encrypts refresh tokens before storage
- `decryptToken()` - Decrypts tokens when retrieving
- Uses AES-256-GCM with random IV per token
- Base64 encoded for database storage

### Secure State Management

**File:** `lib/backup/google-drive.ts`

- `generateSecureState()` - Creates secure state token
- `verifySecureState()` - Validates state token
- State includes: userId, timestamp, nonce
- 10-minute expiration prevents replay attacks

### Per-User Folders

**File:** `lib/backup/google-drive.ts`

- `ensureUserBackupFolder()` - Creates/finds user folder
- Folder naming: `User: {sanitized-email}`
- Parent folder: `PrepFlow Backups`
- Automatic creation on first upload

### Callback Security

**File:** `app/api/backup/google-callback/route.ts`

- Verifies user is authenticated via session
- Validates state token matches authenticated user
- Prevents user ID manipulation attacks
- Proper error handling and logging

## Environment Variables

Add to `.env.local`:

```bash
# Google OAuth2 Credentials
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/backup/google-callback

# Token Encryption Key (separate from backup encryption)
GOOGLE_TOKEN_ENCRYPTION_KEY=your-64-character-hex-key-here
```

**Generate token encryption key:**

```bash
openssl rand -hex 32
```

## Security Improvements

### Before (Single-Tenant Issues)

1. ❌ State parameter used directly as user ID (manipulatable)
2. ❌ Tokens stored as plaintext
3. ❌ All backups in root folder
4. ❌ No user verification in callback

### After (Multi-Tenant Secure)

1. ✅ Secure state tokens with verification
2. ✅ Encrypted token storage
3. ✅ Per-user folder isolation
4. ✅ Session-based user verification
5. ✅ State token expiration
6. ✅ User ID mismatch detection

## Multi-Tenant Flow

### 1. User Initiates Connection

```
User clicks "Connect Google Drive"
  ↓
POST /api/backup/google-auth
  ↓
Generate secure state token (userId + timestamp + nonce)
  ↓
Redirect to Google OAuth with state token
```

### 2. Google OAuth Callback

```
Google redirects to /api/backup/google-callback
  ↓
Verify user session exists
  ↓
Extract userId from state token
  ↓
Verify state userId matches session userId
  ↓
Exchange code for tokens
  ↓
Encrypt refresh token
  ↓
Store encrypted token (user_id scoped)
  ↓
Redirect to settings page
```

### 3. Upload Backup

```
User creates backup
  ↓
Authenticate with user's encrypted token
  ↓
Ensure user folder exists
  ↓
Upload to user-specific folder
  ↓
Store metadata (user_id scoped)
```

### 4. List Backups

```
User requests backup list
  ↓
Authenticate with user's encrypted token
  ↓
Find user's folder
  ↓
List files in user folder only
  ↓
Return user's backups
```

## Database Schema

**Table:** `user_google_tokens`

```sql
CREATE TABLE user_google_tokens (
  id UUID PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL UNIQUE,  -- User isolation
  encrypted_refresh_token TEXT NOT NULL,  -- Encrypted token
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Key Points:**

- `user_id` is UNIQUE - one token per user
- `encrypted_refresh_token` stores encrypted token
- All queries filtered by `user_id`

## Testing Multi-Tenant Setup

### Test User Isolation

1. **User A connects:**
   - Connect Google Drive as user A
   - Verify token stored with `user_id = A`
   - Upload backup → should go to `User: A/` folder

2. **User B connects:**
   - Connect Google Drive as user B
   - Verify token stored with `user_id = B`
   - Upload backup → should go to `User: B/` folder

3. **Verify isolation:**
   - User A lists backups → only sees User A's backups
   - User B lists backups → only sees User B's backups
   - User A cannot access User B's tokens

### Test Security

1. **State manipulation:**
   - Try to modify state parameter in callback URL
   - Should fail with "User ID mismatch" error

2. **Token access:**
   - User A tries to use User B's token
   - Should fail - tokens are user-scoped

3. **Folder isolation:**
   - Verify backups in correct user folders
   - Verify users can't see other users' folders

## Migration Notes

### Existing Users

If you have existing users with Google Drive connected:

1. **Token Encryption:**
   - Existing tokens are stored as plaintext
   - On next token refresh, they'll be encrypted
   - Or manually re-connect to encrypt existing tokens

2. **Folder Migration:**
   - Existing backups are in root folder
   - New backups go to user folders
   - Consider migration script to move existing backups

### Migration Script (Optional)

```typescript
// Script to migrate existing backups to user folders
async function migrateBackupsToUserFolders() {
  // 1. List all backups in root folder
  // 2. Extract userId from backup metadata
  // 3. Move to user-specific folder
  // 4. Update database records
}
```

## Best Practices

1. **Never trust state parameter alone** - Always verify against session
2. **Encrypt all sensitive data** - Tokens, passwords, etc.
3. **Isolate user data** - Folders, tokens, backups per user
4. **Log security events** - State mismatches, token failures
5. **Rotate encryption keys** - Periodically rotate `GOOGLE_TOKEN_ENCRYPTION_KEY`

## Troubleshooting

### "User ID mismatch" error

- **Cause:** State token doesn't match authenticated user
- **Solution:** Re-initiate OAuth flow (state token may have expired)

### "Failed to decrypt token" error

- **Cause:** Encryption key changed or token corrupted
- **Solution:** User needs to reconnect Google Drive

### Backups in wrong folder

- **Cause:** Folder creation failed or user ID changed
- **Solution:** Check folder creation logs, verify user ID format

## Summary

The Google Drive implementation is now fully multi-tenant ready with:

✅ **Secure OAuth flow** - State verification prevents manipulation
✅ **Encrypted tokens** - Refresh tokens encrypted at rest
✅ **User isolation** - Per-user folders and token storage
✅ **Session verification** - Callback verifies authenticated user
✅ **Proper error handling** - Clear errors for security issues

Each user's Google Drive connection is completely isolated and secure.

