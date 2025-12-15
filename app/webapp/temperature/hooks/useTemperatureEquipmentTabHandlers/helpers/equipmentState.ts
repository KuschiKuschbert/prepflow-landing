/**
 * Equipment state management.
 */
import { useState } from 'react';
import type { TemperatureEquipment } from '../../../types';

export function useEquipmentState() {
  const [editingEquipment, setEditingEquipment] = useState<string | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<TemperatureEquipment | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [qrCodeEquipment, setQrCodeEquipment] = useState<TemperatureEquipment | null>(null);
  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [isGenerating, setIsGenerating] = useState(false);
  const [newEquipment, setNewEquipment] = useState({ name: '', equipmentType: '', location: '', minTemp: null as number | null, maxTemp: null as number | null });
  const [showCreateForm, setShowCreateForm] = useState(false);
  return {
    editingEquipment,
    setEditingEquipment,
    selectedEquipment,
    setSelectedEquipment,
    isDrawerOpen,
    setIsDrawerOpen,
    qrCodeEquipment,
    setQrCodeEquipment,
    isQRCodeModalOpen,
    setIsQRCodeModalOpen,
    currentPage,
    setCurrentPage,
    viewMode,
    setViewMode,
    isGenerating,
    setIsGenerating,
    newEquipment,
    setNewEquipment,
    showCreateForm,
    setShowCreateForm,
  };
}
