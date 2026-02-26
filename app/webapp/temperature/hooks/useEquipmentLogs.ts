import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';
import { useCallback, useEffect, useState } from 'react';
import { TemperatureLog } from '../types';
import { getDateRange } from './getDateRange';

interface UseEquipmentLogsOptions {
  equipmentName: string | null;
  equipmentLocation?: string | null;
  equipmentId?: string | null;
  timeFilter: '24h' | '7d' | '30d' | 'all';
}

/**
 * useEquipmentLogs
 *
 * Fetches temperature logs for a single equipment piece, scoped to the
 * selected time range.  Date range is sent to the server so only the
 * relevant rows are returned – no more fetching 1,000 rows and filtering
 * in the browser.
 *
 * Caches the result per (equipmentName, timeFilter) to prevent redundant
 * fetches when the drawer re-opens.
 */
export function useEquipmentLogs({
  equipmentName,
  equipmentLocation,
  equipmentId,
  timeFilter,
}: UseEquipmentLogsOptions) {
  const [logs, setLogs] = useState<TemperatureLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    if (!equipmentName && !equipmentId) {
      setLogs([]);
      setIsLoading(false);
      return;
    }

    const cacheKey = `equipment_logs_${equipmentId ?? equipmentName}_${timeFilter}`;
    const cached = getCachedData<TemperatureLog[]>(cacheKey);
    if (cached) {
      setLogs(cached);
      setIsLoading(false);
      // Still revalidate in background – don't return early
    } else {
      setIsLoading(true);
    }

    try {
      const { dateFrom, dateTo } = getDateRange(timeFilter);

      // Build up to 2 fetch promises (location + name) to cover both matching strategies
      const locationsToQuery = [
        ...(equipmentLocation ? [equipmentLocation] : []),
        ...(equipmentName ? [equipmentName] : []),
      ].filter(Boolean);
      const uniqueLocations = [...new Set(locationsToQuery)];

      // Prefer equipment_id FK lookup when available
      let fetchPromises: Promise<Response>[];
      if (equipmentId) {
        const params = new URLSearchParams({ equipment_id: equipmentId, pageSize: '200' });
        if (dateFrom) params.append('date_from', dateFrom);
        if (dateTo) params.append('date_to', dateTo);
        fetchPromises = [fetch(`/api/temperature-logs?${params.toString()}`)];
      } else {
        fetchPromises = uniqueLocations.map(loc => {
          const params = new URLSearchParams({ location: loc, pageSize: '200' });
          if (dateFrom) params.append('date_from', dateFrom);
          if (dateTo) params.append('date_to', dateTo);
          return fetch(`/api/temperature-logs?${params.toString()}`);
        });
      }

      const responses = await Promise.all(fetchPromises);
      const jsons = await Promise.all(
        responses.map(r => (r.ok ? r.json() : Promise.resolve(null))),
      );

      const allFetched: TemperatureLog[] = [];
      for (const json of jsons) {
        if (json?.success && json.data?.items) {
          allFetched.push(...json.data.items);
        }
      }

      // Deduplicate by id
      const unique = Array.from(new Map(allFetched.map(l => [l.id, l])).values());

      cacheData(cacheKey, unique);
      setLogs(unique);

      logger.dev(`[useEquipmentLogs] Fetched ${unique.length} logs for "${equipmentName}"`, {
        timeFilter,
        dateFrom,
        dateTo,
        equipmentId,
      });
    } catch (err) {
      logger.error('[useEquipmentLogs] Error fetching equipment logs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch logs');
    } finally {
      setIsLoading(false);
    }
  }, [equipmentId, equipmentName, equipmentLocation, timeFilter]);

  // Fetch when equipment or time filter changes
  useEffect(() => {
    fetchLogs().catch(() => {});
  }, [fetchLogs]);

  return { logs, isLoading, error };
}
