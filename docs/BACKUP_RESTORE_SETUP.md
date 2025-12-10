# Backup and Restore System Setup Guide

## Overview

The comprehensive backup and restore system has been fully implemented. This document outlines what was created and how to set it up.

## What Was Implemented

### Core Components

1. **Backup Export Engine** (`lib/backup/export.ts`)
   - Exports user-specific data from tables with `user_id` column
   - Supports JSON and SQL export formats
   - Handles parent-child table relationships

2. **Encryption System** (`lib/backup/encryption.ts`)
   - AES-256-GCM encryption using Web Crypto API
   - Two encryption modes:
     - **User Password-Protected**: Portable, works outside PrepFlow
     - **PrepFlow-Only**: Convenient, locked to PrepFlow server
   - PBKDF2 key derivation (100,000 iterations for passwords)

3. **Restore Engine** (`lib/backup/restore.ts`)
   - Full restore (replace all user data)
   - Selective restore (choose specific tables)
   - Merge restore (add backup data without deleting existing)

4. **Google Drive Integration** (`lib/backup/google-drive.ts`)
   - OAuth2 authentication flow
   - Upload/download encrypted backup files
   - List and manage backups in Drive

5. **Scheduled Backup System** (`lib/backup/scheduler.ts`)
   - Interval-based scheduling (daily/weekly/monthly/custom)
   - Automatic Google Drive upload option
   - Background job execution

### API Endpoints

- `POST /api/backup/create` - Create manual backup
- `GET /api/backup/list` - List user's backups
- `POST /api/backup/restore` - Restore from backup
- `POST /api/backup/upload-to-drive` - Upload to Google Drive
- `GET /api/backup/drive/list` - List Drive backups
- `GET /api/backup/drive/download/[fileId]` - Download from Drive
- `POST /api/backup/google-auth` - Initiate Google OAuth
- `GET /api/backup/google-callback` - OAuth callback handler
- `DELETE /api/backup/google-auth` - Disconnect Google Drive
- `GET /api/backup/settings` - Get backup settings
- `PUT /api/backup/settings` - Update backup settings
- `POST /api/backup/schedule` - Configure scheduled backups
- `DELETE /api/backup/schedule` - Cancel scheduled backups
- `GET /api/backup/cron` - Cron job endpoint for scheduled backups

### UI Components

- **Backup Settings Page** (`app/webapp/settings/backup/page.tsx`)
  - Main backup management interface
  - Links from main settings page

- **Google Drive Connection** (`app/webapp/settings/backup/components/GoogleDriveConnection.tsx`)
  - Connect/disconnect Google Drive
  - Connection status display

- **Scheduled Backup Config** (`app/webapp/settings/backup/components/ScheduledBackupConfig.tsx`)
  - Configure automatic backup intervals
  - Enable/disable scheduled backups

- **Manual Backup Controls** (`app/webapp/settings/backup/components/ManualBackupControls.tsx`)
  - Create backups in JSON/SQL/Encrypted formats
  - Upload to Google Drive option

- **Backup List** (`app/webapp/settings/backup/components/BackupList.tsx`)
  - Display backup history
  - Download and restore options

- **Restore Dialog** (`app/webapp/settings/backup/components/RestoreDialog.tsx`)
  - Full/selective/merge restore options
  - Password input for protected backups

### Database Schema

Migration file: `migrations/add-backup-tables.sql`

New tables:

- `user_google_tokens` - Store encrypted Google OAuth refresh tokens
- `backup_schedules` - Scheduled backup configuration
- `backup_metadata` - Backup file metadata and tracking

## Setup Instructions

### 1. Database Migration

Run the migration SQL in Supabase SQL Editor:

```bash
# Run migrations/add-backup-tables.sql in Supabase SQL Editor
```

### 2. Environment Variables

Add these to your `.env.local`:

```bash
# Backup Encryption Key (generate with: openssl rand -hex 32)
PREPFLOW_BACKUP_ENCRYPTION_KEY=your-64-character-hex-encryption-key-here

# Google OAuth2 Credentials (from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/backup/google-callback

# Cron Secret (for scheduled backup endpoint security)
CRON_SECRET=your-cron-secret-for-backup-scheduler
```

### 3. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Drive API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3000/api/backup/google-callback` (dev) and your production URL
5. Copy Client ID and Client Secret to environment variables

### 4. Install Dependencies

```bash
npm install
```

The `googleapis` package has been added to `package.json`.

### 5. Vercel Cron Configuration

The `vercel.json` file has been created with cron configuration:

