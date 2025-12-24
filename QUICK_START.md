# Quick Start Guide

Welcome to PrepFlow! Follow these steps to get up and running.

## Prerequisites

- Node.js 22+ (see `SETUP_INSTRUCTIONS.md` if not installed)
- Supabase account and project
- Auth0 account (for authentication)
- Stripe account (for payments)

## Setup Steps

### 1. Install Node.js 22+

If Node.js is not installed:

```bash
# Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc  # or ~/.zshrc
nvm install 22
nvm use 22

# Verify
node --version  # Should show v22.x.x
```

See `SETUP_INSTRUCTIONS.md` for other installation methods.

### 2. Run Complete Setup Script

```bash
bash scripts/complete-setup.sh
```

This will:

- ✅ Verify Node.js version
- ✅ Create `.env.local` from template
- ✅ Generate secrets automatically
- ✅ Install all dependencies
- ✅ Run type check and lint

### 3. Add Your Credentials

Edit `.env.local` and add your credentials:

**Required:**

- Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

**For Full Setup:**

- Auth0: `AUTH0_ISSUER_BASE_URL`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`
- Stripe: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_*_MONTHLY`

See `SETUP_CREDENTIALS.md` for detailed instructions.

### 4. Set Up Database Schema

Run the database setup SQL in Supabase SQL Editor:

- Open `database-setup.sql`
- Copy and paste into Supabase SQL Editor
- Run the SQL

Or use Supabase CLI:

```bash
npm run supabase:migrate
```

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Verification

Run verification steps:

```bash
npm run type-check  # Check TypeScript
npm run lint        # Check code quality
npm run dev         # Start server
```

See `VERIFICATION_STEPS.md` for detailed verification.

## Documentation

- **Setup Instructions**: `SETUP_INSTRUCTIONS.md` - Node.js installation
- **Credentials Setup**: `SETUP_CREDENTIALS.md` - Complete credentials guide
- **Verification**: `VERIFICATION_STEPS.md` - How to verify everything works
- **Setup Summary**: `SETUP_SUMMARY.md` - Overview of what's been set up

## Troubleshooting

### Node.js Not Found

- Install Node.js 22+ (see `SETUP_INSTRUCTIONS.md`)
- Verify with `node --version`

### Dependencies Won't Install

- Check Node.js version (must be 22+)
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

### Type Check Errors

- Some errors are expected if credentials aren't set yet
- Add your credentials to `.env.local`
- Run `npm install` to ensure all dependencies are installed

### Server Won't Start

- Check `.env.local` exists and has required variables
- Check port 3000 is available
- Check console for specific error messages

## Next Steps

1. ✅ Complete setup (this guide)
2. ✅ Add credentials (`SETUP_CREDENTIALS.md`)
3. ✅ Set up database schema
4. ✅ Start developing!

## Need Help?

- Check the documentation in `docs/` directory
- See `SETUP_CREDENTIALS.md` for credential setup
- See `VERIFICATION_STEPS.md` for troubleshooting

Happy coding! 🚀
