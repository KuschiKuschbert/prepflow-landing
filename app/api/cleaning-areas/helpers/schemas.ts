import { z } from 'zod';

export const createCleaningAreaSchema = z.object({
  area_name: z.string().min(1, 'Area name is required'),
  description: z.string().optional(),
  cleaning_frequency: z.string().optional(),
});

export const updateCleaningAreaSchema = z.object({
  id: z.string().min(1, 'Cleaning area ID is required'),
  area_name: z.string().optional(),
  description: z.string().optional(),
  cleaning_frequency: z.string().optional(),
  is_active: z.boolean().optional(),
});

