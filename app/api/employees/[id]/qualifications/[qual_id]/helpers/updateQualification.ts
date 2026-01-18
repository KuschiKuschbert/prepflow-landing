import { ApiErrorHandler, type ApiError } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { QUALIFICATION_SELECT, Qualification } from './schemas';

export async function updateQualification(
  supabase: SupabaseClient,
  employeeId: string,
  qualificationId: string,
  data: {
    certificate_number?: string;
    issue_date?: string;
    expiry_date?: string;
    issuing_authority?: string;
    document_url?: string;
    notes?: string;
  },
): Promise<
  { success: boolean; message: string; data: Qualification } | { error: ApiError; status: number }
> {
  // Verify qualification belongs to employee
  const { data: qualification, error: checkError } = await supabase
    .from('employee_qualifications')
    .select('id, employee_id')
    .eq('id', qualificationId)
    .eq('employee_id', employeeId)
    .single();

  if (checkError || !qualification) {
    return {
      error: ApiErrorHandler.createError('Qualification not found', 'NOT_FOUND', 404),
      status: 404,
    };
  }

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (data.certificate_number !== undefined)
    updateData.certificate_number = data.certificate_number || null;
  if (data.issue_date !== undefined) updateData.issue_date = data.issue_date;
  if (data.expiry_date !== undefined) updateData.expiry_date = data.expiry_date || null;
  if (data.issuing_authority !== undefined)
    updateData.issuing_authority = data.issuing_authority || null;
  if (data.document_url !== undefined) updateData.document_url = data.document_url || null;
  if (data.notes !== undefined) updateData.notes = data.notes || null;

  const { data: updatedQualification, error } = await supabase
    .from('employee_qualifications')
    .update(updateData)
    .eq('id', qualificationId)
    .select(QUALIFICATION_SELECT)
    .single();

  if (error) {
    logger.error('[Employee Qualifications API] Database error updating qualification:', {
      error: error.message,
      code: error.code,
      context: {
        endpoint: '/api/employees/[id]/qualifications/[qual_id]',
        operation: 'PUT',
        table: 'employee_qualifications',
        qualification_id: qualificationId,
      },
    });

    const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
    return { error: apiError, status: apiError.status || 500 };
  }

  return {
    success: true,
    message: 'Qualification updated successfully',
    data: updatedQualification as Qualification,
  };
}
