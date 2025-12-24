# Data Restoration Guide

## Overview

If data has been accidentally deleted (e.g., by running `/api/populate-clean-test-data`), this guide outlines options for restoring your data.

## Restoration Options

### Option 1: Supabase Automated Backups (Recommended)

**Supabase provides daily automated backups with 30 days retention.**

#### Steps to Restore from Supabase Backup:

1. **Access Supabase Dashboard**
   - Go to your Supabase project dashboard
   - Navigate to **Settings** → **Database** → **Backups**

2. **Check Available Backups**
   - Supabase maintains daily backups for 30 days
   - Look for a backup timestamp **before** the data was deleted

3. **Point-in-Time Recovery (if available)**
   - If your Supabase plan supports point-in-time recovery:
     - Navigate to **Database** → **Point-in-time Recovery**
     - Select a timestamp before the deletion
     - Initiate restore to that point

4. **Manual SQL Restore (if point-in-time not available)**
   - Download the backup SQL dump from Supabase dashboard
   - Restore specific tables using SQL:

   ```sql
   -- Example: Restore recipes table from backup
   -- (This requires manual SQL execution in Supabase SQL Editor)
   ```

5. **Contact Supabase Support**
   - If backups are not accessible via dashboard
   - Contact Supabase support with:
     - Project reference
     - Approximate time of data loss
     - Tables affected

### Option 2: Re-populate Sample Data

If you were using sample/test data, you can re-populate it using existing endpoints:

#### Restore Recipes and Ingredients:

```bash
# Restore all sample data (WARNING: This will delete existing data first!)
curl -X POST http://localhost:3000/api/populate-clean-test-data

# Or restore only recipes (if endpoint exists)
curl -X POST http://localhost:3000/api/populate-recipes
```

**⚠️ WARNING:** These endpoints may delete existing data before populating. Use with caution.

### Option 3: Manual Data Entry

If you have backups or exports of your data:

1. **Export Format**: Use the `/api/account/export` endpoint (when implemented) to export current data
2. **Import Format**: Manually re-enter data through the UI or create import scripts

### Option 4: Database Transaction Logs

If your database supports transaction logs:

1. Check if Supabase maintains transaction logs
2. Identify the transaction that deleted the data
3. Reverse the transaction (requires database admin access)

## Prevention: Safe Endpoints

To prevent future data loss, use **safe endpoints** that only add data without deleting:

### Safe Endpoint: Add Consumables

```bash
# This endpoint ONLY adds consumables, never deletes existing data
curl -X POST http://localhost:3000/api/ingredients/add-consumables
```

**Features:**

- ✅ Only performs INSERT operations
- ✅ Checks for duplicates before inserting
- ✅ Never deletes or modifies existing data
- ✅ Safe to run multiple times (idempotent)

## Data Loss Prevention Checklist

- [ ] **Always use safe endpoints** for adding data (e.g., `/api/ingredients/add-consumables`)
- [ ] **Avoid destructive endpoints** in production (e.g., `/api/populate-clean-test-data`)
- [ ] **Regular backups**: Verify Supabase backups are running
- [ ] **Test data**: Use separate test database for development
- [ ] **Dry-run mode**: Use `?dry=1` parameter when available to preview operations

## Recovery Time Estimates

- **Supabase Backup Restore**: 15-60 minutes (depending on data size)
- **Re-populate Sample Data**: 1-5 minutes
- **Manual Data Entry**: Hours to days (depending on data volume)

## Support Contacts

- **Supabase Support**: https://supabase.com/support
- **Project Issues**: Check GitHub issues or contact project maintainer

## Related Documentation

- `operations.mdc` - Backup & Recovery procedures
- `app/api/ingredients/add-consumables/route.ts` - Safe consumables endpoint
- `lib/populate-helpers/index.ts` - Data population utilities
