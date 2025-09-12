'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { TemperatureLog, TemperatureEquipment } from '../types';
import CleanTemperatureChart from './CleanTemperatureChart';
import { format } from 'date-fns';
import './temperature-charts.css';

interface TemperatureAnalyticsTabProps {
  allLogs: TemperatureLog[];
  equipment: TemperatureEquipment[];
}

export default function TemperatureAnalyticsTab({ allLogs, equipment }: TemperatureAnalyticsTabProps) {
  const { t } = useTranslation();
  const [timeFilter, setTimeFilter] = useState<'24h' | '7d' | '30d' | 'all'>('24h');
  const [dateOffset, setDateOffset] = useState(0); // 0 for today, 1 for yesterday, etc.
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  const [hasManuallyChangedFilter, setHasManuallyChangedFilter] = useState(false);

  // Handle loading state to prevent FOUC - wait for data to be ready
  useEffect(() => {
    // Show content immediately to prevent FOUC
    if (equipment.length > 0 && allLogs.length > 0) {
      setIsLoaded(true);
        
        // Smart equipment selection logic
        if (!selectedEquipmentId && equipment.length > 0) {
          // 1. First try to find equipment that is out of range
          const outOfRangeEquipment = findOutOfRangeEquipment();
          if (outOfRangeEquipment) {
            setSelectedEquipmentId(outOfRangeEquipment.id);
          } else {
            // 2. Fallback to first equipment
            setSelectedEquipmentId(equipment[0].id);
          }
        }
        
        // Smart time filter selection - find the best filter with data (only if not manually changed)
        if (!hasManuallyChangedFilter) {
          const bestTimeFilter = findBestTimeFilter();
          if (bestTimeFilter !== timeFilter) {
            setTimeFilter(bestTimeFilter);
          }
        }
      }, 100); // Small delay to ensure content is ready
      
      return () => clearTimeout(timer);
    }
  }, [equipment.length, allLogs.length, dateOffset, selectedEquipmentId, hasManuallyChangedFilter]);

  const getFilteredLogs = (equipment: TemperatureEquipment) => {
    // Filter logs by equipment name (location field in logs matches equipment name)
    let filtered = allLogs.filter(log => log.location === equipment.name);

    const today = new Date();
    today.setDate(today.getDate() - dateOffset);
    const selectedDateString = format(today, 'yyyy-MM-dd');

    if (timeFilter === '24h') {
      // For 24h, look at the last 24 hours from now
      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
      
      filtered = filtered.filter(log => {
        const logDateTime = new Date(`${log.log_date}T${log.log_time}`);
        return logDateTime >= twentyFourHoursAgo && logDateTime <= now;
      });
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

  const getSelectedEquipment = () => {
    return equipment.find(eq => eq.id === selectedEquipmentId) || null;
  };

  // Check if there's data for a specific time filter
  const hasDataForTimeFilter = (timeFilter: '24h' | '7d' | '30d' | 'all') => {
    const today = new Date();
    today.setDate(today.getDate() - dateOffset);
    const selectedDateString = format(today, 'yyyy-MM-dd');

    let filteredLogs = allLogs;
    if (timeFilter === '24h') {
      // For 24h, look at the last 24 hours from now
      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
      
      filteredLogs = allLogs.filter(log => {
        const logDateTime = new Date(`${log.log_date}T${log.log_time}`);
        return logDateTime >= twentyFourHoursAgo && logDateTime <= now;
      });
    } else if (timeFilter === '7d') {
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      filteredLogs = allLogs.filter(log => new Date(log.log_date) >= sevenDaysAgo);
    } else if (timeFilter === '30d') {
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);
      filteredLogs = allLogs.filter(log => new Date(log.log_date) >= thirtyDaysAgo);
    }

    return filteredLogs.length > 0;
  };

  // Find the best time filter with data
  const findBestTimeFilter = () => {
    const timeFilters: ('24h' | '7d' | '30d' | 'all')[] = ['24h', '7d', '30d', 'all'];
    for (const filter of timeFilters) {
      if (hasDataForTimeFilter(filter)) {
        return filter;
      }
    }
    return '24h'; // fallback
  };

  // Find equipment that is out of range
  const findOutOfRangeEquipment = () => {
    return equipment.find(item => {
      const status = getEquipmentStatus(item);
      return status.status === 'out-of-range';
    });
  };



  const getEquipmentStatus = (equipment: TemperatureEquipment) => {
    const logs = getFilteredLogs(equipment);
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

  // Show loading skeleton if data isn't ready
  if (!isLoaded) {
    return (
      <div className="space-y-6">
        {/* Time Period Filter Skeleton */}
        <div className="bg-[#1f1f1f] p-4 rounded-2xl shadow-lg border border-[#2a2a2a] flex flex-wrap gap-2">
          {['24h', '7d', '30d', 'all'].map(filter => (
            <div key={filter} className="px-4 py-2 rounded-xl bg-gray-700 animate-pulse w-20 h-8"></div>
          ))}
        </div>

        {/* Equipment Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-[#1f1f1f] p-3 rounded-xl shadow-lg border border-[#2a2a2a] animate-pulse">
              <div className="flex items-center justify-between mb-2">
                <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                <div className="h-2 bg-gray-700 rounded w-1/4"></div>
              </div>
              <div className="h-6 bg-gray-700 rounded mb-2"></div>
              <div className="h-2 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a] animate-pulse">
              <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
              <div className="h-48 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Period Filter */}
      <div className="bg-[#1f1f1f] p-4 rounded-2xl shadow-lg border border-[#2a2a2a] flex flex-wrap gap-2">
        {isLoaded ? (
          ['24h', '7d', '30d', 'all'].map(filter => (
            <button
              key={filter}
              onClick={() => {
                setTimeFilter(filter as '24h' | '7d' | '30d' | 'all');
                setHasManuallyChangedFilter(true);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                timeFilter === filter ? 'bg-[#29E7CD] text-black' : 'bg-transparent text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
              }`}
            >
              {t(`timeFilter.${filter}`, filter === '24h' ? 'Last 24h' : filter === '7d' ? 'Last 7 Days' : filter === '30d' ? 'Last 30 Days' : 'All Time')}
            </button>
          ))
        ) : (
          // Loading skeleton for time filter buttons
          [...Array(4)].map((_, i) => (
            <div key={i} className="h-8 bg-[#2a2a2a] rounded-xl w-20 animate-pulse"></div>
          ))
        )}
      </div>

      {/* Equipment Status Overview - Smart Responsive Grid */}
      <div className={`grid gap-3 ${
        equipment.length <= 2 ? 'grid-cols-1 sm:grid-cols-2' :
        equipment.length <= 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' :
        equipment.length <= 6 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6' :
        equipment.length <= 12 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6' :
        'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
      }`}>
        {isLoaded ? equipment.map(item => {
          const status = getEquipmentStatus(item);
          const logs = getFilteredLogs(item);
          const isOutOfRange = status.status === 'out-of-range';
          const needsSetup = status.status === 'no-thresholds';
          const isSelected = selectedEquipmentId === item.id;
          const isCompact = equipment.length > 6;

          return (
            <button
              key={item.id}
              onClick={() => setSelectedEquipmentId(item.id)}
              className={`group bg-[#1f1f1f] rounded-xl shadow-lg border transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 text-left w-full ${
                isCompact ? 'p-3' : 'p-4'
              } ${
                isSelected
                  ? 'border-[#29E7CD] ring-2 ring-[#29E7CD]/20 bg-[#29E7CD]/5'
                  : isOutOfRange 
                  ? 'border-red-500/50 hover:border-red-500' 
                  : needsSetup 
                  ? 'border-yellow-500/50 hover:border-yellow-500'
                  : 'border-[#2a2a2a] hover:border-[#29E7CD]/50'
              }`}
            >
              {/* Header with status indicator */}
              <div className={`flex items-center justify-between ${isCompact ? 'mb-2' : 'mb-3'}`}>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold text-white truncate group-hover:text-[#29E7CD] transition-colors ${
                    isCompact ? 'text-xs' : 'text-sm'
                  }`}>
                    {item.name}
                  </h3>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <div className={`rounded-full ${
                      isCompact ? 'w-1 h-1' : 'w-1.5 h-1.5'
                    } ${
                      isOutOfRange ? 'bg-red-500 animate-pulse' : 
                      needsSetup ? 'bg-yellow-500' : 
                      'bg-green-500'
                    }`}></div>
                    <span className={`font-medium ${
                      isCompact ? 'text-xs' : 'text-xs'
                    } ${
                      isOutOfRange ? 'text-red-400' : 
                      needsSetup ? 'text-yellow-400' : 
                      'text-green-400'
                    }`}>
                      {status.status === 'no-data' ? 'No Data' : 
                       status.status === 'no-thresholds' ? 'Setup Required' :
                       status.status === 'in-range' ? 'In Range' : 'Out of Range'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Temperature display */}
              <div className={isCompact ? 'mb-2' : 'mb-3'}>
                <div className={`font-bold text-white ${isCompact ? 'text-lg mb-1' : 'text-2xl mb-1'}`}>
                  {status.temperature ? `${status.temperature.toFixed(1)}°C` : '--'}
                </div>
                <div className="text-xs text-gray-400">
                  {logs.length} readings {isCompact ? '' : `• ${timeFilter.toUpperCase()}`}
                </div>
              </div>

              {/* Action indicators - only show in non-compact mode or if critical */}
              {!isCompact && (isOutOfRange || needsSetup) && (
                <div className="pt-3 border-t border-[#2a2a2a]">
                  {isOutOfRange && (
                    <div className="flex items-center space-x-1.5 text-red-400 text-xs">
                      <span>⚠️</span>
                      <span>Attention required</span>
                    </div>
                  )}
                  {needsSetup && (
                    <div className="flex items-center space-x-1.5 text-yellow-400 text-xs">
                      <span>⚙️</span>
                      <span>Configure thresholds</span>
                    </div>
                  )}
                </div>
              )}

              {/* Compact mode critical indicators */}
              {isCompact && isOutOfRange && (
                <div className="flex items-center justify-center text-red-400 text-xs">
                  <span>⚠️</span>
                </div>
              )}
            </button>
          );
        }) : (
          // Loading skeleton for equipment cards
          [...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#1f1f1f] p-3 rounded-xl shadow-lg border border-[#2a2a2a] animate-pulse">
              <div className="h-3 bg-[#2a2a2a] rounded w-3/4 mb-2"></div>
              <div className="h-2 bg-[#2a2a2a] rounded w-1/2 mb-2"></div>
              <div className="h-6 bg-[#2a2a2a] rounded w-1/3 mb-1"></div>
              <div className="h-2 bg-[#2a2a2a] rounded w-1/2"></div>
            </div>
          ))
        )}
      </div>

      {/* Selected Equipment Chart */}
      {!isLoaded ? (
        // Loading skeleton for chart
        <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a] animate-pulse">
          <div className="h-48 bg-[#2a2a2a] rounded"></div>
        </div>
      ) : equipment.length === 0 ? (
        <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a] w-full h-64 flex items-center justify-center">
          <p className="text-gray-400">No equipment found to display analytics.</p>
        </div>
      ) : selectedEquipmentId ? (
        <div className="chart-container">
          {(() => {
            const selectedEquipment = getSelectedEquipment();
            if (!selectedEquipment) return null;
            
            return (
              <CleanTemperatureChart
                key={selectedEquipment.id}
                logs={getFilteredLogs(selectedEquipment)}
                equipment={selectedEquipment}
                timeFilter={timeFilter}
              />
            );
          })()}
        </div>
      ) : (
        <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a] w-full h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">📊</div>
            <p className="text-gray-400 mb-2">Select an equipment to view its temperature chart</p>
            <p className="text-sm text-gray-500">Click on any equipment card above to see detailed analytics</p>
          </div>
        </div>
      )}

    </div>
  );
}
