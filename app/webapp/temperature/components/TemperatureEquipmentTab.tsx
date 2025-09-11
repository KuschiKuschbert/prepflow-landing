'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/useTranslation';

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
  onCreateEquipment: (name: string, equipmentType: string, location: string | null, minTemp: number | null, maxTemp: number | null) => Promise<void>;
  onDeleteEquipment: (equipmentId: string) => Promise<void>;
  onQuickTempLog: (equipmentId: string, equipmentName: string, equipmentType: string) => Promise<void>;
}

const temperatureTypes = [
  { value: 'fridge', label: 'Fridge', icon: '🧊' },
  { value: 'freezer', label: 'Freezer', icon: '❄️' },
  { value: 'food_cooking', label: 'Food Cooking', icon: '🔥' },
  { value: 'food_hot_holding', label: 'Food Hot Holding', icon: '🍲' },
  { value: 'food_cold_holding', label: 'Food Cold Holding', icon: '🥗' },
  { value: 'storage', label: 'Storage', icon: '📦' }
];

export default function TemperatureEquipmentTab({
  equipment,
  quickTempLoading,
  onUpdateEquipment,
  onCreateEquipment,
  onDeleteEquipment,
  onQuickTempLog
}: TemperatureEquipmentTabProps) {
  const { t } = useTranslation();
  const [editingEquipment, setEditingEquipment] = useState<string | null>(null);
  const [newEquipment, setNewEquipment] = useState({
    name: '',
    equipmentType: '',
    location: '',
    minTemp: null as number | null,
    maxTemp: null as number | null
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
        newEquipment.maxTemp
      );
      setNewEquipment({ name: '', equipmentType: '', location: '', minTemp: null, maxTemp: null });
      setShowCreateForm(false);
    } catch (error) {
      // Handle error gracefully
    }
  };

  const handleUpdateEquipment = async (equipmentId: string, updates: Partial<TemperatureEquipment>) => {
    try {
      await onUpdateEquipment(equipmentId, updates);
      setEditingEquipment(null);
    } catch (error) {
      // Handle error gracefully
    }
  };

  const handleDeleteEquipment = async (equipmentId: string) => {
    if (confirm('Are you sure you want to delete this equipment? This will also delete all associated temperature logs.')) {
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-white">{t('temperature.equipment', 'Temperature Equipment')}</h2>
          <p className="text-gray-400 mt-1">{t('temperature.equipmentDesc', 'Manage your temperature monitoring equipment')}</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-black px-6 py-3 rounded-2xl font-semibold hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
        >
          <span>➕</span>
          <span>{t('temperature.addEquipment', 'Add Equipment')}</span>
        </button>
      </div>

      {/* Create New Equipment Form */}
      {showCreateForm && (
        <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]">
          <h3 className="text-lg font-semibold text-white mb-4">➕ Add New Equipment</h3>
          <form onSubmit={handleCreateEquipment} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Equipment Name</label>
                <input
                  type="text"
                  value={newEquipment.name}
                  onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                  placeholder="e.g., Main Fridge, Freezer 1"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Equipment Type</label>
                <select
                  value={newEquipment.equipmentType}
                  onChange={(e) => setNewEquipment({ ...newEquipment, equipmentType: e.target.value })}
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                  required
                >
                  <option value="">Select type...</option>
                  {temperatureTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Location (Optional)</label>
                <input
                  type="text"
                  value={newEquipment.location}
                  onChange={(e) => setNewEquipment({ ...newEquipment, location: e.target.value })}
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                  placeholder="e.g., Kitchen, Storage Room"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Min Temperature (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newEquipment.minTemp || ''}
                  onChange={(e) => setNewEquipment({ 
                    ...newEquipment, 
                    minTemp: e.target.value ? parseFloat(e.target.value) : null 
                  })}
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                  placeholder="Optional"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Max Temperature (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newEquipment.maxTemp || ''}
                  onChange={(e) => setNewEquipment({ 
                    ...newEquipment, 
                    maxTemp: e.target.value ? parseFloat(e.target.value) : null 
                  })}
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                  placeholder="Optional"
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-black px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-200"
              >
                Add Equipment
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

      {/* Equipment List */}
      <div className="space-y-4">
        {equipment.length === 0 ? (
          <div className="bg-[#1f1f1f] p-8 rounded-3xl shadow-lg border border-[#2a2a2a] text-center">
            <div className="text-4xl mb-4">🌡️</div>
            <h3 className="text-lg font-semibold text-white mb-2">No Equipment Added</h3>
            <p className="text-gray-400 mb-4">Add temperature monitoring equipment to start tracking</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-black px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-200"
            >
              Add Your First Equipment
            </button>
          </div>
        ) : (
          equipment.map((item) => (
            <div key={item.id} className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{getTypeIcon(item.equipment_type)}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                    <p className="text-gray-400">{getTypeLabel(item.equipment_type)}</p>
                    {item.location && (
                      <p className="text-gray-500 text-sm">📍 {item.location}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Temperature Range</div>
                    <div className="text-lg font-semibold text-white">
                      {item.min_temp_celsius && item.max_temp_celsius 
                        ? `${item.min_temp_celsius}°C - ${item.max_temp_celsius}°C`
                        : 'Not set'
                      }
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${item.is_active ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                    <span className="text-sm text-gray-300">
                      {item.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onQuickTempLog(item.id, item.name, item.equipment_type)}
                      disabled={quickTempLoading[item.id] || !item.is_active}
                      className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-black px-4 py-2 rounded-xl font-semibold hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {quickTempLoading[item.id] ? 'Logging...' : 'Quick Log'}
                    </button>
                    
                    <button
                      onClick={() => toggleEquipmentStatus(item.id, item.is_active)}
                      className={`px-3 py-2 rounded-xl font-semibold transition-all duration-200 text-sm ${
                        item.is_active 
                          ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
                          : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                      }`}
                    >
                      {item.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    
                    <button
                      onClick={() => setEditingEquipment(editingEquipment === item.id ? null : item.id)}
                      className="bg-[#2a2a2a] text-gray-300 px-3 py-2 rounded-xl hover:bg-[#3a3a3a] transition-all duration-200 text-sm"
                    >
                      {editingEquipment === item.id ? 'Cancel' : 'Edit'}
                    </button>
                    
                    <button
                      onClick={() => handleDeleteEquipment(item.id)}
                      className="bg-red-500/20 text-red-400 px-3 py-2 rounded-xl hover:bg-red-500/30 transition-all duration-200 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* Edit Form */}
              {editingEquipment === item.id && (
                <div className="mt-6 pt-6 border-t border-[#2a2a2a]">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleUpdateEquipment(item.id, {
                      name: formData.get('name') as string,
                      equipment_type: formData.get('equipmentType') as string,
                      location: formData.get('location') as string || null,
                      min_temp_celsius: formData.get('minTemp') ? parseFloat(formData.get('minTemp') as string) : null,
                      max_temp_celsius: formData.get('maxTemp') ? parseFloat(formData.get('maxTemp') as string) : null
                    });
                  }} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Equipment Name</label>
                        <input
                          type="text"
                          name="name"
                          defaultValue={item.name}
                          className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Equipment Type</label>
                        <select
                          name="equipmentType"
                          defaultValue={item.equipment_type}
                          className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                          required
                        >
                          {temperatureTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.icon} {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                        <input
                          type="text"
                          name="location"
                          defaultValue={item.location || ''}
                          className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                          placeholder="Optional"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Min Temperature (°C)</label>
                        <input
                          type="number"
                          step="0.1"
                          name="minTemp"
                          defaultValue={item.min_temp_celsius || ''}
                          className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                          placeholder="Optional"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Max Temperature (°C)</label>
                        <input
                          type="number"
                          step="0.1"
                          name="maxTemp"
                          defaultValue={item.max_temp_celsius || ''}
                          className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                          placeholder="Optional"
                        />
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-black px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-200"
                      >
                        Update Equipment
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}