'use client';

import React from 'react';
import { NewEquipment } from '../types';
import { equipmentTypes } from './equipment-config';
import { getDefaultTemps, getEquipmentLabel } from './equipment-utils';
import { useAutosave } from '@/hooks/useAutosave';
import { AutosaveStatus } from '@/components/ui/AutosaveStatus';

interface EquipmentFormProps {
  equipment: NewEquipment;
  setEquipment: (eq: NewEquipment) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  loading: boolean;
  error: string | null;
  result: string | null;
}

export function EquipmentForm({
  equipment,
  setEquipment,
  onSubmit,
  onCancel,
  loading,
  error,
  result,
}: EquipmentFormProps) {
  // Autosave integration
  const entityId = (equipment as any).id || 'new';
  const canAutosave = entityId !== 'new' || Boolean(equipment.name);

  const {
    status,
    error: autosaveError,
    saveNow,
  } = useAutosave({
    entityType: 'temperature_equipment',
    entityId: entityId,
    data: equipment,
    enabled: canAutosave,
  });
  return (
    <div className="mb-6 rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/50 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Add New Equipment</h3>
        <AutosaveStatus status={status} error={autosaveError} onRetry={saveNow} />
      </div>
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 desktop:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">Equipment Name</label>
          <input
            type="text"
            value={equipment.name}
            onChange={e => setEquipment({ ...equipment, name: e.target.value })}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            placeholder="e.g., Main Kitchen Fridge"
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">Equipment Type</label>
          <select
            value={equipment.equipment_type}
            onChange={e => {
              const type = e.target.value;
              const defaults = getDefaultTemps(type);
              setEquipment({
                ...equipment,
                equipment_type: type,
                min_temp: defaults.min.toString(),
                max_temp: defaults.max.toString(),
              });
            }}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
          >
            {equipmentTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.icon} {type.label} ({type.category})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">Location</label>
          <input
            type="text"
            value={equipment.location}
            onChange={e => setEquipment({ ...equipment, location: e.target.value })}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            placeholder="e.g., Main Kitchen, Prep Area"
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">Temperature Range</label>
          <div className="rounded-2xl bg-[#2a2a2a] p-3 text-white">
            <span className="text-lg font-semibold">
              {(() => {
                const defaults = getDefaultTemps(equipment.equipment_type);
                return `${defaults.min}°C - ${defaults.max}°C`;
              })()}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-400">
            Automatically set based on food safety standards for{' '}
            {getEquipmentLabel(equipment.equipment_type)}
          </p>
        </div>
        <div className="desktop:col-span-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={equipment.is_active}
              onChange={e => setEquipment({ ...equipment, is_active: e.target.checked })}
              className="h-4 w-4 rounded border-[#2a2a2a] bg-[#1f1f1f] text-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]"
            />
            <label htmlFor="is_active" className="ml-2 text-sm text-gray-300">
              Active Equipment
            </label>
          </div>
        </div>
        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-900/20 p-3 text-red-300 desktop:col-span-2">
            {error}
          </div>
        )}
        {result && (
          <div className="rounded-2xl border border-green-500/30 bg-green-900/20 p-3 text-green-300 desktop:col-span-2">
            {result}
          </div>
        )}
        <div className="flex space-x-4 desktop:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-8 py-3 font-semibold text-white transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                Saving...
              </span>
            ) : (
              'Save Equipment'
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl bg-[#2a2a2a] px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-[#3a3a3a]"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
