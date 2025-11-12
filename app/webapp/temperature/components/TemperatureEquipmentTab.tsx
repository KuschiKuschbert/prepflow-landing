'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { CreateEquipmentForm } from './CreateEquipmentForm';
import { EquipmentItem } from './EquipmentItem';
import { Thermometer } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

interface TemperatureEquipment {
  id: string;
  name: string;
  equipment_type: string;
  location: string | null;
  min_temp_celsius: number | null;
  max_temp_celsius: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface TemperatureEquipmentTabProps {
  equipment: TemperatureEquipment[];
  quickTempLoading: Record<string, boolean>;
  onUpdateEquipment: (equipmentId: string, updates: Partial<TemperatureEquipment>) => Promise<void>;
  onCreateEquipment: (
    name: string,
    equipmentType: string,
    location: string | null,
    minTemp: number | null,
    maxTemp: number | null,
  ) => Promise<void>;
  onDeleteEquipment: (equipmentId: string) => Promise<void>;
  onQuickTempLog: (
    equipmentId: string,
    equipmentName: string,
    equipmentType: string,
  ) => Promise<void>;
}

const temperatureTypes = [
  { value: 'fridge', label: 'Fridge', icon: '🧊' },
  { value: 'freezer', label: 'Freezer', icon: '❄️' },
  { value: 'food_cooking', label: 'Food Cooking', icon: '🔥' },
  { value: 'food_hot_holding', label: 'Food Hot Holding', icon: '🍲' },
  { value: 'food_cold_holding', label: 'Food Cold Holding', icon: '🥗' },
  { value: 'storage', label: 'Storage', icon: '📦' },
];

export default function TemperatureEquipmentTab({
  equipment,
  quickTempLoading,
  onUpdateEquipment,
  onCreateEquipment,
  onDeleteEquipment,
  onQuickTempLog,
}: TemperatureEquipmentTabProps) {
  const { t } = useTranslation();
  const [editingEquipment, setEditingEquipment] = useState<string | null>(null);
  const [newEquipment, setNewEquipment] = useState({
    name: '',
    equipmentType: '',
    location: '',
    minTemp: null as number | null,
    maxTemp: null as number | null,
  });
  const [showCreateForm, setShowCreateForm] = useState(false);

  const getTypeIcon = (type: string) => {
    const typeInfo = temperatureTypes.find(t => t.value === type);
    return typeInfo?.icon || '🌡️';
  };

  const getTypeLabel = (type: string) => {
    const typeInfo = temperatureTypes.find(t => t.value === type);
    return typeInfo?.label || type;
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">
            {t('temperature.equipment', 'Temperature Equipment')}
          </h2>
          <p className="mt-1 text-gray-400">
            {t('temperature.equipmentDesc', 'Manage your temperature monitoring equipment')}
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center space-x-2 rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl"
        >
          <span>➕</span>
          <span>{t('temperature.addEquipment', 'Add Equipment')}</span>
        </button>
      </div>

      {/* Create New Equipment Form */}
      <CreateEquipmentForm
        show={showCreateForm}
        temperatureTypes={temperatureTypes}
        newEquipment={newEquipment}
        setNewEquipment={setNewEquipment}
        onSubmit={handleCreateEquipment}
        onCancel={() => setShowCreateForm(false)}
      />

      {/* Equipment List */}
      <div className="space-y-4">
        {equipment.length === 0 ? (
          <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-8 text-center shadow-lg">
            <div className="mb-4 flex justify-center">
              <Icon icon={Thermometer} size="xl" className="text-gray-400" aria-hidden={true} />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">No Equipment Added</h3>
            <p className="mb-4 text-gray-400">
              Add temperature monitoring equipment to start tracking
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl"
            >
              Add Your First Equipment
            </button>
          </div>
        ) : (
          equipment.map(item => (
            <EquipmentItem
              key={item.id}
              item={item as any}
              editingId={editingEquipment}
              setEditingId={setEditingEquipment}
              temperatureTypes={temperatureTypes}
              quickTempLoading={quickTempLoading}
              onQuickTempLog={onQuickTempLog}
              onToggleStatus={toggleEquipmentStatus}
              onDelete={handleDeleteEquipment}
              onUpdate={(id, updates) => handleUpdateEquipment(id, updates)}
            />
          ))
        )}
      </div>
    </div>
  );
}