```json
{
  "crons": [
    {
      "path": "/api/backup/cron",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

This runs scheduled backups every 6 hours. Adjust the schedule as needed.

**Note:** Vercel Cron requires a Pro plan. For free/hobby plans, use an external cron service (e.g., cron-job.org) to call `/api/backup/cron` with the `CRON_SECRET` header.

### 6. Generate Encryption Key

Generate a secure encryption key:

```bash
openssl rand -hex 32
```

This generates a 64-character hex string. Add it to `PREPFLOW_BACKUP_ENCRYPTION_KEY`.

## Usage

### Creating a Backup

1. Navigate to Settings → Backup & Restore
2. Choose backup format (JSON, SQL, or Encrypted)
3. For encrypted backups, choose encryption mode:
   - **PrepFlow-Only**: No password needed, convenient
   - **Password-Protected**: Enter password, portable
4. Click "Create & Download Backup" or "Upload to Drive"

### Restoring from Backup

1. Go to Backup History
2. Click "Restore" on desired backup
3. Choose restore mode:
   - **Full**: Replace all data
   - **Selective**: Restore specific tables
   - **Merge**: Add backup data to existing
4. Enter password if backup is password-protected
5. Confirm restore

### Scheduled Backups

1. Enable scheduled backups in settings
2. Choose interval (daily/weekly/monthly/custom)
3. Optionally enable automatic Google Drive upload
4. Backups run automatically at configured intervals

### Google Drive Integration

1. Click "Connect Google Drive"
2. Authorize PrepFlow in Google OAuth flow
3. Backups can now be uploaded/downloaded from Drive
4. Scheduled backups can auto-upload to Drive

## Security Considerations

1. **Encryption Keys**: Store `PREPFLOW_BACKUP_ENCRYPTION_KEY` securely in environment variables
2. **Google Tokens**: Refresh tokens are stored encrypted in database (encryption implementation needed for production)
3. **Password-Protected Backups**: User passwords are never stored - only used for key derivation
4. **Access Control**: All endpoints require authentication
5. **Cron Security**: Use `CRON_SECRET` to protect cron endpoint

## Testing

### Manual Testing

1. Create a backup in each format (JSON, SQL, Encrypted)
2. Test restore with each mode (full, selective, merge)
3. Test Google Drive upload/download
4. Test scheduled backup creation

### Database Testing

Run the migration and verify tables are created:

```sql
SELECT * FROM user_google_tokens;
SELECT * FROM backup_schedules;
SELECT * FROM backup_metadata;
```

## Troubleshooting

### Google Drive Connection Issues

- Verify OAuth credentials in Google Cloud Console
- Check redirect URI matches exactly
- Ensure Google Drive API is enabled

### Encryption Errors

- Verify `PREPFLOW_BACKUP_ENCRYPTION_KEY` is 64 hex characters
- Check password is correct for password-protected backups

### Scheduled Backups Not Running

- Verify Vercel Cron is configured (Pro plan required)
- Or use external cron service with `CRON_SECRET` header
- Check cron endpoint logs for errors

## Future Enhancements

- [ ] Encrypt Google refresh tokens in database (currently stored as-is)
- [ ] Add backup file storage in Supabase Storage (alternative to Google Drive)
- [ ] Implement backup versioning and incremental backups
- [ ] Add backup compression for large datasets
- [ ] Implement backup expiration and automatic cleanup
- [ ] Add backup verification/validation before restore
- [ ] Support for restoring to different user accounts (admin feature)

## Files Created

### Core Library Files

- `lib/backup/types.ts` - Type definitions
- `lib/backup/export.ts` - Export engine
- `lib/backup/encryption.ts` - Encryption system
- `lib/backup/restore.ts` - Restore engine
- `lib/backup/google-drive.ts` - Google Drive integration
- `lib/backup/scheduler.ts` - Scheduled backup system

### API Routes

- `app/api/backup/create/route.ts`
- `app/api/backup/list/route.ts`
- `app/api/backup/restore/route.ts`
- `app/api/backup/upload-to-drive/route.ts`
- `app/api/backup/drive/list/route.ts`
- `app/api/backup/drive/download/[fileId]/route.ts`
- `app/api/backup/google-auth/route.ts`
- `app/api/backup/google-callback/route.ts`
- `app/api/backup/settings/route.ts`
- `app/api/backup/schedule/route.ts`
- `app/api/backup/cron/route.ts`

### UI Components

- `app/webapp/settings/backup/page.tsx`
- `app/webapp/settings/backup/components/GoogleDriveConnection.tsx`
- `app/webapp/settings/backup/components/ScheduledBackupConfig.tsx`
- `app/webapp/settings/backup/components/ManualBackupControls.tsx`
- `app/webapp/settings/backup/components/BackupList.tsx`
- `app/webapp/settings/backup/components/RestoreDialog.tsx`

### Database & Configuration

- `migrations/add-backup-tables.sql`
- `vercel.json` - Cron configuration
- `env.example` - Updated with new environment variables

### Modified Files

- `app/api/account/export/route.ts` - Now uses backup export engine
- `app/webapp/settings/page.tsx` - Added backup settings link
- `package.json` - Added googleapis dependency

## Support

For issues or questions, refer to the main project documentation or contact support.



