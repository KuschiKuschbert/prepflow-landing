import { createClient } from '@supabase/supabase-js';

import { ApiErrorHandler } from '@/lib/api-error-handler';

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

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

  if (!supabaseUrl) {
    throw ApiErrorHandler.createError(
      'Missing NEXT_PUBLIC_SUPABASE_URL environment variable.',
      'DATABASE_ERROR',
      500,
    );
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

// For backward compatibility, create admin client only on server-side
export const supabaseAdmin = typeof window === 'undefined' ? createSupabaseAdmin() : null;
