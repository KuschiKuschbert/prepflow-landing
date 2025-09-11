'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/useTranslation';

interface TemperatureThreshold {
  id: number;
  temperature_type: string;
  min_temp_celsius: number | null;
  max_temp_celsius: number | null;
  alert_enabled: boolean;
}

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

interface TemperatureThresholdsTabProps {
  thresholds: TemperatureThreshold[];
  equipment: TemperatureEquipment[];
  onUpdateThreshold: (thresholdId: number, updates: Partial<TemperatureThreshold>) => Promise<void>;
  onCreateThreshold: (equipmentId: string, minTemp: number, maxTemp: number, alertEnabled: boolean) => Promise<void>;
  onDeleteThreshold: (thresholdId: number) => Promise<void>;
}

const temperatureTypes = [
  { value: 'fridge', label: 'Fridge', icon: '🧊', defaultMin: 2, defaultMax: 4 },
  { value: 'freezer', label: 'Freezer', icon: '❄️', defaultMin: -18, defaultMax: -15 },
  { value: 'food_cooking', label: 'Food Cooking', icon: '🔥', defaultMin: 75, defaultMax: 100 },
  { value: 'food_hot_holding', label: 'Food Hot Holding', icon: '🍲', defaultMin: 60, defaultMax: 75 },
  { value: 'food_cold_holding', label: 'Food Cold Holding', icon: '🥗', defaultMin: 2, defaultMax: 4 },
  { value: 'storage', label: 'Storage', icon: '📦', defaultMin: 2, defaultMax: 8 }
];

