'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';

export const usePricing = (costPerPortion: number) => {
  const [targetGrossProfit, setTargetGrossProfit] = useState<number>(70);
  const [sellPriceExclGST, setSellPriceExclGST] = useState<number>(0);
  const [sellPriceInclGST, setSellPriceInclGST] = useState<number>(0);
  const [pricingStrategy, setPricingStrategy] = useState<'charm' | 'whole' | 'real'>('charm');

  const calculateRecommendedPrices = useCallback(
    (foodCost: number, targetGP: number, strategy: 'charm' | 'whole' | 'real') => {
      const sellPriceExclGST = foodCost / (1 - targetGP / 100);
      const gstAmount = sellPriceExclGST * 0.1;
      const sellPriceInclGST = sellPriceExclGST + gstAmount;
      let finalPriceInclGST = sellPriceInclGST;
      switch (strategy) {
        case 'charm':
          finalPriceInclGST = Math.ceil(sellPriceInclGST) - 0.01;
          break;
        case 'whole':
          finalPriceInclGST = Math.ceil(sellPriceInclGST);
          break;
        case 'real':
          finalPriceInclGST = sellPriceInclGST;
          break;
      }
      const finalPriceExclGST = finalPriceInclGST / 1.1;
      const finalGstAmount = finalPriceInclGST - finalPriceExclGST;
      const contributingMargin = finalPriceExclGST - foodCost;
      return {
        sellPriceExclGST: finalPriceExclGST,
        sellPriceInclGST: finalPriceInclGST,
        gstAmount: finalGstAmount,
        actualGrossProfit: ((finalPriceExclGST - foodCost) / finalPriceExclGST) * 100,
        grossProfitDollar: finalPriceExclGST - foodCost,
        contributingMargin,
        contributingMarginPercent: (contributingMargin / finalPriceExclGST) * 100,
      };
    },
    [],
  );

  const allStrategyPrices = useMemo(() => {
    if (costPerPortion > 0) {
      return {
        charm: calculateRecommendedPrices(costPerPortion, targetGrossProfit, 'charm'),
        whole: calculateRecommendedPrices(costPerPortion, targetGrossProfit, 'whole'),
        real: calculateRecommendedPrices(costPerPortion, targetGrossProfit, 'real'),
      };
    }
    return null;
  }, [costPerPortion, targetGrossProfit, calculateRecommendedPrices]);

  const pricingCalculation = useMemo(() => {
    if (costPerPortion > 0) {
      return calculateRecommendedPrices(costPerPortion, targetGrossProfit, pricingStrategy);
    }
    return null;
  }, [costPerPortion, targetGrossProfit, pricingStrategy, calculateRecommendedPrices]);

  useEffect(() => {
    if (costPerPortion > 0 && pricingCalculation) {
      setSellPriceExclGST(pricingCalculation.sellPriceExclGST);
      setSellPriceInclGST(pricingCalculation.sellPriceInclGST);
    }
  }, [costPerPortion, pricingCalculation]);

  return {
    targetGrossProfit,
    sellPriceExclGST,
    sellPriceInclGST,
    pricingStrategy,
    pricingCalculation,
    allStrategyPrices,
    setTargetGrossProfit,
    setPricingStrategy,
  };
};
