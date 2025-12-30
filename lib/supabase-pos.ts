import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://akcnwnchvowibwjybgvi.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrY253bmNodm93aWJ3anliZ3ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0OTAzMDcsImV4cCI6MjA4MjA2NjMwN30.0PShsumawBDH3iSNhEoz4NFHqwimaJqvS2I_SB_2pKQ';

// Global singleton pattern - use window object to persist across HMR
// This ensures only one instance exists even with hot module reloading
const getGlobalSupabase = (): SupabaseClient => {
  const globalKey = '__CURBOS_SUPABASE_CLIENT__';

  if (typeof window !== 'undefined') {
    if (!(window as any)[globalKey]) {
      (window as any)[globalKey] = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
          storageKey: 'curbos-auth-token',
        },
      });
    }
    return (window as any)[globalKey];
  }

  if (!(globalThis as any)[globalKey]) {
    (globalThis as any)[globalKey] = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
        storageKey: 'curbos-auth-token',
      },
    });
  }
  return (globalThis as any)[globalKey];
};

/**
 * Lazy-initialized Supabase client proxy for CurbOS.
 * Deferring client creation until property access prevents unnecessary
 * GoTrueClient instances and subsequent warnings during module evaluation.
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
    const client = getGlobalSupabase();
    return (client as any)[prop];
  },
});
