'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { useCountryFormatting } from '@/hooks/useCountryFormatting';
import dynamic from 'next/dynamic';

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

const TemperatureThresholdsTab = dynamic(() => import('./components/TemperatureThresholdsTab'), {
  loading: () => (
    <div className="animate-pulse">
      <div className="h-96 bg-[#2a2a2a] rounded-3xl"></div>
    </div>
  ),
  ssr: false
});

const TemperatureAnalyticsTab = dynamic(() => import('./components/TemperatureAnalyticsTab'), {
  loading: () => (
    <div className="animate-pulse">
      <div className="h-96 bg-[#2a2a2a] rounded-3xl"></div>
    </div>
  ),
  ssr: false
});

interface TemperatureLog {
  id: number;
  log_date: string;
  log_time: string;
  temperature_type: string;
  temperature_celsius: number;
  location: string | null;
  notes: string | null;
  photo_url: string | null;
  logged_by: string | null;
  created_at: string;
  updated_at: string;
}

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
  const [allLogs, setAllLogs] = useState<TemperatureLog[]>([]);
  const [thresholds, setThresholds] = useState<TemperatureThreshold[]>([]);
  const [equipment, setEquipment] = useState<TemperatureEquipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'logs' | 'thresholds' | 'equipment' | 'analytics'>('logs');
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
    fetchLogs();
    fetchThresholds();
    fetchEquipment();
    fetchAllLogs();
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
      if (data.success) {
        setLogs(data.data);
      }
    } catch (error) {
      // Handle fetch error gracefully
    } finally {
      setLoading(false);
    }
  };

  const fetchAllLogs = async () => {
    try {
      const response = await fetch('/api/temperature-logs');
      const data = await response.json();
      if (data.success) {
        setAllLogs(data.data);
      }
    } catch (error) {
      // Handle fetch error gracefully
    }
  };

  const fetchThresholds = async () => {
    try {
      const response = await fetch('/api/temperature-thresholds');
      const data = await response.json();
      if (data.success) {
        setThresholds(data.data);
      }
    } catch (error) {
      // Handle fetch error gracefully
    }
  };

  const fetchEquipment = async () => {
    try {
      const response = await fetch('/api/temperature-equipment');
      const data = await response.json();
      if (data.success) {
        setEquipment(data.data);
      }
    } catch (error) {
      // Handle fetch error gracefully
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

  const handleUpdateThreshold = async (thresholdId: number, updates: Partial<TemperatureThreshold>) => {
    try {
      const response = await fetch(`/api/temperature-thresholds/${thresholdId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      if (data.success) {
        fetchThresholds();
      }
    } catch (error) {
      // Handle update error gracefully
    }
  };

  const handleCreateThreshold = async (equipmentId: string, minTemp: number, maxTemp: number, alertEnabled: boolean) => {
    try {
      const response = await fetch('/api/temperature-thresholds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          equipment_id: equipmentId,
          min_temp_celsius: minTemp,
          max_temp_celsius: maxTemp,
          alert_enabled: alertEnabled
        }),
      });

      const data = await response.json();
      if (data.success) {
        fetchThresholds();
      }
    } catch (error) {
      // Handle create error gracefully
    }
  };

  const handleDeleteThreshold = async (thresholdId: number) => {
    try {
      const response = await fetch(`/api/temperature-thresholds/${thresholdId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        fetchThresholds();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
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
              onClick={() => setActiveTab('thresholds')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] ${
                activeTab === 'thresholds'
                  ? 'bg-[#29E7CD] text-black shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
              aria-pressed={activeTab === 'thresholds'}
              aria-label="View temperature thresholds"
            >
              ⚙️ {t('temperature.thresholds', 'Thresholds')}
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
            thresholds={thresholds}
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

        {activeTab === 'thresholds' && (
          <TemperatureThresholdsTab
            thresholds={thresholds}
            equipment={equipment}
            onUpdateThreshold={handleUpdateThreshold}
            onCreateThreshold={handleCreateThreshold}
            onDeleteThreshold={handleDeleteThreshold}
          />
        )}

        {activeTab === 'analytics' && (
          <TemperatureAnalyticsTab
            allLogs={allLogs}
            equipment={equipment}
            logs={logs}
          />
        )}

      </div>
    </div>
  );
}