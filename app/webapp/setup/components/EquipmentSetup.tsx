'use client';

import { useState, useEffect } from 'react';
import { TemperatureEquipment, NewEquipment, EquipmentType } from '../types';

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

const equipmentTypes: EquipmentType[] = [
  // Cold Storage
  {
    value: 'fridge',
    label: 'Fridge',
    icon: '🧊',
    defaultMin: 2,
    defaultMax: 8,
    category: 'Cold Storage',
  },
  {
    value: 'freezer',
    label: 'Freezer',
    icon: '❄️',
    defaultMin: -18,
    defaultMax: -15,
    category: 'Cold Storage',
  },
  {
    value: 'walk_in_cooler',
    label: 'Walk-in Cooler',
    icon: '🏠',
    defaultMin: 2,
    defaultMax: 8,
    category: 'Cold Storage',
  },
  {
    value: 'walk_in_freezer',
    label: 'Walk-in Freezer',
    icon: '🏠',
    defaultMin: -18,
    defaultMax: -15,
    category: 'Cold Storage',
  },
  {
    value: 'reach_in_cooler',
    label: 'Bench Fridge',
    icon: '🧊',
    defaultMin: 2,
    defaultMax: 8,
    category: 'Cold Storage',
  },
  {
    value: 'ice_machine',
    label: 'Ice Machine',
    icon: '🧊',
    defaultMin: 0,
    defaultMax: 4,
    category: 'Cold Storage',
  },

  // Hot Holding
  {
    value: 'bain_marie',
    label: 'Bain Marie',
    icon: '♨️',
    defaultMin: 63,
    defaultMax: 75,
    category: 'Hot Holding',
  },
  {
    value: 'hot_holding_cabinet',
    label: 'Hot Holding Cabinet',
    icon: '♨️',
    defaultMin: 63,
    defaultMax: 75,
    category: 'Hot Holding',
  },
  {
    value: 'steam_table',
    label: 'Steam Table',
    icon: '♨️',
    defaultMin: 63,
    defaultMax: 75,
    category: 'Hot Holding',
  },
  {
    value: 'warming_drawer',
    label: 'Warming Drawer',
    icon: '♨️',
    defaultMin: 63,
    defaultMax: 75,
    category: 'Hot Holding',
  },
  {
    value: 'soup_kettle',
    label: 'Soup Kettle',
    icon: '🍲',
    defaultMin: 63,
    defaultMax: 75,
    category: 'Hot Holding',
  },
  {
    value: 'rice_cooker',
    label: 'Rice Cooker',
    icon: '🍚',
    defaultMin: 63,
    defaultMax: 75,
    category: 'Hot Holding',
  },

  // Cooking Equipment
  {
    value: 'combi_oven',
    label: 'Combi Oven',
    icon: '🍳',
    defaultMin: 60,
    defaultMax: 80,
    category: 'Cooking Equipment',
  },
  {
    value: 'sous_vide',
    label: 'Sous Vide Bath',
    icon: '🍳',
    defaultMin: 60,
    defaultMax: 80,
    category: 'Cooking Equipment',
  },
  {
    value: 'proofing_cabinet',
    label: 'Proofing Cabinet',
    icon: '🍞',
    defaultMin: 30,
    defaultMax: 35,
    category: 'Cooking Equipment',
  },
  {
    value: 'chocolate_tempering',
    label: 'Chocolate Tempering',
    icon: '🍫',
    defaultMin: 30,
    defaultMax: 32,
    category: 'Cooking Equipment',
  },
];

