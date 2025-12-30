#!/bin/bash

# Setup script to generate and add secrets to .env.local
# Run this script after creating .env.local from env.example

echo "Generating secrets for .env.local..."

# Generate secrets
AUTH0_SECRET=$(openssl rand -hex 32)
SEED_ADMIN_KEY=$(openssl rand -hex 32)
SQUARE_TOKEN_ENCRYPTION_KEY=$(openssl rand -hex 32)

echo ""
echo "Generated secrets:"
echo "==================="
echo "AUTH0_SECRET=$AUTH0_SECRET"
echo "SEED_ADMIN_KEY=$SEED_ADMIN_KEY"
echo "SQUARE_TOKEN_ENCRYPTION_KEY=$SQUARE_TOKEN_ENCRYPTION_KEY"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "Error: .env.local not found!"
    echo "Please create .env.local from env.example first:"
    echo "  cp env.example .env.local"
    exit 1
fi

# Update .env.local with generated secrets
echo "Updating .env.local with generated secrets..."

# Use sed to replace placeholder values
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s|AUTH0_SECRET=use \`openssl rand -hex 32\`|AUTH0_SECRET=$AUTH0_SECRET|" .env.local
    sed -i '' "s|SEED_ADMIN_KEY=your-seed-admin-key|SEED_ADMIN_KEY=$SEED_ADMIN_KEY|" .env.local
    sed -i '' "s|SQUARE_TOKEN_ENCRYPTION_KEY=your-64-character-hex-encryption-key-here|SQUARE_TOKEN_ENCRYPTION_KEY=$SQUARE_TOKEN_ENCRYPTION_KEY|" .env.local
else
    # Linux
    sed -i "s|AUTH0_SECRET=use \`openssl rand -hex 32\`|AUTH0_SECRET=$AUTH0_SECRET|" .env.local
    sed -i "s|SEED_ADMIN_KEY=your-seed-admin-key|SEED_ADMIN_KEY=$SEED_ADMIN_KEY|" .env.local
    sed -i "s|SQUARE_TOKEN_ENCRYPTION_KEY=your-64-character-hex-encryption-key-here|SQUARE_TOKEN_ENCRYPTION_KEY=$SQUARE_TOKEN_ENCRYPTION_KEY|" .env.local
fi

echo "✅ Secrets have been added to .env.local"
echo ""
echo "Next steps:"
echo "1. Add your Supabase credentials (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY)"
echo "2. Add your Auth0 credentials (AUTH0_ISSUER_BASE_URL, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET)"
echo "3. Add your Stripe credentials (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PRICE_*_MONTHLY)"
echo "4. Run: npm install"
echo "5. Run: npm run dev"



