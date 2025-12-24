import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { calculateComplianceStatus } from './calculateComplianceStatus';

const COMPLIANCE_TYPES_SELECT = `
  *,
  compliance_types (
    id,
    name,
    description,
    renewal_frequency_days
  )
`;

/**
 * Update a compliance record.
 *
 * @param {string} id - Compliance record ID
 * @param {Object} updateData - Update data
 * @returns {Promise<Object>} Updated compliance record
 * @throws {Error} If update fails
 */
export async function updateComplianceRecord(
  id: string,
  updateData: {
    document_name?: string;
    issue_date?: string | null;
    expiry_date?: string | null;
    document_url?: string | null;
    photo_url?: string | null;
    notes?: string | null;
    reminder_enabled?: boolean;
    reminder_days_before?: number;
  },
) {
  if (!supabaseAdmin)
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 503);

  const finalUpdateData: any = {};
  if (updateData.document_name !== undefined)
    finalUpdateData.document_name = updateData.document_name;
  if (updateData.issue_date !== undefined) finalUpdateData.issue_date = updateData.issue_date;
  if (updateData.expiry_date !== undefined) {
    finalUpdateData.expiry_date = updateData.expiry_date;
    finalUpdateData.status = calculateComplianceStatus(
      updateData.expiry_date,
      updateData.reminder_days_before,
    );
  }
  if (updateData.document_url !== undefined) finalUpdateData.document_url = updateData.document_url;
  if (updateData.photo_url !== undefined) finalUpdateData.photo_url = updateData.photo_url;
  if (updateData.notes !== undefined) finalUpdateData.notes = updateData.notes;
  if (updateData.reminder_enabled !== undefined)
    finalUpdateData.reminder_enabled = updateData.reminder_enabled;
  if (updateData.reminder_days_before !== undefined)
    finalUpdateData.reminder_days_before = updateData.reminder_days_before;

  const { data, error } = await supabaseAdmin
    .from('compliance_records')
    .update(finalUpdateData)
    .eq('id', id)
    .select(COMPLIANCE_TYPES_SELECT)
    .single();

  if (error) {
    logger.error('[Compliance Records API] Database error updating record:', {
      error: error.message,
      code: (error as any).code,
      context: { endpoint: '/api/compliance-records', operation: 'PUT', recordId: id },
    });
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }

  return data;
}
