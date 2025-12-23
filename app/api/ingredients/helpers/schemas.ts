import { z } from 'zod';

export const createIngredientSchema = z.object({
  ingredient_name: z.string().min(1, 'ingredient_name is required').optional(),
  name: z.string().min(1, 'name is required').optional(), // Legacy field name
  supplier: z.string().optional(),
  storage_location: z.string().optional(),
  cost: z.number().optional(),
  cost_per_unit: z.number().optional(),
  pack_price: z.number().optional(),
  unit: z.string().optional(),
  pack_size: z.number().optional(),
  pack_size_unit: z.string().optional(),
  brand: z.string().optional(),
  trim_peel_waste_percentage: z.number().min(0).max(100).optional(),
  yield_percentage: z.number().min(0).max(100).optional(),
  min_stock_level: z.number().optional(),
  current_stock: z.number().optional(),
  allergens: z.array(z.string()).optional(),
  allergen_source: z.any().optional(),
  notes: z.string().optional(),
}).refine(data => data.ingredient_name || data.name, {
  message: 'ingredient_name or name is required',
  path: ['ingredient_name'],
});

export const updateIngredientSchema = z.object({
  id: z.string().min(1, 'Ingredient ID is required'),
  ingredient_name: z.string().optional(),
  name: z.string().optional(), // Legacy field name
  supplier: z.string().optional(),
  storage_location: z.string().optional(),
  cost: z.number().optional(),
  cost_per_unit: z.number().optional(),
  pack_price: z.number().optional(),
  unit: z.string().optional(),
  pack_size: z.number().optional(),
  pack_size_unit: z.string().optional(),
  brand: z.string().optional(),
  trim_peel_waste_percentage: z.number().min(0).max(100).optional(),
  yield_percentage: z.number().min(0).max(100).optional(),
  min_stock_level: z.number().optional(),
  current_stock: z.number().optional(),
  allergens: z.array(z.string()).optional(),
  allergen_source: z.any().optional(),
  notes: z.string().optional(),
});
