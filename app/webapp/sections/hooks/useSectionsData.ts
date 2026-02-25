/**
 * Hook for fetching and caching sections data.
 */

import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';
import { cacheData, getCachedData, prefetchApis } from '@/lib/cache/data-cache';
import type { KitchenSection, MenuDish } from '../types';

export function useSectionsData(userId: string) {
  // Initialize with empty arrays to avoid SSR/client hydration mismatch.
  // getCachedData reads sessionStorage which is browser-only; calling it in
  // the useState initializer causes server-rendered HTML to differ from the
  // client's first render when cache has data. Load cache in useEffect instead.
  const [kitchenSections, setKitchenSections] = useState<KitchenSection[]>([]);
  const [menuDishes, setMenuDishes] = useState<MenuDish[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prefetch APIs on mount and load from cache (client-only, safe after hydration)
  useEffect(() => {
    prefetchApis([`/api/kitchen-sections?userId=${userId}`, `/api/menu-dishes?userId=${userId}`]);
    const cachedSections = getCachedData<KitchenSection[]>('kitchen_sections');
    if (cachedSections) setKitchenSections(cachedSections);
    const cachedDishes = getCachedData<MenuDish[]>('menu_dishes');
    if (cachedDishes) setMenuDishes(cachedDishes);
  }, [userId]);

  const fetchKitchenSections = useCallback(async () => {
    try {
      const response = await fetch(`/api/kitchen-sections?userId=${userId}`);
      const result = await response.json();

      if (result.success) {
        const sections = result.data || [];
        setKitchenSections(sections);
        cacheData('kitchen_sections', sections);
        if (result.message && result.instructions) {
          logger.warn('Kitchen sections:', result.message);
          logger.dev('Setup instructions:', result.instructions);
        }
      } else {
        setError(result.message || 'Failed to fetch kitchen sections');
      }
    } catch (err) {
      logger.error('Failed to fetch kitchen sections:', err);
      setError('Failed to fetch kitchen sections. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchMenuDishes = useCallback(async () => {
    try {
      const response = await fetch(`/api/menu-dishes?userId=${userId}`);
      const result = await response.json();

      if (result.success) {
        const dishes = result.data || [];
        setMenuDishes(dishes);
        cacheData('menu_dishes', dishes);
        if (result.message && result.instructions) {
          logger.warn('Menu dishes:', result.message);
          logger.dev('Setup instructions:', result.instructions);
        }
      } else {
        logger.error('Failed to fetch menu dishes:', result);
      }
    } catch (err) {
      logger.error('Failed to fetch menu dishes:', err);
    }
  }, [userId]);

  useEffect(() => {
    fetchKitchenSections();
    fetchMenuDishes();
  }, [fetchKitchenSections, fetchMenuDishes]);

  return {
    kitchenSections,
    menuDishes,
    loading,
    error,
    setKitchenSections,
    setMenuDishes,
    setError,
    fetchKitchenSections,
    fetchMenuDishes,
  };
}
