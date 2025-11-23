#!/bin/bash

# Supabase Migration Script for Cleaning Tasks
# This script handles login, linking, and migration execution

set -e

PROJECT_REF="dulkrqgjfohsuxhsmofo"
MIGRATION_FILE="supabase/migrations/20251122103654_fix_cleaning_tasks_schema.sql"

echo "🚀 Supabase Cleaning Tasks Migration"
echo "====================================="
echo ""

# Check if migration file exists
if [ ! -f "$MIGRATION_FILE" ]; then
    echo "❌ Migration file not found: $MIGRATION_FILE"
    exit 1
fi

echo "✅ Migration file found: $MIGRATION_FILE"
echo ""

# Step 1: Check if logged in
echo "Step 1: Checking Supabase login..."
if npx supabase projects list &>/dev/null; then
    echo "✅ Already logged in"
else
    echo "❌ Not logged in"
    echo ""
    echo "Please login first:"
    echo "  npx supabase login"
    echo ""
    echo "This will open your browser for authentication."
    read -p "Press Enter after you've logged in (or Ctrl+C to cancel)..."
fi

# Step 2: Check if linked
echo ""
echo "Step 2: Checking project link..."
if [ -f "supabase/.temp/project-ref" ] || npx supabase status &>/dev/null; then
    echo "✅ Project is linked"
else
    echo "❌ Project is not linked"
    echo ""
    echo "Linking to project: $PROJECT_REF"
    npx supabase link --project-ref "$PROJECT_REF"
fi

# Step 3: Push migration
echo ""
echo "Step 3: Pushing migration to Supabase..."
echo "Migration file: $MIGRATION_FILE"
echo ""
npx supabase db push

echo ""
echo "✅ Migration complete!"
echo ""
echo "Verifying..."
npm run supabase:verify:cleaning



