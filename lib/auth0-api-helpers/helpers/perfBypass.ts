/**
 * Performance test bypass - returns perf user if bypass token matches.
 */
import type { NextRequest } from 'next/server';

const PERF_USER = {
  email: 'perf-test-user@prepflow.org',
  name: 'Performance Test User',
  picture: 'https://via.placeholder.com/150',
  sub: '00000000-0000-0000-0000-000000000000',
  email_verified: true,
  roles: [] as string[],
};

export function getPerfTestUserIfBypass(req: NextRequest): typeof PERF_USER | null {
  const perfTestToken = process.env.PERFORMANCE_TEST_TOKEN || 'perf-test-secret';
  const bypassHeader =
    req.headers.get('x-prepflow-perf-bypass') ||
    req.headers.get('performance-test-token') ||
    req.headers.get('x-perf-test-token');
  const bypassCookie = req.cookies.get('prepflow-perf-bypass')?.value;
  const bypassQuery = req.nextUrl.searchParams.get('performance-test-token');

  if (
    bypassHeader === perfTestToken ||
    bypassCookie === perfTestToken ||
    bypassQuery === perfTestToken
  ) {
    return PERF_USER;
  }
  return null;
}
