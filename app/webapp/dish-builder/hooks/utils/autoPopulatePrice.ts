import { useEffect } from 'react';
import { DishBuilderState } from '../../types';
import type { PricingCalculation } from '@/lib/types/cogs';

interface AutoPopulatePriceProps {
  pricingCalculation: PricingCalculation | null;
  dishState: DishBuilderState;
  setDishState: React.Dispatch<React.SetStateAction<DishBuilderState>>;
}

export function useAutoPopulatePrice({
  pricingCalculation,
  dishState,
  setDishState,
}: AutoPopulatePriceProps): void {
  useEffect(() => {
    if (
      pricingCalculation &&
      pricingCalculation.sellPriceInclGST > 0 &&
      (dishState.sellingPrice === 0 || !dishState.sellingPrice)
    ) {
      setDishState(prev => ({
        ...prev,
        sellingPrice: pricingCalculation.sellPriceInclGST,
      }));
    }
  }, [pricingCalculation, dishState.sellingPrice, setDishState]);
}
