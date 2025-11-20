/**
 * CRUD operations for temperature equipment.
 */
import { logger } from '@/lib/logger';
import type { TemperatureEquipment } from '../../types';

interface EquipmentCRUDProps {
  equipment: TemperatureEquipment[];
  setEquipment: React.Dispatch<React.SetStateAction<TemperatureEquipment[]>>;
  fetchEquipment: () => Promise<void>;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

/**
 * Update equipment with optimistic updates.
 */
export async function updateEquipment(
  equipmentId: string,
  updates: Partial<TemperatureEquipment>,
  { equipment, setEquipment, fetchEquipment, showError, showSuccess }: EquipmentCRUDProps,
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
      fetchEquipment().catch(err => logger.error('Failed to refresh equipment:', err));
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
/**
 * Create equipment with optimistic updates.
 */
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
/**
 * Delete equipment with optimistic updates.
 */
export async function deleteEquipment(
  equipmentId: string,
  { equipment, setEquipment, fetchEquipment, showError, showSuccess }: EquipmentCRUDProps,
): Promise<void> {
  const originalEquipment = [...equipment];
  const equipmentToDelete = equipment.find(eq => eq.id === equipmentId);
  if (!equipmentToDelete) {
    showError('Equipment not found');
    return;
  }
  setEquipment(prevEquipment => prevEquipment.filter(eq => eq.id !== equipmentId));
  try {
    const response = await fetch(`/api/temperature-equipment/${equipmentId}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (data.success) {
      showSuccess('Equipment deleted successfully');
      fetchEquipment().catch(err => logger.error('Failed to refresh equipment:', err));
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
