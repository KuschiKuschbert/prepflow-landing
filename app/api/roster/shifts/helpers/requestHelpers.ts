import { logger } from '@/lib/logger';
import { NextRequest } from 'next/server';

export interface CreateShiftRequest {
  employee_id: string;
  shift_date: string;
  start_time: string;
  end_time: string;
  status?: 'draft' | 'published' | 'completed' | 'cancelled';
  role?: string;
  break_duration_minutes?: number;
  notes?: string;
  template_shift_id?: string;
}

export async function validateCreateShiftRequest(
  request: NextRequest,
): Promise<CreateShiftRequest | null> {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.employee_id || !body.shift_date || !body.start_time || !body.end_time) {
      return null;
    }

    return body as CreateShiftRequest;
  } catch (err) {
    logger.warn('[Shifts API] Failed to parse request JSON:', {
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}

export function validateShiftData(data: CreateShiftRequest): { isValid: boolean; error?: string } {
  if (!data.employee_id) return { isValid: false, error: 'Employee ID is required' };
  if (!data.shift_date) return { isValid: false, error: 'Shift date is required' };
  if (!data.start_time) return { isValid: false, error: 'Start time is required' };
  if (!data.end_time) return { isValid: false, error: 'End time is required' };

  // Date format validation
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(data.shift_date)) {
    return { isValid: false, error: 'Invalid date format. Use YYYY-MM-DD' };
  }

  // Timestamp validation
  const startTime = new Date(data.start_time);
  const endTime = new Date(data.end_time);

  if (isNaN(startTime.getTime())) return { isValid: false, error: 'Invalid start time format' };
  if (isNaN(endTime.getTime())) return { isValid: false, error: 'Invalid end time format' };
  if (endTime <= startTime) return { isValid: false, error: 'End time must be after start time' };

  // Status validation
  const validStatuses = ['draft', 'published', 'completed', 'cancelled'];
  if (data.status && !validStatuses.includes(data.status)) {
    return { isValid: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` };
  }

  return { isValid: true };
}
