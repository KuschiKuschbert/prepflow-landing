# Verification Steps

After completing setup, verify everything works:

## Prerequisites Check

1. **Node.js 22+ installed**

   ```bash
   node --version  # Should show v22.x.x or higher
   ```

2. **.env.local exists with credentials**
   - Supabase credentials added
   - Auth0 credentials added (if doing full setup)
   - Stripe credentials added (if doing full setup)
   - Secrets generated

## Automated Verification

Run the complete setup script (after Node.js is installed):

```bash
bash scripts/complete-setup.sh
```

This will:

- ✅ Verify Node.js version
- ✅ Create .env.local if missing
- ✅ Generate secrets
- ✅ Install dependencies
- ✅ Run type check
- ✅ Run linter

## Manual Verification Steps

### 1. Type Check

```bash
npm run type-check
```

**Expected:** No TypeScript errors (may have errors if credentials not set yet)

### 2. Lint Check

```bash
npm run lint
```

**Expected:** No linting errors (fix any errors before committing)

### 3. Start Development Server

```bash
npm run dev
```

**Expected:**

- Server starts on `http://localhost:3000`
- No critical errors in console
- Application loads in browser

### 4. Test Database Connection

- Visit `http://localhost:3000/webapp`
- Check if data loads (if database schema is set up)
- Check browser console for errors

### 5. Test Authentication (if Auth0 configured)

- Try to sign in
- Verify callback URL works
- Check session management

## Troubleshooting

### Type Check Fails

- Check if all credentials are set in `.env.local`
- Some type errors may be expected if credentials are missing
- Run `npm install` again if dependencies are missing

### Lint Errors

- Run `npm run format` to auto-fix formatting issues
- Fix remaining errors manually
- Check `eslint.config.mjs` for rule configuration

### Dev Server Won't Start

- Check Node.js version: `node --version` (must be 22+)
- Check if port 3000 is available
- Check `.env.local` for missing required variables
- Check console for specific error messages

### Database Connection Errors

- Verify Supabase credentials in `.env.local`
- Check Supabase dashboard for project status
- Verify database schema is set up (run `database-setup.sql`)

### Authentication Errors

- Verify Auth0 credentials in `.env.local`
- Check Auth0 dashboard for callback URL configuration
- Verify `AUTH0_BASE_URL` matches your local URL

## Success Criteria

✅ All verification steps pass
✅ Development server starts without errors
✅ Application loads in browser
✅ Database connection works (if schema set up)
✅ Authentication works (if Auth0 configured)

## Next Steps After Verification

1. Set up database schema (if not done):
   - Run `database-setup.sql` in Supabase SQL Editor
   - Or use: `npm run supabase:migrate`

2. Test application features:
   - Create ingredients
   - Create recipes
   - Calculate COGS
   - Test authentication flow

3. Start development!



