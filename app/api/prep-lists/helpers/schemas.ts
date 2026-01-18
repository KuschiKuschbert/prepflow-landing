import { z } from 'zod';

export const getPrepListsSchema = z.object({
  userId: z.string().optional(),
  page: z.preprocess((val) => parseInt(val as string, 10), z.number().min(1).default(1)),
  pageSize: z.preprocess((val) => parseInt(val as string, 10), z.number().min(1).max(100).default(10)),
});

export const createPrepListSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  kitchenSectionId: z.string().min(1, 'Kitchen section ID is required'),
  name: z.string().min(1, 'Prep list name is required'),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        ingredient_id: z.string().optional(),
        quantity: z.number().optional(),
        unit: z.string().optional(),
        notes: z.string().optional(),
      }),
    )
    .optional(),
});

export const updatePrepListSchema = z.object({
  id: z.string().min(1, 'Prep list ID is required'),
  kitchenSectionId: z.string().optional(),
  name: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled', 'draft', 'archived']).optional(),
  items: z
    .array(
      z.object({
        ingredient_id: z.string().min(1, 'Ingredient ID is required'),
        quantity: z.union([z.number(), z.string()]).optional(),
        unit: z.string().optional(),
        notes: z.string().optional(),
      }),
    )
    .optional(),
});

export const deletePrepListSchema = z.string().min(1, 'Prep list ID is required');

export const batchCreateSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  prepLists: z
    .array(
      z.object({
        sectionId: z.string().nullable(),
        name: z.string().min(1, 'Prep list name is required'),
        notes: z.string().optional(),
        items: z.array(
          z.object({
            ingredientId: z.string().min(1, 'Ingredient ID is required'),
            quantity: z.string().optional(),
            unit: z.string().optional(),
            notes: z.string().optional(),
          }),
        ),
      }),
    )
    .min(1, 'At least one prep list is required'),
});

export const generateFromMenuSchema = z.object({
  menuId: z.string().min(1, 'Menu ID is required'),
  userId: z.string().optional(),
});

export const analyzePrepDetailsSchema = z.object({
  recipeIds: z.array(z.string().min(1)).min(1, 'At least one recipe ID is required'),
  countryCode: z.string().default('AU'),
});
