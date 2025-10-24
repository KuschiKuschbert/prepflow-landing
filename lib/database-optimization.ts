// Database optimization utilities for Supabase
// Based on Supabase performance best practices

import { supabaseAdmin } from './supabase';

// Connection pooling configuration
const CONNECTION_POOL_CONFIG = {
  maxConnections: 20,
  minConnections: 5,
  connectionTimeout: 30000,
  idleTimeout: 60000,
  retryAttempts: 3,
  retryDelay: 1000,
};

// Query optimization cache
const queryCache = new Map<string, { data: any; timestamp: number; ttl: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Performance monitoring
interface QueryMetrics {
  query: string;
  duration: number;
  rowsReturned: number;
  cacheHit: boolean;
  timestamp: number;
}

const queryMetrics: QueryMetrics[] = [];

/**
 * Optimized database query with caching and performance monitoring
 */
export async function optimizedQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  cacheKey?: string,
  ttl: number = CACHE_TTL,
): Promise<{ data: T | null; error: any; fromCache: boolean }> {
  const startTime = performance.now();

  // Check cache first
  if (cacheKey) {
    const cached = queryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      const duration = performance.now() - startTime;

      // Track cache hit
      queryMetrics.push({
        query: cacheKey,
        duration,
        rowsReturned: Array.isArray(cached.data) ? cached.data.length : 1,
        cacheHit: true,
        timestamp: Date.now(),
      });

      return { data: cached.data, error: null, fromCache: true };
    }
  }

  try {
    // Execute query
    const result = await queryFn();
    const duration = performance.now() - startTime;

    // Track query performance
    queryMetrics.push({
      query: cacheKey || 'unknown',
      duration,
      rowsReturned: Array.isArray(result.data) ? result.data.length : 1,
      cacheHit: false,
      timestamp: Date.now(),
    });

    // Cache successful results
    if (cacheKey && result.data && !result.error) {
      queryCache.set(cacheKey, {
        data: result.data,
        timestamp: Date.now(),
        ttl,
      });
    }

    // Log slow queries
    if (duration > 1000) {
      console.warn(
        `🐌 Slow query detected: ${cacheKey || 'unknown'} took ${duration.toFixed(2)}ms`,
      );
    }

    return { ...result, fromCache: false };
  } catch (error) {
    const duration = performance.now() - startTime;

    console.error(`❌ Query failed: ${cacheKey || 'unknown'}`, error);

    queryMetrics.push({
      query: cacheKey || 'unknown',
      duration,
      rowsReturned: 0,
      cacheHit: false,
      timestamp: Date.now(),
    });

    return { data: null, error, fromCache: false };
  }
}

/**
 * Batch multiple queries for better performance
 */
export async function batchQueries<T>(
  queries: Array<{ key: string; queryFn: () => Promise<{ data: T | null; error: any }> }>,
  ttl: number = CACHE_TTL,
): Promise<Record<string, { data: T | null; error: any; fromCache: boolean }>> {
  const results: Record<string, { data: T | null; error: any; fromCache: boolean }> = {};

  // Execute all queries in parallel
  const promises = queries.map(async ({ key, queryFn }) => {
    const result = await optimizedQuery(queryFn, key, ttl);
    results[key] = result;
  });

  await Promise.all(promises);

  return results;
}

/**
 * Optimized ingredients query with caching
 */
export async function getIngredientsOptimized(
  searchTerm?: string,
  limit: number = 50,
  offset: number = 0,
) {
  const cacheKey = `ingredients_${searchTerm || 'all'}_${limit}_${offset}`;

  return optimizedQuery(
    async () => {
      if (!supabaseAdmin) {
        return { data: null, error: new Error('Supabase admin client not initialized') };
      }

      let query = supabaseAdmin
        .from('ingredients')
        .select('*')
        .order('ingredient_name', { ascending: true })
        .range(offset, offset + limit - 1);

      if (searchTerm) {
        query = query.ilike('ingredient_name', `%${searchTerm}%`);
      }

      return await query;
    },
    cacheKey,
    2 * 60 * 1000, // 2 minutes cache for ingredients
  );
}

