import { TemperatureEquipment } from '../types';
import { useEquipmentState } from './useTemperatureEquipmentTabHandlers/helpers/equipmentState';
import { createEquipmentHandlersHelper } from './useTemperatureEquipmentTabHandlers/helpers/equipmentHandlers';
import { createUIHandlers } from './useTemperatureEquipmentTabHandlers/helpers/uiHandlers';
interface UseTemperatureEquipmentTabHandlersProps {
  equipment: TemperatureEquipment[];
  itemsPerPage: number;
  onUpdateEquipment: (equipmentId: string, updates: Partial<TemperatureEquipment>) => Promise<void>;
  onCreateEquipment: (
    name: string,
    equipmentType: string,
    location: string | null,
    minTemp: number | null,
    maxTemp: number | null,
  ) => Promise<void>;
  onDeleteEquipment: (equipmentId: string) => Promise<void>;
  onRefreshLogs?: () => Promise<void>;
}

export function useTemperatureEquipmentTabHandlers({
  equipment,
  itemsPerPage,
  onUpdateEquipment,
  onCreateEquipment,
  onDeleteEquipment,
  onRefreshLogs,
}: UseTemperatureEquipmentTabHandlersProps) {
  const state = useEquipmentState();
  const { editingEquipment, setEditingEquipment, selectedEquipment, setSelectedEquipment, isDrawerOpen, setIsDrawerOpen, qrCodeEquipment, setQrCodeEquipment, isQRCodeModalOpen, setIsQRCodeModalOpen, currentPage, setCurrentPage, viewMode, setViewMode, isGenerating, setIsGenerating, newEquipment, setNewEquipment, showCreateForm, setShowCreateForm } = state;
  const handlers = createEquipmentHandlersHelper(equipment, itemsPerPage, currentPage, setCurrentPage, newEquipment, setNewEquipment, setShowCreateForm, setEditingEquipment, onUpdateEquipment, onCreateEquipment, onDeleteEquipment, onRefreshLogs, setIsGenerating);
  const { handleCreateEquipment, handleUpdateEquipment, handleDeleteEquipment, toggleEquipmentStatus, handleGenerateSampleData, ConfirmDialog } = handlers;
  const uiHandlers = createUIHandlers(setSelectedEquipment, setIsDrawerOpen, setQrCodeEquipment, setIsQRCodeModalOpen);
  const { handleEquipmentClick, handleCloseDrawer, handleShowQRCode, handleCloseQRCodeModal } = uiHandlers;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, equipment.length);
  return { ...state, startIndex, endIndex, handleEquipmentClick, handleCloseDrawer, handleShowQRCode, handleCloseQRCodeModal, handleCreateEquipment, handleUpdateEquipment, handleDeleteEquipment, toggleEquipmentStatus, handleGenerateSampleData, ConfirmDialog };
}
