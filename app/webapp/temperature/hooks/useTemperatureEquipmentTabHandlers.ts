import { useState } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { TemperatureEquipment } from '../types';

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
  const [editingEquipment, setEditingEquipment] = useState<string | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<TemperatureEquipment | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [qrCodeEquipment, setQrCodeEquipment] = useState<TemperatureEquipment | null>(null);
  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [isGenerating, setIsGenerating] = useState(false);
  const [newEquipment, setNewEquipment] = useState({
    name: '',
    equipmentType: '',
    location: '',
    minTemp: null as number | null,
    maxTemp: null as number | null,
  });
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleEquipmentClick = (equipment: TemperatureEquipment) => {
    setSelectedEquipment(equipment);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedEquipment(null);
  };

  const handleShowQRCode = (equipment: TemperatureEquipment) => {
    setQrCodeEquipment(equipment);
    setIsQRCodeModalOpen(true);
  };

  const handleCloseQRCodeModal = () => {
    setIsQRCodeModalOpen(false);
    setQrCodeEquipment(null);
  };

  const handleCreateEquipment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onCreateEquipment(
        newEquipment.name,
        newEquipment.equipmentType,
        newEquipment.location || null,
        newEquipment.minTemp,
        newEquipment.maxTemp,
      );
      setNewEquipment({ name: '', equipmentType: '', location: '', minTemp: null, maxTemp: null });
      setShowCreateForm(false);
      const newTotalPages = Math.ceil((equipment.length + 1) / itemsPerPage);
      setCurrentPage(newTotalPages);
    } catch (error) {
      // Handle error gracefully
    }
  };

  const handleUpdateEquipment = async (
    equipmentId: string,
    updates: Partial<TemperatureEquipment>,
  ) => {
    try {
      await onUpdateEquipment(equipmentId, updates);
      setEditingEquipment(null);
    } catch (error) {
      // Handle error gracefully
    }
  };

  const handleDeleteEquipment = async (equipmentId: string) => {
    if (
      confirm(
        'Are you sure you want to delete this equipment? This will also delete all associated temperature logs.',
      )
    ) {
      try {
        await onDeleteEquipment(equipmentId);
        const newTotalPages = Math.ceil((equipment.length - 1) / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }
      } catch (error) {
        // Handle error gracefully
      }
    }
  };

  const toggleEquipmentStatus = async (equipmentId: string, currentStatus: boolean) => {
    try {
      await onUpdateEquipment(equipmentId, { is_active: !currentStatus });
    } catch (error) {
      // Handle error gracefully
    }
  };

  const handleGenerateSampleData = async () => {
    if (equipment.length === 0) {
      showError('Please add equipment first before generating sample logs');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/temperature-logs/generate-sample', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        showSuccess(
          `Successfully generated ${data.data.totalLogs} temperature log entries (5 per equipment, spread across last 2 weeks)`,
        );
        if (onRefreshLogs) {
          await new Promise(resolve => setTimeout(resolve, 500));
          await onRefreshLogs();
        } else {
          setTimeout(() => {
            window.location.hash = 'equipment';
            window.location.reload();
          }, 1500);
        }
      } else {
        showError(data.error || 'Failed to generate sample data');
      }
    } catch (error) {
      console.error('Error generating sample data:', error);
      showError('Failed to generate sample data. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, equipment.length);

  return {
    editingEquipment,
    setEditingEquipment,
    selectedEquipment,
    isDrawerOpen,
    qrCodeEquipment,
    isQRCodeModalOpen,
    currentPage,
    setCurrentPage,
    viewMode,
    setViewMode,
    isGenerating,
    newEquipment,
    setNewEquipment,
    showCreateForm,
    setShowCreateForm,
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
  };
}
