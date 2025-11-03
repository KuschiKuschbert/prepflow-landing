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
  name: string;
  created_at: string;
}

export function useIngredientData() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setSmartLoading] = useSmartLoading(false, 200);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = async () => {
    try {
      const { data, error } = await supabase.from('suppliers').select('*').order('name');
      if (error) throw error;
      setSuppliers(data || []);
    } catch (error) {
      // Handle error gracefully
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
