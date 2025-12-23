import { z } from 'zod';

export const updateRecipeSchema = z.object({
  name: z.string().min(1, 'Recipe name is required'),
  yield: z.number().positive().optional(),
  yield_unit: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  instructions: z.string().optional(),
});

