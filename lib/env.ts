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

  // Supabase (required for all database operations)
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url({ message: 'NEXT_PUBLIC_SUPABASE_URL must be a valid URL' }),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, { message: 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required' }),
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, { message: 'SUPABASE_SERVICE_ROLE_KEY is required' }),

  // Auth0 (required for authentication)
  AUTH0_SECRET: z.string().min(32, {
    message: 'AUTH0_SECRET must be at least 32 characters (run: openssl rand -hex 32)',
  }),
  AUTH0_BASE_URL: z.string().url({ message: 'AUTH0_BASE_URL must be a valid URL' }),
  AUTH0_ISSUER_BASE_URL: z.string().url({ message: 'AUTH0_ISSUER_BASE_URL must be a valid URL' }),
  AUTH0_CLIENT_ID: z.string().min(1, { message: 'AUTH0_CLIENT_ID is required' }),
  AUTH0_CLIENT_SECRET: z.string().min(1, { message: 'AUTH0_CLIENT_SECRET is required' }),

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
