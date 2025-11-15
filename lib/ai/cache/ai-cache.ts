/**
 * AI Response Caching
 *
 * Caches AI responses to reduce costs and improve performance
 * Uses sessionStorage for client-side caching
 */

import { AICacheEntry } from '../types';

const CACHE_PREFIX = 'ai_cache_';
const DEFAULT_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Generate cache key from request data
 */
export function generateCacheKey(endpoint: string, data: unknown): string {
  const dataString = JSON.stringify(data);
  const hash = simpleHash(dataString);
  return `${CACHE_PREFIX}${endpoint}_${hash}`;
}

/**
 * Simple hash function for cache keys
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Get cached AI response
 */
export function getCachedAIResponse(key: string): string | null {
  if (typeof window === 'undefined') {
    return null; // Server-side, no cache
  }

  try {
    const cached = sessionStorage.getItem(key);
    if (!cached) {
      return null;
    }

    const entry: AICacheEntry = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is expired
    if (now - entry.timestamp > entry.ttl) {
      sessionStorage.removeItem(key);
      return null;
    }

    return entry.response;
  } catch (error) {
    console.warn('Failed to read AI cache:', error);
    return null;
  }
}

/**
 * Cache AI response
 */
export function cacheAIResponse(
  key: string,
  response: string,
  ttl: number = DEFAULT_TTL,
): void {
  if (typeof window === 'undefined') {
    return; // Server-side, no cache
  }

  try {
    const entry: AICacheEntry = {
      key,
      response,
      timestamp: Date.now(),
      ttl,
    };
    sessionStorage.setItem(key, JSON.stringify(entry));
  } catch (error) {
    console.warn('Failed to cache AI response:', error);
    // Handle quota exceeded error
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      clearExpiredCacheEntries();
      // Try again
      try {
        const retryEntry: AICacheEntry = {
          key,
          response,
          timestamp: Date.now(),
          ttl,
        };
        sessionStorage.setItem(key, JSON.stringify(retryEntry));
      } catch (retryError) {
        console.warn('Failed to cache after cleanup:', retryError);
      }
    }
  }
}

/**
 * Clear expired cache entries
 */
function clearExpiredCacheEntries(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const keysToRemove: string[] = [];
    const now = Date.now();

    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        try {
          const cached = sessionStorage.getItem(key);
          if (cached) {
            const entry: AICacheEntry = JSON.parse(cached);
            if (now - entry.timestamp > entry.ttl) {
              keysToRemove.push(key);
            }
          }
        } catch {
          // Invalid entry, remove it
          keysToRemove.push(key);
        }
      }
    }

    keysToRemove.forEach(key => sessionStorage.removeItem(key));
  } catch (error) {
    console.warn('Failed to clear expired cache:', error);
  }
}

/**
 * Clear all AI cache entries
 */
export function clearAICache(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => sessionStorage.removeItem(key));
  } catch (error) {
    console.warn('Failed to clear AI cache:', error);
  }
}
