/**
 * Environment variable validation using Zod.
 * Imported at module level in app/layout.tsx so the app fails fast
 * with a clear error message if required env vars are missing.
 */
import { logger } from '@/lib/logger';
import { z } from 'zod';

const envSchema = z.object({
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Supabase (optional at build - validated at first DB use via lib/supabase.ts)
  // Empty string treated as missing so Vercel build succeeds before env vars are added
  NEXT_PUBLIC_SUPABASE_URL: z.preprocess(
    val => (val === '' || val === undefined ? undefined : val),
    z.string().url().optional(),
  ),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.preprocess(
    val => (val === '' || val === undefined ? undefined : val),
    z.string().min(1).optional(),
  ),
  SUPABASE_SERVICE_ROLE_KEY: z.preprocess(
    val => (val === '' || val === undefined ? undefined : val),
    z.string().min(1).optional(),
  ),

  // Auth0 (optional at build - validated at runtime by Auth0 SDK on first auth request)
  // Empty string treated as missing so builds succeed in CI without full secrets configured
  AUTH0_SECRET: z.preprocess(
    val => (val === '' || val === undefined ? undefined : val),
    z.string().min(32).optional(),
  ),
  AUTH0_BASE_URL: z.preprocess(
    val => (val === '' || val === undefined ? undefined : val),
    z.string().url().optional(),
  ),
  AUTH0_ISSUER_BASE_URL: z.preprocess(
    val => (val === '' || val === undefined ? undefined : val),
    z.string().url().optional(),
  ),
  AUTH0_CLIENT_ID: z.preprocess(
    val => (val === '' || val === undefined ? undefined : val),
    z.string().min(1).optional(),
  ),
  AUTH0_CLIENT_SECRET: z.preprocess(
    val => (val === '' || val === undefined ? undefined : val),
    z.string().min(1).optional(),
  ),

  // Stripe (required for billing — optional fields default to empty)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRICE_STARTER_MONTHLY: z.string().optional(),
  STRIPE_PRICE_PRO_MONTHLY: z.string().optional(),
  STRIPE_PRICE_BUSINESS_MONTHLY: z.string().optional(),

  // Resend (email)
  RESEND_API_KEY: z.string().optional(),
});

// Parse and validate — throws a ZodError with field-level messages on failure
const _parsed = envSchema.safeParse(process.env);

if (!_parsed.success) {
  const missing = _parsed.error.issues
    .map(issue => `  • ${issue.path.join('.')}: ${issue.message}`)
    .join('\n');

  // In production this is a fatal error — the app must not start with missing config
  // In development we warn so devs can work locally with a partial .env.local
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      `[env] Missing or invalid required environment variables:\n${missing}\n\nCheck your Vercel environment variable configuration.`,
    );
  } else {
    logger.warn(
      `[env] Missing or invalid environment variables (non-fatal in development):\n${missing}`,
    );
  }
}

export const env = (_parsed.success ? _parsed.data : process.env) as z.infer<typeof envSchema>;

// In production, warn loudly if Stripe price IDs are not configured.
// Checkout will return 501 for any tier that is missing its price ID.
if (process.env.NODE_ENV === 'production') {
  const stripePriceVars = [
    'STRIPE_PRICE_STARTER_MONTHLY',
    'STRIPE_PRICE_PRO_MONTHLY',
    'STRIPE_PRICE_BUSINESS_MONTHLY',
  ] as const;

  const missingStripePrices = stripePriceVars.filter(v => !process.env[v]);
  if (missingStripePrices.length > 0) {
    logger.warn(
      `[env] WARNING: The following Stripe price IDs are not configured in production:\n` +
        missingStripePrices.map(v => `  • ${v}`).join('\n') +
        `\n  Checkout sessions for those tiers will fail with 501. Set them in Vercel environment variables.`,
    );
  }
}
