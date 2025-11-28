/**
 * Hook for fetching and caching suppliers data.
 */

import { useCallback, useEffect, useState } from 'react';
import { logger } from '@/lib/logger';
import { cacheData, getCachedData, prefetchApis } from '@/lib/cache/data-cache';
import type { Supplier, SupplierPriceList } from '../types';

export function useSuppliersData(selectedSupplier: string) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [priceLists, setPriceLists] = useState<SupplierPriceList[]>([]);
  const [loading, setLoading] = useState(false);

  // Prefetch APIs on mount
  useEffect(() => {
    prefetchApis(['/api/suppliers', '/api/supplier-price-lists']);
  }, []);

  const fetchSuppliers = useCallback(async () => {
    try {
      const response = await fetch('/api/suppliers');
      const data = await response.json();
      if (data.success) {
        setSuppliers(data.data);
        cacheData('suppliers', data.data);
      }
    } catch (error) {
      logger.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPriceLists = useCallback(async () => {
    try {
      let url = '/api/supplier-price-lists';
      if (selectedSupplier !== 'all') {
        url += `?supplier_id=${selectedSupplier}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setPriceLists(data.data);
        // Cache price lists (only cache when no filter applied for instant display)
        if (selectedSupplier === 'all') {
          cacheData('supplier_price_lists', data.data);
        }
      }
    } catch (error) {
      logger.error('Error fetching price lists:', error);
    }
  }, [selectedSupplier]);

  useEffect(() => {
    // Load cached data for instant display (client-only)
    const cachedSuppliers = getCachedData<Supplier[]>('suppliers');
    if (cachedSuppliers && cachedSuppliers.length > 0) {
      setSuppliers(cachedSuppliers);
    }

    const cachedPriceLists = getCachedData<SupplierPriceList[]>('supplier_price_lists');
    if (cachedPriceLists && cachedPriceLists.length > 0) {
      setPriceLists(cachedPriceLists);
    }

    // Fetch fresh data
    fetchSuppliers();
    fetchPriceLists();
  }, [fetchSuppliers, fetchPriceLists]);

  return {
    suppliers,
    priceLists,
    loading,
    setSuppliers,
    setPriceLists,
    setLoading,
    fetchSuppliers,
    fetchPriceLists,
  };
}
