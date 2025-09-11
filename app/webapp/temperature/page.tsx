'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { useCountryFormatting } from '@/hooks/useCountryFormatting';
import dynamic from 'next/dynamic';
import { TemperatureLog, TemperatureEquipment } from './types';

// Dynamic imports for heavy components
const TemperatureLogsTab = dynamic(() => import('./components/TemperatureLogsTab'), {
  loading: () => (
    <div className="animate-pulse">
      <div className="h-96 bg-[#2a2a2a] rounded-3xl"></div>
    </div>
  ),
  ssr: false
});

const TemperatureEquipmentTab = dynamic(() => import('./components/TemperatureEquipmentTab'), {
  loading: () => (
    <div className="animate-pulse">
      <div className="h-96 bg-[#2a2a2a] rounded-3xl"></div>
    </div>
  ),
  ssr: false
});


import TemperatureAnalyticsTab from './components/TemperatureAnalyticsTab';


export default function TemperatureLogsPage() {
  const { t } = useTranslation();
  const { formatDate } = useCountryFormatting();
  
  // Helper function to format time strings
  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };
  
  // Helper function to format date strings
  const formatDateString = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return formatDate(date);
  };

  const [logs, setLogs] = useState<TemperatureLog[]>([]);
  const [allLogs, setAllLogs] = useState<TemperatureLog[]>([
    {
      id: '1',
      log_date: '2025-01-11',
      log_time: '08:00',
      temperature_type: 'refrigerator',
      temperature_celsius: 4.2,
      location: 'Main Fridge',
      notes: 'Morning check',
      photo_url: null,
      logged_by: 'Chef',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      log_date: '2025-01-11',
      log_time: '12:00',
      temperature_type: 'refrigerator',
      temperature_celsius: 3.8,
      location: 'Main Fridge',
      notes: 'Lunch check',
      photo_url: null,
      logged_by: 'Chef',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      log_date: '2025-01-11',
      log_time: '16:00',
      temperature_type: 'refrigerator',
      temperature_celsius: 4.5,
      location: 'Main Fridge',
      notes: 'Afternoon check',
      photo_url: null,
      logged_by: 'Chef',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '4',
      log_date: '2025-01-11',
      log_time: '08:30',
      temperature_type: 'freezer',
      temperature_celsius: -16.5,
      location: 'Freezer Unit',
      notes: 'Morning check',
      photo_url: null,
      logged_by: 'Chef',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '5',
      log_date: '2025-01-11',
      log_time: '14:30',
      temperature_type: 'freezer',
      temperature_celsius: -17.2,
      location: 'Freezer Unit',
      notes: 'Afternoon check',
      photo_url: null,
      logged_by: 'Chef',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]);
  const [equipment, setEquipment] = useState<TemperatureEquipment[]>([
    {
      id: '1',
      name: 'Main Fridge',
      equipment_type: 'refrigerator',
      location: 'Kitchen',
      min_temp_celsius: 2,
      max_temp_celsius: 8,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2', 
      name: 'Freezer Unit',
      equipment_type: 'freezer',
      location: 'Kitchen',
      min_temp_celsius: -18,
      max_temp_celsius: -15,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]);
  const [loading, setLoading] = useState(false); // Temporarily set to false to test charts
  const [activeTab, setActiveTab] = useState<'logs' | 'equipment' | 'analytics'>('analytics');
  const [quickTempLoading, setQuickTempLoading] = useState<{[key: string]: boolean}>({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedType, setSelectedType] = useState('all');
  const [newLog, setNewLog] = useState({
    log_date: new Date().toISOString().split('T')[0],
    log_time: new Date().toTimeString().split(' ')[0].substring(0, 5),
    temperature_type: 'fridge',
    temperature_celsius: '',
    location: '',
    notes: '',
    logged_by: ''
  });
  const [showAddLog, setShowAddLog] = useState(false);

  const temperatureTypes = [
    { value: 'fridge', label: 'Fridge', icon: '🧊' },
    { value: 'freezer', label: 'Freezer', icon: '❄️' },
    { value: 'food_cooking', label: 'Food Cooking', icon: '🔥' },
    { value: 'food_hot_holding', label: 'Food Hot Holding', icon: '🍲' },
    { value: 'food_cold_holding', label: 'Food Cold Holding', icon: '🥗' },
    { value: 'storage', label: 'Storage', icon: '📦' }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('TemperaturePage - Starting data load...');
        setLoading(true);
        
        // Test one function at a time to isolate the issue
        console.log('TemperaturePage - Testing fetchLogs...');
        await fetchLogs();
        console.log('TemperaturePage - fetchLogs completed');
        
        console.log('TemperaturePage - Testing fetchEquipment...');
        await fetchEquipment();
        console.log('TemperaturePage - fetchEquipment completed');
        
        console.log('TemperaturePage - Testing fetchAllLogs...');
        await fetchAllLogs();
        console.log('TemperaturePage - fetchAllLogs completed');
        
        
        console.log('TemperaturePage - All data loaded successfully');
      } catch (error) {
        console.error('TemperaturePage - Error loading data:', error);
      } finally {
        console.log('TemperaturePage - Setting loading to false');
        setLoading(false);
      }
    };
    loadData();
  }, [selectedDate, selectedType]);

  const fetchLogs = async () => {
    try {
      let url = '/api/temperature-logs';
      const params = new URLSearchParams();
      if (selectedDate) params.append('date', selectedDate);
      if (selectedType !== 'all') params.append('type', selectedType);
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url);
      const data = await response.json();
      console.log('fetchLogs - API response:', data);
      if (data.success) {
        console.log('fetchLogs - Setting logs:', data.data.length, 'logs');
        setLogs(data.data);
      }
    } catch (error) {
      console.error('fetchLogs - Error:', error);
    }
  };

  const fetchAllLogs = async () => {
    try {
      const response = await fetch('/api/temperature-logs');
      const data = await response.json();
      console.log('fetchAllLogs - API response:', data);
      if (data.success) {
        console.log('fetchAllLogs - Setting allLogs:', data.data.length, 'logs');
        setAllLogs(data.data);
      }
    } catch (error) {
      console.error('fetchAllLogs - Error:', error);
    }
  };


  const fetchEquipment = async () => {
    try {
      const response = await fetch('/api/temperature-equipment');
      const data = await response.json();
      console.log('fetchEquipment - API response:', data);
      if (data.success) {
        console.log('fetchEquipment - Setting equipment:', data.data.length, 'equipment');
        setEquipment(data.data);
      }
    } catch (error) {
      console.error('fetchEquipment - Error:', error);
    }
  };

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/temperature-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newLog,
          temperature_celsius: parseFloat(newLog.temperature_celsius)
        }),
      });

      const data = await response.json();
      if (data.success) {
        setNewLog({
          log_date: new Date().toISOString().split('T')[0],
          log_time: new Date().toTimeString().split(' ')[0].substring(0, 5),
          temperature_type: 'fridge',
          temperature_celsius: '',
          location: '',
          notes: '',
          logged_by: ''
        });
        setShowAddLog(false);
        fetchLogs();
        fetchAllLogs();
      }
    } catch (error) {
      // Handle add log error gracefully
    }
  };

  const handleDeleteLog = async (logId: number) => {
    try {
      const response = await fetch(`/api/temperature-logs/${logId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        fetchLogs();
        fetchAllLogs();
      }
    } catch (error) {
      // Handle delete error gracefully
    }
  };

  const handleQuickTempLog = async (equipmentId: string, equipmentName: string, equipmentType: string) => {
    setQuickTempLoading(prev => ({ ...prev, [equipmentId]: true }));
    try {
      const response = await fetch('/api/temperature-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          log_date: new Date().toISOString().split('T')[0],
          log_time: new Date().toTimeString().split(' ')[0].substring(0, 5),
          temperature_type: equipmentType,
          temperature_celsius: 0, // Will be updated by user
          location: equipmentName,
          notes: 'Quick log',
          logged_by: 'System'
        }),
      });

      const data = await response.json();
      if (data.success) {
        fetchLogs();
        fetchAllLogs();
      }
    } catch (error) {
      // Handle logging error gracefully
      alert('Failed to log temperature. Please try again.');
    } finally {
      setQuickTempLoading(prev => ({ ...prev, [equipmentId]: false }));
    }
  };

  const handleUpdateEquipment = async (equipmentId: string, updates: Partial<TemperatureEquipment>) => {
    try {
      const response = await fetch(`/api/temperature-equipment/${equipmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      if (data.success) {
        fetchEquipment();
      }
    } catch (error) {
      // Handle update error gracefully
    }
  };

  const handleCreateEquipment = async (name: string, equipmentType: string, location: string | null, minTemp: number | null, maxTemp: number | null) => {
    try {
      const response = await fetch('/api/temperature-equipment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          equipment_type: equipmentType,
          location,
          min_temp_celsius: minTemp,
          max_temp_celsius: maxTemp,
          is_active: true
        }),
      });

      const data = await response.json();
      if (data.success) {
        fetchEquipment();
      }
    } catch (error) {
      // Handle create error gracefully
    }
  };

  const handleDeleteEquipment = async (equipmentId: string) => {
    try {
      const response = await fetch(`/api/temperature-equipment/${equipmentId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        fetchEquipment();
      }
    } catch (error) {
      // Handle delete error gracefully
    }
  };


  const getTypeIcon = (type: string) => {
    const typeInfo = temperatureTypes.find(t => t.value === type);
    return typeInfo?.icon || '🌡️';
  };

  const getTypeLabel = (type: string) => {
    const typeInfo = temperatureTypes.find(t => t.value === type);
    return typeInfo?.label || type;
  };

  const getFoodSafetyStatus = (temp: number, logTime: string, logDate: string, type: string) => {
    if (type !== 'food_cooking' && type !== 'food_hot_holding' && type !== 'food_cold_holding') {
      return null;
    }

    if (temp < 5 || temp > 60) {
      return { status: 'safe', message: 'Outside danger zone', color: 'text-green-400', icon: '✅' };
    }

    const logDateTime = new Date(`${logDate}T${logTime}`);
    const now = new Date();
    const hoursInDangerZone = (now.getTime() - logDateTime.getTime()) / (1000 * 60 * 60);

    if (hoursInDangerZone < 2) {
      return { 
        status: 'safe', 
        message: `${(2 - hoursInDangerZone).toFixed(1)}h remaining - can refrigerate`, 
        color: 'text-green-400',
        icon: '✅'
      };
    } else if (hoursInDangerZone < 4) {
      return { 
        status: 'warning', 
        message: `${(4 - hoursInDangerZone).toFixed(1)}h remaining - use immediately`, 
        color: 'text-yellow-400',
        icon: '⚠️'
      };
    } else {
      return { 
        status: 'danger', 
        message: `${hoursInDangerZone.toFixed(1)}h in danger zone - DISCARD`, 
        color: 'text-red-400',
        icon: '🚨'
      };
    }
  };

  // Temporarily bypass loading state to test charts
  if (false && loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
            <h3 className="text-yellow-300 font-semibold mb-2">🐛 Debug Information (Loading State)</h3>
            <div className="text-sm space-y-1">
              <p>Loading: <span className="text-yellow-300">{loading ? 'true' : 'false'}</span></p>
              <p>Logs count: <span className="text-yellow-300">{logs.length}</span></p>
              <p>All logs count: <span className="text-yellow-300">{allLogs.length}</span></p>
              <p>Equipment count: <span className="text-yellow-300">{equipment.length}</span></p>
              <p>Active tab: <span className="text-yellow-300">{activeTab}</span></p>
            </div>
          </div>
          <div className="animate-pulse">
            <div className="h-8 bg-[#2a2a2a] rounded-3xl w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]">
                  <div className="h-4 bg-[#2a2a2a] rounded-xl w-3/4 mb-3"></div>
                  <div className="h-20 bg-[#2a2a2a] rounded-xl"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🌡️ {t('temperature.title', 'Temperature Logs')}
          </h1>
          <p className="text-gray-400">{t('temperature.subtitle', 'Track fridge, freezer, and food temperatures for food safety compliance')}</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-[#1f1f1f] p-1 rounded-2xl border border-[#2a2a2a]">
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] ${
                activeTab === 'logs'
                  ? 'bg-[#29E7CD] text-black shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
              aria-pressed={activeTab === 'logs'}
              aria-label="View temperature logs"
            >
              📝 {t('temperature.logs', 'Logs')}
            </button>
            <button
              onClick={() => setActiveTab('equipment')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] ${
                activeTab === 'equipment'
                  ? 'bg-[#29E7CD] text-black shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
              aria-pressed={activeTab === 'equipment'}
              aria-label="View temperature equipment"
            >
              🏭 {t('temperature.equipment', 'Equipment')}
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] ${
                activeTab === 'analytics'
                  ? 'bg-[#29E7CD] text-black shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
              aria-pressed={activeTab === 'analytics'}
              aria-label="View temperature analytics"
            >
              📊 {t('temperature.analytics', 'Analytics')}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'logs' && (
          <TemperatureLogsTab
            logs={logs}
            equipment={equipment}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            showAddLog={showAddLog}
            setShowAddLog={setShowAddLog}
            newLog={newLog}
            setNewLog={setNewLog}
            onAddLog={handleAddLog}
            onRefreshLogs={fetchLogs}
          />
        )}

        {activeTab === 'equipment' && (
          <TemperatureEquipmentTab
            equipment={equipment}
            quickTempLoading={quickTempLoading}
            onUpdateEquipment={handleUpdateEquipment}
            onCreateEquipment={handleCreateEquipment}
            onDeleteEquipment={handleDeleteEquipment}
            onQuickTempLog={handleQuickTempLog}
          />
        )}


        {activeTab === 'analytics' && (
          <TemperatureAnalyticsTab
            allLogs={allLogs}
            equipment={equipment}
          />
        )}

      </div>
    </div>
  );
}