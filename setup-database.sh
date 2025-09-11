#!/bin/bash

echo "🚀 PrepFlow Database Setup Script"
echo "=================================="
echo ""

echo "📋 Step 1: Create Database Tables"
echo "1. Go to your Supabase dashboard: https://supabase.com/dashboard"
echo "2. Select your project: dulkrqgjfohsuxhsmofo"
echo "3. Navigate to SQL Editor"
echo "4. Copy and paste the contents of setup-database.sql"
echo "5. Click 'Run' to execute the SQL script"
echo ""

echo "⏳ Waiting for you to complete the database setup..."
echo "Press Enter when you've run the SQL script in Supabase..."
read -p ""

echo ""
echo "📊 Step 2: Populate Sample Data"
echo "Running sample data population..."

# Wait for server to be ready
sleep 2

# Populate sample data
echo "Creating sample performance data..."
curl -X POST http://localhost:3000/api/sample-performance-data

echo ""
echo "✅ Database setup complete!"
echo "You can now test the performance page at: http://localhost:3000/webapp/performance"
