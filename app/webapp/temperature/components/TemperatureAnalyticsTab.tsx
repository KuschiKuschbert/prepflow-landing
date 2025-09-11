'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { useCountryFormatting } from '@/hooks/useCountryFormatting';
import dynamic from 'next/dynamic';

// Lazy load the synchronized chart component for better performance
const SynchronizedChart = dynamic(() => import('./SynchronizedChart'), {
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

interface TemperatureAnalyticsTabProps {
  allLogs: TemperatureLog[];
  equipment: TemperatureEquipment[];
  logs: TemperatureLog[];
}

const temperatureTypes = [
  { value: 'fridge', label: 'Fridge', icon: '🧊' },
  { value: 'freezer', label: 'Freezer', icon: '❄️' },
  { value: 'food_cooking', label: 'Food Cooking', icon: '🔥' },
  { value: 'food_hot_holding', label: 'Food Hot Holding', icon: '🍲' },
  { value: 'food_cold_holding', label: 'Food Cold Holding', icon: '🥗' },
  { value: 'storage', label: 'Storage', icon: '📦' }
];

export default function TemperatureAnalyticsTab({
  allLogs,
  equipment,
  logs
}: TemperatureAnalyticsTabProps) {
  const { t } = useTranslation();
  const { formatDate } = useCountryFormatting();
  
  const [timeFilter, setTimeFilter] = useState('all');
  const [dateOffset, setDateOffset] = useState(0);

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

  return (
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
                    setDateOffset(0);
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

      {/* Individual Equipment Charts */}
      <div className="space-y-8">
        {equipment.filter(eq => eq.is_active).map((item) => {
          const itemLogs = filterLogsByTimePeriod(
            allLogs.filter(log => {
              return log.location === item.name;
            })
            .sort((a, b) => new Date(`${a.log_date}T${a.log_time}`).getTime() - new Date(`${b.log_date}T${b.log_time}`).getTime()),
            timeFilter,
            dateOffset
          );
          
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
  );
}
