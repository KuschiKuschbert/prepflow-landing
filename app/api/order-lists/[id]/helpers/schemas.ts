import { z } from 'zod';

export const updateOrderListSchema = z.object({
  supplierId: z.string().uuid().optional(),
  name: z.string().min(1).optional(),
  notes: z.string().optional(),
  status: z.enum(['draft', 'pending', 'ordered', 'received', 'cancelled']).optional(),
  items: z
    .array(
      z.object({
        ingredientId: z.string().uuid(),
        quantity: z.number().positive(),
        unit: z.string().min(1),
        notes: z.string().optional(),
      }),
    )
    .optional(),
});

