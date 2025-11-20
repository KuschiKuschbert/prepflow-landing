/**
 * Clean Test Data - Ingredients
 * ~45 ingredients demonstrating all categories
 * Clear naming, realistic Australian prices
 *
 * This file combines ingredients from separate category files to stay under size limits
 */

import { cleanSampleConsumablesIngredients } from '@/data/sample-ingredients-consumables';
import { cleanSampleDairyIngredients } from '@/data/sample-ingredients-dairy';
import { cleanSampleMeatIngredients } from '@/data/sample-ingredients-meat';
import { cleanSampleOtherIngredients } from '@/data/sample-ingredients-other';
import { cleanSampleVegetableIngredients } from '@/data/sample-ingredients-vegetables';

export const cleanSampleIngredients = [
  ...cleanSampleMeatIngredients,
  ...cleanSampleVegetableIngredients,
  ...cleanSampleDairyIngredients,
  ...cleanSampleOtherIngredients,
  ...cleanSampleConsumablesIngredients,
];
