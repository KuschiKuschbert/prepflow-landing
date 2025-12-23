import { z } from 'zod';

export const updateMenuItemSchema = z.object({
  category: z.string().optional(),
  position: z.number().int().positive().optional(),
  actual_selling_price: z.number().positive().nullable().optional(),
});

