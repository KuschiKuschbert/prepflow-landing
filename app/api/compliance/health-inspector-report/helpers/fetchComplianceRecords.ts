/**
 * Fetch compliance records
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
 * Fetch compliance records within a date range.
 *
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Object | null>} Compliance records with type details or null if error
 */
export async function fetchComplianceRecords(startDate: string, endDate: string) {
  if (!supabaseAdmin) return null;

  const { data: complianceRecords, error: complianceError } = await supabaseAdmin
    .from('compliance_records')
    .select(COMPLIANCE_TYPES_SELECT)
    .gte('created_at', `${startDate}T00:00:00Z`)
    .lte('created_at', `${endDate}T23:59:59Z`)
    .order('expiry_date', { ascending: true });

  if (complianceError) {
    logger.warn('[Health Inspector Report] Error fetching compliance records:', {
      error: complianceError.message,
      code: (complianceError as unknown).code,
    });
    return null;
  }

  return {
    all_records: complianceRecords || [],
    active: complianceRecords?.filter(r => r.status === 'active') || [],
    expiring_soon:
      complianceRecords?.filter(r => {
        if (!r.expiry_date) return false;
        const expiry = new Date(r.expiry_date);
        const today = new Date();
        const daysUntilExpiry = Math.ceil(
          (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        );
        return daysUntilExpiry > 0 && daysUntilExpiry <= 90;
      }) || [],
    expired:
      complianceRecords?.filter(r => {
        if (!r.expiry_date) return false;
        return new Date(r.expiry_date) < new Date();
      }) || [],
  };
}
