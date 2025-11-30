#!/bin/bash

# Supabase Setup Script
# This script helps set up Supabase CLI and run migrations

set -e

echo "🚀 Supabase Setup Script"
echo "========================"
echo ""

# Check if Supabase CLI is available
if ! command -v npx &> /dev/null; then
    echo "❌ npx not found. Please install Node.js first."
    exit 1
fi

# Step 1: Login (requires interactive terminal)
echo "Step 1: Login to Supabase"
echo "-------------------------"
echo "This will open your browser for authentication..."
echo ""
read -p "Press Enter to continue with login (or Ctrl+C to skip)..."
npx supabase login

# Step 2: Link project
echo ""
echo "Step 2: Link Supabase Project"
echo "-----------------------------"
PROJECT_REF="dulkrqgjfohsuxhsmofo"
echo "Linking to project: $PROJECT_REF"
npx supabase link --project-ref "$PROJECT_REF"

# Step 3: Check status
echo ""
echo "Step 3: Verify Connection"
echo "-------------------------"
npx supabase status

# Step 4: Run migration
echo ""
echo "Step 4: Run Cleaning Tasks Migration"
echo "------------------------------------"
read -p "Press Enter to run the migration (or Ctrl+C to skip)..."
npm run supabase:migrate:cleaning

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  - Check Supabase dashboard to verify tables were created"
echo "  - Test the cleaning page: http://localhost:3000/webapp/cleaning"







