/**
 * Delete equipment with optimistic updates.
 */
import { logger } from '@/lib/logger';
import type { TemperatureEquipment } from '../../../types';

interface EquipmentCRUDProps {
  equipment: TemperatureEquipment[];
  setEquipment: React.Dispatch<React.SetStateAction<TemperatureEquipment[]>>;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

export async function deleteEquipment(
  equipmentId: string,
  { equipment, setEquipment, showError, showSuccess }: EquipmentCRUDProps,
): Promise<void> {
  const originalEquipment = [...equipment];
  const equipmentToDelete = equipment.find(eq => eq.id === equipmentId);
  if (!equipmentToDelete) {
    showError('Equipment not found');
    return;
  }
  setEquipment(prevEquipment => prevEquipment.filter(eq => eq.id !== equipmentId));
  try {
    const response = await fetch(`/api/temperature-equipment/${equipmentId}`, { method: 'DELETE' });
    const data = await response.json();
    if (data.success) {
      showSuccess('Equipment deleted successfully');
    } else {
      setEquipment(originalEquipment);
      showError(data.error || 'Failed to delete equipment');
    }
  } catch (error) {
    setEquipment(originalEquipment);
    logger.error('Failed to delete equipment:', error);
    showError('Failed to delete equipment. Please check your connection and try again.');
  }
}
