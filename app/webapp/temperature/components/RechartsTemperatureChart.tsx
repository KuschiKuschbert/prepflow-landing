"use client";

import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface TemperatureLog {
  id: string;
  log_date: string;
  log_time: string;
  temperature_celsius: number;
  location: string | null;
  temperature_type: string;
  notes: string | null;
  photo_url: string | null;
  logged_by: string | null;
  created_at: string;
  updated_at: string;
}

interface Equipment {
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

interface RechartsTemperatureChartProps {
  logs: TemperatureLog[];
  equipment: Equipment | null;
  timeFilter: string;
}

export default function RechartsTemperatureChart({
  logs,
  equipment,
  timeFilter,
}: RechartsTemperatureChartProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Filter logs by equipment and time
  const getFilteredLogs = () => {
    if (!equipment || !equipment.name) return [];

    // Filter by equipment
    const equipmentLogs = logs.filter(log => log.location === equipment.name);
    
    if (equipmentLogs.length === 0) return [];

    // Sort by timestamp
    const sortedLogs = equipmentLogs.sort((a, b) => {
      const dateA = new Date(`${a.log_date}T${a.log_time}`);
      const dateB = new Date(`${b.log_date}T${b.log_time}`);
      return dateA.getTime() - dateB.getTime();
    });

    // Apply time filter
    const now = new Date();
    const mostRecentLog = sortedLogs[sortedLogs.length - 1];
    const mostRecentTime = new Date(`${mostRecentLog.log_date}T${mostRecentLog.log_time}`);

    let cutoffTime: Date;
    switch (timeFilter) {
      case '24h':
        cutoffTime = new Date(mostRecentTime.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        cutoffTime = new Date(mostRecentTime.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        cutoffTime = new Date(mostRecentTime.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        return sortedLogs;
    }

    return sortedLogs.filter(log => {
      const logTime = new Date(`${log.log_date}T${log.log_time}`);
      return logTime >= cutoffTime;
    });
  };

  const filteredLogs = getFilteredLogs();

  // Transform data for Recharts
  const chartData = filteredLogs.map(log => ({
    timestamp: `${log.log_date}T${log.log_time}`,
    temperature: log.temperature_celsius,
    time: new Date(`${log.log_date}T${log.log_time}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    }),
    date: new Date(`${log.log_date}T${log.log_time}`).toLocaleDateString(),
  }));

  // Handle loading state
  useEffect(() => {
    if (chartData.length > 0 && equipment && equipment.name) {
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 200);
      
      return () => clearTimeout(timer);
    } else {
      setIsLoaded(false);
    }
  }, [chartData.length, equipment?.name, timeFilter]);

  // Don't render chart if not loaded, no data, or invalid equipment
  if (!isLoaded || chartData.length === 0 || !equipment || !equipment.name) {
    return (
      <div className="w-full h-96 bg-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden">
        {/* Material Design 3 Loading Animation */}
        <div className="absolute inset-0">
          {/* Animated background lines */}
          <div className="absolute inset-0 opacity-20">
            <div className="h-full w-full bg-gradient-to-r from-transparent via-gray-600 to-transparent animate-pulse"></div>
          </div>
          
          {/* Animated line drawing effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3/4 h-1 bg-gradient-to-r from-transparent via-[#29E7CD] to-transparent rounded-full animate-pulse"></div>
          </div>
          
          {/* Animated dots */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex space-x-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-[#29E7CD] rounded-full animate-pulse"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '1.5s'
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Loading text */}
        <div className="text-gray-400 text-sm font-medium relative z-10">
          Drawing temperature path...
        </div>
      </div>
    );
  }

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 border border-[#29E7CD] rounded-xl p-3 shadow-lg">
          <p className="text-white font-medium text-sm">
            {data.date} at {data.time}
          </p>
          <p className="text-[#29E7CD] font-semibold text-lg">
            {data.temperature}°C
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom tick formatter for X-axis
  const formatXAxisTick = (tickItem: string) => {
    const date = new Date(tickItem);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#2a2a2a" 
            strokeOpacity={0.5}
          />
          
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatXAxisTick}
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          
          <YAxis
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={['dataMin - 2', 'dataMax + 2']}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          {/* Threshold lines */}
          {equipment.min_temp_celsius !== null && (
            <ReferenceLine
              y={equipment.min_temp_celsius}
              stroke="#ef4444"
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{
                value: `Min: ${equipment.min_temp_celsius}°C`,
                position: 'insideTopLeft',
                style: { fill: '#ef4444', fontSize: '12px' }
              }}
            />
          )}
          
          {equipment.max_temp_celsius !== null && (
            <ReferenceLine
              y={equipment.max_temp_celsius}
              stroke="#ef4444"
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{
                value: `Max: ${equipment.max_temp_celsius}°C`,
                position: 'insideTopRight',
                style: { fill: '#ef4444', fontSize: '12px' }
              }}
            />
          )}
          
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#29E7CD"
            strokeWidth={3}
            dot={{
              fill: '#29E7CD',
              stroke: '#ffffff',
              strokeWidth: 2,
              r: 4,
            }}
            activeDot={{
              r: 6,
              stroke: '#29E7CD',
              strokeWidth: 2,
              fill: '#ffffff',
            }}
            animationDuration={1000}
            animationEasing="ease-in-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
