/**
 * Validates shift request data.
 *
 * @param {any} body - Request body
 * @returns {{ isValid: boolean; error?: string; data?: any }} Validation result
 */
export function validateShiftRequest(body: any): { isValid: boolean; error?: string; data?: any } {
  if (!body.employee_id) {
    return { isValid: false, error: 'Employee ID is required' };
  }

  if (!body.shift_date) {
    return { isValid: false, error: 'Shift date is required' };
  }

  if (!body.start_time) {
    return { isValid: false, error: 'Start time is required' };
  }

  if (!body.end_time) {
    return { isValid: false, error: 'End time is required' };
  }

  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(body.shift_date)) {
    return { isValid: false, error: 'Invalid date format. Use YYYY-MM-DD' };
  }

  // Validate timestamps
  const startTime = new Date(body.start_time);
  const endTime = new Date(body.end_time);

  if (isNaN(startTime.getTime())) {
    return { isValid: false, error: 'Invalid start time format' };
  }

  if (isNaN(endTime.getTime())) {
    return { isValid: false, error: 'Invalid end time format' };
  }

  if (endTime <= startTime) {
    return { isValid: false, error: 'End time must be after start time' };
  }

  // Validate status if provided
  const validStatuses = ['draft', 'published', 'completed', 'cancelled'];
  if (body.status && !validStatuses.includes(body.status)) {
    return { isValid: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` };
  }

  return {
    isValid: true,
    data: {
      employee_id: body.employee_id,
      template_shift_id: body.template_shift_id || null,
      shift_date: body.shift_date,
      start_time: body.start_time,
      end_time: body.end_time,
      status: body.status || 'draft',
      role: body.role || null,
      break_duration_minutes: body.break_duration_minutes || 0,
      notes: body.notes || null,
    },
  };
}
