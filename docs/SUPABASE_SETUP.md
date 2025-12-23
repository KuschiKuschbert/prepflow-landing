# Supabase CLI Setup Guide

This guide explains how to set up and use Supabase CLI for database migrations and management.

## Installation

Supabase CLI is installed as a dev dependency:

```bash
npm install
```

Verify installation:

```bash
npx supabase --version
```

## Initial Setup

### 1. Login to Supabase

First, you need to authenticate with Supabase:

```bash
npx supabase login
```

This will open your browser to authenticate. After authentication, you'll be logged in.

### 2. Link Your Project

Link your local project to your Supabase project:

```bash
npm run supabase:link
```

Or manually:

```bash
npx supabase link --project-ref dulkrqgjfohsuxhsmofo
```

The project ref (`dulkrqgjfohsuxhsmofo`) is extracted from your `NEXT_PUBLIC_SUPABASE_URL`.

### 3. Verify Connection

Check if everything is set up correctly:

```bash
npm run supabase:status
```

## Running Migrations

### Run Cleaning Tasks Migration

To run the cleaning tasks migration:

```bash
npm run supabase:migrate:cleaning
```

This will:

1. Copy the migration file from `migrations/fix-cleaning-tasks-schema.sql` to `supabase/migrations/`
2. Push it to your Supabase project using `supabase db push`

### Run All Migrations

To push all migrations in `supabase/migrations/`:

```bash
npm run supabase:migrate
```

## Available Scripts

- `npm run supabase:status` - Check Supabase connection status
- `npm run supabase:migrate` - Push all migrations to Supabase
- `npm run supabase:migrate:cleaning` - Run cleaning tasks migration
- `npm run supabase:migrate:reset` - Reset database (dev only)
- `npm run supabase:diff` - Generate migration from schema differences
- `npm run supabase:generate` - Create a new migration file
- `npm run supabase:link` - Link project to Supabase

## Migration Workflow

### Creating a New Migration

1. Create migration file:

   ```bash
   npm run supabase:generate migration_name
   ```

2. Edit the generated file in `supabase/migrations/`

3. Test locally (if using local Supabase):

   ```bash
   npx supabase start
   npx supabase db reset
   ```

4. Push to remote:
   ```bash
   npm run supabase:migrate
   ```

### Running Existing Migrations

Migrations in `migrations/` directory can be run using:

```bash
npm run supabase:migrate:cleaning
```

Or manually copy them to `supabase/migrations/` and run:

```bash
npm run supabase:migrate
```

## Troubleshooting

### "Access token not provided"

Run `npx supabase login` to authenticate.

### "Project is not linked"

Run `npm run supabase:link` to link your project.

### Migration fails

1. Check Supabase connection: `npm run supabase:status`
2. Verify migration SQL syntax
3. Check Supabase dashboard for error details
4. Run migration manually in Supabase SQL Editor if needed

## Project Structure

```
prepflow-landing/
├── migrations/              # Migration SQL files (source)
│   └── fix-cleaning-tasks-schema.sql
├── supabase/                # Supabase CLI directory (auto-generated)
│   └── migrations/          # Migrations for Supabase CLI
└── scripts/
    └── run-cleaning-migration.js  # Migration runner script
```

## Manual Migration (Alternative)

If CLI setup is not working, you can always run migrations manually:

1. Get SQL: Visit `http://localhost:3000/api/setup-cleaning-tasks`
2. Copy the SQL from the response
3. Open Supabase Dashboard → SQL Editor
4. Paste and run the SQL

## Next Steps

After setting up Supabase CLI:

1. ✅ Login: `npx supabase login`
2. ✅ Link project: `npm run supabase:link`
3. ✅ Run cleaning migration: `npm run supabase:migrate:cleaning`
4. ✅ Verify: Check Supabase dashboard that tables/columns exist




