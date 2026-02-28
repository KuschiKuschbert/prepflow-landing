import { ApiErrorHandler } from '@/lib/api-error-handler';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Declare global types for singleton storage
declare global {
  var __PREPFLOW_SUPABASE_CLIENT__: SupabaseClient | undefined;
  interface Window {
    __PREPFLOW_SUPABASE_CLIENT__: SupabaseClient | undefined;
  }
}

/**
 * Get Supabase URL and anon key. Validation is deferred to first use so the
 * build can succeed when env vars are not yet configured (e.g. Vercel build
 * before env vars are added). Runtime calls will throw if vars are missing.
 */
function getSupabaseConfig(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw ApiErrorHandler.createError(
      'Missing Supabase environment variables. Please check your .env.local file or Vercel Environment Variables.',
      'DATABASE_ERROR',
      500,
    );
  }
  return { url, anonKey };
}

// Client-side Supabase client singleton (lazy - validates env on first use)
const getSupabaseClient = (): SupabaseClient => {
  const globalKey = '__PREPFLOW_SUPABASE_CLIENT__';
  const { url, anonKey } = getSupabaseConfig();

  if (typeof window !== 'undefined') {
    if (!window[globalKey]) {
      window[globalKey] = createClient(url, anonKey, {
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
    globalThis[globalKey] = createClient(url, anonKey, {
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
// Lazy - only validates and creates client when first used (allows build to succeed without env vars)
export function createSupabaseAdmin() {
  const { url } = getSupabaseConfig();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw ApiErrorHandler.createError(
      'Missing SUPABASE_SERVICE_ROLE_KEY environment variable.',
      'DATABASE_ERROR',
      500,
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// Lazy admin client - only created on first property access (allows build to succeed without env vars)
let _supabaseAdmin: SupabaseClient | null | undefined = undefined;

function getSupabaseAdmin(): SupabaseClient | null {
  if (typeof window !== 'undefined') return null;
  if (_supabaseAdmin !== undefined) return _supabaseAdmin;
  try {
    _supabaseAdmin = createSupabaseAdmin();
    return _supabaseAdmin;
  } catch {
    _supabaseAdmin = null;
    return null;
  }
}

const adminProxy = new Proxy({} as SupabaseClient, {
  get: (_target, prop) => {
    const client = getSupabaseAdmin();
    if (!client) {
      throw new Error(
        'Missing Supabase environment variables. Please check Vercel Environment Variables.',
      );
    }
    return client[prop as keyof SupabaseClient];
  },
});

export const supabaseAdmin: SupabaseClient | null =
  typeof window === 'undefined' ? adminProxy : null;
