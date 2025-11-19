/**
 * Performance calculation utilities for PrepFlow COGS Dynamic methodology
 */

import { AggregatedSalesData } from './salesAggregation';

export interface PerformanceMetrics {
  profitCategory: 'High' | 'Low';
  popularityCategory: 'High' | 'Low';
  menuItemClass: "Chef's Kiss" | 'Hidden Gem' | 'Bargain Bucket' | 'Burnt Toast';
  foodCost: number;
  contributionMargin: number;
  grossProfitExclGST: number;
}

/**
 * Calculate profit category based on profit margin and threshold
 */
export function calculateProfitCategory(
  profitMargin: number | null | undefined,
  profitThreshold: number,
): 'High' | 'Low' {
  // Edge case: Negative profit margins are always LOW
  if (profitMargin === null || profitMargin === undefined || profitMargin < 0) {
    return 'Low';
  }
  // HIGH if ≥ average (items at average still "making you smile at the bank")
  return profitMargin >= profitThreshold ? 'High' : 'Low';
}

/**
 * Calculate popularity category based on sales data and threshold
 */
export function calculatePopularityCategory(
  aggregatedSales: AggregatedSalesData,
  popularityThreshold: number,
): 'High' | 'Low' {
  // Edge case: Items without sales data automatically get LOW popularity
  if (!aggregatedSales.hasSalesData) {
    return 'Low';
  }
  if (
    aggregatedSales.popularityPercentage === null ||
    aggregatedSales.popularityPercentage === undefined
  ) {
    return 'Low';
  }
  // HIGH if ≥ 80% threshold (items at threshold still "selling like hot chips")
  return aggregatedSales.popularityPercentage >= popularityThreshold ? 'High' : 'Low';
}

/**
 * Calculate menu item class based on profit and popularity categories
 */
export function calculateMenuItemClass(
  profitCategory: 'High' | 'Low',
  popularityCategory: 'High' | 'Low',
): "Chef's Kiss" | 'Hidden Gem' | 'Bargain Bucket' | 'Burnt Toast' {
  if (profitCategory === 'High' && popularityCategory === 'High') {
    return "Chef's Kiss";
  } else if (profitCategory === 'High' && popularityCategory === 'Low') {
    return 'Hidden Gem';
  } else if (profitCategory === 'Low' && popularityCategory === 'High') {
    return 'Bargain Bucket';
  } else {
    return 'Burnt Toast';
  }
}

/**
 * Calculate all performance metrics for a dish
 */
export function calculatePerformanceMetrics(
  dish: any,
  aggregatedSales: AggregatedSalesData,
  profitThreshold: number,
  popularityThreshold: number,
): PerformanceMetrics {
  // Handle null/undefined profit_margin - default to 0 for calculation purposes
  const profitMargin = dish.profit_margin ?? 0;

  // Calculate food cost and contribution margin (PrepFlow's key metric)
  // In PrepFlow Excel: profit_margin is actually gross profit percentage
  // Food cost = selling price * (100 - profit_margin) / 100
  const foodCost = (dish.selling_price * (100 - profitMargin)) / 100;
  const contributionMargin = dish.selling_price - foodCost;

  // Calculate gross profit excluding GST (PrepFlow standard)
  // Assuming 10% GST rate for Australia
  const gstRate = 0.1;
  const grossProfitExclGST = contributionMargin / (1 + gstRate);

  // Calculate categories
  const profitCategory = calculateProfitCategory(dish.profit_margin, profitThreshold);
  const popularityCategory = calculatePopularityCategory(aggregatedSales, popularityThreshold);
  const menuItemClass = calculateMenuItemClass(profitCategory, popularityCategory);

  return {
    profitCategory,
    popularityCategory,
    menuItemClass,
    foodCost,
    contributionMargin,
    grossProfitExclGST,
  };
}

