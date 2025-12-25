import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://akcnwnchvowibwjybgvi.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrY253bmNodm93aWJ3anliZ3ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0OTAzMDcsImV4cCI6MjA4MjA2NjMwN30.0PShsumawBDH3iSNhEoz4NFHqwimaJqvS2I_SB_2pKQ';

// Singleton pattern to prevent multiple GoTrueClient instances
// Use a unique storage key to avoid conflicts with main Supabase client
let supabaseInstance: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  supabaseInstance = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      // Use a unique storage key to avoid conflicts with main Supabase client
      storageKey: 'nachotaco-auth-token',
    },
  });

  return supabaseInstance;
}

export const supabase = getSupabaseClient();
