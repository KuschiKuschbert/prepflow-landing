/**
 * Update equipment with optimistic updates.
 */
import { logger } from '@/lib/logger';
import type { TemperatureEquipment } from '../../../types';

interface EquipmentCRUDProps {
  equipment: TemperatureEquipment[];
  setEquipment: React.Dispatch<React.SetStateAction<TemperatureEquipment[]>>;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

export async function updateEquipment(
  equipmentId: string,
  updates: Partial<TemperatureEquipment>,
  { equipment, setEquipment, showError, showSuccess }: EquipmentCRUDProps,
): Promise<void> {
  const originalEquipment = [...equipment];
  const equipmentToUpdate = equipment.find(eq => eq.id === equipmentId);
  if (!equipmentToUpdate) {
    showError('Equipment not found');
    return;
  }
  setEquipment(prevEquipment =>
    prevEquipment.map(eq => (eq.id === equipmentId ? { ...eq, ...updates } : eq)),
  );
  try {
    const response = await fetch(`/api/temperature-equipment/${equipmentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await response.json();
    if (data.success) {
      // Replace optimistic update with server response if different
      if (data.item) {
        setEquipment(prevEquipment =>
          prevEquipment.map(eq => (eq.id === equipmentId ? data.item : eq)),
        );
      }
      showSuccess('Equipment updated successfully');
    } else {
      setEquipment(originalEquipment);
      showError(data.error || 'Failed to update equipment');
    }
  } catch (error) {
    setEquipment(originalEquipment);
    logger.error('Failed to update equipment:', error);
    showError('Failed to update equipment. Please check your connection and try again.');
  }
}
