'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/useTranslation';
import OptimizedImage from '@/components/OptimizedImage';
import { useCountryFormatting } from '@/hooks/useCountryFormatting';

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

interface TemperatureLogsTabProps {
  logs: TemperatureLog[];
  thresholds: TemperatureThreshold[];
  equipment: TemperatureEquipment[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  showAddLog: boolean;
  setShowAddLog: (show: boolean) => void;
  newLog: any;
  setNewLog: (log: any) => void;
  onAddLog: (e: React.FormEvent) => void;
  onRefreshLogs: () => void;
}

const temperatureTypes = [
  { value: 'fridge', label: 'Fridge', icon: '🧊' },
  { value: 'freezer', label: 'Freezer', icon: '❄️' },
  { value: 'food_cooking', label: 'Food Cooking', icon: '🔥' },
  { value: 'food_hot_holding', label: 'Food Hot Holding', icon: '🍲' },
  { value: 'food_cold_holding', label: 'Food Cold Holding', icon: '🥗' },
  { value: 'storage', label: 'Storage', icon: '📦' }
];

export default function TemperatureLogsTab({
  logs,
  thresholds,
  equipment,
  selectedDate,
  setSelectedDate,
  selectedType,
  setSelectedType,
  showAddLog,
  setShowAddLog,
  newLog,
  setNewLog,
  onAddLog,
  onRefreshLogs
}: TemperatureLogsTabProps) {
  const { t } = useTranslation();
  const { formatDate } = useCountryFormatting();

  // Helper functions
  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  const formatDateString = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return formatDate(date);
  };

  const getTemperatureStatus = (temp: number, type: string) => {
    const threshold = thresholds.find(t => t.temperature_type === type);
    if (!threshold || !threshold.alert_enabled) return 'normal';
    
    if (threshold.min_temp_celsius && temp < threshold.min_temp_celsius) return 'low';
    if (threshold.max_temp_celsius && temp > threshold.max_temp_celsius) return 'high';
    return 'normal';
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

    const periodOrder = ['morning', 'late-morning', 'midday', 'afternoon', 'dinner', 'evening', 'night'];
    return periodOrder
      .filter(period => grouped[period])
      .map(period => grouped[period])
      .map(group => ({
        ...group,
        logs: group.logs.sort((a, b) => a.log_time.localeCompare(b.log_time))
      }));
  };

  return (
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
              
              {equipment.filter(eq => eq.is_active).map((item) => (
                <option key={item.id} value={item.equipment_type}>
                  {getTypeIcon(item.equipment_type)} {item.name}
                </option>
              ))}
              
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
          <form onSubmit={onAddLog} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                
                {equipment.filter(eq => eq.is_active).map((item) => (
                  <option key={item.id} value={item.equipment_type}>
                    {getTypeIcon(item.equipment_type)} {item.name} ({getTypeLabel(item.equipment_type)})
                  </option>
                ))}
                
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
                          <OptimizedImage 
                            src={log.photo_url} 
                            alt="Temperature reading" 
                            width={96}
                            height={96}
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
  );
}
