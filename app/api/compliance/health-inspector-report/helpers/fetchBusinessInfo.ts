/**
 * Fetch business information (licenses, compliance records)
 */

import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';

const COMPLIANCE_TYPES_SELECT = `
  *,
  compliance_types (
    id,
    type_name,
    name,
    description,
    renewal_frequency_days
  )
`;

/**
 * Fetch business information including active compliance records.
 *
 * @returns {Promise<Object | null>} Business info with compliance records or null if error
 */
export async function fetchBusinessInfo() {
  if (!supabaseAdmin) return null;

  const { data: complianceRecords, error: complianceError } = await supabaseAdmin
    .from('compliance_records')
    .select(COMPLIANCE_TYPES_SELECT)
    .eq('status', 'active')
    .order('expiry_date', { ascending: true });

  if (complianceError) {
    logger.warn('[Health Inspector Report] Error fetching compliance records:', {
      error: complianceError.message,
      code: (complianceError as unknown).code,
    });
    return null;
  }

  return {
    active_licenses:
      complianceRecords?.filter(r => {
        const typeName = r.compliance_types?.type_name || r.compliance_types?.name || '';
        return typeName.toLowerCase().includes('license');
      }) || [],
    total_compliance_records: complianceRecords?.length || 0,
  };
}
