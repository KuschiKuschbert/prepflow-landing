import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';

/**
 * Fetch incident reports.
 *
 * @param {string} startDate - Start date for filtering
 * @param {string} endDate - End date for filtering
 * @returns {Promise<any>} Incident reports data
 */
export async function fetchIncidents(startDate: string, endDate: string) {
  if (!supabaseAdmin) return null;

  const { data: incidents, error: incidentsError } = await supabaseAdmin
    .from('incident_reports')
    .select('*')
    .gte('incident_date', startDate)
    .lte('incident_date', endDate)
    .order('incident_date', { ascending: false })
    .order('severity', { ascending: false })
    .limit(100);

  if (incidentsError) {
    logger.warn('[Health Inspector Report] Error fetching incident reports:', {
      error: incidentsError.message,
      code: (incidentsError as any).code,
    });
    return null;
  }

  const incidentList = incidents || [];
  return {
    incidents: incidentList,
    total_incidents: incidentList.length,
    by_severity: {
      critical: incidentList.filter(i => i.severity === 'critical').length,
      high: incidentList.filter(i => i.severity === 'high').length,
      medium: incidentList.filter(i => i.severity === 'medium').length,
      low: incidentList.filter(i => i.severity === 'low').length,
    },
    by_status: {
      open: incidentList.filter(i => i.status === 'open').length,
      investigating: incidentList.filter(i => i.status === 'investigating').length,
      resolved: incidentList.filter(i => i.status === 'resolved').length,
      closed: incidentList.filter(i => i.status === 'closed').length,
    },
    unresolved: incidentList.filter(i => i.status !== 'closed' && i.status !== 'resolved'),
  };
}

/**
 * Fetch HACCP records.
 *
 * @param {string} startDate - Start date for filtering
 * @param {string} endDate - End date for filtering
 * @returns {Promise<any>} HACCP records data
 */
export async function fetchHACCP(startDate: string, endDate: string) {
  if (!supabaseAdmin) return null;

  const { data: haccpRecords, error: haccpError } = await supabaseAdmin
    .from('haccp_records')
    .select('*')
    .gte('record_date', startDate)
    .lte('record_date', endDate)
    .order('record_date', { ascending: false })
    .limit(200);

  if (haccpError) {
    logger.warn('[Health Inspector Report] Error fetching HACCP records:', {
      error: haccpError.message,
      code: (haccpError as any).code,
    });
    return null;
  }

  const records = haccpRecords || [];
  return {
    records: records,
    total_records: records.length,
    out_of_limit: records.filter(r => !r.is_within_limit),
    by_step: records.reduce((acc: any, r) => {
      acc[r.haccp_step] = (acc[r.haccp_step] || 0) + 1;
      return acc;
    }, {}),
  };
}
