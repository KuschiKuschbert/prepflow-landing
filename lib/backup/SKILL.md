# BACKUP & RECOVERY SKILL

## PURPOSE

Load when working on the backup system: Google Drive integration, scheduled backups, manual backup/restore, backup encryption, or backup settings.

## HOW IT WORKS IN THIS CODEBASE

**Full backup system in `lib/backup/`:**

```
lib/backup/
├── google-drive/    → Google Drive OAuth + file operations
├── export/          → Build backup content (all user tables)
├── restore/         → Parse and restore backup files
├── encryption/      → AES encryption for backup files
└── scheduler/       → Cron-based auto-backup scheduling
```

**Backup flow:**

1. User connects Google Drive at `/webapp/settings/backup`
2. OAuth at `/api/backup/google-auth` → callback at `/api/backup/google-callback`
3. Token stored encrypted (`GOOGLE_TOKEN_ENCRYPTION_KEY`)
4. `POST /api/backup/create` — creates encrypted JSON backup
5. `POST /api/backup/upload-to-drive` — uploads to connected Drive
6. `GET /api/backup/list` — lists local and Drive backups
7. `POST /api/backup/restore` — restores from backup file

**Scheduled backups:**

- Schedule stored in DB via `PUT /api/backup/schedule`
- Cron job runs at `POST /api/backup/cron` (triggered by Vercel cron)
- `CRON_SECRET` env var authenticates the cron request

**Encryption:**

- Backup files are AES-encrypted with `PREPFLOW_BACKUP_ENCRYPTION_KEY`
- Never store or transmit unencrypted backup content

## STEP-BY-STEP: Add a new table to backups

1. Open `lib/backup/export/helpers/getUserTablesWithData.ts`
2. Add the table name to the export list
3. Ensure the table has a `user_id` column (or equivalent scope)
4. Update `lib/backup/restore/helpers/processRestore.ts` to handle the table
5. Test backup + restore cycle in development

## STEP-BY-STEP: Debug a failed restore

1. Check `lib/backup/restore/helpers/processRestore.ts` for validation errors
2. Verify the backup file was decrypted correctly
3. Check that `PREPFLOW_BACKUP_ENCRYPTION_KEY` matches the key used during backup
4. Verify table schemas haven't changed since the backup was created

## GOTCHAS

- **Encryption key mismatch:** If `PREPFLOW_BACKUP_ENCRYPTION_KEY` changes, old backups cannot be restored. Never change this key in production.
- **Google Drive token expiry:** OAuth tokens expire. `lib/backup/google-drive/authentication.ts` handles refresh, but the token may need re-authorization if refresh fails.
- **Restore is destructive** — it deletes existing user data before restoring. Always confirm with the user first.
- **Cron authentication:** `POST /api/backup/cron` requires `CRON_SECRET` header. Vercel cron jobs send this automatically if configured.
- **Large backups:** For users with many ingredients/recipes, backups can be large (>10MB). Use streaming if needed.

## REFERENCE FILES

- `app/api/backup/create/helpers/prepareContent.ts` — backup content builder
- `app/api/backup/restore/helpers/processRestore.ts` — restore logic
- `lib/backup/google-drive/authentication.ts` — OAuth token management
- `lib/backup/export/helpers/getUserTablesWithData.ts` — which tables to back up
- `app/webapp/settings/backup/components/GoogleDriveConnection.tsx` — UI

## RETROFIT LOG

### 2025-02-26 — Batch 5 (integrations)

- No violations found. All files pass: no console.\*, no native dialogs, no rogue breakpoints.

## LAST UPDATED

2025-02-26
