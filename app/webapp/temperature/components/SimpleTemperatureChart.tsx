'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TemperatureLog, TemperatureEquipment } from '../types';
import { format } from 'date-fns';

interface SimpleTemperatureChartProps {
  logs: TemperatureLog[];
  equipment: TemperatureEquipment;
  timeFilter: '24h' | '7d' | '30d' | 'all';
}

export default function SimpleTemperatureChart({ logs, equipment, timeFilter }: SimpleTemperatureChartProps) {
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
    
    uniqueDates.forEach((date, index) => {
      const dayData = chartData.filter(d => d.timestamp.startsWith(date));
      if (dayData.length > 0) {
        markers.push({
          date,
          timestamp: dayData[0].timestamp,
          index
        });
      }
    });
    
    return markers;
  };

  const get24HourMarkers = () => {
    if (timeFilter !== '24h') return [];
    
    const today = new Date();
    const todayString = format(today, 'yyyy-MM-dd');
    const todayData = chartData.filter(d => d.date === todayString);
    
    const markers: Array<{hour: number, timestamp: string, index: number, label: string}> = [];
    
    // Create 6-hour markers (0, 6, 12, 18)
    for (let hour = 0; hour < 24; hour += 6) {
      const hourString = hour.toString().padStart(2, '0');
      const closestEntry = todayData.find(d => d.time.startsWith(hourString));
      
      if (closestEntry) {
        markers.push({
          hour,
          timestamp: closestEntry.timestamp,
          index: todayData.indexOf(closestEntry),
          label: `${hourString}:00`
        });
      }
    }
    
    return markers;
  };

  const formatXAxisLabel = (tickItem: string) => {
    const date = new Date(tickItem);
    if (timeFilter === '24h') {
      // Show time for 24h view
      return date.getHours().toString().padStart(2, '0') + ':' + 
             date.getMinutes().toString().padStart(2, '0');
    } else {
      // Show date for other views
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months[date.getMonth()] + ' ' + date.getDate();
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
            No temperature logs found for this equipment. Add some temperature readings to see the chart.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{equipment.name}</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${statusColor.replace('text-', 'bg-')}`}></div>
          <span className={`text-sm ${statusColor}`}>{latestStatus}</span>
        </div>
      </div>
      
      <div className="text-2xl font-bold text-white mb-2">
        {latestTemperature ? `${latestTemperature.toFixed(1)}°C` : '--'}
      </div>
      
      <div className="text-xs text-gray-400 mb-4">
        {chartData.length} readings
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatXAxisLabel}
              stroke="#6b7280"
              fontSize={12}
              tick={{ fill: '#9ca3af' }}
              axisLine={{ stroke: '#374151' }}
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
            
            {/* Date separators for non-24h views */}
            {timeFilter !== '24h' && getDateMarkers().map((marker, index) => (
              <ReferenceLine
                key={`date-${equipment.id}-${marker.date}-${index}`}
                x={marker.timestamp}
                stroke="#29E7CD"
                strokeDasharray="2 2"
                strokeOpacity={0.6}
                label={{ value: marker.date, position: "top", style: { fill: '#29E7CD', fontSize: '10px' } }}
              />
            ))}
            
            {/* 6-hour separators for 24h view */}
            {timeFilter === '24h' && get24HourMarkers().map((marker, index) => (
              <ReferenceLine
                key={`hour-${equipment.id}-${marker.hour}-${index}`}
                x={marker.timestamp}
                stroke="#29E7CD"
                strokeDasharray="2 2"
                strokeOpacity={0.6}
                label={{ value: marker.label, position: "top", style: { fill: '#29E7CD', fontSize: '10px' } }}
              />
            ))}
            
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#29E7CD"
              strokeWidth={2}
              dot={{ fill: '#29E7CD', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#29E7CD', strokeWidth: 2, fill: '#ffffff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}