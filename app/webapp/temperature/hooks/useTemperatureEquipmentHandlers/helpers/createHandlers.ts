/**
 * Create equipment handlers.
 */
import type { TemperatureEquipment } from '../../../types';
import { updateEquipment, createEquipment, deleteEquipment } from '../equipmentCRUD';

export function createEquipmentHandlers(
  equipment: TemperatureEquipment[],
  setEquipment: React.Dispatch<React.SetStateAction<TemperatureEquipment[]>>,
  showError: (message: string) => void,
  showSuccess: (message: string) => void,
) {
  return {
    handleUpdateEquipment: async (equipmentId: string, updates: Partial<TemperatureEquipment>) => {
      await updateEquipment(equipmentId, updates, {
        equipment,
        setEquipment,
        showError,
        showSuccess,
      });
    },
    handleCreateEquipment: async (
      name: string,
      equipmentType: string,
      location: string | null,
      minTemp: number | null,
      maxTemp: number | null,
    ) => {
      await createEquipment(name, equipmentType, location, minTemp, maxTemp, {
        equipment,
        setEquipment,
        showError,
        showSuccess,
      });
    },
    handleDeleteEquipment: async (equipmentId: string) => {
      await deleteEquipment(equipmentId, {
        equipment,
        setEquipment,
        showError,
        showSuccess,
      });
    },
  };
}
