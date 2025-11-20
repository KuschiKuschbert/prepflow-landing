'use client';

import { useState, useEffect } from 'react';
import { TemperatureEquipment, NewEquipment } from '../types';
import { equipmentTypes } from './equipment-config';
import { getDefaultTemps } from './equipment-utils';
import { EquipmentTypeModal } from './EquipmentTypeModal';
import { EquipmentForm } from './EquipmentForm';
import { EquipmentList } from './EquipmentList';
import { useConfirm } from '@/hooks/useConfirm';
import { logger } from '@/lib/logger';
interface EquipmentSetupProps {
  setupProgress: {
    ingredients: boolean;
    recipes: boolean;
    equipment: boolean;
    country: boolean;
  };
  onProgressUpdate: (progress: {
    ingredients: boolean;
    recipes: boolean;
    equipment: boolean;
    country: boolean;
  }) => void;
}

export default function EquipmentSetup({ setupProgress, onProgressUpdate }: EquipmentSetupProps) {
  const { showConfirm, ConfirmDialog } = useConfirm();
  const [equipment, setEquipment] = useState<TemperatureEquipment[]>([]);
  const [showAddEquipment, setShowAddEquipment] = useState(false);
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [showAllEquipment, setShowAllEquipment] = useState(false);
  const [newEquipment, setNewEquipment] = useState<NewEquipment>({
    name: '',
    equipment_type: 'fridge',
    location: '',
    min_temp: '2',
    max_temp: '8',
    is_active: true,
  });
  const [equipmentLoading, setEquipmentLoading] = useState(false);
  const [equipmentError, setEquipmentError] = useState<string | null>(null);
  const [equipmentResult, setEquipmentResult] = useState<string | null>(null);

  const handleEquipmentSelection = (equipmentType: string) => {
    const defaults = getDefaultTemps(equipmentType);
    setNewEquipment({
      name: '',
      equipment_type: equipmentType,
      location: '',
      min_temp: defaults.min.toString(),
      max_temp: defaults.max.toString(),
      is_active: true,
    });
    setShowEquipmentModal(false);
    setShowAddEquipment(true);
  };

  // Utility functions moved to equipment-utils.ts

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const response = await fetch('/api/temperature-equipment');
      const data = await response.json();
      if (data.success) {
        setEquipment(data.data);
      }
    } catch (error) {
      logger.error('Error fetching equipment:', error);
    }
  };

  const handleAddEquipment = async (e: React.FormEvent) => {
    e.preventDefault();
    setEquipmentLoading(true);
    setEquipmentError(null);
    setEquipmentResult(null);

    try {
      const response = await fetch('/api/temperature-equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newEquipment,
          min_temp: newEquipment.min_temp ? parseFloat(newEquipment.min_temp) : null,
          max_temp: newEquipment.max_temp ? parseFloat(newEquipment.max_temp) : null,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setEquipment([...equipment, data.data]);
        setNewEquipment({
          name: '',
          equipment_type: 'fridge',
          location: '',
          min_temp: '2',
          max_temp: '8',
          is_active: true,
        });
        setShowAddEquipment(false);
        setEquipmentResult('Equipment added successfully!');
        onProgressUpdate({ ...setupProgress, equipment: true });
      } else {
        setEquipmentError(data.message || 'Failed to add equipment');
      }
    } catch (error) {
      setEquipmentError('Network error occurred');
    } finally {
      setEquipmentLoading(false);
    }
  };

  const handleDeleteEquipment = async (id: number) => {
    const confirmed = await showConfirm({
      title: 'Delete Equipment?',
      message: "Delete this equipment? All its temperature logs go with it. Can't undo this one.",
      variant: 'danger',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    });

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/temperature-equipment?id=${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setEquipment(equipment.filter(eq => eq.id !== id));
        setEquipmentResult('Equipment deleted successfully!');
      } else {
        setEquipmentError(data.message || 'Failed to delete equipment');
      }
    } catch (error) {
      setEquipmentError('Network error occurred');
    }
  };

  const handleDeleteAllEquipment = async () => {
    const confirmed = await showConfirm({
      title: 'Delete All Equipment?',
      message: `Delete ALL ${equipment.length} pieces of equipment? That's... everything. Sure about this?`,
      variant: 'danger',
      confirmLabel: 'Delete All',
      cancelLabel: 'Cancel',
    });

    if (!confirmed) return;

    try {
      setEquipmentLoading(true);
      setEquipmentError(null);
      setEquipmentResult(null);

      // Delete all equipment one by one
      const deletePromises = equipment.map(eq =>
        fetch(`/api/temperature-equipment?id=${eq.id}`, {
          method: 'DELETE',
        }),
      );

      const results = await Promise.all(deletePromises);
      const allSuccess = results.every(response => response.ok);

      if (allSuccess) {
        setEquipment([]);
        setEquipmentResult(`Successfully deleted all ${equipment.length} pieces of equipment!`);
      } else {
        setEquipmentError('Some equipment failed to delete. Please try again.');
      }
    } catch (error) {
      setEquipmentError('Network error occurred');
    } finally {
      setEquipmentLoading(false);
    }
  };

  return (
    <>
      <ConfirmDialog />
      <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-8 shadow-lg">
        {/* Add Equipment Button */}
        <div className="mb-6 flex justify-center">
          <button
            onClick={() => setShowEquipmentModal(true)}
            className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-8 py-4 text-lg font-medium text-white shadow-lg transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80 hover:shadow-xl"
          >
            ➕ Add Equipment
          </button>
        </div>

        {/* Equipment Type Selection Modal */}
        <EquipmentTypeModal
          isOpen={showEquipmentModal}
          onClose={() => setShowEquipmentModal(false)}
          onSelect={handleEquipmentSelection}
        />

        {/* Add Equipment Form */}
        {showAddEquipment && (
          <EquipmentForm
            equipment={newEquipment}
            setEquipment={setNewEquipment}
            onSubmit={handleAddEquipment}
            onCancel={() => setShowAddEquipment(false)}
            loading={equipmentLoading}
            error={equipmentError}
            result={equipmentResult}
          />
        )}

        {/* Equipment List */}
        <EquipmentList
          equipment={equipment}
          showAll={showAllEquipment}
          onToggleShowAll={() => setShowAllEquipment(!showAllEquipment)}
          onDelete={handleDeleteEquipment}
          onDeleteAll={handleDeleteAllEquipment}
        />
      </div>
    </>
  );
}
