import { z } from 'zod';

/**
 * Base shift schema without refinements (for .partial() compatibility)
 */
const shiftBaseSchema = z.object({
  employee_id: z.string().uuid('Employee ID must be a valid UUID'),
  shift_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD'),
  start_time: z.string().datetime('Invalid start time format'),
  end_time: z.string().datetime('Invalid end time format'),
  status: z.enum(['draft', 'published', 'completed', 'cancelled']).optional().default('draft'),
  role: z.string().optional().nullable(),
  break_duration_minutes: z.number().int().nonnegative().optional().default(0),
  notes: z.string().optional().nullable(),
  template_shift_id: z.string().uuid().optional().nullable(),
});

/**
 * Create shift schema with start/end time validation
 */
export const createShiftSchema = shiftBaseSchema.refine(
  data => {
    const startTime = new Date(data.start_time);
    const endTime = new Date(data.end_time);
    return endTime > startTime;
  },
  {
    message: 'End time must be after start time',
    path: ['end_time'],
  },
);

/**
 * Update shift schema - partial fields with conditional time validation
 */
export const updateShiftSchema = shiftBaseSchema.partial().refine(
  data => {
    // If both times are present, validate order
    if (data.start_time && data.end_time) {
      const startTime = new Date(data.start_time);
      const endTime = new Date(data.end_time);
      return endTime > startTime;
    }
    // Otherwise valid (partial update)
    return true;
  },
  {
    message: 'End time must be after start time',
    path: ['end_time'],
  },
);
