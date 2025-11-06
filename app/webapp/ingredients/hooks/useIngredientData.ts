import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useSmartLoading } from '@/hooks/useSmartLoading';

interface Ingredient {
  id: string;
  ingredient_name: string;
  [key: string]: any;
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
          console.error('Error fetching suppliers:', fallbackQuery.error);
          setError(`Failed to load suppliers: ${fallbackQuery.error.message}`);
          throw fallbackQuery.error;
        }

        setSuppliers(fallbackQuery.data || []);
      } else {
        setSuppliers(data || []);
      }
    } catch (error: any) {
      console.error('Error fetching suppliers:', error);
      setError(error?.message || 'Failed to load suppliers');
      setSuppliers([]); // Set empty array on error to prevent crashes
    } finally {
      setSmartLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return {
    suppliers,
    loading,
    error,
    setError,
    fetchSuppliers,
  };
}
