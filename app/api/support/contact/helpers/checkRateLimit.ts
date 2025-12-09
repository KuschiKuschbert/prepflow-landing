// Rate limiting: 5 requests per 15 minutes per user
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes in milliseconds
const RATE_LIMIT_MAX = 5; // 5 requests per window

/**
 * Check rate limit for user
 * Returns true if within limit, false if exceeded
 */
export function checkRateLimit(userEmail: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userEmail);

  // Clean up expired entries periodically
  if (rateLimitMap.size > 1000) {
    for (const [email, limit] of rateLimitMap.entries()) {
      if (limit.resetAt < now) {
        rateLimitMap.delete(email);
      }
    }
  }

  if (!userLimit || userLimit.resetAt < now) {
    // New window or expired - reset
    rateLimitMap.set(userEmail, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW,
    });
    return { allowed: true };
  }

  if (userLimit.count >= RATE_LIMIT_MAX) {
    // Rate limit exceeded
    const retryAfter = Math.ceil((userLimit.resetAt - now) / 1000); // seconds
    return { allowed: false, retryAfter };
  }

  // Increment count
  userLimit.count++;
  return { allowed: true };
}
