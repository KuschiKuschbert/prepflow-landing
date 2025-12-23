import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { QUALIFICATION_SELECT } from './schemas';

export async function createQualification(
  employeeId: string,
  data: {
    qualification_type_id: string;
    certificate_number?: string;
    issue_date: string;
    expiry_date?: string;
    issuing_authority?: string;
    document_url?: string;
    notes?: string;
  },
): Promise<{ success: boolean; message: string; data: any } | { error: any; status: number }> {
  // Verify employee exists
  const { data: employee, error: employeeError } = await supabaseAdmin
    .from('employees')
    .select('id')
    .eq('id', employeeId)
    .single();

  if (employeeError || !employee) {
    return {
      error: ApiErrorHandler.createError('Employee not found', 'NOT_FOUND', 404),
      status: 404,
    };
  }

  const { data, error } = await supabaseAdmin
    .from('employee_qualifications')
    .insert({
      employee_id: employeeId,
      qualification_type_id: data.qualification_type_id,
      certificate_number: data.certificate_number || null,
      issue_date: data.issue_date,
      expiry_date: data.expiry_date || null,
      issuing_authority: data.issuing_authority || null,
      document_url: data.document_url || null,
      notes: data.notes || null,
    })
    .select(QUALIFICATION_SELECT)
    .single();

  if (error) {
    logger.error('[Employee Qualifications API] Database error creating qualification:', {
      error: error.message,
      code: (error as any).code,
      context: {
        endpoint: '/api/employees/[id]/qualifications',
        operation: 'POST',
        table: 'employee_qualifications',
        employee_id: employeeId,
      },
    });

    const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
    return { error: apiError, status: apiError.status || 500 };
  }

  return {
    success: true,
    message: 'Qualification added successfully',
    data,
  };
}

