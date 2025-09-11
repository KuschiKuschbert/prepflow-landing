'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

interface SynchronizedChartProps {
  logs: TemperatureLog[];
  equipment: TemperatureEquipment;
  formatDateString: (dateString: string) => string;
  formatTime: (timeString: string) => string;
  getTypeIcon: (type: string) => string;
}

export default function SynchronizedChart({
  logs,
  equipment,
  formatDateString,
  formatTime,
  getTypeIcon
}: SynchronizedChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (!logs || logs.length === 0) {
      setChartData([]);
      return;
    }

    // Prepare data for Recharts
    const sortedLogs = [...logs].sort((a, b) => {
      const dateA = new Date(`${a.log_date}T${a.log_time}`);
      const dateB = new Date(`${b.log_date}T${b.log_time}`);
      return dateA.getTime() - dateB.getTime();
    });

    const data = sortedLogs.map(log => ({
      timestamp: `${formatDateString(log.log_date)} ${formatTime(log.log_time)}`,
      temperature: log.temperature_celsius,
      location: log.location || '',
      notes: log.notes || '',
      date: log.log_date,
      time: log.log_time
    }));

    setChartData(data);
  }, [logs, formatDateString, formatTime]);

  if (!chartData || logs.length === 0) {
    return (
      <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">
            {getTypeIcon(equipment.equipment_type)} {equipment.name}
          </h3>
          <span className="text-gray-400 text-sm">No data available</span>
        </div>
        <div className="h-64 bg-[#2a2a2a]/30 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
            <div className="text-gray-400">No temperature logs found for this equipment</div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          {getTypeIcon(equipment.equipment_type)} {equipment.name}
        </h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#29E7CD] rounded-full"></div>
            <span className="text-gray-300">Temperature</span>
          </div>
          {equipment.min_temp_celsius && equipment.max_temp_celsius && (
            <div className="text-gray-400">
              Range: {equipment.min_temp_celsius}°C - {equipment.max_temp_celsius}°C
            </div>
          )}
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis 
              dataKey="timestamp" 
              stroke="#9ca3af"
              fontSize={10}
              tick={{ fill: '#9ca3af' }}
              interval="preserveStartEnd"
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize={11}
              tick={{ fill: '#9ca3af' }}
              tickFormatter={(value) => `${value}°C`}
              domain={[
                equipment.min_temp_celsius ? equipment.min_temp_celsius - 5 : 'dataMin - 5',
                equipment.max_temp_celsius ? equipment.max_temp_celsius + 5 : 'dataMax + 5'
              ]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(31, 31, 31, 0.95)',
                border: '1px solid #29E7CD',
                borderRadius: '8px',
                color: '#ffffff'
              }}
              labelStyle={{ color: '#ffffff' }}
              formatter={(value: any, name: string, props: any) => {
                const log = props.payload;
                let status = '';
                
                if (equipment.min_temp_celsius && equipment.max_temp_celsius) {
                  if (value < equipment.min_temp_celsius) {
                    status = '❄️ Below minimum';
                  } else if (value > equipment.max_temp_celsius) {
                    status = '🔥 Above maximum';
                  } else {
                    status = '✅ Within range';
                  }
                }
                
                return [
                  [`Temperature: ${value}°C`, 'Temperature'],
                  log.location ? [`Location: ${log.location}`, 'Location'] : null,
                  log.notes ? [`Notes: ${log.notes}`, 'Notes'] : null,
                  status ? [status, 'Status'] : null
                ].filter(Boolean);
              }}
            />
            <Legend 
              wrapperStyle={{ color: '#ffffff' }}
              iconType="line"
            />
            <Line 
              type="monotone" 
              dataKey="temperature" 
              stroke="#29E7CD" 
              strokeWidth={2}
              dot={{ fill: '#29E7CD', stroke: '#ffffff', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#29E7CD', strokeWidth: 3 }}
              name="Temperature (°C)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
          
      {/* Chart Statistics */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div className="bg-[#2a2a2a]/30 p-3 rounded-xl text-center">
          <div className="text-gray-400">Average</div>
          <div className="text-white font-semibold">
            {(logs.reduce((sum, log) => sum + log.temperature_celsius, 0) / logs.length).toFixed(1)}°C
          </div>
        </div>
        <div className="bg-[#2a2a2a]/30 p-3 rounded-xl text-center">
          <div className="text-gray-400">Min</div>
          <div className="text-white font-semibold">
            {Math.min(...logs.map(log => log.temperature_celsius))}°C
          </div>
        </div>
        <div className="bg-[#2a2a2a]/30 p-3 rounded-xl text-center">
          <div className="text-gray-400">Max</div>
          <div className="text-white font-semibold">
            {Math.max(...logs.map(log => log.temperature_celsius))}°C
          </div>
        </div>
      </div>
    </div>
  );
}