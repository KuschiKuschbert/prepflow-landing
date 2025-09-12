'use client';

import { useState, useRef, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TemperatureLog, TemperatureEquipment } from '../types';
import { format } from 'date-fns';
import './temperature-charts.css';

interface CleanTemperatureChartProps {
  logs: TemperatureLog[];
  equipment: TemperatureEquipment;
  timeFilter: '24h' | '7d' | '30d' | 'all';
}

export default function CleanTemperatureChart({ logs, equipment, timeFilter }: CleanTemperatureChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Filter logs based on time range and equipment
  const getFilteredLogs = () => {
    // First filter by equipment name (matching log.location with equipment.name)
    let equipmentFilteredLogs = logs;
    if (equipment && equipment.name) {
      equipmentFilteredLogs = logs.filter(log => log.location === equipment.name);
    }
    
    // If we have logs but they're all from the same date (historical data),
    // don't apply time filtering - just return all equipment-filtered logs
    const uniqueDates = [...new Set(equipmentFilteredLogs.map(log => log.log_date))];
    if (uniqueDates.length === 1 && equipmentFilteredLogs.length > 0) {
      return equipmentFilteredLogs;
    }
    
    // For historical data that doesn't extend to current date, be more flexible with time filtering
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (timeFilter) {
      case '24h':
        // For 24h, if we have historical data, show the most recent 24 hours of available data
        if (equipmentFilteredLogs.length > 0) {
          const mostRecentLog = equipmentFilteredLogs.reduce((latest, log) => {
            const logDate = new Date(`${log.log_date} ${log.log_time}`);
            const latestDate = new Date(`${latest.log_date} ${latest.log_time}`);
            return logDate > latestDate ? log : latest;
          });
          const mostRecentDate = new Date(`${mostRecentLog.log_date} ${mostRecentLog.log_time}`);
          cutoffDate.setTime(mostRecentDate.getTime() - (24 * 60 * 60 * 1000));
        } else {
          cutoffDate.setHours(now.getHours() - 24);
        }
        break;
      case '7d':
        // For 7d, if we have historical data, show the most recent 7 days of available data
        if (equipmentFilteredLogs.length > 0) {
          const mostRecentLog = equipmentFilteredLogs.reduce((latest, log) => {
            const logDate = new Date(`${log.log_date} ${log.log_time}`);
            const latestDate = new Date(`${latest.log_date} ${latest.log_time}`);
            return logDate > latestDate ? log : latest;
          });
          const mostRecentDate = new Date(`${mostRecentLog.log_date} ${mostRecentLog.log_time}`);
          cutoffDate.setTime(mostRecentDate.getTime() - (7 * 24 * 60 * 60 * 1000));
        } else {
          cutoffDate.setDate(now.getDate() - 7);
        }
        break;
      case '30d':
        // For 30d, if we have historical data, show the most recent 30 days of available data
        if (equipmentFilteredLogs.length > 0) {
          const mostRecentLog = equipmentFilteredLogs.reduce((latest, log) => {
            const logDate = new Date(`${log.log_date} ${log.log_time}`);
            const latestDate = new Date(`${latest.log_date} ${latest.log_time}`);
            return logDate > latestDate ? log : latest;
          });
          const mostRecentDate = new Date(`${mostRecentLog.log_date} ${mostRecentLog.log_time}`);
          cutoffDate.setTime(mostRecentDate.getTime() - (30 * 24 * 60 * 60 * 1000));
        } else {
          cutoffDate.setDate(now.getDate() - 30);
        }
        break;
      case 'all':
      default:
        return equipmentFilteredLogs;
    }
    
    return equipmentFilteredLogs.filter(log => {
      const logDate = new Date(`${log.log_date} ${log.log_time}`);
      return logDate >= cutoffDate;
    });
  };

  const filteredLogs = getFilteredLogs();
  
  
  const chartData = filteredLogs
    .map(log => ({
      timestamp: `${log.log_date} ${log.log_time}`,
      temperature: log.temperature_celsius,
      date: log.log_date,
      time: log.log_time,
    }))
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Handle loading state to prevent FOUC and stray chart elements
  useEffect(() => {
    // Only show chart when we have actual data and equipment info
    if (filteredLogs.length > 0 && equipment && equipment.name) {
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 200); // Small delay to ensure content is ready
      
      return () => clearTimeout(timer);
    } else {
      setIsLoaded(false);
    }
  }, [filteredLogs.length, equipment?.name, timeFilter]);

  const isTemperatureInRange = (temp: number) => {
    if (equipment.min_temp_celsius === null || equipment.max_temp_celsius === null) {
      return true;
    }
    return temp >= equipment.min_temp_celsius && temp <= equipment.max_temp_celsius;
  };

  // Adaptive features based on data density and time range
  const getAdaptiveSettings = () => {
    const dataLength = chartData.length;
    const timeRange = timeFilter;
    
    // Adaptive data sampling for performance
    const shouldSample = dataLength > 1000;
    const sampleRate = dataLength > 5000 ? 5 : dataLength > 2000 ? 3 : 1;
    
    // Adaptive chart height based on data density
    const chartHeight = dataLength > 500 ? 200 : dataLength > 100 ? 250 : 300;
    
    // Adaptive dot size based on data density
    const dotSize = dataLength > 1000 ? 2 : dataLength > 500 ? 3 : 4;
    const showDots = dataLength < 200;
    
    // Adaptive line width
    const lineWidth = dataLength > 1000 ? 1 : dataLength > 500 ? 2 : 3;
    
    // Smart X-axis interval based on data density and time range
    const getXAxisInterval = () => {
      if (dataLength < 20) return 0; // Show all labels for small datasets
      if (dataLength < 50) return 1; // Show every other label
      if (dataLength < 100) return 2; // Show every 3rd label
      if (dataLength < 200) return 3; // Show every 4th label
      if (dataLength < 500) return 4; // Show every 5th label
      if (dataLength < 1000) return 5; // Show every 6th label
      return 6; // Show every 7th label for very dense data
    };
    
    return {
      shouldSample,
      sampleRate,
      chartHeight,
      dotSize,
      showDots,
      lineWidth,
      xAxisInterval: getXAxisInterval()
    };
  };

  const adaptiveSettings = getAdaptiveSettings();
  
  // Sample data if needed for performance
  const getOptimizedData = () => {
    if (!adaptiveSettings.shouldSample) {
      return chartData;
    }
    
    const sampled = [];
    for (let i = 0; i < chartData.length; i += adaptiveSettings.sampleRate) {
      sampled.push(chartData[i]);
    }
    
    // Always include the last point
    if (chartData.length > 0 && sampled[sampled.length - 1] !== chartData[chartData.length - 1]) {
      sampled.push(chartData[chartData.length - 1]);
    }
    
    return sampled;
  };

  const optimizedData = getOptimizedData();
  
  // Add out-of-range highlighting to chart data
  const enhancedData = optimizedData.map((point, index) => ({
    ...point,
    isOutOfRange: !isTemperatureInRange(point.temperature),
    isRecentOutOfRange: !isTemperatureInRange(point.temperature) && index >= optimizedData.length - 5 // Last 5 points
  }));
  
  const latestLog = filteredLogs.length > 0 ? filteredLogs[filteredLogs.length - 1] : null;
  const latestTemperature = latestLog?.temperature_celsius;
  const latestStatus = latestTemperature !== null && latestTemperature !== undefined
    ? isTemperatureInRange(latestTemperature) ? 'In Range' : 'Out of Range'
    : 'N/A';
  const statusColor = latestStatus === 'In Range' ? 'text-green-400' : 'text-red-400';
  
  // Check for recent out-of-range temperatures
  const hasRecentOutOfRange = enhancedData.some(point => point.isRecentOutOfRange);
  
  // Daily compliance tracking
  const getDailyCompliance = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayLogs = filteredLogs.filter(log => log.log_date === today);
    
    return {
      hasMinimumLogs: todayLogs.length >= 2,
      logCount: todayLogs.length,
      hasFoodTemp: todayLogs.some(log => log.temperature_type === 'food' || log.temperature_type === 'Food'),
      lastLogTime: todayLogs.length > 0 ? todayLogs[todayLogs.length - 1].log_time : null
    };
  };
  
  const dailyCompliance = getDailyCompliance();
  
  // Smart alerts for unusual patterns (only non-redundant alerts)
  const getSmartAlerts = () => {
    const alerts = [];
    
    // Only show alerts that aren't already covered by daily compliance status
    // Alert: No recent logs (if no logs in last 4 hours)
    const now = new Date();
    const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000);
    const recentLogs = filteredLogs.filter(log => {
      const logTime = new Date(`${log.log_date} ${log.log_time}`);
      return logTime >= fourHoursAgo;
    });
    
    if (recentLogs.length === 0 && filteredLogs.length > 0) {
      alerts.push({
        type: 'warning',
        message: 'No logs in last 4 hours',
        icon: '⏰'
      });
    }
    
    return alerts;
  };
  
  const smartAlerts = getSmartAlerts();



  const formatXAxisLabel = (tickItem: string) => {
    const date = new Date(tickItem);
    
    // Use consistent formatting to prevent hydration mismatches
    switch (timeFilter) {
      case '24h':
        return date.getHours().toString().padStart(2, '0') + ':' + 
               date.getMinutes().toString().padStart(2, '0');
      case '7d':
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return weekdays[date.getDay()] + ' ' + date.getDate();
      case '30d':
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return date.getDate() + ' ' + months[date.getMonth()];
      case 'all':
      default:
        const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return date.getDate() + ' ' + shortMonths[date.getMonth()];
    }
  };

  const formatTooltipLabel = (label: string) => {
    const date = new Date(label);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}, ${hours}:${minutes}`;
  };

  const formatTooltipValue = (value: number) => {
    return `${value?.toFixed(1)}°C`;
  };

  // Clean up event listeners
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      // Handle mouse up events if needed
    };
    const handleGlobalTouchEnd = () => {
      // Handle touch end events if needed
    };
    
    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('touchend', handleGlobalTouchEnd);
    
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, []);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">{equipment.name}</h3>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${statusColor.replace('text-', 'bg-')}`}></div>
            <span className={`text-sm ${statusColor}`}>{latestStatus}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-white mb-2">No Temperature Data</h4>
          <p className="text-gray-400 text-sm max-w-sm">
            No temperature logs found for this equipment.
          </p>
        </div>
      </div>
    );
  }


  // Don't render chart if not loaded, no data, or invalid equipment
  if (!isLoaded || chartData.length === 0 || !equipment || !equipment.name) {
    return (
      <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]">
        <div className="animate-pulse">
          <div className="h-6 bg-[#2a2a2a] rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-[#2a2a2a] rounded w-1/4 mb-4"></div>
          <div className="h-48 bg-[#2a2a2a] rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a] temperature-chart-container`}
      ref={chartRef}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-white chart-title">{equipment.name}</h3>
          {hasRecentOutOfRange && (
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${statusColor.replace('text-', 'bg-')}`}></div>
          <span className={`text-sm ${statusColor}`}>{latestStatus}</span>
        </div>
      </div>
      
      <div className="text-2xl font-bold text-white mb-2">
        {latestTemperature ? `${latestTemperature.toFixed(1)}°C` : '--'}
      </div>
      
      <div className="text-xs text-gray-400 mb-4">
        <div className="flex items-center justify-between">
          <span>
            {optimizedData.length} of {chartData.length} readings
            {adaptiveSettings.shouldSample && (
              <span className="ml-2 text-yellow-400">
                (sampled for performance)
              </span>
            )}
          </span>
          <span className="text-[#29E7CD]">
            {timeFilter.toUpperCase()} view
          </span>
        </div>
        
        {/* Daily Compliance Status */}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-1 ${
              dailyCompliance.hasMinimumLogs ? 'text-green-400' : 'text-red-400'
            }`}>
              <span>{dailyCompliance.hasMinimumLogs ? '✅' : '❌'}</span>
              <span>{dailyCompliance.logCount}/2+ logs today</span>
            </div>
            <div className={`flex items-center space-x-1 ${
              dailyCompliance.hasFoodTemp ? 'text-green-400' : 'text-yellow-400'
            }`}>
              <span>{dailyCompliance.hasFoodTemp ? '✅' : '📋'}</span>
              <span>{dailyCompliance.hasFoodTemp ? 'Food temped' : 'No food temp'}</span>
            </div>
          </div>
          {dailyCompliance.lastLogTime && (
            <span className="text-gray-500">
              Last: {dailyCompliance.lastLogTime}
            </span>
          )}
        </div>
        
        {/* Smart Alerts */}
        {smartAlerts.length > 0 && (
          <div className="mt-2 space-y-1">
            {smartAlerts.map((alert, index) => (
              <div
                key={index}
                className={`flex items-center space-x-2 px-2 py-1 rounded text-xs ${
                  alert.type === 'critical' 
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                    : alert.type === 'warning'
                    ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                }`}
              >
                <span>{alert.icon}</span>
                <span>{alert.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-full" style={{ height: `${adaptiveSettings.chartHeight}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={enhancedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatXAxisLabel}
              stroke="#6b7280"
              fontSize={chartData.length > 1000 ? 10 : 12}
              tick={{ fill: '#9ca3af' }}
              axisLine={{ stroke: '#374151' }}
              interval={adaptiveSettings.xAxisInterval}
            />
            
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              tick={{ fill: '#9ca3af' }}
              axisLine={{ stroke: '#374151' }}
              label={{ value: '°C', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9ca3af' } }}
            />
            
            <Tooltip
              labelFormatter={formatTooltipLabel}
              formatter={(value: number) => [formatTooltipValue(value), 'Temperature']}
              contentStyle={{
                backgroundColor: '#1f1f1f',
                border: '1px solid #2a2a2a',
                borderRadius: '8px',
                color: '#ffffff'
              }}
            />
            
            {/* Temperature threshold lines */}
            {equipment.min_temp_celsius !== null && (
              <ReferenceLine
                y={equipment.min_temp_celsius}
                stroke="#ef4444"
                strokeDasharray="5 5"
                label={{ value: `Min: ${equipment.min_temp_celsius}°C`, position: "top", style: { fill: '#ef4444' } }}
              />
            )}
            
            {equipment.max_temp_celsius !== null && (
              <ReferenceLine
                y={equipment.max_temp_celsius}
                stroke="#ef4444"
                strokeDasharray="5 5"
                label={{ value: `Max: ${equipment.max_temp_celsius}°C`, position: "top", style: { fill: '#ef4444' } }}
              />
            )}
            
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#29E7CD"
              strokeWidth={adaptiveSettings.lineWidth}
              dot={adaptiveSettings.showDots ? { 
                fill: '#29E7CD', 
                strokeWidth: 1, 
                r: adaptiveSettings.dotSize 
              } : false}
              activeDot={{ 
                r: adaptiveSettings.dotSize + 2, 
                stroke: '#29E7CD', 
                strokeWidth: 2, 
                fill: '#ffffff' 
              }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
