/**
 * Clean Test Data - Ingredients
 * ~40 ingredients demonstrating all categories
 * Clear naming, realistic Australian prices
 *
 * This file combines ingredients from separate category files to stay under size limits
 */

import { cleanSampleMeatIngredients } from '@/data/sample-ingredients-meat';
import { cleanSampleVegetableIngredients } from '@/data/sample-ingredients-vegetables';
import { cleanSampleDairyIngredients } from '@/data/sample-ingredients-dairy';
import { cleanSampleOtherIngredients } from '@/data/sample-ingredients-other';

export const cleanSampleIngredients = [
  ...cleanSampleMeatIngredients,
  ...cleanSampleVegetableIngredients,
  ...cleanSampleDairyIngredients,
  ...cleanSampleOtherIngredients,
];
