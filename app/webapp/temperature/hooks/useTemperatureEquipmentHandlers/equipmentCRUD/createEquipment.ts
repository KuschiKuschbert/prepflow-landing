/**
 * Create equipment with optimistic updates.
 */
import { logger } from '@/lib/logger';
import type { TemperatureEquipment } from '../../../types';

interface EquipmentCRUDProps {
  equipment: TemperatureEquipment[];
  setEquipment: React.Dispatch<React.SetStateAction<TemperatureEquipment[]>>;
  fetchEquipment: () => Promise<void>;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

export async function createEquipment(
  name: string,
  equipmentType: string,
  location: string | null,
  minTemp: number | null,
  maxTemp: number | null,
  { equipment, setEquipment, fetchEquipment, showError, showSuccess }: EquipmentCRUDProps,
): Promise<void> {
  const originalEquipment = [...equipment];
  const tempId = `temp-${Date.now()}`;
  const tempEquipment: TemperatureEquipment = {
    id: tempId,
    name,
    equipment_type: equipmentType,
    location,
    min_temp_celsius: minTemp,
    max_temp_celsius: maxTemp,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  setEquipment(prevEquipment => [...prevEquipment, tempEquipment]);
  try {
    const response = await fetch('/api/temperature-equipment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        equipment_type: equipmentType,
        location,
        min_temp_celsius: minTemp,
        max_temp_celsius: maxTemp,
        is_active: true,
      }),
    });
    const data = await response.json();
    if (data.success && data.item) {
      setEquipment(prevEquipment => prevEquipment.map(eq => (eq.id === tempId ? data.item : eq)));
      showSuccess('Equipment created successfully');
      fetchEquipment().catch(err => logger.error('Failed to refresh equipment:', err));
    } else {
      setEquipment(originalEquipment);
      showError(data.error || 'Failed to create equipment');
    }
  } catch (error) {
    setEquipment(originalEquipment);
    logger.error('Failed to create equipment:', error);
    showError('Failed to create equipment. Please check your connection and try again.');
  }
}