export default function TemperatureThresholdsTab({
  thresholds,
  equipment,
  onUpdateThreshold,
  onCreateThreshold,
  onDeleteThreshold
}: TemperatureThresholdsTabProps) {
  const { t } = useTranslation();
  const [editingThreshold, setEditingThreshold] = useState<number | null>(null);
  const [newThreshold, setNewThreshold] = useState({
    equipmentId: '',
    minTemp: 0,
    maxTemp: 10,
    alertEnabled: true
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

  const getDefaultTemps = (type: string) => {
    const typeInfo = temperatureTypes.find(t => t.value === type);
    return { min: typeInfo?.defaultMin || 0, max: typeInfo?.defaultMax || 10 };
  };

  const handleCreateThreshold = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onCreateThreshold(
        newThreshold.equipmentId,
        newThreshold.minTemp,
        newThreshold.maxTemp,
        newThreshold.alertEnabled
      );
      setNewThreshold({ equipmentId: '', minTemp: 0, maxTemp: 10, alertEnabled: true });
      setShowCreateForm(false);
    } catch (error) {
      // Handle error gracefully
    }
  };

  const handleUpdateThreshold = async (thresholdId: number, updates: Partial<TemperatureThreshold>) => {
    try {
      await onUpdateThreshold(thresholdId, updates);
      setEditingThreshold(null);
    } catch (error) {
      // Handle error gracefully
    }
  };

  const handleDeleteThreshold = async (thresholdId: number) => {
    if (confirm('Are you sure you want to delete this threshold?')) {
      try {
        await onDeleteThreshold(thresholdId);
      } catch (error) {
        // Handle error gracefully
      }
    }
  };

  const getEquipmentById = (id: string) => {
    return equipment.find(eq => eq.id === id);
  };

  const getEquipmentByType = (type: string) => {
    return equipment.find(eq => eq.equipment_type === type);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-white">{t('temperature.thresholds', 'Temperature Thresholds')}</h2>
          <p className="text-gray-400 mt-1">{t('temperature.thresholdsDesc', 'Set temperature limits and alerts for your equipment')}</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-black px-6 py-3 rounded-2xl font-semibold hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
        >
          <span>➕</span>
          <span>{t('temperature.addThreshold', 'Add Threshold')}</span>
        </button>
      </div>

      {/* Create New Threshold Form */}
      {showCreateForm && (
        <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]">
          <h3 className="text-lg font-semibold text-white mb-4">➕ Create New Threshold</h3>
          <form onSubmit={handleCreateThreshold} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Equipment</label>
                <select
                  value={newThreshold.equipmentId}
                  onChange={(e) => {
                    const selectedEquipment = getEquipmentById(e.target.value);
                    if (selectedEquipment) {
                      const defaults = getDefaultTemps(selectedEquipment.equipment_type);
                      setNewThreshold({
                        ...newThreshold,
                        equipmentId: e.target.value,
                        minTemp: defaults.min,
                        maxTemp: defaults.max
                      });
                    } else {
                      setNewThreshold({ ...newThreshold, equipmentId: e.target.value });
                    }
                  }}
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                  required
                >
                  <option value="">Select equipment...</option>
                  {equipment.filter(eq => eq.is_active).map((eq) => (
                    <option key={eq.id} value={eq.id}>
                      {getTypeIcon(eq.equipment_type)} {eq.name} ({getTypeLabel(eq.equipment_type)})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Min Temperature (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newThreshold.minTemp}
                    onChange={(e) => setNewThreshold({ ...newThreshold, minTemp: parseFloat(e.target.value) })}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Max Temperature (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newThreshold.maxTemp}
                    onChange={(e) => setNewThreshold({ ...newThreshold, maxTemp: parseFloat(e.target.value) })}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newThreshold.alertEnabled}
                  onChange={(e) => setNewThreshold({ ...newThreshold, alertEnabled: e.target.checked })}
                  className="w-4 h-4 text-[#29E7CD] bg-[#2a2a2a] border-[#3a3a3a] rounded focus:ring-[#29E7CD] focus:ring-2"
                />
                <span className="text-gray-300">Enable alerts for this threshold</span>
              </label>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-black px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-200"
              >
                Create Threshold
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="bg-[#2a2a2a] text-gray-300 px-6 py-3 rounded-xl font-semibold hover:bg-[#3a3a3a] transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Thresholds List */}
      <div className="space-y-4">
        {thresholds.length === 0 ? (
          <div className="bg-[#1f1f1f] p-8 rounded-3xl shadow-lg border border-[#2a2a2a] text-center">
            <div className="text-4xl mb-4">🌡️</div>
            <h3 className="text-lg font-semibold text-white mb-2">No Thresholds Set</h3>
            <p className="text-gray-400 mb-4">Create temperature thresholds to monitor your equipment</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-black px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-200"
            >
              Create Your First Threshold
            </button>
          </div>
        ) : (
          thresholds.map((threshold) => {
            const equipmentItem = getEquipmentByType(threshold.temperature_type);
            if (!equipmentItem) return null;

            return (
              <div key={threshold.id} className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{getTypeIcon(equipmentItem.equipment_type)}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{equipmentItem.name}</h3>
                      <p className="text-gray-400">{getTypeLabel(equipmentItem.equipment_type)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Temperature Range</div>
                      <div className="text-lg font-semibold text-white">
                        {threshold.min_temp_celsius}°C - {threshold.max_temp_celsius}°C
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${threshold.alert_enabled ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                      <span className="text-sm text-gray-300">
                        {threshold.alert_enabled ? 'Alerts On' : 'Alerts Off'}
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingThreshold(editingThreshold === threshold.id ? null : threshold.id)}
                        className="bg-[#2a2a2a] text-gray-300 px-3 py-2 rounded-xl hover:bg-[#3a3a3a] transition-all duration-200 text-sm"
                      >
                        {editingThreshold === threshold.id ? 'Cancel' : 'Edit'}
                      </button>
                      <button
                        onClick={() => handleDeleteThreshold(threshold.id)}
                        className="bg-red-500/20 text-red-400 px-3 py-2 rounded-xl hover:bg-red-500/30 transition-all duration-200 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Edit Form */}
                {editingThreshold === threshold.id && (
                  <div className="mt-6 pt-6 border-t border-[#2a2a2a]">
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      handleUpdateThreshold(threshold.id, {
                        min_temp_celsius: parseFloat(formData.get('minTemp') as string),
                        max_temp_celsius: parseFloat(formData.get('maxTemp') as string),
                        alert_enabled: formData.get('alertEnabled') === 'on'
                      });
                    }} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Min Temperature (°C)</label>
                          <input
                            type="number"
                            step="0.1"
                            name="minTemp"
                            defaultValue={threshold.min_temp_celsius || ''}
                            className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Max Temperature (°C)</label>
                          <input
                            type="number"
                            step="0.1"
                            name="maxTemp"
                            defaultValue={threshold.max_temp_celsius || ''}
                            className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            name="alertEnabled"
                            defaultChecked={threshold.alert_enabled}
                            className="w-4 h-4 text-[#29E7CD] bg-[#2a2a2a] border-[#3a3a3a] rounded focus:ring-[#29E7CD] focus:ring-2"
                          />
                          <span className="text-gray-300">Enable alerts for this threshold</span>
                        </label>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-black px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-200"
                        >
                          Update Threshold
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Recommended Thresholds */}
      <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]">
        <h3 className="text-lg font-semibold text-white mb-4">📋 Recommended Temperature Thresholds</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {temperatureTypes.map((type) => (
            <div key={type.value} className="bg-[#2a2a2a]/30 p-4 rounded-xl">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-2xl">{type.icon}</span>
                <div>
                  <h4 className="font-semibold text-white">{type.label}</h4>
                  <p className="text-gray-400 text-sm">Recommended range</p>
                </div>
              </div>
              <div className="text-[#29E7CD] font-semibold">
                {type.defaultMin}°C - {type.defaultMax}°C
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