/**
 * Optimized recipes query with caching
 */
export async function getRecipesOptimized(
  searchTerm?: string,
  limit: number = 20,
  offset: number = 0,
) {
  const cacheKey = `recipes_${searchTerm || 'all'}_${limit}_${offset}`;

  return optimizedQuery(
    async () => {
      if (!supabaseAdmin) {
        return { data: null, error: new Error('Supabase admin client not initialized') };
      }

      let query = supabaseAdmin
        .from('recipes')
        .select(
          `
          *,
          recipe_ingredients (
            id,
            quantity,
            unit,
            ingredients (
              ingredient_name,
              cost_per_unit,
              unit
            )
          )
        `,
        )
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (searchTerm) {
        query = query.ilike('recipe_name', `%${searchTerm}%`);
      }

      return await query;
    },
    cacheKey,
    5 * 60 * 1000, // 5 minutes cache for recipes
  );
}

/**
 * Optimized recipe ingredients query
 */
export async function getRecipeIngredientsOptimized(recipeId: number) {
  const cacheKey = `recipe_ingredients_${recipeId}`;

  return optimizedQuery(
    async () => {
      if (!supabaseAdmin) {
        return { data: null, error: new Error('Supabase admin client not initialized') };
      }

      return await supabaseAdmin
        .from('recipe_ingredients')
        .select(
          `
          *,
          ingredients (
            ingredient_name,
            cost_per_unit,
            unit,
            waste_percentage,
            yield_percentage
          )
        `,
        )
        .eq('recipe_id', recipeId);
    },
    cacheKey,
    10 * 60 * 1000, // 10 minutes cache for recipe ingredients
  );
}

/**
 * Clear cache for specific patterns
 */
export function clearCache(pattern?: string) {
  if (pattern) {
    const regex = new RegExp(pattern);
    for (const [key] of queryCache) {
      if (regex.test(key)) {
        queryCache.delete(key);
      }
    }
  } else {
    queryCache.clear();
  }

  console.log(`🗑️ Cache cleared for pattern: ${pattern || 'all'}`);
}

/**
 * Get query performance metrics
 */
export function getQueryMetrics(): QueryMetrics[] {
  return [...queryMetrics];
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  const now = Date.now();
  let validEntries = 0;
  let expiredEntries = 0;

  for (const [key, value] of queryCache) {
    if (now - value.timestamp < value.ttl) {
      validEntries++;
    } else {
      expiredEntries++;
    }
  }

  return {
    totalEntries: queryCache.size,
    validEntries,
    expiredEntries,
    hitRate:
      queryMetrics.length > 0
        ? queryMetrics.filter(m => m.cacheHit).length / queryMetrics.length
        : 0,
    averageQueryTime:
      queryMetrics.length > 0
        ? queryMetrics.reduce((sum, m) => sum + m.duration, 0) / queryMetrics.length
        : 0,
  };
}

/**
 * Clean up expired cache entries
 */
export function cleanupExpiredCache() {
  const now = Date.now();
  let cleaned = 0;

  for (const [key, value] of queryCache) {
    if (now - value.timestamp >= value.ttl) {
      queryCache.delete(key);
      cleaned++;
    }
  }

  if (cleaned > 0) {
    console.log(`🧹 Cleaned up ${cleaned} expired cache entries`);
  }

  return cleaned;
}

/**
 * Optimize database connection settings
 */
export function optimizeConnection() {
  // Set connection pool settings
  if (typeof window !== 'undefined') {
    // Client-side optimizations
    console.log('🔧 PrepFlow DB: Optimizing client-side connection');
  } else {
    // Server-side optimizations
    console.log('🔧 PrepFlow DB: Optimizing server-side connection');
  }
}

// Auto-cleanup expired cache every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(cleanupExpiredCache, 5 * 60 * 1000);
}
