/**
 * Rate limiting utilities for admin endpoints.
 * Stricter rate limits for admin operations.
 */

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

// Admin rate limits - stricter than regular endpoints
const ADMIN_RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const ADMIN_RATE_LIMIT_MAX = 100; // 100 requests per 15 minutes

// Critical admin operations (delete, impersonate) have stricter limits
const CRITICAL_RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const CRITICAL_RATE_LIMIT_MAX = 10; // 10 requests per minute

/**
 * Check if admin request is within rate limit.
 *
 * @param {string} identifier - User ID or IP address
 * @param {boolean} isCritical - Whether this is a critical operation (delete, impersonate)
 * @returns {boolean} True if within limit, false if rate limited
 */
export function checkAdminRateLimit(identifier: string, isCritical = false): boolean {
  const now = Date.now();
  const window = isCritical ? CRITICAL_RATE_LIMIT_WINDOW : ADMIN_RATE_LIMIT_WINDOW;
  const max = isCritical ? CRITICAL_RATE_LIMIT_MAX : ADMIN_RATE_LIMIT_MAX;

  const entry = rateLimitStore.get(identifier);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(identifier, { count: 1, resetAt: now + window });
    return true;
  }

  if (entry.count >= max) {
    return false;
  }

  entry.count++;
  return true;
}

/**
 * Get remaining requests for admin user.
 *
 * @param {string} identifier - User ID or IP address
 * @param {boolean} isCritical - Whether this is a critical operation
 * @returns {number} Remaining requests in current window
 */
export function getAdminRemainingRequests(identifier: string, isCritical = false): number {
  const entry = rateLimitStore.get(identifier);
  if (!entry) {
    const max = isCritical ? CRITICAL_RATE_LIMIT_MAX : ADMIN_RATE_LIMIT_MAX;
    return max;
  }

  const max = isCritical ? CRITICAL_RATE_LIMIT_MAX : ADMIN_RATE_LIMIT_MAX;
  return Math.max(0, max - entry.count);
}

