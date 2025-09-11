'use client';

import React, { useRef, useEffect, useState, memo } from 'react';

interface TemperatureLog {
  id: number;
  log_date: string;
  log_time: string;
  temperature_celsius: number;
  location: string | null;
  temperature_type: string;
}

interface SynchronizedChartProps {
  logs: TemperatureLog[];
  equipment: {
    id: string;
    name: string;
    equipment_type: string;
    min_temp_celsius: number | null;
    max_temp_celsius: number | null;
  };
  formatDateString: (date: string) => string;
  formatTime: (time: string) => string;
  getTypeIcon: (type: string) => string;
}

const SynchronizedChart = memo(({ 
  logs, 
  equipment, 
  formatDateString, 
  formatTime,
  getTypeIcon 
}: SynchronizedChartProps) => {
  const chartScrollRef = useRef<HTMLDivElement>(null);
  const xAxisScrollRef = useRef<HTMLDivElement>(null);
  
  // Calculate chart dimensions and data
  const chartWidth = Math.max(800, logs.length * 12);
  const uniqueDates = [...new Set(logs.map(l => l.log_date))].sort();
  const dayCount = uniqueDates.length;
  const dayWidth = chartWidth / dayCount;
  
  // Calculate temperature range
  const temps = logs.map(log => log.temperature_celsius);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const tempRange = maxTemp - minTemp;
  const padding = tempRange * 0.1;
  const chartMinTemp = minTemp - padding;
  const chartMaxTemp = maxTemp + padding;
  const chartTempRange = chartMaxTemp - chartMinTemp;
  
  // Synchronize scrolling between chart and x-axis
  useEffect(() => {
    const chartScroll = chartScrollRef.current;
    const xAxisScroll = xAxisScrollRef.current;
    
    if (!chartScroll || !xAxisScroll) return;
    
    let isSyncing = false;
    
    const syncScroll = (source: HTMLElement, target: HTMLElement) => {
      if (!isSyncing) {
        isSyncing = true;
        target.scrollLeft = source.scrollLeft;
        // Use requestAnimationFrame to ensure the sync happens after the scroll
        requestAnimationFrame(() => {
          isSyncing = false;
        });
      }
    };
    
    const handleChartScroll = () => {
      syncScroll(chartScroll, xAxisScroll);
    };
    
    const handleXAxisScroll = () => {
      syncScroll(xAxisScroll, chartScroll);
    };
    
    chartScroll.addEventListener('scroll', handleChartScroll, { passive: true });
    xAxisScroll.addEventListener('scroll', handleXAxisScroll, { passive: true });
    
    return () => {
      chartScroll.removeEventListener('scroll', handleChartScroll);
      xAxisScroll.removeEventListener('scroll', handleXAxisScroll);
    };
  }, []);
  
  // Generate Y-axis scale steps
  const scaleSteps = 5;
  const stepSize = (chartMaxTemp - chartMinTemp) / (scaleSteps - 1);
  const yAxisLabels = Array.from({ length: scaleSteps }, (_, i) => {
    const temp = chartMaxTemp - (i * stepSize);
    return temp.toFixed(1);
  });
  
  if (logs.length === 0) {
    return (
      <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-[#2a2a2a] flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-gray-400">No temperature data available</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-[#2a2a2a] relative">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10 flex items-center justify-center">
            <span className="text-2xl">{getTypeIcon(equipment.equipment_type)}</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">{equipment.name}</h3>
            <p className="text-sm text-gray-400">Temperature Trend</p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex space-x-6 text-center">
          <div>
            <div className="text-2xl font-bold text-[#29E7CD]">
              {logs[0]?.temperature_celsius || '--'}°C
            </div>
            <div className="text-xs text-gray-400">Latest</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-white">
              {(temps.reduce((sum, t) => sum + t, 0) / temps.length).toFixed(1)}°C
            </div>
            <div className="text-xs text-gray-400">Average</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-white">{logs.length}</div>
            <div className="text-xs text-gray-400">Readings</div>
          </div>
        </div>
      </div>
      
      {/* Chart Container with Fixed Y-axis */}
      <div className="relative bg-[#111111] rounded-xl overflow-hidden">
        <div className="flex h-64">
          {/* Fixed Left Y-axis */}
          <div className="flex-shrink-0 w-16 flex flex-col justify-between py-2.5 px-2 bg-[#111111] border-r border-[#2a2a2a] z-10">
            {yAxisLabels.map((label, i) => (
              <div key={i} className="text-xs text-gray-400 text-right">
                {label}°C
              </div>
            ))}
          </div>
          
          {/* Scrollable Chart Area */}
          <div 
            ref={chartScrollRef}
            className="flex-1 overflow-x-auto"
            style={{ 
              scrollbarWidth: 'thin',
              scrollbarColor: '#4a5568 #1a202c'
            }}
          >
            <div style={{ width: `${chartWidth}px`, height: '100%' }}>
              <svg width={chartWidth} height="256" className="w-full h-full">
                {/* Grid and Chart Content */}
                <defs>
                  <pattern id={`grid-${equipment.id}`} width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2a2a2a" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#grid-${equipment.id})`} />
                
                {/* Temperature Range Background */}
                {equipment.min_temp_celsius && equipment.max_temp_celsius && (
                  <rect 
                    x="0" 
                    y={((chartMaxTemp - equipment.max_temp_celsius) / chartTempRange) * 240 + 8}
                    width="100%" 
                    height={((equipment.max_temp_celsius - equipment.min_temp_celsius) / chartTempRange) * 240}
                    fill="#29E7CD" 
                    opacity="0.1"
                  />
                )}
                
                {/* Reference Lines */}
                {equipment.min_temp_celsius && (
                  <line 
                    x1="0" 
                    y1={248 - (((equipment.min_temp_celsius - chartMinTemp) / chartTempRange) * 240)}
                    x2={chartWidth}
                    y2={248 - (((equipment.min_temp_celsius - chartMinTemp) / chartTempRange) * 240)}
                    stroke="#29E7CD" 
                    strokeWidth="2" 
                    strokeDasharray="5,5"
                    opacity="0.7"
                  />
                )}
                
                {equipment.max_temp_celsius && (
                  <line 
                    x1="0" 
                    y1={248 - (((equipment.max_temp_celsius - chartMinTemp) / chartTempRange) * 240)}
                    x2={chartWidth}
                    y2={248 - (((equipment.max_temp_celsius - chartMinTemp) / chartTempRange) * 240)}
                    stroke="#29E7CD" 
                    strokeWidth="2" 
                    strokeDasharray="5,5"
                    opacity="0.7"
                  />
                )}
                
                {/* Temperature Line Path */}
                <path
                  fill="none"
                  stroke="#29E7CD"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={(() => {
                    const points = logs.map((log) => {
                      // Calculate time-based X position
                      const timeParts = log.log_time.split(':');
                      const hours = parseInt(timeParts[0]);
                      const minutes = parseInt(timeParts[1]);
                      const timeOfDay = (hours * 60 + minutes) / (24 * 60);
                      
                      const dateIndex = uniqueDates.indexOf(log.log_date);
                      const dayStartX = (dateIndex * dayWidth) + 10;
                      const timeOffsetX = timeOfDay * (dayWidth - 20);
                      const x = dayStartX + timeOffsetX;
                      
                      const y = 248 - (((log.temperature_celsius - chartMinTemp) / chartTempRange) * 240);
                      return `${x},${y}`;
                    });
                    
                    if (points.length < 2) return '';
                    
                    // Create smooth curve
                    let path = `M ${points[0]}`;
                    for (let i = 1; i < points.length; i++) {
                      const [x1, y1] = points[i - 1].split(',').map(Number);
                      const [x2, y2] = points[i].split(',').map(Number);
                      const cp1x = x1 + (x2 - x1) * 0.5;
                      const cp1y = y1;
                      const cp2x = x2 - (x2 - x1) * 0.5;
                      const cp2y = y2;
                      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}`;
                    }
                    return path;
                  })()}
                />
                
                {/* Data Points */}
                {logs.map((log, index) => {
                  const timeParts = log.log_time.split(':');
                  const hours = parseInt(timeParts[0]);
                  const minutes = parseInt(timeParts[1]);
                  const timeOfDay = (hours * 60 + minutes) / (24 * 60);
                  
                  const dateIndex = uniqueDates.indexOf(log.log_date);
                  const dayStartX = (dateIndex * dayWidth) + 10;
                  const timeOffsetX = timeOfDay * (dayWidth - 20);
                  const x = dayStartX + timeOffsetX;
                  
                  const y = 248 - (((log.temperature_celsius - chartMinTemp) / chartTempRange) * 240);
                  const isInRange = equipment.min_temp_celsius && equipment.max_temp_celsius 
                    ? log.temperature_celsius >= equipment.min_temp_celsius && log.temperature_celsius <= equipment.max_temp_celsius
                    : true;
                  
                  return (
                    <g key={log.id}>
                      <circle
                        cx={x}
                        cy={y}
                        r="4"
                        fill={isInRange ? "#29E7CD" : "#ef4444"}
                        stroke="white"
                        strokeWidth="2"
                      />
                      <title>
                        {formatDateString(log.log_date)} {formatTime(log.log_time)} - {log.temperature_celsius}°C
                      </title>
                    </g>
                  );
                })}
                
                {/* Day Dividers */}
                {uniqueDates.slice(1).map((date, index) => {
                  const x = ((index + 1) * dayWidth);
                  return (
                    <line
                      key={date}
                      x1={x}
                      y1="8"
                      x2={x}
                      y2="248"
                      stroke="#29E7CD"
                      strokeWidth="1"
                      opacity="0.3"
                    />
                  );
                })}
              </svg>
            </div>
          </div>
          
          {/* Fixed Right Y-axis */}
          <div className="flex-shrink-0 w-16 flex flex-col justify-between py-2.5 px-2 bg-[#111111] border-l border-[#2a2a2a] z-10">
            {yAxisLabels.map((label, i) => (
              <div key={i} className="text-xs text-gray-400 text-left">
                {label}°C
              </div>
            ))}
          </div>
        </div>
        
        {/* Synchronized X-axis Labels */}
        <div className="flex border-t border-[#2a2a2a]">
          <div className="w-16 flex-shrink-0 bg-[#111111]"></div>
          <div 
            ref={xAxisScrollRef}
            className="flex-1 overflow-x-auto"
            style={{ 
              scrollbarWidth: 'thin',
              scrollbarColor: '#4a5568 #1a202c'
            }}
          >
            <div style={{ width: `${chartWidth}px` }} className="px-2 py-2 bg-[#111111]">
              <div className="flex">
                {uniqueDates.map((date, index) => (
                  <div 
                    key={date} 
                    className="text-center flex-shrink-0" 
                    style={{ width: `${dayWidth}px` }}
                  >
                    <div className="text-xs font-medium text-white">
                      {formatDateString(date)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-16 flex-shrink-0 bg-[#111111]"></div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#29E7CD]"></div>
            <span className="text-gray-300">In Range</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-300">Out of Range</span>
          </div>
        </div>
        {equipment.min_temp_celsius && equipment.max_temp_celsius && (
          <div className="text-sm text-gray-400">
            Safe Range: {equipment.min_temp_celsius}°C - {equipment.max_temp_celsius}°C
          </div>
        )}
      </div>
    </div>
  );
});

SynchronizedChart.displayName = 'SynchronizedChart';

export default SynchronizedChart;
