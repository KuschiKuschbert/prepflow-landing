import { z } from 'zod';

// --- Base Schemas ---

export const specialDaySchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  name: z.string().min(1, 'Name is required'),
  date: z.string(), // ISO date string
  demand_level: z.enum(['Low', 'Medium', 'High']).default('Medium'),
  is_public_holiday: z.boolean().default(false),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

// --- Input Schemas ---

export const createSpecialDaySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  date: z.string(),
  demand_level: z.enum(['Low', 'Medium', 'High']).default('Medium'),
  is_public_holiday: z.boolean().default(false),
});

export const updateSpecialDaySchema = createSpecialDaySchema.partial();

// --- Inferred Types ---

export type SpecialDay = z.infer<typeof specialDaySchema>;
export type CreateSpecialDayInput = z.infer<typeof createSpecialDaySchema>;
export type UpdateSpecialDayInput = z.infer<typeof updateSpecialDaySchema>;
