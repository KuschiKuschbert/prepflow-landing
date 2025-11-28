/**
 * Hook for cost calculation logic.
 */

import { useCallback } from 'react';
import { convertUnit } from '@/lib/unit-conversion';

interface FormData {
  pack_price?: number;
  pack_size?: string;
  pack_size_unit?: string;
  unit?: string;
  cost_per_unit?: number;
  cost_per_unit_as_purchased?: number;
  cost_per_unit_incl_trim?: number;
}

export function useCostCalculation(
  formData: FormData,
  setFormData: React.Dispatch<React.SetStateAction<Partial<FormData>>>,
) {
  const calculateCostPerUnit = useCallback(
    (packPrice: number, packSize: number, packSizeUnit: string, targetUnit: string): number => {
      if (packPrice === 0 || packSize === 0) return 0;
      const conversion = convertUnit(1, packSizeUnit, targetUnit);
      const packSizeInTargetUnit = packSize * conversion.value;
      return packPrice / packSizeInTargetUnit;
    },
    [],
  );

  const updateCostPerUnit = useCallback(() => {
    const targetUnit = formData.pack_size_unit || formData.unit || 'GM';
    if (formData.pack_price && formData.pack_size && formData.pack_size_unit && targetUnit) {
      const calculatedCost = calculateCostPerUnit(
        formData.pack_price,
        parseFloat(formData.pack_size),
        formData.pack_size_unit,
        targetUnit,
      );
      setFormData(prev => ({
        ...prev,
        cost_per_unit: calculatedCost,
        cost_per_unit_as_purchased: calculatedCost,
        cost_per_unit_incl_trim: calculatedCost,
        unit: targetUnit,
      }));
    }
  }, [
    formData.pack_price,
    formData.pack_size,
    formData.pack_size_unit,
    formData.unit,
    calculateCostPerUnit,
    setFormData,
  ]);

  return { calculateCostPerUnit, updateCostPerUnit };
}
