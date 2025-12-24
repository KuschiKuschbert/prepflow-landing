import { z } from 'zod';

export const createCleaningTaskSchema = z.object({
  task_name: z.string().min(1, 'Task name is required'),
  frequency_type: z.enum(['daily', 'bi-daily', 'weekly', 'monthly', '3-monthly']),
  area_id: z.string().optional(),
  assigned_date: z.string().optional(),
  equipment_id: z.string().optional(),
  section_id: z.string().optional(),
  is_standard_task: z.boolean().optional(),
  standard_task_type: z.string().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
});

export const updateCleaningTaskSchema = z.object({
  id: z.string().min(1, 'Cleaning task ID is required'),
  status: z.string().optional(),
  completed_date: z.string().optional(),
  notes: z.string().optional(),
  photo_url: z.string().url().optional().or(z.literal('')),
});
