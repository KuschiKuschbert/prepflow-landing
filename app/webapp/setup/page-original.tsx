'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import CountrySetup from '../../../components/CountrySetup';

export default function SetupPage() {
  const [loading, setLoading] = useState(false);
  const [recipesLoading, setRecipesLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [recipesResult, setRecipesResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recipesError, setRecipesError] = useState<string | null>(null);

  // Setup completion tracking
  const [setupProgress, setSetupProgress] = useState({
    ingredients: false,
    recipes: false,
    equipment: false,
    country: false,
  });

  // Temperature Equipment Setup State
  const [equipment, setEquipment] = useState<any[]>([]);
  const [showAddEquipment, setShowAddEquipment] = useState(false);
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [showAllEquipment, setShowAllEquipment] = useState(false);
  const [newEquipment, setNewEquipment] = useState({
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

  // Test Data Generation State
  const [isGeneratingTestData, setIsGeneratingTestData] = useState(false);

  const equipmentTypes = [
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
      icon: '🔥',
      defaultMin: 60,
      defaultMax: 80,
      category: 'Hot Holding',
    },
    {
      value: 'hot_cabinet',
      label: 'Hot Cabinet/Warmer',
      icon: '🔥',
      defaultMin: 60,
      defaultMax: 80,
      category: 'Hot Holding',
    },
    {
      value: 'steam_table',
      label: 'Steam Table',
      icon: '🔥',
      defaultMin: 60,
      defaultMax: 80,
      category: 'Hot Holding',
    },
    {
      value: 'heat_lamp',
      label: 'Heat Lamp',
      icon: '🔥',
      defaultMin: 60,
      defaultMax: 80,
      category: 'Hot Holding',
    },
    {
      value: 'hot_well',
      label: 'Hot Well',
      icon: '🔥',
      defaultMin: 60,
      defaultMax: 80,
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

    // Transport & Delivery
    {
      value: 'delivery_van_cold',
      label: 'Delivery Van (Cold)',
      icon: '🚚',
      defaultMin: 2,
      defaultMax: 8,
      category: 'Transport & Delivery',
    },
    {
      value: 'delivery_van_hot',
      label: 'Delivery Van (Hot)',
      icon: '🚚',
      defaultMin: 60,
      defaultMax: 80,
      category: 'Transport & Delivery',
    },
    {
      value: 'food_carrier_cold',
      label: 'Food Carrier (Cold)',
      icon: '📦',
      defaultMin: 2,
      defaultMax: 8,
      category: 'Transport & Delivery',
    },
    {
      value: 'food_carrier_hot',
      label: 'Food Carrier (Hot)',
      icon: '📦',
      defaultMin: 60,
      defaultMax: 80,
      category: 'Transport & Delivery',
    },

    // Specialized
    {
      value: 'fermentation_chamber',
      label: 'Fermentation Chamber',
      icon: '🍺',
      defaultMin: 18,
      defaultMax: 24,
      category: 'Specialized',
    },
    {
      value: 'aging_room',
      label: 'Aging Room',
      icon: '🧀',
      defaultMin: 2,
      defaultMax: 8,
      category: 'Specialized',
    },
    {
      value: 'wine_cellar',
      label: 'Wine Cellar',
      icon: '🍷',
      defaultMin: 12,
      defaultMax: 18,
      category: 'Specialized',
    },
    {
      value: 'storage',
      label: 'Storage Area',
      icon: '📦',
      defaultMin: 15,
      defaultMax: 25,
      category: 'Specialized',
    },
  ];

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

  // Fetch equipment on component mount
  useEffect(() => {
    fetchEquipment();
  }, []);

  // Mark country setup as complete (since CountrySetup component is always rendered)
  useEffect(() => {
    setSetupProgress(prev => ({ ...prev, country: true }));
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
          min_temp: '',
          max_temp: '',
          is_active: true,
        });
        setShowAddEquipment(false);
        setEquipmentResult('Equipment added successfully!');
        setSetupProgress(prev => ({ ...prev, equipment: true }));
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

  const handleGenerateTestData = async () => {
    if (
      !confirm(
        'This will generate 3 months of test temperature data. This may take a few minutes. Continue?',
      )
    ) {
      return;
    }

    setIsGeneratingTestData(true);
    try {
      const response = await fetch('/api/generate-test-temperature-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (data.success) {
        alert(
          `Successfully generated ${data.data.totalLogs} temperature log entries for the last 3 months!`,
        );
      } else {
        alert(data.message || 'Failed to generate test data');
      }
    } catch (error) {
      console.error('Error generating test data:', error);
      alert('Failed to generate test data');
    } finally {
      setIsGeneratingTestData(false);
    }
  };

  const populateIngredients = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/setup-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.message);
        setSetupProgress(prev => ({ ...prev, ingredients: true }));
      } else {
        setError(data.error || 'Failed to populate ingredients');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const populateRecipes = async () => {
    setRecipesLoading(true);
    setRecipesError(null);
    setRecipesResult(null);

    try {
      const response = await fetch('/api/populate-recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setRecipesResult(data.message);
        setSetupProgress(prev => ({ ...prev, recipes: true }));
      } else {
        setRecipesError(data.error || 'Failed to populate recipes');
      }
    } catch (err) {
      setRecipesError('Network error occurred');
    } finally {
      setRecipesLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header with Logo */}
        <div className="mb-8">
          <div className="mb-6 flex items-center space-x-4">
            <Image
              src="/images/prepflow-logo.png"
              alt="PrepFlow Logo"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
            <div className="h-8 w-px bg-[#2a2a2a]"></div>
            <div>
              <h1 className="mb-2 text-4xl font-bold text-white">🚀 PrepFlow Setup</h1>
              <p className="text-gray-400">
                Get your restaurant management system up and running in minutes
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-8 rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Setup Progress</h2>
              <div className="text-sm text-gray-400">
                {Object.values(setupProgress).filter(Boolean).length} of 4 completed
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${
                    setupProgress.country
                      ? 'bg-[#29E7CD]'
                      : 'border border-[#29E7CD]/30 bg-[#2a2a2a]'
                  }`}
                >
                  {setupProgress.country ? (
                    <span className="text-sm font-bold text-black">✓</span>
                  ) : (
                    <span className="text-sm font-bold text-[#29E7CD]">1</span>
                  )}
                </div>
                <span
                  className={`font-medium transition-colors duration-200 ${
                    setupProgress.country ? 'text-[#29E7CD]' : 'text-white'
                  }`}
                >
                  Country Setup
                </span>
              </div>
              <div
                className={`h-px w-8 transition-colors duration-200 ${
                  setupProgress.country ? 'bg-[#29E7CD]' : 'bg-[#2a2a2a]'
                }`}
              ></div>
              <div className="flex items-center space-x-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${
                    setupProgress.equipment
                      ? 'bg-[#29E7CD]'
                      : 'border border-[#29E7CD]/30 bg-[#2a2a2a]'
                  }`}
                >
                  {setupProgress.equipment ? (
                    <span className="text-sm font-bold text-black">✓</span>
                  ) : (
                    <span className="text-sm font-bold text-[#29E7CD]">2</span>
                  )}
                </div>
                <span
                  className={`font-medium transition-colors duration-200 ${
                    setupProgress.equipment ? 'text-[#29E7CD]' : 'text-white'
                  }`}
                >
                  Equipment Setup
                </span>
              </div>
              <div
                className={`h-px w-8 transition-colors duration-200 ${
                  setupProgress.equipment ? 'bg-[#29E7CD]' : 'bg-[#2a2a2a]'
                }`}
              ></div>
              <div className="flex items-center space-x-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${
                    setupProgress.ingredients
                      ? 'bg-[#29E7CD]'
                      : 'border border-[#29E7CD]/30 bg-[#2a2a2a]'
                  }`}
                >
                  {setupProgress.ingredients ? (
                    <span className="text-sm font-bold text-black">✓</span>
                  ) : (
                    <span className="text-sm font-bold text-[#29E7CD]">3</span>
                  )}
                </div>
                <span
                  className={`font-medium transition-colors duration-200 ${
                    setupProgress.ingredients ? 'text-[#29E7CD]' : 'text-white'
                  }`}
                >
                  Sample Data
                </span>
              </div>
              <div
                className={`h-px w-8 transition-colors duration-200 ${
                  setupProgress.ingredients ? 'bg-[#29E7CD]' : 'bg-[#2a2a2a]'
                }`}
              ></div>
              <div className="flex items-center space-x-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${
                    Object.values(setupProgress).every(Boolean)
                      ? 'bg-[#D925C7]'
                      : 'border border-[#D925C7]/30 bg-[#2a2a2a]'
                  }`}
                >
                  {Object.values(setupProgress).every(Boolean) ? (
                    <span className="text-sm font-bold text-white">🎉</span>
                  ) : (
                    <span className="text-sm font-bold text-[#D925C7]">4</span>
                  )}
                </div>
                <span
                  className={`font-medium transition-colors duration-200 ${
                    Object.values(setupProgress).every(Boolean) ? 'text-[#D925C7]' : 'text-gray-400'
                  }`}
                >
                  Ready to Go!
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Start Guide */}
        <div className="mb-8 rounded-3xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 p-6 shadow-lg">
          <div className="mb-4 flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20">
              <span className="text-2xl">🚀</span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white">Quick Start Guide</h2>
              <p className="text-gray-400">Get up and running in 4 simple steps</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-[#2a2a2a]/50 bg-[#1f1f1f]/50 p-4">
              <div className="mb-2 flex items-center space-x-2">
                <span className="text-lg">🌍</span>
                <span className="text-sm font-semibold text-white">1. Country</span>
              </div>
              <p className="text-xs text-gray-400">
                Configure your country settings and tax rates first
              </p>
            </div>

            <div className="rounded-2xl border border-[#2a2a2a]/50 bg-[#1f1f1f]/50 p-4">
              <div className="mb-2 flex items-center space-x-2">
                <span className="text-lg">🌡️</span>
                <span className="text-sm font-semibold text-white">2. Equipment</span>
              </div>
              <p className="text-xs text-gray-400">
                Set up your fridges, freezers, and bain maries
              </p>
            </div>

            <div className="rounded-2xl border border-[#2a2a2a]/50 bg-[#1f1f1f]/50 p-4">
              <div className="mb-2 flex items-center space-x-2">
                <span className="text-lg">📊</span>
                <span className="text-sm font-semibold text-white">3. Sample Data</span>
              </div>
              <p className="text-xs text-gray-400">
                Add realistic ingredients and recipes to get started
              </p>
            </div>

            <div className="rounded-2xl border border-[#2a2a2a]/50 bg-[#1f1f1f]/50 p-4">
              <div className="mb-2 flex items-center space-x-2">
                <span className="text-lg">🎉</span>
                <span className="text-sm font-semibold text-white">4. Ready!</span>
              </div>
              <p className="text-xs text-gray-400">Start managing your restaurant operations</p>
            </div>
          </div>
        </div>

        {/* Step 1: Country & Tax Setup */}
        <div className="mb-12">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-3xl font-bold text-white">🌍 Country & Tax Configuration</h2>
            <p className="text-lg text-gray-400">
              Set up your country settings and tax rates for accurate calculations
            </p>
          </div>
          <CountrySetup />
        </div>

        {/* Step 2: Equipment Setup */}
        <div className="mb-12">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-3xl font-bold text-white">🌡️ Temperature Equipment Setup</h2>
            <p className="text-lg text-gray-400">
              Configure your fridges, freezers, and bain maries for temperature monitoring
            </p>
          </div>
          <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg">
            <div className="mb-6 rounded-2xl border border-[#2a2a2a]/50 bg-[#2a2a2a]/30 p-4">
              <p className="leading-relaxed text-gray-300">
                Set up your temperature monitoring equipment to streamline food safety compliance.
                Add fridges, freezers, bain maries, and storage areas with their recommended
                temperature ranges. This will make temperature logging much faster and more
                organized.
              </p>
            </div>

            {/* Add Equipment Button */}
            <div className="mb-6 flex justify-center">
              <button
                onClick={() => setShowEquipmentModal(true)}
                className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-8 py-4 text-lg font-medium text-white shadow-lg transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80 hover:shadow-xl"
              >
                ➕ Add Equipment
              </button>
            </div>

            {/* Add Equipment Form */}
            {showAddEquipment && (
              <div className="mb-6 rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/50 p-6">
                <h3 className="mb-4 text-xl font-semibold text-white">Add New Equipment</h3>
                <form
                  onSubmit={handleAddEquipment}
                  className="grid grid-cols-1 gap-4 md:grid-cols-2"
                >
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Equipment Name
                    </label>
                    <input
                      type="text"
                      value={newEquipment.name}
                      onChange={e => setNewEquipment({ ...newEquipment, name: e.target.value })}
                      className="w-full rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                      placeholder="e.g., Main Fridge, Freezer 1"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Equipment Type
                    </label>
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
                      required
                    >
                      {equipmentTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-400">
                      💡 Temperature ranges will be set automatically based on your selection
                    </p>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">Location</label>
                    <input
                      type="text"
                      value={newEquipment.location}
                      onChange={e => setNewEquipment({ ...newEquipment, location: e.target.value })}
                      className="w-full rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                      placeholder="e.g., Kitchen, Storage Room"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Temperature Range (°C)
                      <span className="ml-2 text-xs text-[#29E7CD]">✨ Auto-set</span>
                    </label>
                    <div className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/50 px-4 py-3 text-white">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold">
                          {(() => {
                            const defaults = getDefaultTemps(newEquipment.equipment_type);
                            return `${defaults.min}°C - ${defaults.max}°C`;
                          })()}
                        </span>
                        <span className="text-sm text-[#29E7CD]">🔒 Locked</span>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">
                      Automatically set based on food safety standards for{' '}
                      {getEquipmentLabel(newEquipment.equipment_type)}
                    </p>
                  </div>
                  <div className="flex items-center md:col-span-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={newEquipment.is_active}
                      onChange={e =>
                        setNewEquipment({ ...newEquipment, is_active: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-[#2a2a2a] bg-[#1f1f1f] text-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]"
                    />
                    <label htmlFor="is_active" className="ml-2 text-sm text-gray-300">
                      Active Equipment
                    </label>
                  </div>
                  <div className="flex space-x-4 md:col-span-2">
                    <button
                      type="submit"
                      disabled={equipmentLoading}
                      className="rounded-2xl bg-[#29E7CD] px-6 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {equipmentLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
                          <span>Saving...</span>
                        </div>
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
                <h3 className="text-lg font-semibold text-white">Configured Equipment</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {equipment.map(eq => (
                    <div
                      key={eq.id}
                      className="rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/50 p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10">
                            <span className="text-lg">{getEquipmentIcon(eq.equipment_type)}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">{eq.name}</h4>
                            <p className="text-sm text-gray-400">
                              {getEquipmentLabel(eq.equipment_type)}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            eq.is_active
                              ? 'border border-green-400/20 bg-green-400/10 text-green-400'
                              : 'border border-gray-400/20 bg-gray-400/10 text-gray-400'
                          }`}
                        >
                          {eq.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      {eq.location && (
                        <p className="mb-2 text-sm text-gray-300">📍 {eq.location}</p>
                      )}

                      {(eq.min_temp_celsius || eq.max_temp_celsius) && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Temperature Range:</span>
                          <span className="font-semibold text-white">
                            {eq.min_temp_celsius && eq.max_temp_celsius
                              ? `${eq.min_temp_celsius}°C - ${eq.max_temp_celsius}°C`
                              : eq.min_temp_celsius
                                ? `Min: ${eq.min_temp_celsius}°C`
                                : `Max: ${eq.max_temp_celsius}°C`}
                          </span>
                        </div>
                      )}

                      <div className="mt-3 flex space-x-2">
                        <button
                          onClick={() => handleDeleteEquipment(eq.id)}
                          className="rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-1 text-sm font-semibold text-red-400 transition-all duration-200 hover:bg-red-400/20"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status Messages */}
            {equipmentResult && (
              <div className="mb-6 rounded-2xl border border-green-500/30 bg-gradient-to-r from-green-500/10 to-green-600/10 p-4 text-green-400">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">✅</span>
                  <span className="font-medium">{equipmentResult}</span>
                </div>
              </div>
            )}

            {equipmentError && (
              <div className="mb-6 rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-500/10 to-red-600/10 p-4 text-red-400">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">❌</span>
                  <span className="font-medium">{equipmentError}</span>
                </div>
              </div>
            )}

            {/* Pro Tip Card */}
            <div className="rounded-2xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/10 to-[#3B82F6]/10 p-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#29E7CD]/20 to-[#3B82F6]/20">
                  <span className="text-lg">💡</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#29E7CD]">
                    <strong>Pro Tip:</strong> Select your equipment type first - the temperature
                    ranges will be automatically set and locked based on food safety standards!
                  </p>
                </div>
              </div>
            </div>

            {/* Equipment Selection Modal */}
            {showEquipmentModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] shadow-2xl">
                  <div className="p-6">
                    <div className="mb-6 flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-white">
                        Add Equipment to Your Kitchen
                      </h2>
                      <button
                        onClick={() => {
                          setShowEquipmentModal(false);
                          setShowAllEquipment(false);
                        }}
                        className="text-2xl text-gray-400 transition-colors duration-200 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>

                    <p className="mb-6 text-gray-300">
                      Select the equipment you want to add. Temperature ranges will be automatically
                      configured based on food safety standards.
                    </p>

                    {/* Most Common Equipment */}
                    <div className="mb-6">
                      <h3 className="mb-4 text-lg font-semibold text-white">
                        Most Common Equipment
                      </h3>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {equipmentTypes
                          .filter(type =>
                            [
                              'fridge',
                              'freezer',
                              'walk_in_cooler',
                              'walk_in_freezer',
                              'bain_marie',
                              'reach_in_cooler',
                            ].includes(type.value),
                          )
                          .map(type => (
                            <button
                              key={type.value}
                              onClick={() => handleEquipmentSelection(type.value)}
                              className="group flex items-center space-x-3 rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/50 p-4 text-left transition-all duration-200 hover:border-[#29E7CD]/30 hover:bg-[#2a2a2a]"
                            >
                              <span className="text-2xl">{type.icon}</span>
                              <div>
                                <div className="font-medium text-white transition-colors duration-200 group-hover:text-[#29E7CD]">
                                  {type.label}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {type.defaultMin}°C - {type.defaultMax}°C
                                </div>
                              </div>
                            </button>
                          ))}
                      </div>
                    </div>

                    {/* Show More/Less Button */}
                    <div className="mb-6 text-center">
                      <button
                        onClick={() => setShowAllEquipment(!showAllEquipment)}
                        className="font-medium text-[#29E7CD] transition-colors duration-200 hover:text-[#29E7CD]/80"
                      >
                        {showAllEquipment ? 'Show Less' : 'Show All Equipment Types'}{' '}
                        {showAllEquipment ? '▲' : '▼'}
                      </button>
                    </div>

                    {/* All Equipment (Collapsible) */}
                    {showAllEquipment && (
                      <div className="space-y-6">
                        {[
                          'Cold Storage',
                          'Hot Holding',
                          'Cooking Equipment',
                          'Transport & Delivery',
                          'Specialized',
                        ].map(category => (
                          <div key={category} className="mb-6">
                            <h3 className="mb-3 border-b border-[#2a2a2a] pb-2 text-lg font-semibold text-white">
                              {category}
                            </h3>
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                              {equipmentTypes
                                .filter(type => type.category === category)
                                .map(type => (
                                  <button
                                    key={type.value}
                                    onClick={() => handleEquipmentSelection(type.value)}
                                    className="group flex items-center space-x-3 rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/30 p-3 text-left transition-all duration-200 hover:border-[#29E7CD]/30 hover:bg-[#2a2a2a]"
                                  >
                                    <span className="text-xl">{type.icon}</span>
                                    <div>
                                      <div className="text-sm font-medium text-white transition-colors duration-200 group-hover:text-[#29E7CD]">
                                        {type.label}
                                      </div>
                                      <div className="text-xs text-gray-400">
                                        {type.defaultMin}°C - {type.defaultMax}°C
                                      </div>
                                    </div>
                                  </button>
                                ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Step 3: Sample Data Setup */}
        <div className="mb-12">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-3xl font-bold text-white">📊 Sample Data Setup</h2>
            <p className="text-lg text-gray-400">Add realistic data to get started quickly</p>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Ingredients Setup Card */}
            <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg transition-all duration-200 hover:shadow-xl">
              <div className="mb-4 flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Sample Ingredients</h3>
                  <p className="text-sm text-gray-400">50+ Australian kitchen ingredients</p>
                </div>
              </div>

              <div className="mb-4 rounded-2xl border border-[#2a2a2a]/50 bg-[#2a2a2a]/30 p-4">
                <p className="text-sm leading-relaxed text-gray-300">
                  Realistic ingredients with cost data, waste percentages, and supplier information.
                  Perfect for testing COGS calculator and recipe management.
                </p>
              </div>

              <button
                onClick={populateIngredients}
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Adding Ingredients...</span>
                  </div>
                ) : (
                  '🚀 Add Sample Ingredients'
                )}
              </button>

              {/* Status Messages */}
              {result && (
                <div className="mt-4 rounded-xl border border-green-500/30 bg-gradient-to-r from-green-500/10 to-green-600/10 p-3 text-green-400">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">✅</span>
                    <span className="text-sm font-medium">{result}</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 rounded-xl border border-red-500/30 bg-gradient-to-r from-red-500/10 to-red-600/10 p-3 text-red-400">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">❌</span>
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Recipes Setup Card */}
            <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg transition-all duration-200 hover:shadow-xl">
              <div className="mb-4 flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D925C7]/20 to-[#D925C7]/10">
                  <span className="text-2xl">🍽️</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Sample Recipes</h3>
                  <p className="text-sm text-gray-400">12 complete restaurant dishes</p>
                </div>
              </div>

              <div className="mb-4 rounded-2xl border border-[#2a2a2a]/50 bg-[#2a2a2a]/30 p-4">
                <p className="text-sm leading-relaxed text-gray-300">
                  Complete recipes including Classic Beef Burger, Margherita Pizza, Chicken Caesar
                  Salad, Fish and Chips, and 8 more dishes with detailed instructions.
                </p>
              </div>

              <button
                onClick={populateRecipes}
                disabled={recipesLoading}
                className="w-full rounded-2xl bg-gradient-to-r from-[#D925C7] to-[#29E7CD] px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-[#D925C7]/80 hover:to-[#29E7CD]/80 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
              >
                {recipesLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Adding Recipes...</span>
                  </div>
                ) : (
                  '🍽️ Add Sample Recipes'
                )}
              </button>

              {/* Status Messages */}
              {recipesResult && (
                <div className="mt-4 rounded-xl border border-green-500/30 bg-gradient-to-r from-green-500/10 to-green-600/10 p-3 text-green-400">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">✅</span>
                    <span className="text-sm font-medium">{recipesResult}</span>
                  </div>
                </div>
              )}

              {recipesError && (
                <div className="mt-4 rounded-xl border border-red-500/30 bg-gradient-to-r from-red-500/10 to-red-600/10 p-3 text-red-400">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">❌</span>
                    <span className="text-sm font-medium">{recipesError}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Step 4: Test Data Generation */}
        <div className="mb-12">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-3xl font-bold text-white">🧪 Test Data Generation</h2>
            <p className="text-lg text-gray-400">
              Generate sample data to test your temperature monitoring system
            </p>
          </div>

          <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-8 shadow-lg">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#2a2a2a]">
                <span className="text-4xl">🧪</span>
              </div>
              <h3 className="mb-4 text-2xl font-bold text-white">Generate Temperature Test Data</h3>
              <p className="mx-auto mb-6 max-w-2xl text-lg text-gray-300">
                Create 3 months of realistic temperature log data for testing purposes. This
                includes equipment readings, food safety logs, and staff assignments.
              </p>

              <div className="mx-auto mb-6 max-w-2xl rounded-2xl bg-[#2a2a2a]/30 p-6 text-left">
                <h4 className="mb-3 text-lg font-semibold text-white">What will be generated:</h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center space-x-2">
                    <span className="text-[#29E7CD]">✓</span>
                    <span>2 entries per day for each equipment (morning & evening)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-[#29E7CD]">✓</span>
                    <span>2 hot holding entries per day</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-[#29E7CD]">✓</span>
                    <span>2 cold holding entries per day</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-[#29E7CD]">✓</span>
                    <span>1 cooking entry per day</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-[#29E7CD]">✓</span>
                    <span>Realistic temperature variations and staff assignments</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={handleGenerateTestData}
                disabled={isGeneratingTestData}
                className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-8 py-4 text-lg font-semibold text-black transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isGeneratingTestData ? (
                  <span className="flex items-center space-x-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
                    <span>Generating Test Data...</span>
                  </span>
                ) : (
                  '🧪 Generate 3 Months of Test Data'
                )}
              </button>

              <p className="mt-4 text-sm text-gray-400">
                This process may take a few minutes. You can continue using the system while it
                runs.
              </p>
            </div>
          </div>
        </div>

        {/* Step 5: Completion */}
        <div className="mb-12">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-3xl font-bold text-white">🎉 Setup Completion</h2>
            <p className="text-lg text-gray-400">
              You're almost ready to start managing your restaurant!
            </p>
          </div>
          <div
            className={`rounded-3xl border p-8 shadow-lg transition-all duration-500 ${
              Object.values(setupProgress).every(Boolean)
                ? 'border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10'
                : 'border-[#2a2a2a] bg-[#1f1f1f]'
            }`}
          >
            <div className="text-center">
              <div
                className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full transition-all duration-500 ${
                  Object.values(setupProgress).every(Boolean)
                    ? 'bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20'
                    : 'bg-[#2a2a2a]'
                }`}
              >
                <span className="text-4xl">
                  {Object.values(setupProgress).every(Boolean) ? '🎉' : '⏳'}
                </span>
              </div>
              <h2
                className={`mb-4 text-3xl font-bold transition-colors duration-500 ${
                  Object.values(setupProgress).every(Boolean) ? 'text-white' : 'text-gray-400'
                }`}
              >
                {Object.values(setupProgress).every(Boolean)
                  ? 'Setup Complete!'
                  : 'Setup In Progress...'}
              </h2>
              <p className="mx-auto mb-6 max-w-2xl text-lg text-gray-300">
                {Object.values(setupProgress).every(Boolean)
                  ? "Your PrepFlow system is now ready to use. You can start managing ingredients, creating recipes, monitoring temperatures, and tracking your restaurant's performance."
                  : 'Complete the setup steps above to unlock the full potential of your PrepFlow system. Each step brings you closer to streamlined restaurant management.'}
              </p>

              {Object.values(setupProgress).every(Boolean) && (
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <a
                    href="/webapp"
                    className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-8 py-4 text-lg font-medium text-white shadow-lg transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 hover:shadow-xl"
                  >
                    🚀 Go to Dashboard
                  </a>
                  <a
                    href="/webapp/ingredients"
                    className="rounded-2xl bg-[#2a2a2a] px-8 py-4 text-lg font-medium text-white transition-all duration-200 hover:bg-[#3a3a3a]"
                  >
                    📊 Manage Ingredients
                  </a>
                </div>
              )}

              {!Object.values(setupProgress).every(Boolean) && (
                <div className="mx-auto max-w-md rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/50 p-4">
                  <p className="text-sm text-gray-400">
                    Complete all setup steps to unlock the dashboard and start managing your
                    restaurant operations.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
