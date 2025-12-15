/**
 * Validate shift form data.
 */
export function validateShiftForm(formData: {
  employee_id: string;
  shift_date: string;
  start_time: string;
  end_time: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!formData.employee_id) errors.employee_id = 'Employee is required';
  if (!formData.shift_date) errors.shift_date = 'Date is required';
  if (!formData.start_time) errors.start_time = 'Start time is required';
  if (!formData.end_time) errors.end_time = 'End time is required';
  if (formData.start_time && formData.end_time) {
    const [startHour, startMin] = formData.start_time.split(':').map(Number);
    const [endHour, endMin] = formData.end_time.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    if (endMinutes <= startMinutes) {
      errors.end_time = 'End time must be after start time';
    }
  }
  return errors;
}
