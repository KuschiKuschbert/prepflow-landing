import { z } from 'zod';

export type CreateCleaningAreaInput = z.infer<typeof createCleaningAreaSchema>;
export type UpdateCleaningAreaInput = z.infer<typeof updateCleaningAreaSchema>;

export interface CleaningArea {
  id: string;
  user_id: string;
  area_name: string;
  description?: string | null;
  cleaning_frequency?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

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
