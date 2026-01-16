import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';

/**
 * Fetch sanitizer logs.
 *
 * @param {string} startDate - Start date for filtering
 * @param {string} endDate - End date for filtering
 * @returns {Promise<any>} Sanitizer logs data
 */
export async function fetchSanitizerLogs(startDate: string, endDate: string) {
  if (!supabaseAdmin) return null;

  const { data: sanitizerLogs, error: sanitizerError } = await supabaseAdmin
    .from('sanitizer_logs')
    .select('*')
    .gte('log_date', startDate)
    .lte('log_date', endDate)
    .order('log_date', { ascending: false })
    .order('log_time', { ascending: false })
    .limit(200);

  if (sanitizerError) {
    logger.warn('[Health Inspector Report] Error fetching sanitizer logs:', {
      error: sanitizerError.message,
      code: sanitizerError.code,
    });
  }

  const logs = sanitizerLogs || [];
  return {
    logs: logs,
    total_logs: logs.length,
    out_of_range: logs.filter(l => !l.is_within_range),
    date_range: {
      start: startDate,
      end: endDate,
    },
  };
}

/**
 * Fetch staff health declarations.
 *
 * @param {string} startDate - Start date for filtering
 * @param {string} endDate - End date for filtering
 * @returns {Promise<any>} Staff health data
 */
export async function fetchStaffHealth(startDate: string, endDate: string) {
  if (!supabaseAdmin) return null;

  const { data: healthDeclarations, error: healthError } = await supabaseAdmin
    .from('staff_health_declarations')
    .select('*, employees(full_name, role)')
    .gte('declaration_date', startDate)
    .lte('declaration_date', endDate)
    .order('declaration_date', { ascending: false })
    .limit(200);

  if (healthError) {
    logger.warn('[Health Inspector Report] Error fetching staff health declarations:', {
      error: healthError.message,
      code: healthError.code,
    });
  }

  const declarations = healthDeclarations || [];
  return {
    declarations: declarations,
    total_declarations: declarations.length,
    unhealthy_count: declarations.filter(d => !d.is_healthy).length,
    excluded_count: declarations.filter(d => d.excluded_from_work).length,
    date_range: {
      start: startDate,
      end: endDate,
    },
  };
}
