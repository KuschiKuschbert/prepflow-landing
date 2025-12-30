# Setup Credentials Guide

After creating `.env.local` from `env.example`, you need to add your credentials.

## Step 1: Generate Secrets

Run the automated script:

```bash
bash scripts/setup-env-secrets.sh
```

Or manually generate and add:

- `AUTH0_SECRET` - Run: `openssl rand -hex 32`
- `SEED_ADMIN_KEY` - Run: `openssl rand -hex 32`
- `SQUARE_TOKEN_ENCRYPTION_KEY` - Run: `openssl rand -hex 32`

## Step 2: Add Supabase Credentials

Get these from: https://app.supabase.com/project/_/settings/api

Update in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Your service_role key (keep secret!)

## Step 3: Add Auth0 Credentials

Get these from: https://manage.auth0.com

Update in `.env.local`:

- `AUTH0_ISSUER_BASE_URL` - Your Auth0 tenant URL (e.g., `https://your-tenant.auth0.com`)
- `AUTH0_CLIENT_ID` - Your Auth0 application client ID
- `AUTH0_CLIENT_SECRET` - Your Auth0 application client secret

**Important:** Also configure Auth0 dashboard:

- Allowed Callback URLs: `http://localhost:3000/api/auth/callback`
- Allowed Logout URLs: `http://localhost:3000` and `http://localhost:3000/`
- Allowed Web Origins: `http://localhost:3000`

See `docs/AUTH0_STRIPE_REFERENCE.md` for complete Auth0 setup.

## Step 4: Add Stripe Credentials

Get these from: https://dashboard.stripe.com

Update in `.env.local`:

- `STRIPE_SECRET_KEY` - Your Stripe secret key (test: `sk_test_...` or live: `sk_live_...`)
- `STRIPE_WEBHOOK_SECRET` - Your webhook signing secret (or use `STRIPE_WEBHOOK_SECRET_DEV` and `STRIPE_WEBHOOK_SECRET_PROD`)
- `STRIPE_PRICE_STARTER_MONTHLY` - Price ID for Starter tier (create product in Stripe dashboard)
- `STRIPE_PRICE_PRO_MONTHLY` - Price ID for Pro tier
- `STRIPE_PRICE_BUSINESS_MONTHLY` - Price ID for Business tier

**Important:** Create products and prices in Stripe dashboard first, then copy the Price IDs.

See `docs/STRIPE_SETUP_CHECKLIST.md` for complete Stripe setup.

## Step 5: Access Control (Already Configured)

For development, `DISABLE_ALLOWLIST=true` is already set in the template, which allows all authenticated users.

To restrict access, set:

- `DISABLE_ALLOWLIST=false`
- `ALLOWED_EMAILS=your-email@example.com,another@example.com`

## Verification

After adding all credentials, verify:

```bash
# Check TypeScript compilation
npm run type-check

# Check for linting errors
npm run lint

# Start development server
npm run dev
```

## Next Steps

1. Set up database schema (if not already done):
   - Run SQL from `database-setup.sql` in Supabase SQL Editor
   - Or use Supabase CLI: `npm run supabase:migrate`

2. Test the application:
   - Visit `http://localhost:3000`
   - Test authentication flow
   - Test database connections




