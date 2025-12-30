#!/bin/bash

# Complete setup script for PrepFlow project
# Run this after Node.js 22+ is installed

set -e  # Exit on error

echo "🚀 PrepFlow Setup Script"
echo "========================"
echo ""

# Check Node.js version
echo "Checking Node.js version..."
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 22 ]; then
    echo "❌ Error: Node.js 22+ required. Current version: $(node --version)"
    echo "Please install Node.js 22+ first. See SETUP_INSTRUCTIONS.md"
    exit 1
fi
echo "✅ Node.js $(node --version) detected"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "Creating .env.local from template..."
    cp env.example .env.local
    echo "✅ Created .env.local"
    echo ""
    echo "⚠️  IMPORTANT: You need to add your credentials to .env.local"
    echo "   See SETUP_CREDENTIALS.md for instructions"
    echo ""
fi

# Generate secrets if not already set
echo "Generating secrets..."
bash scripts/setup-env-secrets.sh
echo ""

# Install dependencies
echo "Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Run type check
echo "Running TypeScript type check..."
if npm run type-check; then
    echo "✅ Type check passed"
else
    echo "⚠️  Type check found errors (this is okay if credentials aren't set yet)"
fi
echo ""

# Run lint
echo "Running linter..."
if npm run lint; then
    echo "✅ Lint passed"
else
    echo "⚠️  Lint found errors (fix these before committing)"
fi
echo ""

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Add your credentials to .env.local (see SETUP_CREDENTIALS.md)"
echo "2. Set up database schema (see docs/SUPABASE_SETUP.md)"
echo "3. Start dev server: npm run dev"
echo ""



