/**
 * Fetch equipment helper.
 */
import { cacheData } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';
import type { TemperatureEquipment } from '../../types';

export async function fetchEquipmentHelper(
  setEquipment: (equipment: TemperatureEquipment[]) => void,
): Promise<void> {
  try {
    const response = await fetch('/api/temperature-equipment');
    const data = await response.json();
    if (data.success && data.data) {
      setEquipment(data.data);
      cacheData('temperature_equipment', data.data);
    }
  } catch (error) {
    logger.error('Error fetching equipment:', error);
  }
}
