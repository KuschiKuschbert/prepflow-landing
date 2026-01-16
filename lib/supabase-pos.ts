import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Typed cache to store the Supabase client singleton
interface SupabaseCache {
  client?: SupabaseClient;
}

// Use a typed object for caching instead of augmenting Window/globalThis
const windowCache: SupabaseCache = {};
const serverCache: SupabaseCache = {};

// Global singleton pattern - use window object to persist across HMR
// This ensures only one instance exists even with hot module reloading
const getGlobalSupabase = (): SupabaseClient => {
  if (typeof window !== 'undefined') {
    if (!windowCache.client) {
      windowCache.client = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
          storageKey: 'curbos-auth-token',
        },
      });
    }
    return windowCache.client;
  }

  if (!serverCache.client) {
    serverCache.client = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
        storageKey: 'curbos-auth-token',
      },
    });
  }
  return serverCache.client;
};

/**
 * Lazy-initialized Supabase client proxy for CurbOS.
 * Deferring client creation until property access prevents unnecessary
 * GoTrueClient instances and subsequent warnings during module evaluation.
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get: (_target, prop) => {
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
      return undefined;
    }
    const client = getGlobalSupabase();
    return client[prop as keyof SupabaseClient];
  },
});
