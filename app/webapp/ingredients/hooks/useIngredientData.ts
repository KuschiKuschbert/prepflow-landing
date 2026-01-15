import { useSmartLoading } from '@/hooks/useSmartLoading';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

import { logger } from '@/lib/logger';
interface Ingredient {
  id: string;
  ingredient_name: string;
}

interface Supplier {
  id: string;
  supplier_name?: string; // Actual column name in database
  name?: string; // Fallback for compatibility
  created_at?: string;
}

export function useIngredientData() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setSmartLoading] = useSmartLoading(false, 200);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = async () => {
    try {
      setSmartLoading(true);
      // Try supplier_name first (actual column name), fallback to name if that fails
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('supplier_name', { ascending: true });

      if (error) {
        // Fallback: try 'name' column if supplier_name doesn't exist
        const fallbackQuery = await supabase
          .from('suppliers')
          .select('*')
          .order('name', { ascending: true });

        if (fallbackQuery.error) {
          logger.error('Error fetching suppliers:', fallbackQuery.error);
          setError(`Failed to load suppliers: ${fallbackQuery.error.message}`);
          throw fallbackQuery.error;
        }

        setSuppliers(fallbackQuery.data || []);
      } else {
        setSuppliers(data || []);
      }
    } catch (error: unknown) {
      logger.error('Error fetching suppliers:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load suppliers';
      setError(errorMessage);
      setSuppliers([]); // Set empty array on error to prevent crashes
    } finally {
      setSmartLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    suppliers,
    loading,
    error,
    setError,
    fetchSuppliers,
  };
}
