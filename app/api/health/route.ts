import { createSupabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

/**
 * Health check endpoint for uptime monitoring and load balancer probes.
 * Public route — no authentication required.
 *
 * @returns {{ status: 'ok' | 'degraded', timestamp: string, checks: { database: boolean } }}
 */
export async function GET() {
  const timestamp = new Date().toISOString();
  const checks = { database: false };

  try {
    const supabase = createSupabaseAdmin();
    const { error } = await supabase.from('users').select('id').limit(1).maybeSingle();
    checks.database = !error;
  } catch {
    checks.database = false;
  }

  const allHealthy = Object.values(checks).every(Boolean);
  const status = allHealthy ? 'ok' : 'degraded';

  return NextResponse.json({ status, timestamp, checks }, { status: allHealthy ? 200 : 503 });
}
