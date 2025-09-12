'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { PricingCalculation } from '../types';

export const usePricing = (costPerPortion: number) => {
  const [targetGrossProfit, setTargetGrossProfit] = useState<number>(70); // Default 70% GP
  const [sellPriceExclGST, setSellPriceExclGST] = useState<number>(0);
  const [sellPriceInclGST, setSellPriceInclGST] = useState<number>(0);
  const [pricingStrategy, setPricingStrategy] = useState<'charm' | 'whole' | 'real'>('charm');

  const calculateRecommendedPrices = useCallback((foodCost: number, targetGP: number, strategy: 'charm' | 'whole' | 'real') => {
    // Calculate sell price excluding GST based on target gross profit
    // GP% = (Sell Price - Food Cost) / Sell Price * 100
    // Solving for Sell Price: Sell Price = Food Cost / (1 - GP/100)
    const sellPriceExclGST = foodCost / (1 - targetGP / 100);
    
    // Calculate GST (10% in Australia) on the base price
    const gstAmount = sellPriceExclGST * 0.10;
    const sellPriceInclGST = sellPriceExclGST + gstAmount;
    
    // Apply pricing strategy to the GST-inclusive price (menu price)
    let finalPriceInclGST = sellPriceInclGST;
    
    switch (strategy) {
      case 'charm':
        // Charm pricing: round to .95 or .99
        const charmRounded = Math.ceil(sellPriceInclGST);
        finalPriceInclGST = charmRounded - 0.01;
        break;
      case 'whole':
        // Whole number pricing: round up to nearest dollar
        finalPriceInclGST = Math.ceil(sellPriceInclGST);
        break;
      case 'real':
        // Real price: keep exact calculation
        finalPriceInclGST = sellPriceInclGST;
        break;
    }
    
    // Calculate the GST-exclusive price from the final menu price
    const finalPriceExclGST = finalPriceInclGST / 1.10;
    const finalGstAmount = finalPriceInclGST - finalPriceExclGST;
    
    // Calculate contributing margin (Revenue - Food Cost)
    const contributingMargin = finalPriceExclGST - foodCost;
    const contributingMarginPercent = (contributingMargin / finalPriceExclGST) * 100;
    
    return {
      sellPriceExclGST: finalPriceExclGST,
      sellPriceInclGST: finalPriceInclGST,
      gstAmount: finalGstAmount,
      actualGrossProfit: ((finalPriceExclGST - foodCost) / finalPriceExclGST) * 100,
      grossProfitDollar: finalPriceExclGST - foodCost,
      contributingMargin: contributingMargin,
      contributingMarginPercent: contributingMarginPercent
    };
  }, []);

  const pricingCalculation = useMemo(() => {
    if (costPerPortion > 0) {
      return calculateRecommendedPrices(costPerPortion, targetGrossProfit, pricingStrategy);
    }
    return null;
  }, [costPerPortion, targetGrossProfit, pricingStrategy, calculateRecommendedPrices]);

  // Update pricing when COGS changes
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
    setTargetGrossProfit,
    setPricingStrategy,
  };
};
