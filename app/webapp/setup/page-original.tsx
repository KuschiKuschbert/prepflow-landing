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
    country: false
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
    is_active: true
  });
  const [equipmentLoading, setEquipmentLoading] = useState(false);
  const [equipmentError, setEquipmentError] = useState<string | null>(null);
  const [equipmentResult, setEquipmentResult] = useState<string | null>(null);
  
  // Test Data Generation State
  const [isGeneratingTestData, setIsGeneratingTestData] = useState(false);

  const equipmentTypes = [
    // Cold Storage
    { value: 'fridge', label: 'Fridge', icon: '🧊', defaultMin: 2, defaultMax: 8, category: 'Cold Storage' },
    { value: 'freezer', label: 'Freezer', icon: '❄️', defaultMin: -18, defaultMax: -15, category: 'Cold Storage' },
    { value: 'walk_in_cooler', label: 'Walk-in Cooler', icon: '🏠', defaultMin: 2, defaultMax: 8, category: 'Cold Storage' },
    { value: 'walk_in_freezer', label: 'Walk-in Freezer', icon: '🏠', defaultMin: -18, defaultMax: -15, category: 'Cold Storage' },
    { value: 'reach_in_cooler', label: 'Bench Fridge', icon: '🧊', defaultMin: 2, defaultMax: 8, category: 'Cold Storage' },
    { value: 'ice_machine', label: 'Ice Machine', icon: '🧊', defaultMin: 0, defaultMax: 4, category: 'Cold Storage' },
    
    // Hot Holding
    { value: 'bain_marie', label: 'Bain Marie', icon: '🔥', defaultMin: 60, defaultMax: 80, category: 'Hot Holding' },
    { value: 'hot_cabinet', label: 'Hot Cabinet/Warmer', icon: '🔥', defaultMin: 60, defaultMax: 80, category: 'Hot Holding' },
    { value: 'steam_table', label: 'Steam Table', icon: '🔥', defaultMin: 60, defaultMax: 80, category: 'Hot Holding' },
    { value: 'heat_lamp', label: 'Heat Lamp', icon: '🔥', defaultMin: 60, defaultMax: 80, category: 'Hot Holding' },
    { value: 'hot_well', label: 'Hot Well', icon: '🔥', defaultMin: 60, defaultMax: 80, category: 'Hot Holding' },
    
    // Cooking Equipment
    { value: 'combi_oven', label: 'Combi Oven', icon: '🍳', defaultMin: 60, defaultMax: 80, category: 'Cooking Equipment' },
    { value: 'sous_vide', label: 'Sous Vide Bath', icon: '🍳', defaultMin: 60, defaultMax: 80, category: 'Cooking Equipment' },
    { value: 'proofing_cabinet', label: 'Proofing Cabinet', icon: '🍞', defaultMin: 30, defaultMax: 35, category: 'Cooking Equipment' },
    { value: 'chocolate_tempering', label: 'Chocolate Tempering', icon: '🍫', defaultMin: 30, defaultMax: 32, category: 'Cooking Equipment' },
    
    // Transport & Delivery
    { value: 'delivery_van_cold', label: 'Delivery Van (Cold)', icon: '🚚', defaultMin: 2, defaultMax: 8, category: 'Transport & Delivery' },
    { value: 'delivery_van_hot', label: 'Delivery Van (Hot)', icon: '🚚', defaultMin: 60, defaultMax: 80, category: 'Transport & Delivery' },
    { value: 'food_carrier_cold', label: 'Food Carrier (Cold)', icon: '📦', defaultMin: 2, defaultMax: 8, category: 'Transport & Delivery' },
    { value: 'food_carrier_hot', label: 'Food Carrier (Hot)', icon: '📦', defaultMin: 60, defaultMax: 80, category: 'Transport & Delivery' },
    
    // Specialized
    { value: 'fermentation_chamber', label: 'Fermentation Chamber', icon: '🍺', defaultMin: 18, defaultMax: 24, category: 'Specialized' },
    { value: 'aging_room', label: 'Aging Room', icon: '🧀', defaultMin: 2, defaultMax: 8, category: 'Specialized' },
    { value: 'wine_cellar', label: 'Wine Cellar', icon: '🍷', defaultMin: 12, defaultMax: 18, category: 'Specialized' },
    { value: 'storage', label: 'Storage Area', icon: '📦', defaultMin: 15, defaultMax: 25, category: 'Specialized' }
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
      is_active: true
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
          max_temp: newEquipment.max_temp ? parseFloat(newEquipment.max_temp) : null
        })
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
          is_active: true
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
        method: 'DELETE'
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
    if (!confirm('This will generate 3 months of test temperature data. This may take a few minutes. Continue?')) {
      return;
    }

    setIsGeneratingTestData(true);
    try {
      const response = await fetch('/api/generate-test-temperature-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      if (data.success) {
        alert(`Successfully generated ${data.data.totalLogs} temperature log entries for the last 3 months!`);
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
        <div className="max-w-6xl mx-auto">
        {/* Header with Logo */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Image
              src="/images/prepflow-logo.png"
              alt="PrepFlow Logo"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
            <div className="h-8 w-px bg-[#2a2a2a]"></div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                🚀 PrepFlow Setup
              </h1>
              <p className="text-gray-400">Get your restaurant management system up and running in minutes</p>
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a] mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Setup Progress</h2>
              <div className="text-sm text-gray-400">
                {Object.values(setupProgress).filter(Boolean).length} of 4 completed
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                  setupProgress.country ? 'bg-[#29E7CD]' : 'bg-[#2a2a2a] border border-[#29E7CD]/30'
                }`}>
                  {setupProgress.country ? (
                    <span className="text-black font-bold text-sm">✓</span>
                  ) : (
                    <span className="text-[#29E7CD] font-bold text-sm">1</span>
                  )}
                </div>
                <span className={`font-medium transition-colors duration-200 ${
                  setupProgress.country ? 'text-[#29E7CD]' : 'text-white'
                }`}>Country Setup</span>
              </div>
              <div className={`w-8 h-px transition-colors duration-200 ${
                setupProgress.country ? 'bg-[#29E7CD]' : 'bg-[#2a2a2a]'
              }`}></div>
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                  setupProgress.equipment ? 'bg-[#29E7CD]' : 'bg-[#2a2a2a] border border-[#29E7CD]/30'
                }`}>
                  {setupProgress.equipment ? (
                    <span className="text-black font-bold text-sm">✓</span>
                  ) : (
                    <span className="text-[#29E7CD] font-bold text-sm">2</span>
                  )}
                </div>
                <span className={`font-medium transition-colors duration-200 ${
                  setupProgress.equipment ? 'text-[#29E7CD]' : 'text-white'
                }`}>Equipment Setup</span>
              </div>
              <div className={`w-8 h-px transition-colors duration-200 ${
                setupProgress.equipment ? 'bg-[#29E7CD]' : 'bg-[#2a2a2a]'
              }`}></div>
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                  setupProgress.ingredients ? 'bg-[#29E7CD]' : 'bg-[#2a2a2a] border border-[#29E7CD]/30'
                }`}>
                  {setupProgress.ingredients ? (
                    <span className="text-black font-bold text-sm">✓</span>
                  ) : (
                    <span className="text-[#29E7CD] font-bold text-sm">3</span>
                  )}
                </div>
                <span className={`font-medium transition-colors duration-200 ${
                  setupProgress.ingredients ? 'text-[#29E7CD]' : 'text-white'
                }`}>Sample Data</span>
              </div>
              <div className={`w-8 h-px transition-colors duration-200 ${
                setupProgress.ingredients ? 'bg-[#29E7CD]' : 'bg-[#2a2a2a]'
              }`}></div>
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                  Object.values(setupProgress).every(Boolean) ? 'bg-[#D925C7]' : 'bg-[#2a2a2a] border border-[#D925C7]/30'
                }`}>
                  {Object.values(setupProgress).every(Boolean) ? (
                    <span className="text-white font-bold text-sm">🎉</span>
                  ) : (
                    <span className="text-[#D925C7] font-bold text-sm">4</span>
                  )}
                </div>
                <span className={`font-medium transition-colors duration-200 ${
                  Object.values(setupProgress).every(Boolean) ? 'text-[#D925C7]' : 'text-gray-400'
                }`}>Ready to Go!</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Start Guide */}
        <div className="bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 border border-[#29E7CD]/30 p-6 rounded-3xl shadow-lg mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20 flex items-center justify-center">
              <span className="text-2xl">🚀</span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white">Quick Start Guide</h2>
              <p className="text-gray-400">Get up and running in 4 simple steps</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#1f1f1f]/50 p-4 rounded-2xl border border-[#2a2a2a]/50">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">🌍</span>
                <span className="text-white font-semibold text-sm">1. Country</span>
              </div>
              <p className="text-gray-400 text-xs">Configure your country settings and tax rates first</p>
          </div>
          
            <div className="bg-[#1f1f1f]/50 p-4 rounded-2xl border border-[#2a2a2a]/50">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">🌡️</span>
                <span className="text-white font-semibold text-sm">2. Equipment</span>
                </div>
              <p className="text-gray-400 text-xs">Set up your fridges, freezers, and bain maries</p>
          </div>

            <div className="bg-[#1f1f1f]/50 p-4 rounded-2xl border border-[#2a2a2a]/50">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">📊</span>
                <span className="text-white font-semibold text-sm">3. Sample Data</span>
              </div>
              <p className="text-gray-400 text-xs">Add realistic ingredients and recipes to get started</p>
            </div>
            
            <div className="bg-[#1f1f1f]/50 p-4 rounded-2xl border border-[#2a2a2a]/50">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">🎉</span>
                <span className="text-white font-semibold text-sm">4. Ready!</span>
              </div>
              <p className="text-gray-400 text-xs">Start managing your restaurant operations</p>
            </div>
          </div>
        </div>

        {/* Step 1: Country & Tax Setup */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">🌍 Country & Tax Configuration</h2>
            <p className="text-gray-400 text-lg">Set up your country settings and tax rates for accurate calculations</p>
            </div>
          <CountrySetup />
            </div>

        {/* Step 2: Equipment Setup */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">🌡️ Temperature Equipment Setup</h2>
            <p className="text-gray-400 text-lg">Configure your fridges, freezers, and bain maries for temperature monitoring</p>
          </div>
          <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]">
          
          <div className="bg-[#2a2a2a]/30 p-4 rounded-2xl border border-[#2a2a2a]/50 mb-6">
            <p className="text-gray-300 leading-relaxed">
              Set up your temperature monitoring equipment to streamline food safety compliance. Add fridges, freezers, 
              bain maries, and storage areas with their recommended temperature ranges. This will make temperature 
              logging much faster and more organized.
            </p>
          </div>
          
          {/* Add Equipment Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setShowEquipmentModal(true)}
              className="bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] text-white px-8 py-4 rounded-2xl hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80 transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-lg"
            >
              ➕ Add Equipment
            </button>
          </div>

          {/* Add Equipment Form */}
          {showAddEquipment && (
            <div className="bg-[#2a2a2a]/50 p-6 rounded-2xl border border-[#2a2a2a] mb-6">
              <h3 className="text-xl font-semibold text-white mb-4">Add New Equipment</h3>
              <form onSubmit={handleAddEquipment} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Equipment Name</label>
                  <input
                    type="text"
                    value={newEquipment.name}
                    onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1f1f1f] border border-[#2a2a2a] rounded-2xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                    placeholder="e.g., Main Fridge, Freezer 1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Equipment Type</label>
                  <select
                    value={newEquipment.equipment_type}
                    onChange={(e) => {
                      const type = e.target.value;
                      const defaults = getDefaultTemps(type);
                      setNewEquipment({ 
                        ...newEquipment, 
                        equipment_type: type,
                        min_temp: defaults.min.toString(),
                        max_temp: defaults.max.toString()
                      });
                    }}
                    className="w-full px-4 py-3 bg-[#1f1f1f] border border-[#2a2a2a] rounded-2xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                    required
                  >
                    {equipmentTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-400 mt-1">
                    💡 Temperature ranges will be set automatically based on your selection
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                  <input
                    type="text"
                    value={newEquipment.location}
                    onChange={(e) => setNewEquipment({ ...newEquipment, location: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1f1f1f] border border-[#2a2a2a] rounded-2xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                    placeholder="e.g., Kitchen, Storage Room"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Temperature Range (°C)
                    <span className="text-xs text-[#29E7CD] ml-2">✨ Auto-set</span>
                  </label>
                  <div className="w-full px-4 py-3 bg-[#2a2a2a]/50 border border-[#2a2a2a] rounded-2xl text-white">
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
                  <p className="text-xs text-gray-400 mt-1">
                    Automatically set based on food safety standards for {getEquipmentLabel(newEquipment.equipment_type)}
                  </p>
                </div>
                <div className="md:col-span-2 flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={newEquipment.is_active}
                    onChange={(e) => setNewEquipment({ ...newEquipment, is_active: e.target.checked })}
                    className="w-4 h-4 text-[#29E7CD] bg-[#1f1f1f] border-[#2a2a2a] rounded focus:ring-[#29E7CD] focus:ring-2"
                  />
                  <label htmlFor="is_active" className="ml-2 text-sm text-gray-300">
                    Active Equipment
                  </label>
                </div>
                <div className="md:col-span-2 flex space-x-4">
                  <button
                    type="submit"
                    disabled={equipmentLoading}
                    className="bg-[#29E7CD] text-black px-6 py-3 rounded-2xl font-semibold hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {equipmentLoading ? (
                <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving...</span>
                </div>
              ) : (
                      'Save Equipment'
              )}
            </button>
                  <button
                    type="button"
                    onClick={() => setShowAddEquipment(false)}
                    className="bg-[#2a2a2a] text-white px-6 py-3 rounded-2xl font-semibold hover:bg-[#3a3a3a] transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Equipment List */}
          {equipment.length > 0 && (
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-white">Configured Equipment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {equipment.map((eq) => (
                  <div key={eq.id} className="bg-[#2a2a2a]/50 p-4 rounded-2xl border border-[#2a2a2a]">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10 flex items-center justify-center">
                          <span className="text-lg">{getEquipmentIcon(eq.equipment_type)}</span>
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">{eq.name}</h4>
                          <p className="text-sm text-gray-400">{getEquipmentLabel(eq.equipment_type)}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        eq.is_active ? 'bg-green-400/10 text-green-400 border border-green-400/20' : 'bg-gray-400/10 text-gray-400 border border-gray-400/20'
                      }`}>
                        {eq.is_active ? 'Active' : 'Inactive'}
                      </span>
          </div>
                    
                    {eq.location && (
                      <p className="text-gray-300 text-sm mb-2">📍 {eq.location}</p>
                    )}
                    
                    {(eq.min_temp_celsius || eq.max_temp_celsius) && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Temperature Range:</span>
                        <span className="text-white font-semibold">
                          {eq.min_temp_celsius && eq.max_temp_celsius 
                            ? `${eq.min_temp_celsius}°C - ${eq.max_temp_celsius}°C`
                            : eq.min_temp_celsius 
                              ? `Min: ${eq.min_temp_celsius}°C`
                              : `Max: ${eq.max_temp_celsius}°C`
                          }
                        </span>
                      </div>
                    )}
                    
                    <div className="mt-3 flex space-x-2">
                      <button 
                        onClick={() => handleDeleteEquipment(eq.id)}
                        className="bg-red-400/10 text-red-400 border border-red-400/20 px-3 py-1 rounded-xl font-semibold hover:bg-red-400/20 transition-all duration-200 text-sm"
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
            <div className="mb-6 p-4 bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/30 text-green-400 rounded-2xl">
              <div className="flex items-center space-x-2">
                <span className="text-xl">✅</span>
                <span className="font-medium">{equipmentResult}</span>
              </div>
            </div>
          )}

          {equipmentError && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 text-red-400 rounded-2xl">
              <div className="flex items-center space-x-2">
                <span className="text-xl">❌</span>
                <span className="font-medium">{equipmentError}</span>
              </div>
            </div>
          )}

          {/* Pro Tip Card */}
          <div className="bg-gradient-to-br from-[#29E7CD]/10 to-[#3B82F6]/10 border border-[#29E7CD]/30 p-4 rounded-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#29E7CD]/20 to-[#3B82F6]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-lg">💡</span>
              </div>
              <div className="flex-1">
                <p className="text-[#29E7CD] text-sm font-medium">
                  <strong>Pro Tip:</strong> Select your equipment type first - the temperature ranges will be automatically set and locked based on food safety standards!
                </p>
              </div>
            </div>
          </div>

          {/* Equipment Selection Modal */}
          {showEquipmentModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-[#1f1f1f] rounded-3xl shadow-2xl border border-[#2a2a2a] max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Add Equipment to Your Kitchen</h2>
                    <button
                      onClick={() => {
                        setShowEquipmentModal(false);
                        setShowAllEquipment(false);
                      }}
                      className="text-gray-400 hover:text-white transition-colors duration-200 text-2xl"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <p className="text-gray-300 mb-6">
                    Select the equipment you want to add. Temperature ranges will be automatically configured based on food safety standards.
                  </p>

                  {/* Most Common Equipment */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Most Common Equipment</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {equipmentTypes
                        .filter(type => ['fridge', 'freezer', 'walk_in_cooler', 'walk_in_freezer', 'bain_marie', 'reach_in_cooler'].includes(type.value))
                        .map((type) => (
                          <button
                            key={type.value}
                            onClick={() => handleEquipmentSelection(type.value)}
                            className="flex items-center space-x-3 p-4 bg-[#2a2a2a]/50 border border-[#2a2a2a] rounded-xl hover:bg-[#2a2a2a] hover:border-[#29E7CD]/30 transition-all duration-200 text-left group"
                          >
                            <span className="text-2xl">{type.icon}</span>
                            <div>
                              <div className="text-white font-medium group-hover:text-[#29E7CD] transition-colors duration-200">
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
                  <div className="text-center mb-6">
                    <button
                      onClick={() => setShowAllEquipment(!showAllEquipment)}
                      className="text-[#29E7CD] hover:text-[#29E7CD]/80 transition-colors duration-200 font-medium"
                    >
                      {showAllEquipment ? 'Show Less' : 'Show All Equipment Types'} {showAllEquipment ? '▲' : '▼'}
                    </button>
                  </div>

                  {/* All Equipment (Collapsible) */}
                  {showAllEquipment && (
                    <div className="space-y-6">
                      {['Cold Storage', 'Hot Holding', 'Cooking Equipment', 'Transport & Delivery', 'Specialized'].map((category) => (
                        <div key={category} className="mb-6">
                          <h3 className="text-lg font-semibold text-white mb-3 border-b border-[#2a2a2a] pb-2">
                            {category}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {equipmentTypes
                              .filter(type => type.category === category)
                              .map((type) => (
                                <button
                                  key={type.value}
                                  onClick={() => handleEquipmentSelection(type.value)}
                                  className="flex items-center space-x-3 p-3 bg-[#2a2a2a]/30 border border-[#2a2a2a] rounded-lg hover:bg-[#2a2a2a] hover:border-[#29E7CD]/30 transition-all duration-200 text-left group"
                                >
                                  <span className="text-xl">{type.icon}</span>
                                  <div>
                                    <div className="text-white font-medium group-hover:text-[#29E7CD] transition-colors duration-200 text-sm">
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
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">📊 Sample Data Setup</h2>
            <p className="text-gray-400 text-lg">Add realistic data to get started quickly</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ingredients Setup Card */}
            <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a] hover:shadow-xl transition-all duration-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10 flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
            <div>
                  <h3 className="text-xl font-semibold text-white">Sample Ingredients</h3>
                  <p className="text-sm text-gray-400">50+ Australian kitchen ingredients</p>
                </div>
              </div>
              
              <div className="bg-[#2a2a2a]/30 p-4 rounded-2xl border border-[#2a2a2a]/50 mb-4">
                <p className="text-gray-300 text-sm leading-relaxed">
                  Realistic ingredients with cost data, waste percentages, and supplier information. 
                  Perfect for testing COGS calculator and recipe management.
                </p>
              </div>
              
              <button
                onClick={populateIngredients}
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white px-6 py-3 rounded-2xl hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 transition-all duration-200 shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Adding Ingredients...</span>
                  </div>
                ) : (
                  '🚀 Add Sample Ingredients'
                )}
              </button>

              {/* Status Messages */}
              {result && (
                <div className="mt-4 p-3 bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/30 text-green-400 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">✅</span>
                    <span className="text-sm font-medium">{result}</span>
                  </div>
            </div>
              )}

              {error && (
                <div className="mt-4 p-3 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 text-red-400 rounded-xl">
            <div className="flex items-center space-x-2">
                    <span className="text-lg">❌</span>
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Recipes Setup Card */}
            <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a] hover:shadow-xl transition-all duration-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D925C7]/20 to-[#D925C7]/10 flex items-center justify-center">
                  <span className="text-2xl">🍽️</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Sample Recipes</h3>
                  <p className="text-sm text-gray-400">12 complete restaurant dishes</p>
            </div>
          </div>
          
              <div className="bg-[#2a2a2a]/30 p-4 rounded-2xl border border-[#2a2a2a]/50 mb-4">
                <p className="text-gray-300 text-sm leading-relaxed">
                  Complete recipes including Classic Beef Burger, Margherita Pizza, Chicken Caesar Salad, 
                  Fish and Chips, and 8 more dishes with detailed instructions.
            </p>
          </div>
          
            <button
              onClick={populateRecipes}
              disabled={recipesLoading}
                className="w-full bg-gradient-to-r from-[#D925C7] to-[#29E7CD] text-white px-6 py-3 rounded-2xl hover:from-[#D925C7]/80 hover:to-[#29E7CD]/80 transition-all duration-200 shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {recipesLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Adding Recipes...</span>
                </div>
              ) : (
                  '🍽️ Add Sample Recipes'
              )}
            </button>

          {/* Status Messages */}
          {recipesResult && (
                <div className="mt-4 p-3 bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/30 text-green-400 rounded-xl">
              <div className="flex items-center space-x-2">
                    <span className="text-lg">✅</span>
                    <span className="text-sm font-medium">{recipesResult}</span>
              </div>
            </div>
          )}

          {recipesError && (
                <div className="mt-4 p-3 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 text-red-400 rounded-xl">
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
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">🧪 Test Data Generation</h2>
            <p className="text-gray-400 text-lg">Generate sample data to test your temperature monitoring system</p>
          </div>
          
          <div className="bg-[#1f1f1f] p-8 rounded-3xl shadow-lg border border-[#2a2a2a]">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-[#2a2a2a] flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🧪</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Generate Temperature Test Data</h3>
              <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
                Create 3 months of realistic temperature log data for testing purposes. This includes equipment readings, food safety logs, and staff assignments.
              </p>
              
              <div className="bg-[#2a2a2a]/30 p-6 rounded-2xl mb-6 text-left max-w-2xl mx-auto">
                <h4 className="text-lg font-semibold text-white mb-3">What will be generated:</h4>
                <ul className="text-gray-300 space-y-2">
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
                className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-black px-8 py-4 rounded-2xl font-semibold hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {isGeneratingTestData ? (
                  <span className="flex items-center space-x-3">
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating Test Data...</span>
                  </span>
                ) : (
                  '🧪 Generate 3 Months of Test Data'
                )}
              </button>
              
              <p className="text-gray-400 text-sm mt-4">
                This process may take a few minutes. You can continue using the system while it runs.
              </p>
            </div>
          </div>
        </div>

        {/* Step 5: Completion */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">🎉 Setup Completion</h2>
            <p className="text-gray-400 text-lg">You're almost ready to start managing your restaurant!</p>
          </div>
          <div className={`border p-8 rounded-3xl shadow-lg transition-all duration-500 ${
            Object.values(setupProgress).every(Boolean) 
              ? 'bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 border-[#29E7CD]/30' 
              : 'bg-[#1f1f1f] border-[#2a2a2a]'
          }`}>
            <div className="text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-500 ${
                Object.values(setupProgress).every(Boolean)
                  ? 'bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20'
                  : 'bg-[#2a2a2a]'
              }`}>
                <span className="text-4xl">
                  {Object.values(setupProgress).every(Boolean) ? '🎉' : '⏳'}
                </span>
              </div>
              <h2 className={`text-3xl font-bold mb-4 transition-colors duration-500 ${
                Object.values(setupProgress).every(Boolean) ? 'text-white' : 'text-gray-400'
              }`}>
                {Object.values(setupProgress).every(Boolean) ? 'Setup Complete!' : 'Setup In Progress...'}
              </h2>
              <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
                {Object.values(setupProgress).every(Boolean) 
                  ? "Your PrepFlow system is now ready to use. You can start managing ingredients, creating recipes, monitoring temperatures, and tracking your restaurant's performance."
                  : "Complete the setup steps above to unlock the full potential of your PrepFlow system. Each step brings you closer to streamlined restaurant management."
                }
              </p>
              
              {Object.values(setupProgress).every(Boolean) && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/webapp"
                    className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white px-8 py-4 rounded-2xl hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-lg"
                  >
                    🚀 Go to Dashboard
                  </a>
                  <a
                    href="/webapp/ingredients"
                    className="bg-[#2a2a2a] text-white px-8 py-4 rounded-2xl hover:bg-[#3a3a3a] transition-all duration-200 font-medium text-lg"
                  >
                    📊 Manage Ingredients
                  </a>
                </div>
              )}
              
              {!Object.values(setupProgress).every(Boolean) && (
                <div className="bg-[#2a2a2a]/50 p-4 rounded-2xl border border-[#2a2a2a] max-w-md mx-auto">
                  <p className="text-gray-400 text-sm">
                    Complete all setup steps to unlock the dashboard and start managing your restaurant operations.
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
