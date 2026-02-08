# Quick Migration Guide - Cleaning Tasks

## ⚡ Fastest Way (Manual - 2 minutes)

Since Supabase CLI requires interactive login, here's the fastest way to run the migration:

### Step 1: Get the SQL

Visit this URL in your browser (while dev server is running):

```
http://localhost:3000/api/setup-cleaning-tasks
```

Or open the file directly:

```
migrations/fix-cleaning-tasks-schema.sql
```

### Step 2: Run in Supabase

1. Open https://supabase.com/dashboard
2. Select your project (dulkrqgjfohsuxhsmofo)
3. Click **SQL Editor** (left sidebar)
4. Click **New query**
5. **Paste the SQL** from Step 1
6. Click **Run** (or press Cmd+Enter)

### Step 3: Verify

Check that the migration worked:

```bash
curl -X POST http://localhost:3000/api/setup-cleaning-tasks
```

You should see: `"tablesExist": true`

---

## 🔧 Using Supabase CLI (For Future Migrations)

### One-Time Setup

1. **Login** (opens browser):

   ```bash
   npx supabase login
   ```

2. **Link project**:

   ```bash
   npx supabase link --project-ref dulkrqgjfohsuxhsmofo
   ```

3. **Verify**:
   ```bash
   npm run supabase:status
   ```

### Run Migrations

After setup, you can run migrations easily:

```bash
# Run cleaning tasks migration
npm run supabase:migrate:cleaning

# Or run all migrations
npm run supabase:migrate
```

### Automated Setup Script

Run the setup script (requires interactive terminal):

```bash
bash scripts/setup-supabase.sh
```

---

## ✅ What This Migration Does

- ✅ Adds missing `description` column to `cleaning_tasks`
- ✅ Creates foreign key relationship between `cleaning_tasks` and `cleaning_areas`
- ✅ Adds all required columns (`task_name`, `frequency_type`, etc.)
- ✅ Creates `cleaning_task_completions` table
- ✅ Adds performance indexes
- ✅ Safe to run multiple times (idempotent)

---

## 🐛 Troubleshooting

**"Access token not provided"**

- Run `npx supabase login` in your terminal (not via script)

**"Project is not linked"**

- Run `npx supabase link --project-ref dulkrqgjfohsuxhsmofo`

**Migration fails in SQL Editor**

- Check for syntax errors
- Ensure you're copying the entire SQL
- Check Supabase dashboard logs for details

---

## 📚 More Info

See `docs/SUPABASE_SETUP.md` for complete Supabase CLI documentation.
