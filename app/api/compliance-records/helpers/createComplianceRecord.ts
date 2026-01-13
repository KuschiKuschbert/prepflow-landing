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

import type { ComplianceRecord, CreateComplianceRecordInput } from './schemas';

/**
 * Create a compliance record.
 *
 * @param {CreateComplianceRecordInput} recordData - Compliance record data
 * @returns {Promise<ComplianceRecord>} Created compliance record
 * @throws {Error} If creation fails
 */
export async function createComplianceRecord(
  recordData: CreateComplianceRecordInput,
): Promise<ComplianceRecord> {
  if (!supabaseAdmin) {
    logger.error('[Compliance Records] Database connection not available');
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  const status = calculateComplianceStatus(
    recordData.expiry_date || null,
    recordData.reminder_days_before,
  );

  const { data, error } = await supabaseAdmin
    .from('compliance_records')
    .insert({
      compliance_type_id: recordData.compliance_type_id,
      document_name: recordData.document_name,
      issue_date: recordData.issue_date || null,
      expiry_date: recordData.expiry_date || null,
      status,
      document_url: recordData.document_url || null,
      photo_url: recordData.photo_url || null,
      notes: recordData.notes || null,
      reminder_enabled:
        recordData.reminder_enabled !== undefined ? recordData.reminder_enabled : true,
      reminder_days_before: recordData.reminder_days_before || 30,
    })
    .select(COMPLIANCE_TYPES_SELECT)
    .single();

  if (error) {
    logger.error('[Compliance Records API] Database error creating record:', {
      error: error.message,
      code: error.code,
      context: {
        endpoint: '/api/compliance-records',
        operation: 'POST',
        table: 'compliance_records',
      },
    });
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }

  return data as unknown as ComplianceRecord;
}
