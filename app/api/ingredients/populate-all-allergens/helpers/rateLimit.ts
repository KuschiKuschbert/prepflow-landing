// Rate limiting for populate-all-allergens endpoint
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 1; // 1 request per hour (this is a heavy operation)

/**
 * Check if user has exceeded rate limit
 *
 * @param {string} userId - User ID
 * @returns {boolean} True if request is allowed, false if rate limited
 */
export function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);
  if (!userLimit || now > userLimit.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (userLimit.count >= RATE_LIMIT_MAX) return false;
  userLimit.count++;
  return true;
}
