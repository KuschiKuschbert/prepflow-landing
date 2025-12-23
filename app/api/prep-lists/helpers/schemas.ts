import { z } from 'zod';

export const createPrepListSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  kitchenSectionId: z.string().min(1, 'Kitchen section ID is required'),
  name: z.string().min(1, 'Prep list name is required'),
  notes: z.string().optional(),
  items: z.array(z.object({
    ingredient_id: z.string().optional(),
    quantity: z.number().optional(),
    unit: z.string().optional(),
    notes: z.string().optional(),
  })).optional(),
});

