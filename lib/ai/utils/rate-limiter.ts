/**
 * Rate Limiting for AI Requests
 *
 * Prevents excessive API usage and controls costs
 */

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number; // Time window in milliseconds
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 50, // 50 requests per window
  windowMs: 60 * 60 * 1000, // 1 hour
};

const rateLimitStore = new Map<string, { count: number; windowStart: number }>();

/**
 * Check if request is within rate limit
 * @param identifier - User ID, IP address, or session ID
 * @param config - Rate limit configuration
 * @returns True if within limit, false if rate limited
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = DEFAULT_CONFIG,
): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry) {
    // First request
    rateLimitStore.set(identifier, { count: 1, windowStart: now });
    return true;
  }

  // Check if window has expired
  if (now - entry.windowStart > config.windowMs) {
    // Reset window
    rateLimitStore.set(identifier, { count: 1, windowStart: now });
    return true;
  }

  // Check if limit exceeded
  if (entry.count >= config.maxRequests) {
    return false;
  }

  // Increment count
  entry.count++;
  return true;
}

/**
 * Get remaining requests in current window
 */
export function getRemainingRequests(
  identifier: string,
  config: RateLimitConfig = DEFAULT_CONFIG,
): number {
  const entry = rateLimitStore.get(identifier);
  if (!entry) {
    return config.maxRequests;
  }

  const now = Date.now();
  if (now - entry.windowStart > config.windowMs) {
    return config.maxRequests;
  }

  return Math.max(0, config.maxRequests - entry.count);
}

/**
 * Reset rate limit for identifier (useful for testing)
 */
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}

/**
 * Clean up old rate limit entries (call periodically)
 */
export function cleanupRateLimits(config: RateLimitConfig = DEFAULT_CONFIG): void {
  const now = Date.now();
  const keysToDelete: string[] = [];

  for (const [key, entry] of rateLimitStore.entries()) {
    if (now - entry.windowStart > config.windowMs) {
      keysToDelete.push(key);
    }
  }

  keysToDelete.forEach(key => rateLimitStore.delete(key));
}
