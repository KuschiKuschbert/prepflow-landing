import { z } from 'zod';

export const createAvailabilitySchema = z.object({
  employee_id: z.string().uuid('Employee ID must be a valid UUID'),
  day_of_week: z.number().int().min(0).max(6, 'Day of week must be between 0 (Sunday) and 6 (Saturday)'),
  start_time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'Start time must be in HH:MM:SS format').optional().nullable(),
  end_time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'End time must be in HH:MM:SS format').optional().nullable(),
  is_available: z.boolean().optional().default(true),
});

