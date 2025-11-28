/**
 * Hook for fetching allergen overview data
 */

import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';
import type { AllergenItem } from '../AllergenOverview';

export function useAllergenData(selectedAllergenFilter: string) {
  const [items, setItems] = useState<AllergenItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllergenData = useCallback(async () => {
    try {
      setLoading(true);
      let url = '/api/compliance/allergens';
      const params = new URLSearchParams();

      if (selectedAllergenFilter !== 'all') {
        params.append('exclude_allergen', selectedAllergenFilter);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        logger.error('[Allergen Overview] Error fetching data:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData.error || errorData.message || 'Failed to fetch allergen data',
          details: errorData,
        });
        setItems([]);
        return;
      }

      const data = await response.json();

      if (data.success) {
        setItems(data.data.items || []);
      } else {
        logger.error('[Allergen Overview] Error fetching data:', {
          error: data.error || data.message || 'Unknown error',
          data,
        });
        setItems([]);
      }
    } catch (err) {
      logger.error('[Allergen Overview] Error:', {
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      });
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [selectedAllergenFilter]);

  useEffect(() => {
    fetchAllergenData();
  }, [fetchAllergenData]);

  return { items, loading, refetch: fetchAllergenData };
}
