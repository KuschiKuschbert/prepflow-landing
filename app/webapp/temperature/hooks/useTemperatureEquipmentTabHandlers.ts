import { useNotification } from '@/contexts/NotificationContext';
import { useConfirm } from '@/hooks/useConfirm';
import { TemperatureEquipment } from '../types';
import { createEquipmentHandlersHelper } from './useTemperatureEquipmentTabHandlers/helpers/equipmentHandlers';
import { useEquipmentState } from './useTemperatureEquipmentTabHandlers/helpers/equipmentState';
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
  const { showSuccess, showError } = useNotification();
  const { showConfirm, ConfirmDialog } = useConfirm();
  const state = useEquipmentState();
  const {
    editingEquipment: _editingEquipment,
    setEditingEquipment,
    selectedEquipment: _selectedEquipment,
    setSelectedEquipment,
    isDrawerOpen: _isDrawerOpen,
    setIsDrawerOpen,
    qrCodeEquipment: _qrCodeEquipment,
    setQrCodeEquipment,
    isQRCodeModalOpen: _isQRCodeModalOpen,
    setIsQRCodeModalOpen,
    currentPage,
    setCurrentPage,
    viewMode: _viewMode,
    setViewMode: _setViewMode,
    isGenerating: _isGenerating,
    setIsGenerating,
    newEquipment,
    setNewEquipment,
    showCreateForm: _showCreateForm,
    setShowCreateForm,
  } = state;
  const handlers = createEquipmentHandlersHelper(
    equipment,
    itemsPerPage,
    currentPage,
    setCurrentPage,
    newEquipment,
    setNewEquipment,
    setShowCreateForm,
    setEditingEquipment,
    onUpdateEquipment,
    onCreateEquipment,
    onDeleteEquipment,
    onRefreshLogs,
    setIsGenerating,
    showSuccess,
    showError,
    showConfirm,
  );
  const {
    handleCreateEquipment,
    handleUpdateEquipment,
    handleDeleteEquipment,
    toggleEquipmentStatus,
    handleGenerateSampleData,
  } = handlers;
  const uiHandlers = createUIHandlers(
    setSelectedEquipment,
    setIsDrawerOpen,
    setQrCodeEquipment,
    setIsQRCodeModalOpen,
  );
  const { handleEquipmentClick, handleCloseDrawer, handleShowQRCode, handleCloseQRCodeModal } =
    uiHandlers;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, equipment.length);
  return {
    ...state,
    startIndex,
    endIndex,
    handleEquipmentClick,
    handleCloseDrawer,
    handleShowQRCode,
    handleCloseQRCodeModal,
    handleCreateEquipment,
    handleUpdateEquipment,
    handleDeleteEquipment,
    toggleEquipmentStatus,
    handleGenerateSampleData,
    ConfirmDialog,
  };
}
