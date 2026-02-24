import { z } from 'zod';

export const batchRecipeIdsSchema = z.object({
  recipeIds: z.array(z.string().min(1)).min(1, 'recipeIds must be a non-empty array'),
});
