import { createClient } from '@supabase/supabase-js'

// Client-side Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only throw error in runtime, not during build
if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined' || process.env.NODE_ENV === 'development') {
    throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
  }
}

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

// Server-side Supabase client with service role key (only available on server)
export function createSupabaseAdmin() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable.')
  }

  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable.')
  }

  return createClient(supabaseUrl, serviceRoleKey)
}

// For backward compatibility, create admin client only on server-side
// Handle missing env vars gracefully during build
export const supabaseAdmin = typeof window === 'undefined' && supabaseUrl && process.env.SUPABASE_SERVICE_ROLE_KEY 
  ? createSupabaseAdmin() 
  : null
