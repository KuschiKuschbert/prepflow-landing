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

// Declare global types for singleton storage
declare global {
  // eslint-disable-next-line no-var
  var __PREPFLOW_SUPABASE_CLIENT__: SupabaseClient | undefined;
  interface Window {
    __PREPFLOW_SUPABASE_CLIENT__: SupabaseClient | undefined;
  }
}

// Client-side Supabase client singleton
const getSupabaseClient = (): SupabaseClient => {
  const globalKey = '__PREPFLOW_SUPABASE_CLIENT__';

  if (typeof window !== 'undefined') {
    if (!window[globalKey]) {
      window[globalKey] = createClient(supabaseUrl, supabaseAnonKey, {
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
    return window[globalKey]!;
  }

  if (!globalThis[globalKey]) {
    globalThis[globalKey] = createClient(supabaseUrl, supabaseAnonKey, {
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
  return globalThis[globalKey]!;
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
      return target[prop as keyof typeof target];
    }
    const client = getSupabaseClient();
    return client[prop as keyof SupabaseClient];
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

  return createClient(supabaseUrl!, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// For backward compatibility, create admin client only on server-side
export const supabaseAdmin = typeof window === 'undefined' ? createSupabaseAdmin() : null;
