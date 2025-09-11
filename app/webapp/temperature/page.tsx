'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { useCountryFormatting } from '@/hooks/useCountryFormatting';
import dynamic from 'next/dynamic';

// Lazy load the synchronized chart component for better performance
const SynchronizedChart = dynamic(() => import('./components/SynchronizedChart'), {
  loading: () => (
    <div className="h-64 bg-[#1f1f1f] rounded-3xl animate-pulse flex items-center justify-center">
      <div className="text-gray-400">Loading chart...</div>
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
    // Convert time string (HH:MM:SS) to a readable format
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
  const [allLogs, setAllLogs] = useState<TemperatureLog[]>([]); // All logs for analytics
  const [thresholds, setThresholds] = useState<TemperatureThreshold[]>([]);
  const [equipment, setEquipment] = useState<TemperatureEquipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'logs' | 'thresholds' | 'equipment' | 'analytics'>('logs');
  const [quickTempInputs, setQuickTempInputs] = useState<{[key: string]: string}>({});
  const [quickTempLoading, setQuickTempLoading] = useState<{[key: string]: boolean}>({});
  const [quickTempConfirmations, setQuickTempConfirmations] = useState<{[key: string]: {message: string, timestamp: number}}>({});
  const [timeFilter, setTimeFilter] = useState('all'); // '1week', '1month', '3months', 'all'
  const [dateOffset, setDateOffset] = useState(0); // For date scrolling
  const [showAddLog, setShowAddLog] = useState(false);
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
    fetchAllLogs(); // Fetch all logs for analytics
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
      console.error('Error fetching logs:', error);
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
      console.error('Error fetching all logs:', error);
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
      console.error('Error fetching thresholds:', error);
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
      console.error('Error fetching equipment:', error);
    }
  };

  const checkCoolingOffPeriod = (equipmentName: string, coolingOffMinutes: number = 5) => {
    const now = new Date();
    const cutoffTime = new Date(now.getTime() - (coolingOffMinutes * 60 * 1000));
    
    // Check if there's a recent log for this equipment
    const recentLog = logs.find(log => 
      log.location === equipmentName && 
      new Date(`${log.log_date}T${log.log_time}`) > cutoffTime
    );
    
    return recentLog;
  };

  const handleQuickTempLog = async (equipmentId: string, equipmentName: string, equipmentType: string) => {
    const tempValue = quickTempInputs[equipmentId];
    if (!tempValue || isNaN(parseFloat(tempValue))) {
      alert('Please enter a valid temperature');
      return;
    }

    // Check cooling off period (5 minutes default)
    const recentLog = checkCoolingOffPeriod(equipmentName, 5);
    if (recentLog) {
      const timeDiff = Math.ceil((new Date().getTime() - new Date(`${recentLog.log_date}T${recentLog.log_time}`).getTime()) / (1000 * 60));
      const remainingTime = 5 - timeDiff;
      alert(`Please wait ${remainingTime} more minute(s) before logging another temperature for this equipment. Last logged at ${recentLog.log_time}.`);
      return;
    }

    setQuickTempLoading(prev => ({ ...prev, [equipmentId]: true }));

    try {
      const response = await fetch('/api/temperature-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          log_date: new Date().toISOString().split('T')[0],
          log_time: new Date().toTimeString().split(' ')[0].substring(0, 5),
          temperature_type: equipmentType,
          temperature_celsius: parseFloat(tempValue),
          location: equipmentName,
          notes: 'Quick log',
          logged_by: 'Staff'
        })
      });

      const data = await response.json();
      if (data.success) {
        // Clear the input
        setQuickTempInputs(prev => ({ ...prev, [equipmentId]: '' }));
        // Show confirmation message
                  setQuickTempConfirmations(prev => ({ 
                    ...prev, 
                    [equipmentId]: { 
                      message: `${tempValue}°C logged successfully! Next entry allowed in 5 minutes.`, 
                      timestamp: Date.now() 
                    } 
                  }));
        // Auto-hide confirmation after 3 seconds
        setTimeout(() => {
          setQuickTempConfirmations(prev => {
            const newState = { ...prev };
            delete newState[equipmentId];
            return newState;
          });
        }, 3000);
        // Refresh logs
        fetchLogs();
      } else {
        alert('Failed to log temperature: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error logging temperature:', error);
      alert('Failed to log temperature. Please try again.');
    } finally {
      setQuickTempLoading(prev => ({ ...prev, [equipmentId]: false }));
    }
  };


  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check cooling off period if location is specified
    if (newLog.location) {
      const recentLog = checkCoolingOffPeriod(newLog.location, 5);
      if (recentLog) {
        const timeDiff = Math.ceil((new Date().getTime() - new Date(`${recentLog.log_date}T${recentLog.log_time}`).getTime()) / (1000 * 60));
        const remainingTime = 5 - timeDiff;
        alert(`Please wait ${remainingTime} more minute(s) before logging another temperature for this equipment. Last logged at ${recentLog.log_time}.`);
        return;
      }
    }
    
    try {
      const response = await fetch('/api/temperature-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newLog,
          temperature_celsius: parseFloat(newLog.temperature_celsius)
        })
      });
      const data = await response.json();
      if (data.success) {
        setLogs([data.data, ...logs]);
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
      }
    } catch (error) {
      console.error('Error adding log:', error);
    }
  };


  const getTemperatureStatus = (temp: number, type: string) => {
    const threshold = thresholds.find(t => t.temperature_type === type);
    if (!threshold || !threshold.alert_enabled) return 'normal';
    
    if (threshold.min_temp_celsius && temp < threshold.min_temp_celsius) return 'low';
    if (threshold.max_temp_celsius && temp > threshold.max_temp_celsius) return 'high';
    return 'normal';
  };


  const getFoodSafetyStatus = (temp: number, logTime: string, logDate: string, type: string) => {
    // Only apply to food items in danger zone (5°C to 60°C)
    if (type !== 'food_cooking' && type !== 'food_hot_holding' && type !== 'food_cold_holding') {
      return null; // Not a food item
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'low': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default: return 'text-green-400 bg-green-400/10 border-green-400/20';
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

  const getTimePeriod = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 5 && hour < 9) return { period: 'morning', label: '🌅 Morning (5:00-8:59)', icon: '🌅' };
    if (hour >= 9 && hour < 12) return { period: 'late-morning', label: '☀️ Late Morning (9:00-11:59)', icon: '☀️' };
    if (hour >= 12 && hour < 14) return { period: 'midday', label: '🌞 Midday (12:00-13:59)', icon: '🌞' };
    if (hour >= 14 && hour < 17) return { period: 'afternoon', label: '🌤️ Afternoon (14:00-16:59)', icon: '🌤️' };
    if (hour >= 17 && hour < 20) return { period: 'dinner', label: '🌆 Dinner Prep (17:00-19:59)', icon: '🌆' };
    if (hour >= 20 && hour < 22) return { period: 'evening', label: '🌙 Evening (20:00-21:59)', icon: '🌙' };
    return { period: 'night', label: '🌚 Night (22:00-4:59)', icon: '🌚' };
  };

  const groupLogsByTimePeriod = (logs: TemperatureLog[]) => {
    const grouped = logs.reduce((acc, log) => {
      const timePeriod = getTimePeriod(log.log_time);
      if (!acc[timePeriod.period]) {
        acc[timePeriod.period] = {
          period: timePeriod.period,
          label: timePeriod.label,
          icon: timePeriod.icon,
          logs: []
        };
      }
      acc[timePeriod.period].logs.push(log);
      return acc;
    }, {} as Record<string, { period: string; label: string; icon: string; logs: TemperatureLog[] }>);

    // Sort periods by time of day
    const periodOrder = ['morning', 'late-morning', 'midday', 'afternoon', 'dinner', 'evening', 'night'];
    return periodOrder
      .filter(period => grouped[period])
      .map(period => grouped[period])
      .map(group => ({
        ...group,
        logs: group.logs.sort((a, b) => a.log_time.localeCompare(b.log_time))
      }));
  };

  const filterLogsByTimePeriod = (logs: TemperatureLog[], timeFilter: string, offset: number = 0): TemperatureLog[] => {
    if (timeFilter === 'all') return logs;
    
    const now = new Date();
    const startDate = new Date();
    const endDate = new Date();
    
    switch (timeFilter) {
      case '1week':
        startDate.setDate(now.getDate() - 7 + offset);
        endDate.setDate(now.getDate() + offset);
        break;
      case '1month':
        startDate.setMonth(now.getMonth() - 1 + offset);
        endDate.setMonth(now.getMonth() + offset);
        break;
      case '3months':
        startDate.setMonth(now.getMonth() - 3 + offset);
        endDate.setMonth(now.getMonth() + offset);
        break;
      default:
        return logs;
    }
    
    // Set time to start of day for accurate comparison
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    
    return logs.filter(log => {
      const logDate = new Date(log.log_date);
      logDate.setHours(0, 0, 0, 0);
      return logDate >= startDate && logDate <= endDate;
    });
  };

  const getDateRangeForFilter = (timeFilter: string, offset: number = 0) => {
    const now = new Date();
    const startDate = new Date();
    
    switch (timeFilter) {
      case '1week':
        startDate.setDate(now.getDate() - 7 + offset);
        break;
      case '1month':
        startDate.setMonth(now.getMonth() - 1 + offset);
        break;
      case '3months':
        startDate.setMonth(now.getMonth() - 3 + offset);
        break;
      default:
        return { start: null, end: null };
    }
    
    const endDate = new Date(now);
    endDate.setDate(now.getDate() + offset);
    
    return { start: startDate, end: endDate };
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
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === 'logs'
                  ? 'bg-[#29E7CD] text-black shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              📊 {t('temperature.logs', 'Temperature Logs')}
            </button>
            <button
              onClick={() => setActiveTab('equipment')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === 'equipment'
                  ? 'bg-[#29E7CD] text-black shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🧊 {t('temperature.equipment', 'Equipment')}
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === 'analytics'
                  ? 'bg-[#29E7CD] text-black shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              📊 {t('temperature.analytics', 'Analytics')}
            </button>
            <button
              onClick={() => setActiveTab('thresholds')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === 'thresholds'
                  ? 'bg-[#29E7CD] text-black shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              ⚙️ {t('temperature.thresholds', 'Temperature Thresholds')}
            </button>
          </div>
        </div>

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className="space-y-6">
            {/* Filters and Add Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{t('temperature.filterDate', 'Filter by Date')}</label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        const currentDate = new Date(selectedDate);
                        currentDate.setDate(currentDate.getDate() - 1);
                        setSelectedDate(currentDate.toISOString().split('T')[0]);
                      }}
                      className="bg-[#2a2a2a] text-white px-3 py-2 rounded-xl hover:bg-[#3a3a3a] transition-all duration-200 flex items-center justify-center"
                      title="Previous day"
                    >
                      <span className="text-lg">←</span>
                    </button>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="px-4 py-2 bg-[#2a2a2a] border border-[#2a2a2a] rounded-xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                    />
                    <button
                      onClick={() => {
                        const currentDate = new Date(selectedDate);
                        currentDate.setDate(currentDate.getDate() + 1);
                        setSelectedDate(currentDate.toISOString().split('T')[0]);
                      }}
                      className="bg-[#2a2a2a] text-white px-3 py-2 rounded-xl hover:bg-[#3a3a3a] transition-all duration-200 flex items-center justify-center"
                      title="Next day"
                    >
                      <span className="text-lg">→</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedDate(new Date().toISOString().split('T')[0]);
                      }}
                      className="bg-[#29E7CD]/10 text-[#29E7CD] px-3 py-2 rounded-xl hover:bg-[#29E7CD]/20 transition-all duration-200 text-sm font-medium"
                      title="Go to today"
                    >
                      Today
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{t('temperature.filterEquipment', 'Filter by Equipment')}</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-4 py-2 bg-[#2a2a2a] border border-[#2a2a2a] rounded-xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                  >
                    <option value="all">{t('temperature.allEquipment', 'All Equipment')}</option>
                    
                    {/* Equipment from database */}
                    {equipment.filter(eq => eq.is_active).map((item) => (
                      <option key={item.id} value={item.equipment_type}>
                        {getTypeIcon(item.equipment_type)} {item.name}
                      </option>
                    ))}
                    
                    {/* Food-specific temperature types */}
                    {temperatureTypes.filter(type => 
                      type.value === 'food_cooking' || 
                      type.value === 'food_hot_holding' || 
                      type.value === 'food_cold_holding'
                    ).map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={() => setShowAddLog(true)}
                className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-black px-6 py-3 rounded-2xl font-semibold hover:shadow-xl transition-all duration-200"
              >
                ➕ {t('temperature.addLog', 'Add Temperature Log')}
              </button>
            </div>

            {/* Add Log Form */}
            {showAddLog && (
              <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]">
                <h3 className="text-xl font-semibold text-white mb-2">{t('temperature.addNewLog', 'Add New Temperature Log')}</h3>
                <p className="text-sm text-gray-400 mb-4">
                  💡 You can log multiple temperatures per day for the same equipment (e.g., morning and evening checks). There's a 5-minute cooling off period between entries for the same equipment.
                </p>
                <div className="mb-4 p-4 bg-blue-400/10 border border-blue-400/20 rounded-2xl">
                  <h4 className="text-sm font-semibold text-blue-400 mb-2">🍽️ Queensland 2-Hour/4-Hour Rule</h4>
                  <div className="text-xs text-gray-300 space-y-1">
                    <p>• <span className="text-green-400">0-2 hours</span> in danger zone (5°C-60°C): Can refrigerate for later use</p>
                    <p>• <span className="text-yellow-400">2-4 hours</span> in danger zone: Must use immediately</p>
                    <p>• <span className="text-red-400">4+ hours</span> in danger zone: Must discard</p>
                  </div>
                </div>
                <form onSubmit={handleAddLog} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('temperature.date', 'Date')}</label>
                    <input
                      type="date"
                      value={newLog.log_date}
                      onChange={(e) => setNewLog({ ...newLog, log_date: e.target.value })}
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('temperature.time', 'Time')}</label>
                    <input
                      type="time"
                      value={newLog.log_time}
                      onChange={(e) => setNewLog({ ...newLog, log_time: e.target.value })}
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('temperature.equipment', 'Equipment')}</label>
                    <select
                      value={newLog.temperature_type}
                      onChange={(e) => {
                        const selectedEquipment = equipment.find(eq => eq.equipment_type === e.target.value);
                        setNewLog({ 
                          ...newLog, 
                          temperature_type: e.target.value,
                          location: selectedEquipment?.name || ''
                        });
                      }}
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                      required
                    >
                      <option value="">{t('temperature.selectEquipment', 'Select Equipment')}</option>
                      
                      {/* Equipment from database */}
                      {equipment.filter(eq => eq.is_active).map((item) => (
                        <option key={item.id} value={item.equipment_type}>
                          {getTypeIcon(item.equipment_type)} {item.name} ({getTypeLabel(item.equipment_type)})
                        </option>
                      ))}
                      
                      {/* Food-specific temperature types */}
                      {temperatureTypes.filter(type => 
                        type.value === 'food_cooking' || 
                        type.value === 'food_hot_holding' || 
                        type.value === 'food_cold_holding'
                      ).map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label} (Food Safety)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('temperature.temperature', 'Temperature (°C)')}</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newLog.temperature_celsius}
                      onChange={(e) => setNewLog({ ...newLog, temperature_celsius: e.target.value })}
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                      placeholder="e.g., 3.5"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {['food_cooking', 'food_hot_holding', 'food_cold_holding'].includes(newLog.temperature_type) 
                        ? t('temperature.foodItem', 'Food Item') 
                        : t('temperature.location', 'Location')
                      }
                    </label>
                    <input
                      type="text"
                      value={newLog.location}
                      onChange={(e) => setNewLog({ ...newLog, location: e.target.value })}
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                      placeholder={
                        ['food_cooking', 'food_hot_holding', 'food_cold_holding'].includes(newLog.temperature_type)
                          ? 'e.g., Chicken Curry, Soup Station 1, Salad Bar'
                          : 'e.g., Main Fridge, Freezer 1'
                      }
                      required={['food_cooking', 'food_hot_holding', 'food_cold_holding'].includes(newLog.temperature_type)}
                    />
                    {['food_cooking', 'food_hot_holding', 'food_cold_holding'].includes(newLog.temperature_type) && (
                      <p className="text-xs text-gray-400 mt-1">
                        💡 Specify the exact food item for proper 2-hour/4-hour rule tracking
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('temperature.loggedBy', 'Logged By')}</label>
                    <input
                      type="text"
                      value={newLog.logged_by}
                      onChange={(e) => setNewLog({ ...newLog, logged_by: e.target.value })}
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                      placeholder="Staff member name"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('temperature.notes', 'Notes')}</label>
                    <textarea
                      value={newLog.notes}
                      onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                      placeholder="Additional notes or observations"
                      rows={3}
                    />
                  </div>
                  <div className="md:col-span-2 flex space-x-4">
                    <button
                      type="submit"
                      className="bg-[#29E7CD] text-black px-6 py-3 rounded-2xl font-semibold hover:shadow-xl transition-all duration-200"
                    >
                      {t('temperature.save', 'Save Log')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddLog(false)}
                      className="bg-[#2a2a2a] text-white px-6 py-3 rounded-2xl font-semibold hover:bg-[#3a3a3a] transition-all duration-200"
                    >
                      {t('temperature.cancel', 'Cancel')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Logs List */}
            <div className="space-y-6">
              {logs.length === 0 ? (
                <div className="bg-[#1f1f1f] p-8 rounded-3xl shadow-lg border border-[#2a2a2a] text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">🌡️</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{t('temperature.noLogs', 'No Temperature Logs')}</h3>
                  <p className="text-gray-400">{t('temperature.noLogsDesc', 'Start logging temperatures to ensure food safety compliance')}</p>
                </div>
              ) : (
                groupLogsByTimePeriod(logs).map((timeGroup) => (
                  <div key={timeGroup.period} className="space-y-4">
                    {/* Time Period Header */}
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10 flex items-center justify-center">
                        <span className="text-xl">{timeGroup.icon}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{timeGroup.label}</h3>
                        <p className="text-sm text-gray-400">{timeGroup.logs.length} temperature reading{timeGroup.logs.length !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    
                    {/* Logs for this time period */}
                    <div className="space-y-3">
                      {timeGroup.logs.map((log) => {
                        const status = getTemperatureStatus(log.temperature_celsius, log.temperature_type);
                        const foodSafety = getFoodSafetyStatus(log.temperature_celsius, log.log_time, log.log_date, log.temperature_type);
                        return (
                          <div key={log.id} className="bg-[#1f1f1f] p-4 rounded-2xl shadow-lg border border-[#2a2a2a] hover:shadow-xl transition-all duration-200">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10 flex items-center justify-center">
                                  <span className="text-lg">{getTypeIcon(log.temperature_type)}</span>
                                </div>
                                <div>
                                  <h4 className="text-lg font-semibold text-white">{log.location || getTypeLabel(log.temperature_type)}</h4>
                                  <div className="flex items-center space-x-2">
                                    <p className="text-sm text-gray-400">{log.log_time}</p>
                                    <span className="text-xs text-gray-500">•</span>
                                    <p className="text-xs text-gray-500">{getTypeLabel(log.temperature_type)}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                                  {status === 'high' ? '⚠️ High' : status === 'low' ? '⚠️ Low' : '✅ Normal'}
                                </span>
                                <span className="text-xl font-bold text-[#29E7CD]">
                                  {log.temperature_celsius}°C
                                </span>
                              </div>
                            </div>
                            
                            {log.location && log.location !== getTypeLabel(log.temperature_type) && (
                              <p className="text-gray-300 text-sm mb-2">📍 {log.location}</p>
                            )}
                            
                            {log.logged_by && (
                              <p className="text-xs text-gray-400 mb-2">👤 {t('temperature.loggedBy', 'Logged by')}: {log.logged_by}</p>
                            )}
                            
                            {log.notes && (
                              <p className="text-gray-300 text-sm mb-3">{log.notes}</p>
                            )}
                            
                            {/* Food Safety Status (2-Hour/4-Hour Rule) */}
                            {foodSafety && (
                              <div className={`mb-3 p-3 rounded-xl border ${foodSafety.color.replace('text-', 'bg-').replace('-400', '-400/10')} border-${foodSafety.color.replace('text-', '').replace('-400', '-400/20')}`}>
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg">{foodSafety.icon}</span>
                                  <div>
                                    <p className={`text-sm font-medium ${foodSafety.color}`}>
                                      Queensland 2-Hour/4-Hour Rule
                                    </p>
                                    <p className={`text-xs ${foodSafety.color}`}>
                                      {foodSafety.message}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {log.photo_url && (
                              <div className="mb-3">
                                <img 
                                  src={log.photo_url} 
                                  alt="Temperature reading" 
                                  className="w-24 h-24 object-cover rounded-xl border border-[#2a2a2a]"
                                />
                              </div>
                            )}
                            
                            <div className="flex space-x-3">
                              <button className="bg-[#2a2a2a] text-white px-3 py-1 rounded-lg font-semibold hover:bg-[#3a3a3a] transition-all duration-200 text-sm">
                                📷 {t('temperature.addPhoto', 'Add Photo')}
                              </button>
                              <button className="bg-[#2a2a2a] text-white px-3 py-1 rounded-lg font-semibold hover:bg-[#3a3a3a] transition-all duration-200 text-sm">
                                ✏️ {t('temperature.edit', 'Edit')}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Equipment Tab */}
        {activeTab === 'equipment' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold text-white">{t('temperature.equipment', 'Temperature Equipment')}</h2>
                <p className="text-gray-400 mt-1">{t('temperature.equipmentDesc', 'Manage your temperature monitoring equipment')}</p>
              </div>
              <button
                onClick={() => window.open('/webapp/setup', '_blank')}
                className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-black px-6 py-3 rounded-2xl font-semibold hover:shadow-xl transition-all duration-200"
              >
                ➕ {t('temperature.addEquipment', 'Add Equipment')}
              </button>
            </div>

            {equipment.length === 0 ? (
              <div className="bg-[#1f1f1f] p-8 rounded-3xl shadow-lg border border-[#2a2a2a] text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🧊</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{t('temperature.noEquipment', 'No Temperature Equipment')}</h3>
                <p className="text-gray-400 mb-6">{t('temperature.noEquipmentDesc', 'Add temperature monitoring equipment to start logging temperatures')}</p>
                <button
                  onClick={() => window.open('/webapp/setup', '_blank')}
                  className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-black px-6 py-3 rounded-2xl font-semibold hover:shadow-xl transition-all duration-200"
                >
                  ➕ {t('temperature.addFirstEquipment', 'Add Your First Equipment')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {equipment.map((item) => (
                  <div key={item.id} className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a] hover:shadow-xl transition-all duration-200">
                    {/* Quick Confirmation Message */}
                    {quickTempConfirmations[item.id] && (
                      <div className="mb-4 p-3 bg-green-400/10 border border-green-400/20 rounded-2xl animate-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center space-x-2">
                          <span className="text-green-400 text-lg">✅</span>
                          <span className="text-green-400 font-medium text-sm">
                            {quickTempConfirmations[item.id].message}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10 flex items-center justify-center">
                          <span className="text-2xl">{getTypeIcon(item.equipment_type)}</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                          <p className="text-sm text-gray-400">{getTypeLabel(item.equipment_type)}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.is_active 
                          ? 'bg-green-400/10 text-green-400 border border-green-400/20' 
                          : 'bg-gray-400/10 text-gray-400 border border-gray-400/20'
                      }`}>
                        {item.is_active ? t('temperature.active', 'Active') : t('temperature.inactive', 'Inactive')}
                      </span>
                    </div>
                    
                    {item.location && (
                      <p className="text-gray-300 mb-3">📍 {item.location}</p>
                    )}
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">{t('temperature.tempRange', 'Temperature Range')}</span>
                        <span className="text-white font-semibold">
                          {item.min_temp_celsius && item.max_temp_celsius 
                            ? `${item.min_temp_celsius}°C - ${item.max_temp_celsius}°C`
                            : t('temperature.notSet', 'Not Set')
                          }
                        </span>
                      </div>
                    </div>
                    
            {/* Quick Temperature Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                🌡️ {t('temperature.quickLog', 'Quick Log Temperature')}
              </label>
              <p className="text-xs text-gray-400 mb-2">
                💡 You can log multiple temperatures per day for the same equipment. 5-minute cooling off period between entries.
              </p>
              <div className="flex space-x-2">
                <input
                  type="number"
                  step="0.1"
                  value={quickTempInputs[item.id] || ''}
                  onChange={(e) => setQuickTempInputs(prev => ({ ...prev, [item.id]: e.target.value }))}
                  className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-[#2a2a2a] rounded-xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent text-sm"
                  placeholder="e.g., 3.5"
                />
                <button
                  onClick={() => handleQuickTempLog(item.id, item.name, item.equipment_type)}
                  disabled={quickTempLoading[item.id] || !quickTempInputs[item.id]}
                  className="bg-[#29E7CD] text-black px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {quickTempLoading[item.id] ? '⏳' : '✅'}
                </button>
              </div>
            </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setNewLog({
                            ...newLog,
                            temperature_type: item.equipment_type,
                            location: item.name
                          });
                          setActiveTab('logs');
                          setShowAddLog(true);
                        }}
                        className="flex-1 bg-[#2a2a2a] text-white px-4 py-2 rounded-xl font-semibold hover:bg-[#3a3a3a] transition-all duration-200"
                      >
                        📝 {t('temperature.detailedLog', 'Detailed Log')}
                      </button>
                      <button
                        onClick={() => window.open('/webapp/setup', '_blank')}
                        className="bg-[#2a2a2a] text-white px-4 py-2 rounded-xl font-semibold hover:bg-[#3a3a3a] transition-all duration-200"
                      >
                        ✏️ {t('temperature.edit', 'Edit')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold text-white">{t('temperature.analytics', 'Temperature Analytics')}</h2>
                <p className="text-gray-400 mt-1">{t('temperature.analyticsDesc', 'Visualize temperature trends and patterns across all equipment')}</p>
              </div>
            </div>

            {/* Time Period Filter */}
            <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">📅 Time Period Filter</h3>
                    <p className="text-gray-400 text-sm">Select the time range for temperature data visualization</p>
                  </div>
                  <div className="flex space-x-2">
                    {[
                      { value: '1week', label: '1 Week', icon: '📅' },
                      { value: '1month', label: '1 Month', icon: '📆' },
                      { value: '3months', label: '3 Months', icon: '🗓️' },
                      { value: 'all', label: 'All Time', icon: '⏰' }
                    ].map((period) => (
                      <button
                        key={period.value}
                        onClick={() => {
                          setTimeFilter(period.value);
                          setDateOffset(0); // Reset offset when changing filter
                        }}
                        className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                          timeFilter === period.value
                            ? 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-black shadow-lg'
                            : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a] hover:text-white'
                        }`}
                      >
                        <span className="mr-2">{period.icon}</span>
                        {period.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Date Scrolling Controls */}
                {timeFilter !== 'all' && (
                  <div className="flex items-center justify-center space-x-4 pt-4 border-t border-[#2a2a2a]">
                    <button
                      onClick={() => setDateOffset(dateOffset - 1)}
                      className="bg-[#2a2a2a] text-white px-4 py-2 rounded-xl hover:bg-[#3a3a3a] transition-all duration-200 flex items-center space-x-2"
                    >
                      <span>←</span>
                      <span>Previous</span>
                    </button>
                    
                    <div className="text-center">
                      <div className="text-white font-medium">
                        {(() => {
                          const range = getDateRangeForFilter(timeFilter, dateOffset);
                          if (range.start && range.end) {
                            const startStr = formatDateString(range.start.toISOString().split('T')[0]);
                            const endStr = formatDateString(range.end.toISOString().split('T')[0]);
                            return `${startStr} - ${endStr}`;
                          }
                          return 'All Time';
                        })()}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {dateOffset === 0 ? 'Current Period' : 
                         dateOffset > 0 ? `${dateOffset} period(s) ahead` : 
                         `${Math.abs(dateOffset)} period(s) ago`}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setDateOffset(dateOffset + 1)}
                      className="bg-[#2a2a2a] text-white px-4 py-2 rounded-xl hover:bg-[#3a3a3a] transition-all duration-200 flex items-center space-x-2"
                    >
                      <span>Next</span>
                      <span>→</span>
                    </button>
                  </div>
                )}
              </div>
            </div>


            {/* Data Summary */}
            <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]">
              <h3 className="text-xl font-semibold text-white mb-4">📊 Data Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="bg-[#2a2a2a]/30 p-4 rounded-xl">
                  <h4 className="font-semibold text-white mb-2">Time Period</h4>
                  <p className="text-[#29E7CD] text-lg font-semibold">
                    {timeFilter === '1week' ? 'Last 7 days' : 
                     timeFilter === '1month' ? 'Last 30 days' : 
                     timeFilter === '3months' ? 'Last 90 days' : 'All time'}
                  </p>
                </div>
                <div className="bg-[#2a2a2a]/30 p-4 rounded-xl">
                  <h4 className="font-semibold text-white mb-2">Total Logs</h4>
                  <p className="text-[#29E7CD] text-lg font-semibold">
                    {filterLogsByTimePeriod(allLogs, timeFilter, dateOffset).length}
                  </p>
                </div>
                <div className="bg-[#2a2a2a]/30 p-4 rounded-xl">
                  <h4 className="font-semibold text-white mb-2">Active Equipment</h4>
                  <p className="text-[#29E7CD] text-lg font-semibold">
                    {equipment.filter(eq => eq.is_active).length}
                  </p>
                </div>
              </div>
            </div>

            {/* Debug Information */}
            <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]">
              <h3 className="text-xl font-semibold text-white mb-4">🔍 Debug Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-white mb-2">Filter Status:</h4>
                  <p className="text-gray-300">Time Filter: {timeFilter}</p>
                  <p className="text-gray-300">Total Logs: {allLogs.length}</p>
                  <p className="text-gray-300">Filtered Logs: {filterLogsByTimePeriod(allLogs, timeFilter, dateOffset).length}</p>
                  <p className="text-gray-300">Active Equipment: {equipment.filter(eq => eq.is_active).length}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Sample Filtered Logs:</h4>
                  {filterLogsByTimePeriod(allLogs, timeFilter, dateOffset).slice(0, 3).map((log, index) => (
                    <p key={log.id} className="text-gray-300 text-xs">
                      {log.location} - {log.temperature_celsius}°C - {formatDateString(log.log_date)} {formatTime(log.log_time)}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Individual Equipment Charts */}
            <div className="space-y-8">
              {equipment.filter(eq => eq.is_active).map((item) => {
                const itemLogs = filterLogsByTimePeriod(
                  allLogs.filter(log => {
                    // Match by equipment name in location field
                    return log.location === item.name;
                  })
                  .sort((a, b) => new Date(`${a.log_date}T${a.log_time}`).getTime() - new Date(`${b.log_date}T${b.log_time}`).getTime()),
                  timeFilter,
                  dateOffset
                ); // Show all readings for the selected time period
                
                // Debug logging
                console.log(`Equipment: ${item.name}, Time Filter: ${timeFilter}, Logs Count: ${itemLogs.length}`);
                
                return (
                  <SynchronizedChart
                    key={`${item.id}-${timeFilter}-${dateOffset}`}
                    logs={itemLogs}
                    equipment={item}
                    formatDateString={formatDateString}
                    formatTime={formatTime}
                    getTypeIcon={getTypeIcon}
                  />
                );
              })}
            </div>

            {/* Food Safety Alerts */}
            {logs.filter(log => ['food_cooking', 'food_hot_holding', 'food_cold_holding'].includes(log.temperature_type)).length > 0 && (
              <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]">
                <h3 className="text-xl font-semibold text-white mb-4">🍽️ Food Safety Alerts</h3>
                <div className="space-y-3">
                  {logs
                    .filter(log => ['food_cooking', 'food_hot_holding', 'food_cold_holding'].includes(log.temperature_type))
                    .slice(0, 5)
                    .map((log) => {
                      const foodSafety = getFoodSafetyStatus(log.temperature_celsius, log.log_time, log.log_date, log.temperature_type);
                      if (!foodSafety) return null;
                      
                      return (
                        <div key={log.id} className={`p-4 rounded-2xl border ${
                          foodSafety.status === 'danger' 
                            ? 'bg-red-400/10 border-red-400/20' 
                            : foodSafety.status === 'warning'
                            ? 'bg-yellow-400/10 border-yellow-400/20'
                            : 'bg-green-400/10 border-green-400/20'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{foodSafety.icon}</span>
                              <div>
                                <h4 className="font-semibold text-white">{log.location || getTypeLabel(log.temperature_type)}</h4>
                                <p className={`text-sm ${foodSafety.color}`}>{foodSafety.message}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-white">{log.temperature_celsius}°C</div>
                              <div className="text-xs text-gray-400">{log.log_time}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Thresholds Tab */}
        {activeTab === 'thresholds' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-white">{t('temperature.manageThresholds', 'Manage Temperature Thresholds')}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {thresholds.map((threshold) => (
                <div key={threshold.id} className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a] hover:shadow-xl transition-all duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10 flex items-center justify-center">
                        <span className="text-2xl">{getTypeIcon(threshold.temperature_type)}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{getTypeLabel(threshold.temperature_type)}</h3>
                        <p className="text-sm text-gray-400">{t('temperature.thresholds', 'Temperature Thresholds')}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      threshold.alert_enabled ? 'bg-green-400/10 text-green-400 border border-green-400/20' : 'bg-gray-400/10 text-gray-400 border border-gray-400/20'
                    }`}>
                      {threshold.alert_enabled ? t('temperature.alertsEnabled', 'Alerts Enabled') : t('temperature.alertsDisabled', 'Alerts Disabled')}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">{t('temperature.minTemp', 'Minimum Temperature')}</span>
                      <span className="text-white font-semibold">
                        {threshold.min_temp_celsius ? `${threshold.min_temp_celsius}°C` : t('temperature.notSet', 'Not Set')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">{t('temperature.maxTemp', 'Maximum Temperature')}</span>
                      <span className="text-white font-semibold">
                        {threshold.max_temp_celsius ? `${threshold.max_temp_celsius}°C` : t('temperature.notSet', 'Not Set')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-4">
                    <button className="bg-[#29E7CD] text-black px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-200">
                      ✏️ {t('temperature.edit', 'Edit')}
                    </button>
                    <button className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                      threshold.alert_enabled 
                        ? 'bg-red-400/10 text-red-400 border border-red-400/20 hover:bg-red-400/20'
                        : 'bg-green-400/10 text-green-400 border border-green-400/20 hover:bg-green-400/20'
                    }`}>
                      {threshold.alert_enabled ? t('temperature.disableAlerts', 'Disable Alerts') : t('temperature.enableAlerts', 'Enable Alerts')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
