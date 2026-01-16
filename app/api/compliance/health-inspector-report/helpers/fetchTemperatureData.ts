/**
 * Fetch temperature logs and violations
 */

import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

interface TemperatureViolation {
  violation_type: string;
  threshold?: number;
  deviation?: string;
  time_in_zone?: string;
  [key: string]: unknown;
}

export async function fetchTemperatureData(startDate: string, endDate: string) {
  if (!supabaseAdmin) return { logs: null, violations: null };

  // Get temperature equipment thresholds
  const { data: equipment, error: equipmentError } = await supabaseAdmin
    .from('temperature_equipment')
    .select('*')
    .eq('is_active', true);

  if (equipmentError) {
    logger.warn('[Health Inspector Report] Error fetching temperature equipment:', {
      error: equipmentError.message,
      code: equipmentError.code,
    });
  }

  const equipmentMap = new Map();
  equipment?.forEach(eq => {
    equipmentMap.set(eq.name?.toLowerCase() || eq.location?.toLowerCase(), {
      min: eq.min_temp_celsius,
      max: eq.max_temp_celsius,
      type: eq.equipment_type,
    });
  });

  const { data: temperatureLogs, error: tempError } = await supabaseAdmin
    .from('temperature_logs')
    .select('*')
    .gte('log_date', startDate)
    .lte('log_date', endDate)
    .order('log_date', { ascending: false })
    .order('log_time', { ascending: false })
    .limit(500);

  if (tempError) {
    logger.warn('[Health Inspector Report] Error fetching temperature logs:', {
      error: tempError.message,
      code: tempError.code,
    });
    return { logs: null, violations: null };
  }

  const logs = temperatureLogs || [];

  // Analyze violations
  const violations: TemperatureViolation[] = [];
  const dangerZoneViolations: TemperatureViolation[] = [];

  logs.forEach(log => {
    const temp = parseFloat(log.temperature_celsius);
    const location = log.location?.toLowerCase() || log.temperature_type?.toLowerCase();
    const eq = equipmentMap.get(location);

    // Check for out-of-range violations
    if (eq) {
      if (eq.min !== null && temp < eq.min) {
        violations.push({
          ...log,
          violation_type: 'below_minimum',
          threshold: eq.min,
          deviation: (eq.min - temp).toFixed(2),
        });
      }
      if (eq.max !== null && temp > eq.max) {
        violations.push({
          ...log,
          violation_type: 'above_maximum',
          threshold: eq.max,
          deviation: (temp - eq.max).toFixed(2),
        });
      }
    }

    // Check for danger zone (5°C to 60°C for cold/hot holding)
    if (temp >= 5 && temp <= 60) {
      if (log.temperature_type === 'fridge' || log.temperature_type === 'storage') {
        dangerZoneViolations.push({
          ...log,
          violation_type: 'danger_zone',
          time_in_zone: 'Unknown', // Would need sequential logs to calculate
        });
      }
    }
  });

  return {
    logs: {
      logs: logs,
      total_logs: logs.length,
      date_range: {
        start: startDate,
        end: endDate,
      },
    },
    violations: {
      total_violations: violations.length + dangerZoneViolations.length,
      out_of_range: violations,
      danger_zone: dangerZoneViolations,
      violation_summary: {
        below_minimum: violations.filter(v => v.violation_type === 'below_minimum').length,
        above_maximum: violations.filter(v => v.violation_type === 'above_maximum').length,
        danger_zone_count: dangerZoneViolations.length,
      },
    },
  };
}
