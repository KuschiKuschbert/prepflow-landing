/**
 * Equipment handlers.
 */
import type { TemperatureEquipment } from '../../../types';
import { handleGenerateSampleData } from '../../utils/generateSampleDataHandler';

export function createEquipmentHandlersHelper(
  equipment: TemperatureEquipment[],
  itemsPerPage: number,
  currentPage: number,
  setCurrentPage: (page: number) => void,
  newEquipment: {
    name: string;
    equipmentType: string;
    location: string;
    minTemp: number | null;
    maxTemp: number | null;
  },
  setNewEquipment: (equipment: {
    name: string;
    equipmentType: string;
    location: string;
    minTemp: number | null;
    maxTemp: number | null;
  }) => void,
  setShowCreateForm: (show: boolean) => void,
  setEditingEquipment: (id: string | null) => void,
  onUpdateEquipment: (equipmentId: string, updates: Partial<TemperatureEquipment>) => Promise<void>,
  onCreateEquipment: (
    name: string,
    equipmentType: string,
    location: string | null,
    minTemp: number | null,
    maxTemp: number | null,
  ) => Promise<void>,
  onDeleteEquipment: (equipmentId: string) => Promise<void>,
  onRefreshLogs: (() => Promise<void>) | undefined,
  setIsGenerating: (generating: boolean) => void,
  showSuccess: (message: string) => void,
  showError: (message: string) => void,
  showConfirm: (options: {
    title: string;
    message: string;
    variant?: 'danger' | 'warning' | 'info';
    confirmLabel?: string;
    cancelLabel?: string;
  }) => Promise<boolean>,
) {
  return {
    handleCreateEquipment: async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await onCreateEquipment(
          newEquipment.name,
          newEquipment.equipmentType,
          newEquipment.location || null,
          newEquipment.minTemp,
          newEquipment.maxTemp,
        );
        setNewEquipment({
          name: '',
          equipmentType: '',
          location: '',
          minTemp: null,
          maxTemp: null,
        });
        setShowCreateForm(false);
        setCurrentPage(Math.ceil((equipment.length + 1) / itemsPerPage));
      } catch (error) {}
    },
    handleUpdateEquipment: async (equipmentId: string, updates: Partial<TemperatureEquipment>) => {
      try {
        await onUpdateEquipment(equipmentId, updates);
        setEditingEquipment(null);
      } catch (error) {}
    },
    handleDeleteEquipment: async (equipmentId: string) => {
      const confirmed = await showConfirm({
        title: 'Delete Equipment?',
        message: "Delete this equipment? All its temperature logs disappear too. Can't undo this.",
        variant: 'danger',
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel',
      });
      if (!confirmed) return;
      try {
        await onDeleteEquipment(equipmentId);
        const newTotalPages = Math.ceil((equipment.length - 1) / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) setCurrentPage(newTotalPages);
      } catch (error) {}
    },
    toggleEquipmentStatus: async (equipmentId: string, currentStatus: boolean) => {
      try {
        await onUpdateEquipment(equipmentId, { is_active: !currentStatus });
      } catch (error) {}
    },
    handleGenerateSampleData: () =>
      handleGenerateSampleData(equipment, showError, showSuccess, setIsGenerating, onRefreshLogs),
  };
}
