'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TemperatureLog, TemperatureEquipment } from '../types';
import { format } from 'date-fns';
import { useState, useCallback, useEffect, useRef } from 'react';

interface SimpleTemperatureChartProps {
  logs: TemperatureLog[];
  equipment: TemperatureEquipment;
  timeFilter: '24h' | '7d' | '30d' | 'all';
}

export default function SimpleTemperatureChart({ logs, equipment, timeFilter }: SimpleTemperatureChartProps) {
  const [scrollOffset, setScrollOffset] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState(0);
  const chartRef = useRef<HTMLDivElement>(null);
  
  const chartData = logs
    .map(log => ({
      timestamp: `${log.log_date} ${log.log_time}`,
      temperature: log.temperature_celsius,
      date: log.log_date,
      time: log.log_time,
    }))
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const isTemperatureInRange = (temp: number) => {
    if (equipment.min_temp_celsius === null || equipment.max_temp_celsius === null) {
      return true; // No thresholds defined
    }
    return temp >= equipment.min_temp_celsius && temp <= equipment.max_temp_celsius;
  };

  const latestLog = logs.length > 0 ? logs[logs.length - 1] : null;
  const latestTemperature = latestLog?.temperature_celsius;
  const latestStatus = latestTemperature !== null && latestTemperature !== undefined
    ? isTemperatureInRange(latestTemperature) ? 'In Range' : 'Out of Range'
    : 'N/A';
  const statusColor = latestStatus === 'In Range' ? 'text-green-400' : 'text-red-400';

  const getUniqueDates = () => {
    const dates = [...new Set(chartData.map(d => d.timestamp.split(' ')[0]))].sort();
    return dates;
  };

  const getDateMarkers = () => {
    const uniqueDates = getUniqueDates();
    const markers: Array<{date: string, timestamp: string, index: number}> = [];
    
    uniqueDates.forEach(date => {
      // Find the first entry of each date
      const firstEntryOfDate = chartData.find(d => d.timestamp.startsWith(date));
      if (firstEntryOfDate) {
        markers.push({
          date: date,
          timestamp: firstEntryOfDate.timestamp,
          index: chartData.indexOf(firstEntryOfDate)
        });
      }
    });
    
    return markers;
  };

  const get24HourMarkers = () => {
    if (timeFilter !== '24h' || chartData.length === 0) return [];
    
    const markers: Array<{hour: number, timestamp: number, label: string, time: Date}> = [];
    const firstEntry = chartData[0];
    const startDate = new Date(firstEntry.timestamp);
    
    // Create 6-hour intervals: 00:00, 06:00, 12:00, 18:00
    for (let hour = 0; hour < 24; hour += 6) {
      const markerTime = new Date(startDate);
      markerTime.setHours(hour, 0, 0, 0);
      
      // Find the closest data point to this time
      const closestEntry = chartData.reduce((closest, current) => {
        const currentTime = new Date(current.timestamp);
        const closestTime = new Date(closest.timestamp);
        const markerTimeDiff = Math.abs(currentTime.getTime() - markerTime.getTime());
        const closestTimeDiff = Math.abs(closestTime.getTime() - markerTime.getTime());
        
        return markerTimeDiff < closestTimeDiff ? current : closest;
      });
      
      markers.push({
        time: markerTime,
        timestamp: new Date(closestEntry.timestamp).getTime(),
        hour: hour,
        label: `${hour.toString().padStart(2, '0')}:00`
      });
    }
    
    return markers;
  };

  const getYAxisTicks = () => {
    if (chartData.length === 0) return [];
    
    const temps = chartData.map(d => d.temperature);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    const range = maxTemp - minTemp;
    const step = Math.max(0.5, range / 8); // 8 ticks max, minimum 0.5°C steps

    const ticks = [];
    for (let i = Math.floor(minTemp / step) * step; i <= Math.ceil(maxTemp / step) * step; i += step) {
      ticks.push(Math.round(i * 10) / 10); // Round to 1 decimal
    }
    return ticks;
  };

  // Create evenly spaced data based on days, ensuring we always have enough points
  const createEvenlySpacedData = () => {
    if (chartData.length === 0) return [];

    // Get date range from the filtered data
    const dates = [...new Set(chartData.map(log => log.date))].sort();
    const startDate = new Date(dates[0]);
    const endDate = new Date(dates[dates.length - 1]);
    
    // For time filters, we need to ensure we have enough days to show 10 points
    let actualStartDate = startDate;
    let actualEndDate = endDate;
    
    // If we have less than 10 days of data, extend the range to show 10 days
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    if (daysDiff < 10) {
      // Extend the range to show 10 days, centered around the available data
      const daysToAdd = 10 - daysDiff;
      const daysBefore = Math.floor(daysToAdd / 2);
      const daysAfter = Math.ceil(daysToAdd / 2);
      
      actualStartDate = new Date(startDate);
      actualStartDate.setDate(actualStartDate.getDate() - daysBefore);
      
      actualEndDate = new Date(endDate);
      actualEndDate.setDate(actualEndDate.getDate() + daysAfter);
    }
    
    // Create evenly spaced points (one per day)
    const evenlySpacedData = [];
    const currentDate = new Date(actualStartDate);
    
    while (currentDate <= actualEndDate) {
      const dateString = currentDate.toISOString().split('T')[0];
      const dayLogs = chartData.filter(log => log.date === dateString);
      
      if (dayLogs.length > 0) {
        // Use the latest log of the day
        const latestLog = dayLogs[dayLogs.length - 1];
        evenlySpacedData.push({
          ...latestLog,
          timestamp: currentDate.getTime(),
          hasData: true,
          logCount: dayLogs.length
        });
      } else {
        // Mark missing data for compliance
        evenlySpacedData.push({
          id: `missing-${dateString}`,
          log_date: dateString,
          log_time: '00:00',
          temperature_type: 'missing',
          temperature_celsius: null,
          location: equipment.name,
          notes: 'No logs recorded',
          photo_url: null,
          logged_by: null,
          created_at: currentDate.toISOString(),
          updated_at: currentDate.toISOString(),
          timestamp: currentDate.getTime(),
          hasData: false,
          logCount: 0
        });
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return evenlySpacedData;
  };

  const evenlySpacedData = createEvenlySpacedData();

  // Calculate chart configuration - always show exactly 10 points
  const getChartConfig = () => {
    const dataPoints = evenlySpacedData.length;
    const maxVisiblePoints = 10;
    const pointWidth = 60; // Wider spacing for better visibility
    
    // Always ensure we have at least 10 points to show
    if (dataPoints < 10) {
      // If we have less than 10 points, show all of them without scrolling
      return {
        width: '100%',
        showScrollButtons: false,
        enablePanning: false,
        visibleData: evenlySpacedData,
        startIndex: 0,
        endIndex: dataPoints
      };
    } else if (dataPoints === 10) {
      // Exactly 10 points, show all without scrolling
      return {
        width: '100%',
        showScrollButtons: false,
        enablePanning: false,
        visibleData: evenlySpacedData,
        startIndex: 0,
        endIndex: 10
      };
    } else {
      // More than 10 points, show 10 at a time with scrolling
      const startIndex = Math.floor(scrollOffset / pointWidth);
      const endIndex = Math.min(startIndex + maxVisiblePoints, dataPoints);
      const visibleData = evenlySpacedData.slice(startIndex, endIndex);

      return {
        width: '100%', // Fixed width for 10 points
        showScrollButtons: true,
        enablePanning: true,
        visibleData: visibleData, // Only show 10 points
        startIndex: startIndex,
        endIndex: endIndex
      };
    }
  };

  const chartConfig = getChartConfig();

  // Pan handlers for horizontal scrolling with snapping
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (!chartConfig.enablePanning) return;
    setIsPanning(true);
    setPanStart(event.clientX);
  }, [chartConfig.enablePanning]);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!isPanning || !chartConfig.enablePanning) return;

    const deltaX = event.clientX - panStart;
    const pointWidth = 60;
    const newOffset = scrollOffset + deltaX;
    const maxOffset = Math.max(0, (evenlySpacedData.length - 10) * pointWidth);
    setScrollOffset(Math.max(0, Math.min(maxOffset, newOffset)));
  }, [isPanning, panStart, scrollOffset, chartConfig.enablePanning, evenlySpacedData.length]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Scroll handlers with snapping to data points
  const handleScrollLeft = useCallback(() => {
    if (!chartConfig.enablePanning) return;
    const pointWidth = 60;
    setScrollOffset(prev => Math.max(0, prev - pointWidth)); // Move by one data point
  }, [chartConfig.enablePanning]);

  const handleScrollRight = useCallback(() => {
    if (!chartConfig.enablePanning) return;
    const pointWidth = 60;
    const maxOffset = Math.max(0, (evenlySpacedData.length - 10) * pointWidth);
    setScrollOffset(prev => Math.min(maxOffset, prev + pointWidth)); // Move by one data point
  }, [chartConfig.enablePanning, evenlySpacedData.length]);

  // Add snapping to data points on mouse up
  const handleMouseUpWithSnap = useCallback(() => {
    setIsPanning(false);
    if (chartConfig.enablePanning) {
      const pointWidth = 60;
      const snappedOffset = Math.round(scrollOffset / pointWidth) * pointWidth;
      setScrollOffset(Math.max(0, Math.min(snappedOffset, (evenlySpacedData.length - 10) * pointWidth)));
    }
  }, [scrollOffset, chartConfig.enablePanning, evenlySpacedData.length]);

  // Reset scroll when data changes
  useEffect(() => {
    setScrollOffset(0);
  }, [logs]);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="bg-[#1f1f1f] p-8 rounded-3xl shadow-lg border border-[#2a2a2a] w-full h-80 flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-[#2a2a2a] rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No Temperature Data</h3>
        <p className="text-gray-400 text-center max-w-sm">
          No temperature logs found for <span className="font-medium text-gray-300">{equipment.name}</span>. 
          Start logging temperatures to see your data here.
        </p>
        <div className="mt-4 px-4 py-2 bg-[#2a2a2a] rounded-lg text-sm text-gray-500">
          💡 Tip: Use the "Quick Log" button to add temperature readings
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a] w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          {equipment.equipment_type === 'refrigerator' ? '🧊' : '❄️'} <span>{equipment.name}</span>
        </h3>
        <div className="flex items-center space-x-4">
                  {chartConfig.showScrollButtons && (
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={handleScrollLeft}
                        disabled={scrollOffset <= 0}
                        className="group flex items-center space-x-1 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 bg-[#2a2a2a] text-gray-400 hover:text-white hover:bg-[#3a3a3a] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#2a2a2a]"
                        title="Previous 10 days"
                      >
                        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Previous</span>
                      </button>
                      
                      <div className="flex items-center space-x-2 px-3 py-2 bg-[#1f1f1f] rounded-xl border border-[#2a2a2a]">
                        <div className="w-2 h-2 bg-[#29E7CD] rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-300">
                          {chartConfig.startIndex + 1}-{chartConfig.endIndex} of {evenlySpacedData.length}
                        </span>
                      </div>
                      
                      <button
                        onClick={handleScrollRight}
                        disabled={scrollOffset >= Math.max(0, (evenlySpacedData.length - 10) * 60)}
                        className="group flex items-center space-x-1 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 bg-[#2a2a2a] text-gray-400 hover:text-white hover:bg-[#3a3a3a] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#2a2a2a]"
                        title="Next 10 days"
                      >
                        <span>Next</span>
                        <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
          <div className="text-sm text-gray-400">
            Latest: <span className={`${statusColor} font-medium`}>{latestTemperature?.toFixed(1)}°C ({latestStatus})</span>
          </div>
        </div>
      </div>
      <div className="h-64 w-full overflow-hidden relative">
        <div 
          ref={chartRef}
          className="h-full w-full overflow-hidden relative group"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpWithSnap}
          onMouseLeave={handleMouseUpWithSnap}
          style={{ cursor: chartConfig.enablePanning ? (isPanning ? 'grabbing' : 'grab') : 'default' }}
        >
          {/* Interactive Hint Overlay */}
          {chartConfig.enablePanning && !isPanning && (
            <div className="absolute top-2 right-2 bg-[#1f1f1f]/90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                <span>Drag to scroll</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          )}
          <div className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={chartConfig.visibleData}
                margin={{ top: 10, right: 30, left: 20, bottom: 60 }}
              >
            <CartesianGrid 
              strokeDasharray="2 2" 
              stroke="#2a2a2a" 
              strokeOpacity={0.6}
              horizontal={true}
              vertical={true}
            />
            <XAxis
              dataKey="timestamp"
              stroke="#9ca3af"
              tickFormatter={(tick) => {
                const date = new Date(tick);
                
                if (timeFilter === '24h') {
                  // For 24h, only show 6-hour markers
                  const hour24Markers = get24HourMarkers();
                  const isHour24Marker = hour24Markers.some(marker => marker.timestamp === tick);
                  
                  if (isHour24Marker) {
                    return format(date, 'HH:mm');
                  } else {
                    return ''; // Don't show labels for non-6-hour-marker points
                  }
                } else {
                  // For multi-day views, only show date markers
                  const dateMarkers = getDateMarkers();
                  const isDateMarker = dateMarkers.some(marker => marker.timestamp === tick);
                  
                  if (isDateMarker) {
                    return format(date, 'MMM dd');
                  } else {
                    return ''; // Don't show labels for non-date-marker points
                  }
                }
              }}
              interval={undefined} // Use custom ticks for all views
              angle={-45}
              textAnchor="end"
              height={60}
              tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 'bold' }}
              axisLine={{ stroke: '#2a2a2a' }}
              tickLine={{ stroke: '#2a2a2a' }}
              ticks={timeFilter === '24h' ? get24HourMarkers().map(m => m.timestamp) : getDateMarkers().map(m => m.timestamp)}
            />
            <YAxis 
              stroke="#9ca3af"
              domain={['dataMin - 1', 'dataMax + 1']}
              ticks={getYAxisTicks()}
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              axisLine={{ stroke: '#2a2a2a' }}
              tickLine={{ stroke: '#2a2a2a' }}
              tickFormatter={(value) => `${value}°C`}
            />
            <Tooltip
              formatter={(value: number) => [`${value.toFixed(1)}°C`, 'Temperature']}
              labelFormatter={(label: string) => {
                const date = new Date(label);
                return `${format(date, 'EEEE, MMM dd, yyyy')} at ${format(date, 'HH:mm')}`;
              }}
              contentStyle={{ 
                backgroundColor: '#1f1f1f', 
                border: '1px solid #2a2a2a', 
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
              }}
              itemStyle={{ color: '#29E7CD', fontWeight: 'bold' }}
              labelStyle={{ color: '#e5e7eb', fontWeight: '600' }}
              separator=": "
            />
            {/* 24h separators - vertical lines at 6-hour markers */}
            {timeFilter === '24h' && get24HourMarkers().map((marker, index) => {
              if (index === 0) return null; // Skip first marker
              
              return (
                <ReferenceLine 
                  key={`hour-${equipment.id}-${marker.hour}-${marker.timestamp}`}
                  x={marker.timestamp}
                  stroke="#2a2a2a"
                  strokeWidth={1}
                  strokeOpacity={0.7}
                  strokeDasharray="2 2"
                />
              );
            })}
            
            {/* Date separators - vertical lines at date markers */}
            {timeFilter !== '24h' && getDateMarkers().map((marker, index) => {
              if (index === 0) return null; // Skip first date marker
              
              return (
                <ReferenceLine 
                  key={`date-${equipment.id}-${marker.date}-${marker.timestamp}`}
                  x={marker.timestamp}
                  stroke="#2a2a2a"
                  strokeWidth={2}
                  strokeOpacity={0.9}
                  strokeDasharray="4 4"
                />
              );
            })}
            
            {/* Temperature threshold lines */}
            {equipment.min_temp_celsius !== null && (
              <ReferenceLine 
                key={`min-threshold-${equipment.id}-${equipment.min_temp_celsius}`}
                y={equipment.min_temp_celsius} 
                stroke="#3B82F6" 
                strokeWidth={2} 
                strokeDasharray="4 4" 
                label={{ 
                  value: `Min: ${equipment.min_temp_celsius}°C`, 
                  position: "insideBottomLeft", 
                  style: { fill: '#3B82F6', fontSize: 11, fontWeight: 'bold' } 
                }} 
              />
            )}
            {equipment.max_temp_celsius !== null && (
              <ReferenceLine 
                key={`max-threshold-${equipment.id}-${equipment.max_temp_celsius}`}
                y={equipment.max_temp_celsius} 
                stroke="#EF4444" 
                strokeWidth={2} 
                strokeDasharray="4 4" 
                label={{ 
                  value: `Max: ${equipment.max_temp_celsius}°C`, 
                  position: "insideTopLeft", 
                  style: { fill: '#EF4444', fontSize: 11, fontWeight: 'bold' } 
                }} 
              />
            )}
                        <Line
                          type="monotone"
                          dataKey="temperature"
                          stroke="#29E7CD"
                          strokeWidth={3}
                          dot={(props) => {
                            const { cx, cy, payload } = props;
                            if (!payload || !payload.hasData) {
                              // Missing data indicator for compliance
                              return (
                                <g>
                                  <circle
                                    cx={cx}
                                    cy={cy}
                                    r={6}
                                    fill="none"
                                    stroke="#EF4444"
                                    strokeWidth={2}
                                    strokeDasharray="4 4"
                                  />
                                  <text
                                    x={cx}
                                    y={cy + 4}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fill="#EF4444"
                                    fontWeight="bold"
                                  >
                                    !
                                  </text>
                                </g>
                              );
                            }
                            // Normal data point
                            return (
                              <circle
                                cx={cx}
                                cy={cy}
                                r={4}
                                fill="#29E7CD"
                                stroke="#ffffff"
                                strokeWidth={2}
                                fillOpacity={0.8}
                              />
                            );
                          }}
                          activeDot={(props) => {
                            const { cx, cy, payload } = props;
                            if (!payload || !payload.hasData) {
                              // Missing data active dot
                              return (
                                <g>
                                  <circle
                                    cx={cx}
                                    cy={cy}
                                    r={8}
                                    fill="none"
                                    stroke="#EF4444"
                                    strokeWidth={3}
                                    strokeDasharray="4 4"
                                  />
                                  <text
                                    x={cx}
                                    y={cy + 4}
                                    textAnchor="middle"
                                    fontSize="12"
                                    fill="#EF4444"
                                    fontWeight="bold"
                                  >
                                    !
                                  </text>
                                </g>
                              );
                            }
                            // Normal active dot
                            return (
                              <circle
                                cx={cx}
                                cy={cy}
                                r={8}
                                fill="#29E7CD"
                                stroke="#ffffff"
                                strokeWidth={3}
                                fillOpacity={1}
                              />
                            );
                          }}
                          connectNulls={false}
                        />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* User-Friendly Timeline Navigation */}
      {chartConfig.enablePanning && (
        <div className="mt-6 bg-[#2a2a2a]/30 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#29E7CD] rounded-full"></div>
              <span className="text-sm font-medium text-white">Timeline View</span>
            </div>
            <div className="text-sm text-gray-300">
              {chartConfig.startIndex + 1}-{chartConfig.endIndex} of {evenlySpacedData.length} days
            </div>
          </div>
          
          {/* Progress Bar with Better Visual */}
          <div className="relative">
            <div className="w-full bg-[#1f1f1f] rounded-full h-3 border border-[#2a2a2a]">
              <div 
                className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] h-3 rounded-full transition-all duration-300 ease-out shadow-lg"
                style={{ 
                  width: `${(10 / evenlySpacedData.length) * 100}%`,
                  marginLeft: `${(chartConfig.startIndex / evenlySpacedData.length) * 100}%`
                }}
              />
            </div>
            
            {/* Navigation Hints */}
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>← Drag to scroll</span>
              <span>Use arrows or drag</span>
              <span>Scroll →</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-500">
        Range: {equipment.min_temp_celsius}°C to {equipment.max_temp_celsius}°C
      </div>
    </div>
  );
}
