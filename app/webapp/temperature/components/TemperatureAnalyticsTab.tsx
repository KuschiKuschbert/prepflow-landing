'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { TemperatureLog, TemperatureEquipment } from '../types';
import SimpleTemperatureChart from './SimpleTemperatureChart';
import { format } from 'date-fns';

interface TemperatureAnalyticsTabProps {
  allLogs: TemperatureLog[];
  equipment: TemperatureEquipment[];
}

export default function TemperatureAnalyticsTab({ allLogs, equipment }: TemperatureAnalyticsTabProps) {
  const { t } = useTranslation();
  const [timeFilter, setTimeFilter] = useState<'24h' | '7d' | '30d' | 'all'>('24h');
  const [dateOffset, setDateOffset] = useState(0); // 0 for today, 1 for yesterday, etc.

  const getFilteredLogs = (equipmentName: string) => {
    let filtered = allLogs.filter(log => log.location === equipmentName);

    const today = new Date();
    today.setDate(today.getDate() - dateOffset);
    const selectedDateString = format(today, 'yyyy-MM-dd');

    if (timeFilter === '24h') {
      filtered = filtered.filter(log => log.log_date === selectedDateString);
    } else if (timeFilter === '7d') {
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      filtered = filtered.filter(log => new Date(log.log_date) >= sevenDaysAgo);
    } else if (timeFilter === '30d') {
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);
      filtered = filtered.filter(log => new Date(log.log_date) >= thirtyDaysAgo);
    }
    // 'all' filter doesn't need further date filtering

    return filtered;
  };

  const getEquipmentStatus = (equipment: TemperatureEquipment) => {
    const logs = getFilteredLogs(equipment.name);
    if (logs.length === 0) return { status: 'no-data', color: 'text-gray-400' };
    
    const latestLog = logs[logs.length - 1];
    const latestTemp = latestLog.temperature_celsius;
    
    if (equipment.min_temp_celsius === null || equipment.max_temp_celsius === null) {
      return { status: 'no-thresholds', color: 'text-blue-400' };
    }
    
    const inRange = latestTemp >= equipment.min_temp_celsius && latestTemp <= equipment.max_temp_celsius;
    return {
      status: inRange ? 'in-range' : 'out-of-range',
      color: inRange ? 'text-green-400' : 'text-red-400',
      temperature: latestTemp
    };
  };

  return (
    <div className="space-y-6">
      {/* Time Period Filter */}
      <div className="bg-[#1f1f1f] p-4 rounded-2xl shadow-lg border border-[#2a2a2a] flex flex-wrap gap-2">
        {['24h', '7d', '30d', 'all'].map(filter => (
          <button
            key={filter}
            onClick={() => setTimeFilter(filter as '24h' | '7d' | '30d' | 'all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              timeFilter === filter ? 'bg-[#29E7CD] text-black' : 'bg-transparent text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
            }`}
          >
            {t(`timeFilter.${filter}`, filter === '24h' ? 'Last 24h' : filter === '7d' ? 'Last 7 Days' : filter === '30d' ? 'Last 30 Days' : 'All Time')}
          </button>
        ))}
      </div>

      {/* Equipment Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {equipment.map(item => {
          const status = getEquipmentStatus(item);
          return (
            <div key={item.id} className="bg-[#1f1f1f] p-4 rounded-2xl shadow-lg border border-[#2a2a2a]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-white truncate">{item.name}</h3>
                <span className={`text-xs ${status.color}`}>
                  {status.status === 'no-data' ? 'No Data' : 
                   status.status === 'no-thresholds' ? 'No Thresholds' :
                   status.status === 'in-range' ? '✓ In Range' : '⚠ Out of Range'}
                </span>
              </div>
              <div className="text-2xl font-bold text-white">
                {status.temperature ? `${status.temperature.toFixed(1)}°C` : '--'}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {getFilteredLogs(item.name).length} readings
              </div>
            </div>
          );
        })}
      </div>

      {/* Individual Equipment Charts */}
      {equipment.length === 0 ? (
        <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a] w-full h-64 flex items-center justify-center">
          <p className="text-gray-400">No equipment found to display analytics.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {equipment.map(item => (
            <SimpleTemperatureChart
              key={item.id}
              logs={getFilteredLogs(item.name)}
              equipment={item}
              timeFilter={timeFilter}
            />
          ))}
        </div>
      )}

      {/* Summary Statistics */}
      <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]">
        <h3 className="text-xl font-semibold text-white mb-4">📊 Summary Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#29E7CD]">{equipment.length}</div>
            <div className="text-gray-400">Equipment Monitored</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#29E7CD]">{allLogs.length}</div>
            <div className="text-gray-400">Total Readings</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">
              {equipment.filter(item => getEquipmentStatus(item).status === 'in-range').length}
            </div>
            <div className="text-gray-400">In Range</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-400">
              {equipment.filter(item => getEquipmentStatus(item).status === 'out-of-range').length}
            </div>
            <div className="text-gray-400">Out of Range</div>
          </div>
        </div>
      </div>
    </div>
  );
}
