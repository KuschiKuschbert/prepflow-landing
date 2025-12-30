import { ApiErrorHandler } from '@/lib/api-error-handler';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Client-side Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw ApiErrorHandler.createError(
    'Missing Supabase environment variables. Please check your .env.local file.',
    'DATABASE_ERROR',
    500,
  );
}

/**
 * Global singleton pattern for standard Supabase client
 * This client is used for data only - PrepFlow Auth uses Auth0.
 * We disable Auth to avoid conflicts with other Supabase clients (like POS).
 */
// Client-side Supabase client singleton
const getSupabaseClient = (): SupabaseClient => {
  const globalKey = '__PREPFLOW_SUPABASE_CLIENT__';

  if (typeof window !== 'undefined') {
    if (!(window as any)[globalKey]) {
      (window as any)[globalKey] = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
          storageKey: 'prepflow-auth-storage', // Unique key to avoid conflict with POS
          // Explicitly use a no-op storage to prevent GoTrue instance conflict warnings
          storage: {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          },
        },
      });
    }
    return (window as any)[globalKey];
  }

  if (!(globalThis as any)[globalKey]) {
    (globalThis as any)[globalKey] = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
        storageKey: 'prepflow-auth-storage',
        storage: {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        },
      },
    });
  }
  return (globalThis as any)[globalKey];
};

/**
 * Lazy-initialized Supabase client proxy.
 * This prevents "Multiple GoTrueClient instances" warnings by deferring
 * initialization until the first property access.
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get: (target, prop) => {
    // Prevent initialization on HMR/DevTools/React-Refresh property inspection
    if (
      prop === '$$typeof' ||
      prop === 'prototype' ||
      prop === 'toJSON' ||
      prop === '__esModule' ||
      prop === 'name' ||
      prop === 'displayName' ||
      prop === 'toString' ||
      typeof prop === 'symbol'
    ) {
      return (target as any)[prop];
    }
    const client = getSupabaseClient();
    return (client as any)[prop];
  },
});

// Server-side Supabase client with service role key (only available on server)
export function createSupabaseAdmin() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw ApiErrorHandler.createError(
      'Missing SUPABASE_SERVICE_ROLE_KEY environment variable.',
      'DATABASE_ERROR',
      500,
    );
  }

  return createClient(supabaseUrl as string, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// For backward compatibility, create admin client only on server-side
export const supabaseAdmin = typeof window === 'undefined' ? createSupabaseAdmin() : null;
