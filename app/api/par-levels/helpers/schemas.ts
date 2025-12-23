import { z } from 'zod';

export const createParLevelSchema = z.object({
  ingredient_id: z.string().min(1, 'Ingredient ID is required').optional(),
  ingredientId: z.string().min(1, 'Ingredient ID is required').optional(),
  par_level: z.union([z.number().positive('Par level must be a positive number'), z.string().transform(val => parseFloat(val))]).optional(),
  parLevel: z.number().positive().optional(),
  reorder_point: z.union([z.number().positive('Reorder point must be a positive number'), z.string().transform(val => parseFloat(val))]).optional(),
  reorderPoint: z.number().positive().optional(),
  unit: z.string().min(1, 'Unit is required'),
}).refine(data => {
  const ingredientId = data.ingredient_id || data.ingredientId;
  const parLevel = data.par_level ?? data.parLevel;
  const reorderPoint = data.reorder_point ?? data.reorderPoint;
  return !!ingredientId && parLevel !== undefined && !isNaN(Number(parLevel)) && reorderPoint !== undefined && !isNaN(Number(reorderPoint)) && !!data.unit;
}, {
  message: 'All fields are required: ingredient_id (or ingredientId), par_level (or parLevel), reorder_point (or reorderPoint), and unit',
});

export const updateParLevelSchema = z.object({
  id: z.string().min(1, 'Par level ID is required'),
  ingredient_id: z.string().optional(),
  ingredientId: z.string().optional(),
  par_level: z.number().positive().optional().or(z.string().transform(val => parseFloat(val))),
  parLevel: z.number().positive().optional(),
  reorder_point: z.number().positive().optional().or(z.string().transform(val => parseFloat(val))),
  reorderPoint: z.number().positive().optional(),
  unit: z.string().optional(),
});
