import { supabaseAdmin } from '@/lib/supabase';

/**
 * Fetch allergen records.
 *
 * @param {string} startDate - Start date for filtering
 * @param {string} endDate - End date for filtering
 * @returns {Promise<any>} Allergen records data
 */
export async function fetchAllergens(startDate: string, endDate: string) {
  if (!supabaseAdmin) return null;

  const { data: allergenRecords, error: allergenError } = await supabaseAdmin
    .from('allergen_records')
    .select('*')
    .gte('record_date', startDate)
    .lte('record_date', endDate)
    .order('record_date', { ascending: false })
    .limit(200);

  if (allergenError) {
    return null;
  }

  const records = allergenRecords || [];
  return {
    records: records,
    total_records: records.length,
    inaccurate_declarations: records.filter(r => !r.is_accurate),
    high_risk_items: records.filter(r => r.cross_contamination_risk === 'high'),
  };
}

/**
 * Fetch equipment maintenance records.
 *
 * @param {string} startDate - Start date for filtering
 * @param {string} endDate - End date for filtering
 * @returns {Promise<any>} Equipment maintenance data
 */
export async function fetchEquipmentMaintenance(startDate: string, endDate: string) {
  if (!supabaseAdmin) return null;

  const { data: maintenance, error: maintenanceError } = await supabaseAdmin
    .from('equipment_maintenance')
    .select('*')
    .gte('maintenance_date', startDate)
    .lte('maintenance_date', endDate)
    .order('maintenance_date', { ascending: false })
    .limit(200);

  if (maintenanceError) {
    return null;
  }

  const maintenanceRecords = maintenance || [];
  return {
    records: maintenanceRecords,
    total_records: maintenanceRecords.length,
    critical_equipment: maintenanceRecords.filter(m => m.is_critical),
    overdue_maintenance: maintenanceRecords.filter(m => {
      if (!m.next_maintenance_date) return false;
      return new Date(m.next_maintenance_date) < new Date();
    }),
  };
}
