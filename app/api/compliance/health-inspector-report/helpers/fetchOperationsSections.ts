import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';

/**
 * Fetch waste management logs.
 *
 * @param {string} startDate - Start date for filtering
 * @param {string} endDate - End date for filtering
 * @returns {Promise<any>} Waste management data
 */
export async function fetchWasteManagement(startDate: string, endDate: string) {
  if (!supabaseAdmin) return null;

  const { data: wasteLogs, error: wasteError } = await supabaseAdmin
    .from('waste_management_logs')
    .select('*')
    .gte('log_date', startDate)
    .lte('log_date', endDate)
    .order('log_date', { ascending: false })
    .limit(200);

  if (wasteError) {
    logger.warn('[Health Inspector Report] Error fetching waste management logs:', {
      error: wasteError.message,
      code: (wasteError as any).code,
    });
  }

  const logs = wasteLogs || [];
  return {
    logs: logs,
    total_logs: logs.length,
    by_type: logs.reduce((acc: any, l) => {
      acc[l.waste_type] = (acc[l.waste_type] || 0) + 1;
      return acc;
    }, {}),
  };
}

/**
 * Fetch food safety procedures.
 *
 * @returns {Promise<any>} Food safety procedures data
 */
export async function fetchProcedures() {
  if (!supabaseAdmin) return null;

  const { data: procedures, error: proceduresError } = await supabaseAdmin
    .from('food_safety_procedures')
    .select('*')
    .eq('is_active', true)
    .order('procedure_type');

  if (proceduresError) {
    return null;
  }

  const procedureList = procedures || [];
  return {
    procedures: procedureList,
    total_procedures: procedureList.length,
    overdue_reviews: procedureList.filter(p => {
      if (!p.next_review_date) return false;
      return new Date(p.next_review_date) < new Date();
    }),
    by_type: procedureList.reduce((acc: any, p) => {
      acc[p.procedure_type] = (acc[p.procedure_type] || 0) + 1;
      return acc;
    }, {}),
  };
}

/**
 * Fetch supplier verification records.
 *
 * @param {string} startDate - Start date for filtering
 * @param {string} endDate - End date for filtering
 * @returns {Promise<any>} Supplier verification data
 */
export async function fetchSupplierVerification(startDate: string, endDate: string) {
  if (!supabaseAdmin) return null;

  const SUPPLIER_SELECT = `
    *,
    suppliers (
      id,
      supplier_name,
      contact_person,
      email,
      phone
    )
  `;

  const { data: supplierVerification, error: supplierError } = await supabaseAdmin
    .from('supplier_verification')
    .select(SUPPLIER_SELECT)
    .gte('verification_date', startDate)
    .lte('verification_date', endDate)
    .order('verification_date', { ascending: false })
    .limit(200);

  if (supplierError) {
    return null;
  }

  const verifications = supplierVerification || [];
  return {
    verifications: verifications,
    total_verifications: verifications.length,
    invalid_certificates: verifications.filter(v => !v.is_valid),
    expired_certificates: verifications.filter(v => {
      if (!v.expiry_date) return false;
      return new Date(v.expiry_date) < new Date();
    }),
  };
}