export default function EquipmentSetup({ setupProgress, onProgressUpdate }: EquipmentSetupProps) {
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

  const getDefaultTemps = (type: string) => {
    const typeInfo = equipmentTypes.find(t => t.value === type);
    return { min: typeInfo?.defaultMin || 0, max: typeInfo?.defaultMax || 10 };
  };

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

  const getEquipmentIcon = (type: string) => {
    const typeInfo = equipmentTypes.find(t => t.value === type);
    return typeInfo?.icon || '🌡️';
  };

  const getEquipmentLabel = (type: string) => {
    const typeInfo = equipmentTypes.find(t => t.value === type);
    return typeInfo?.label || type;
  };

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
      console.error('Error fetching equipment:', error);
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
    if (!confirm('Are you sure you want to delete this equipment?')) return;

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

  return (
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
      {showEquipmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white">Select Equipment Type</h3>
              <button
                onClick={() => setShowEquipmentModal(false)}
                className="text-2xl text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {equipmentTypes.map(type => (
                <button
                  key={type.value}
                  onClick={() => handleEquipmentSelection(type.value)}
                  className="rounded-2xl bg-[#2a2a2a] p-4 text-left transition-all duration-200 hover:bg-[#3a3a3a]"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{type.icon}</span>
                    <div>
                      <h4 className="font-semibold text-white">{type.label}</h4>
                      <p className="text-sm text-gray-400">{type.category}</p>
                      <p className="text-xs text-[#29E7CD]">
                        {type.defaultMin}°C - {type.defaultMax}°C
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Equipment Form */}
      {showAddEquipment && (
        <div className="mb-6 rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/50 p-6">
          <h3 className="mb-4 text-xl font-semibold text-white">Add New Equipment</h3>
          <form onSubmit={handleAddEquipment} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">Equipment Name</label>
              <input
                type="text"
                value={newEquipment.name}
                onChange={e => setNewEquipment({ ...newEquipment, name: e.target.value })}
                className="w-full rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                placeholder="e.g., Main Kitchen Fridge"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">Equipment Type</label>
              <select
                value={newEquipment.equipment_type}
                onChange={e => {
                  const type = e.target.value;
                  const defaults = getDefaultTemps(type);
                  setNewEquipment({
                    ...newEquipment,
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
                value={newEquipment.location}
                onChange={e => setNewEquipment({ ...newEquipment, location: e.target.value })}
                className="w-full rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                placeholder="e.g., Main Kitchen, Prep Area"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Temperature Range
              </label>
              <div className="rounded-2xl bg-[#2a2a2a] p-3 text-white">
                <span className="text-lg font-semibold">
                  {(() => {
                    const defaults = getDefaultTemps(newEquipment.equipment_type);
                    return `${defaults.min}°C - ${defaults.max}°C`;
                  })()}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Automatically set based on food safety standards for{' '}
                {getEquipmentLabel(newEquipment.equipment_type)}
              </p>
            </div>
            <div className="md:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={newEquipment.is_active}
                  onChange={e => setNewEquipment({ ...newEquipment, is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-[#2a2a2a] bg-[#1f1f1f] text-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]"
                />
                <label htmlFor="is_active" className="ml-2 text-sm text-gray-300">
                  Active Equipment
                </label>
              </div>
            </div>

            {equipmentError && (
              <div className="rounded-2xl border border-red-500/30 bg-red-900/20 p-3 text-red-300 md:col-span-2">
                {equipmentError}
              </div>
            )}

            {equipmentResult && (
              <div className="rounded-2xl border border-green-500/30 bg-green-900/20 p-3 text-green-300 md:col-span-2">
                {equipmentResult}
              </div>
            )}

            <div className="flex space-x-4 md:col-span-2">
              <button
                type="submit"
                disabled={equipmentLoading}
                className="flex-1 rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-8 py-3 font-semibold text-white transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {equipmentLoading ? (
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
                onClick={() => setShowAddEquipment(false)}
                className="rounded-2xl bg-[#2a2a2a] px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-[#3a3a3a]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Equipment List */}
      {equipment.length > 0 && (
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">
              Your Equipment ({equipment.length})
            </h3>
            {equipment.length > 6 && (
              <button
                onClick={() => setShowAllEquipment(!showAllEquipment)}
                className="font-medium text-[#29E7CD] hover:text-[#29E7CD]/80"
              >
                {showAllEquipment ? 'Show Less' : 'Show All'}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(showAllEquipment ? equipment : equipment.slice(0, 6)).map(eq => (
              <div key={eq.id} className="rounded-2xl border border-[#3a3a3a] bg-[#2a2a2a] p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getEquipmentIcon(eq.equipment_type)}</span>
                    <div>
                      <h4 className="font-semibold text-white">{eq.name}</h4>
                      <p className="text-sm text-gray-400">
                        {getEquipmentLabel(eq.equipment_type)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteEquipment(eq.id!)}
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-300">
                    <span className="font-medium">Location:</span> {eq.location}
                  </p>
                  <p className="text-sm text-gray-300">
                    <span className="font-medium">Range:</span> {eq.min_temp}°C - {eq.max_temp}°C
                  </p>
                  <p className="text-sm text-gray-300">
                    <span className="font-medium">Status:</span>
                    <span className={`ml-1 ${eq.is_active ? 'text-green-400' : 'text-red-400'}`}>
                      {eq.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {equipment.length === 0 && (
        <div className="py-12 text-center">
          <div className="mb-4 text-6xl">🌡️</div>
          <h3 className="mb-2 text-xl font-semibold text-white">No Equipment Added Yet</h3>
          <p className="mb-6 text-gray-400">
            Add your first piece of temperature monitoring equipment to get started
          </p>
        </div>
      )}
    </div>
  );
}
