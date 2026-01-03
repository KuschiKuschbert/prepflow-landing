/**
 * General rate limiting utilities for API endpoints.
 * Provides rate limiting based on IP address or user identifier.
 */

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

// Default rate limits for public API endpoints
// In development, use higher limits to prevent 429 errors from simultaneous React Query hooks
const DEFAULT_RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const DEFAULT_RATE_LIMIT_MAX =
  process.env.NODE_ENV === 'development' ? 1000 : 100; // 1000 in dev, 100 in prod

// Stricter rate limits for authentication endpoints
const AUTH_RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const AUTH_RATE_LIMIT_MAX = 10; // 10 requests per minute

/**
 * Get client identifier from request (IP address or user ID)
 */
function getClientIdentifier(req: { headers: Headers; ip?: string }): string {
  // Try to get IP from headers (Vercel provides this)
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const ip = forwardedFor?.split(',')[0] || realIp || req.ip || 'unknown';

  return ip;
}

/**
 * Check if request is within rate limit.
 *
 * @param identifier - IP address or user identifier
 * @param isAuthRoute - Whether this is an authentication route (stricter limits)
 * @returns Object with allowed status and retryAfter seconds if rate limited
 */
export function checkRateLimit(
  identifier: string,
  isAuthRoute = false,
): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const window = isAuthRoute ? AUTH_RATE_LIMIT_WINDOW : DEFAULT_RATE_LIMIT_WINDOW;
  const max = isAuthRoute ? AUTH_RATE_LIMIT_MAX : DEFAULT_RATE_LIMIT_MAX;

  const entry = rateLimitStore.get(identifier);

  // Clean up expired entries periodically to prevent memory leaks
  if (rateLimitStore.size > 10000) {
    for (const [key, value] of rateLimitStore.entries()) {
      if (value.resetAt < now) {
        rateLimitStore.delete(key);
      }
    }
  }

  if (!entry || now > entry.resetAt) {
    // New window or expired - reset
    rateLimitStore.set(identifier, { count: 1, resetAt: now + window });
    return { allowed: true };
  }

  if (entry.count >= max) {
    // Rate limit exceeded
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000); // seconds
    return { allowed: false, retryAfter };
  }

  // Increment count
  entry.count++;
  return { allowed: true };
}

/**
 * Check rate limit from NextRequest.
 * Convenience function that extracts identifier from request.
 */
export function checkRateLimitFromRequest(req: { headers: Headers; ip?: string; url?: string }): {
  allowed: boolean;
  retryAfter?: number;
} {
  const identifier = getClientIdentifier(req);
  const isAuthRoute = req.url?.includes('/api/auth/') || false;
  return checkRateLimit(identifier, isAuthRoute);
}

/**
 * Get remaining requests for identifier.
 */
export function getRemainingRequests(identifier: string, isAuthRoute = false): number {
  const entry = rateLimitStore.get(identifier);
  if (!entry) {
    const max = isAuthRoute ? AUTH_RATE_LIMIT_MAX : DEFAULT_RATE_LIMIT_MAX;
    return max;
  }

  const now = Date.now();
  if (now > entry.resetAt) {
    const max = isAuthRoute ? AUTH_RATE_LIMIT_MAX : DEFAULT_RATE_LIMIT_MAX;
    return max;
  }

  const max = isAuthRoute ? AUTH_RATE_LIMIT_MAX : DEFAULT_RATE_LIMIT_MAX;
  return Math.max(0, max - entry.count);
}
