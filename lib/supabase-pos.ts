import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://akcnwnchvowibwjybgvi.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrY253bmNodm93aWJ3anliZ3ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0OTAzMDcsImV4cCI6MjA4MjA2NjMwN30.0PShsumawBDH3iSNhEoz4NFHqwimaJqvS2I_SB_2pKQ';

// Global singleton pattern - use window object to persist across HMR
// This ensures only one instance exists even with hot module reloading
const getGlobalSupabase = (): SupabaseClient => {
  // In browser, use window object to store singleton
  if (typeof window !== 'undefined') {
    const globalKey = '__NACHOTACO_SUPABASE_CLIENT__';
    if (!(window as any)[globalKey]) {
      (window as any)[globalKey] = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
          // Use a unique storage key to avoid conflicts with main Supabase client
          storageKey: 'nachotaco-auth-token',
        },
      });
    }
    return (window as any)[globalKey];
  }

  // On server, use module-level singleton
  if (!(globalThis as any).__NACHOTACO_SUPABASE_CLIENT__) {
    (globalThis as any).__NACHOTACO_SUPABASE_CLIENT__ = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false, // No session persistence on server
        autoRefreshToken: false,
        detectSessionInUrl: false,
        storageKey: 'nachotaco-auth-token',
      },
    });
  }
  return (globalThis as any).__NACHOTACO_SUPABASE_CLIENT__;
};

export const supabase = getGlobalSupabase();
