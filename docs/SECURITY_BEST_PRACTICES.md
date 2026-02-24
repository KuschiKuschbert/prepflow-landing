# Security Best Practices

## 🔒 Secrets Management

### **CRITICAL: Never Commit Secrets**

**MANDATORY Rules:**

- ✅ **Never commit** `.env.local` or any file containing real secrets
- ✅ **Always use placeholders** in `env.example` (e.g., `your-api-key-here`)
- ✅ **Never log secrets** - Logger automatically redacts sensitive data
- ✅ **Rotate secrets** if accidentally committed (immediately!)
- ✅ **Use environment variables** for all secrets in production

### **Secrets That Must Be Protected**

1. **Supabase Service Role Key** (`SUPABASE_SERVICE_ROLE_KEY`)
   - ⚠️ **CRITICAL**: Has full database access - never commit or log
   - Get from: Supabase Dashboard → Project Settings → API

2. **Database Passwords** (`DATABASE_URL`)
   - ⚠️ **CRITICAL**: Contains database credentials
   - Use Supabase connection pooling instead when possible

3. **Stripe Keys** (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`)
   - ⚠️ **CRITICAL**: Can access customer payment data
   - Get from: Stripe Dashboard → Developers → API keys

4. **Auth0 Secrets** (`AUTH0_CLIENT_SECRET`, `NEXTAUTH_SECRET`)
   - ⚠️ **CRITICAL**: Controls authentication access
   - Generate with: `openssl rand -base64 32`

5. **API Keys** (Hugging Face, Google OAuth, etc.)
   - ⚠️ **HIGH**: Can incur costs or access user data
   - Store in Vercel environment variables

### **Logger Secret Redaction**

The logger automatically redacts common secret patterns:

- Stripe keys: `sk_live_...`, `sk_test_...`, `pk_...`
- Webhook secrets: `whsec_...`
- JWT tokens: `eyJ...`
- Database URLs with passwords: `postgresql://user:password@host`
- Environment variables: `..._KEY=...`, `..._SECRET=...`
- Hex encryption keys: 64-character hex strings

**Patterns Redacted:**

```typescript
// These will be automatically redacted in logs:
logger.dev('API key:', { key: 'sk_test_abc123...' }); // → '[REDACTED]'
logger.error('Database error:', { url: 'postgresql://user:pass@host' }); // → '[REDACTED]'
```

### **If Secrets Are Accidentally Committed**

**Immediate Actions:**

1. **Rotate the secret immediately** in the service dashboard
2. **Remove from git history** (if possible, but rotation is more important)
3. **Check access logs** for unauthorized access
4. **Update all environments** with new secret

**Git History Cleanup:**

```bash
# Use git-filter-repo or BFG Repo-Cleaner to remove secrets from history
# ⚠️ WARNING: This rewrites git history - coordinate with team first
```

## 🔐 Environment Variables

### **Development (.env.local)**

- ✅ Gitignored (never committed)
- ✅ Contains real secrets for local development
- ✅ Never share or commit

### **Production (Vercel Environment Variables)**

- ✅ Set in Vercel Dashboard → Settings → Environment Variables
- ✅ Separate values for production vs. preview deployments
- ✅ Never log or expose in error messages

### **env.example**

- ✅ **Only placeholders** - no real secrets
- ✅ **Documentation** - shows what variables are needed
- ✅ **Safe to commit** - contains no sensitive data

## 🛡️ Code Security

### **Never Log Secrets**

```typescript
// ❌ BAD - Secrets exposed in logs
logger.error('API call failed', { apiKey: process.env.API_KEY });

// ✅ GOOD - Logger automatically redacts
logger.error('API call failed', { apiKey: process.env.API_KEY }); // → '[REDACTED]'
```

### **Never Include Secrets in Error Messages**

```typescript
// ❌ BAD - Secret in error message
throw new Error(`API key ${apiKey} is invalid`);

// ✅ GOOD - Generic error message
throw new Error('API key is invalid');
```

### **Validate Environment Variables**

```typescript
// ✅ GOOD - Validate at startup
if (!process.env.STRIPE_SECRET_KEY?.startsWith('sk_')) {
  throw new Error('Invalid STRIPE_SECRET_KEY format');
}
```

## 📋 Security Checklist

Before committing code:

- [ ] No `.env.local` files in commit
- [ ] No hardcoded secrets in code
- [ ] `env.example` only has placeholders
- [ ] No secrets in error messages
- [ ] Logger used instead of `console.log` (auto-redacts secrets)
- [ ] Environment variables validated at startup

## 🔄 Secret Rotation Schedule

**Recommended Rotation:**

- **Production secrets**: Every 90 days
- **After exposure**: Immediately
- **Service role keys**: Every 180 days
- **API keys**: Per service provider recommendations

## 🔬 Dependency Vulnerabilities

### **Regular Audits**

- **Weekly:** Run `npm audit` and review results
- **Pre-deploy:** `npm run pre-deploy` runs `npm audit --audit-level=moderate`
- **Fix promptly:** Address high/critical vulnerabilities within 1 sprint

### **minimatch ReDoS (GHSA-3ppc-4f35-3m26)**

**Symptom:** `npm audit` reports 27+ high severity vulnerabilities; Dependabot alerts for minimatch &lt;10.2.1.

**Root Cause:** minimatch &lt;10.2.1 has a ReDoS (Regular Expression Denial of Service) via repeated wildcards. Used transitively by ESLint, Jest, eslint-config-next, test-exclude, and others.

**Fix (package.json overrides):**

```json
"overrides": {
  "minimatch": "^10.2.1",
  "test-exclude": "7.0.2"
}
```

- **minimatch ^10.2.1:** Forces all transitive deps to use the patched version.
- **test-exclude 7.0.2:** test-exclude 6.x required minimatch 5.x (incompatible API); 7.x uses minimatch ^10.2.2 and is compatible with babel-plugin-istanbul ^6.0.0.

**Verification:**

```bash
npm install && npm audit        # Should show 0 vulnerabilities
npm run test:coverage           # Must pass (Jest coverage uses test-exclude)
```

**Derived Rule:** When npm overrides are used for security fixes, verify both `npm audit` and `npm run test:coverage` pass. Prefer upgrading to fixed package versions over long-term pinning of vulnerable versions.

**Reference:** [GHSA-3ppc-4f35-3m26](https://github.com/advisories/GHSA-3ppc-4f35-3m26)

## 📚 Additional Resources

- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
