'use client';
import { useCallback, useEffect, useState } from 'react';
export function useParallelFetch<T, K extends string | number>(
  items: K[],
  fetchFn: (item: K) => Promise<T>,
  options?: {
    enabled?: boolean;
    onError?: (error: Error, item: K) => void;
    continueOnError?: boolean;
  },
) {
  const { enabled = true, onError, continueOnError = true } = options || {};
  const [data, setData] = useState<Map<K, T>>(new Map());
  const [loading, setLoading] = useState<Map<K, boolean>>(new Map());
  const [errors, setErrors] = useState<Map<K, Error>>(new Map());
  const [isLoading, setIsLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    if (!enabled || items.length === 0) return;
    setIsLoading(true);
    const newLoading = new Map<K, boolean>();
    items.forEach(item => newLoading.set(item, true));
    setLoading(newLoading);
    const results = await Promise.allSettled(
      items.map(async item => {
        try {
          const result = await fetchFn(item);
          return { item, result, error: null };
        } catch (error) {
          const err = error instanceof Error ? error : new Error(String(error));
          if (onError) onError(err, item);
          if (!continueOnError) throw err;
          return { item, result: null, error: err };
        }
      }),
    );
    const newData = new Map<K, T>();
    const newErrors = new Map<K, Error>();
    const finalLoading = new Map<K, boolean>();
    results.forEach((result, index) => {
      const item = items[index];
      finalLoading.set(item, false);
      if (result.status === 'fulfilled') {
        const { item: resultItem, result: resultData, error } = result.value;
        if (error) newErrors.set(resultItem, error);
        else if (resultData !== null) newData.set(resultItem, resultData);
      } else {
        const error =
          result.reason instanceof Error ? result.reason : new Error(String(result.reason));
        newErrors.set(item, error);
        if (onError) onError(error, item);
      }
    });
    setData(newData);
    setErrors(newErrors);
    setLoading(finalLoading);
    setIsLoading(false);
  }, [items, fetchFn, enabled, onError, continueOnError]);
  const fetchItem = useCallback(
    async (item: K) => {
      const newLoading = new Map(loading);
      newLoading.set(item, true);
      setLoading(newLoading);
      try {
        const result = await fetchFn(item);
        const newData = new Map(data);
        newData.set(item, result);
        setData(newData);
        const newErrors = new Map(errors);
        newErrors.delete(item);
        setErrors(newErrors);
        return result;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        const newErrors = new Map(errors);
        newErrors.set(item, err);
        setErrors(newErrors);
        if (onError) onError(err, item);
        throw err;
      } finally {
        const finalLoading = new Map(loading);
        finalLoading.set(item, false);
        setLoading(finalLoading);
      }
    },
    [fetchFn, data, errors, loading, onError],
  );
  const clearError = useCallback(
    (item: K) => {
      const newErrors = new Map(errors);
      newErrors.delete(item);
      setErrors(newErrors);
    },
    [errors],
  );
  const clearAll = useCallback(() => {
    setData(new Map());
    setErrors(new Map());
    setLoading(new Map());
  }, []);
  useEffect(() => {
    if (enabled && items.length > 0) fetchAll();
  }, [enabled, items, fetchAll]);
  return { data, loading, errors, isLoading, fetchAll, fetchItem, clearError, clearAll };
}
