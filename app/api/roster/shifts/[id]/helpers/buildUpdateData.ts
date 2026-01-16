/**
 * Build update data object from request body
 */
export function buildUpdateData(body: any, existingShift: any): unknown {
  const updateData: any = {
    updated_at: new Date().toISOString(),
  };

  if (body.employee_id !== undefined) updateData.employee_id = body.employee_id;
  if (body.shift_date !== undefined) updateData.shift_date = body.shift_date;
  if (body.start_time !== undefined) updateData.start_time = body.start_time;
  if (body.end_time !== undefined) updateData.end_time = body.end_time;
  if (body.status !== undefined) {
    updateData.status = body.status;
    // Set published_at if status changes to published
    if (body.status === 'published' && existingShift.status !== 'published') {
      updateData.published_at = new Date().toISOString();
    }
    // Clear published_at if status changes from published
    if (body.status !== 'published' && existingShift.status === 'published') {
      updateData.published_at = null;
    }
  }
  if (body.role !== undefined) updateData.role = body.role;
  if (body.break_duration_minutes !== undefined)
    updateData.break_duration_minutes = body.break_duration_minutes;
  if (body.notes !== undefined) updateData.notes = body.notes;
  if (body.template_shift_id !== undefined) updateData.template_shift_id = body.template_shift_id;

  return updateData;
}
