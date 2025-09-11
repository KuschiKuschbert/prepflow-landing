'use client';

import React, { memo, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  Dot
} from 'recharts';

interface TemperatureLog {
  id: number;
  log_date: string;
  log_time: string;
  temperature_celsius: number;
  location: string | null;
}

interface ChartProps {
  logs: TemperatureLog[];
  minTemp: number | null;
  maxTemp: number | null;
  equipmentName: string;
}

// Custom dot component for better mobile touch targets
const CustomDot = (props: any) => {
  const { cx, cy, payload, minTemp, maxTemp } = props;
  const isInRange = payload.temperature >= minTemp && payload.temperature <= maxTemp;
  
  return (
    <circle
      cx={cx}
      cy={cy}
      r={6}
      fill={isInRange ? "#29E7CD" : "#ef4444"}
      stroke="#ffffff"
      strokeWidth={2}
      style={{ cursor: 'pointer' }}
      onClick={() => {
        // Handle click/touch for mobile
        console.log('Temperature point clicked:', payload);
      }}
    />
  );
};

// Custom tooltip for better mobile display
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 shadow-lg">
        <p className="text-white text-sm font-medium">{label}</p>
        <p className="text-[#29E7CD] text-lg font-bold">
          {payload[0].value}°C
        </p>
      </div>
    );
  }
  return null;
};

const ImprovedTemperatureChart = memo(({ 
  logs, 
  minTemp, 
  maxTemp, 
  equipmentName 
}: ChartProps) => {
  // Process data for Recharts
  const chartData = useMemo(() => {
    return logs.map(log => ({
      ...log,
      datetime: `${log.log_date} ${log.log_time.substring(0, 5)}`,
      temperature: log.temperature_celsius,
      timestamp: new Date(`${log.log_date}T${log.log_time}`).getTime()
    })).sort((a, b) => a.timestamp - b.timestamp);
  }, [logs]);

  // Calculate Y-axis domain with padding
  const yDomain = useMemo(() => {
    const temps = chartData.map(d => d.temperature);
    const dataMin = Math.min(...temps);
    const dataMax = Math.max(...temps);
    const padding = (dataMax - dataMin) * 0.1;
    
    return [
      Math.floor(dataMin - padding),
      Math.ceil(dataMax + padding)
    ];
  }, [chartData]);

  // Format axis labels for mobile
  const formatXAxisTick = (tickItem: string) => {
    const date = new Date(tickItem);
    return date.toLocaleDateString('en-AU', { 
      day: '2-digit', 
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (logs.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-[#0a0a0a] rounded-2xl border border-[#2a2a2a]">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-gray-400">No temperature data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-[#0a0a0a] p-4 rounded-2xl border border-[#2a2a2a]">
        {/* Chart Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">{equipmentName} Temperature Trend</h3>
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
        </div>

        {/* Responsive Chart Container */}
        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              {/* Grid */}
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#2a2a2a" 
                strokeOpacity={0.5}
              />
              
              {/* Reference area for safe temperature range */}
              {minTemp !== null && maxTemp !== null && (
                <ReferenceArea
                  y1={minTemp}
                  y2={maxTemp}
                  fill="#29E7CD"
                  fillOpacity={0.1}
                  strokeOpacity={0}
                />
              )}
              
              {/* Reference lines for min/max thresholds */}
              {minTemp !== null && (
                <ReferenceLine
                  y={minTemp}
                  stroke="#29E7CD"
                  strokeDasharray="5 5"
                  strokeOpacity={0.7}
                  label={{ value: `Min: ${minTemp}°C`, position: "left", fill: "#29E7CD" }}
                />
              )}
              
              {maxTemp !== null && (
                <ReferenceLine
                  y={maxTemp}
                  stroke="#29E7CD"
                  strokeDasharray="5 5"
                  strokeOpacity={0.7}
                  label={{ value: `Max: ${maxTemp}°C`, position: "left", fill: "#29E7CD" }}
                />
              )}
              
              {/* X Axis */}
              <XAxis
                dataKey="datetime"
                tick={{ fill: '#888888', fontSize: 12 }}
                tickFormatter={formatXAxisTick}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              
              {/* Y Axis */}
              <YAxis
                domain={yDomain}
                tick={{ fill: '#888888', fontSize: 12 }}
                tickFormatter={(value) => `${value}°C`}
                width={50}
              />
              
              {/* Tooltip */}
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: '#29E7CD', strokeOpacity: 0.2 }}
              />
              
              {/* Temperature Line */}
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#29E7CD"
                strokeWidth={2}
                dot={<CustomDot minTemp={minTemp || -999} maxTemp={maxTemp || 999} />}
                activeDot={{ r: 8, stroke: '#ffffff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Chart Statistics */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-[#2a2a2a]/30 p-3 rounded-xl text-center">
            <div className="text-xs text-gray-400">Average</div>
            <div className="text-lg font-bold text-[#29E7CD]">
              {(chartData.reduce((sum, d) => sum + d.temperature, 0) / chartData.length).toFixed(1)}°C
            </div>
          </div>
          <div className="bg-[#2a2a2a]/30 p-3 rounded-xl text-center">
            <div className="text-xs text-gray-400">Min</div>
            <div className="text-lg font-bold text-white">
              {Math.min(...chartData.map(d => d.temperature)).toFixed(1)}°C
            </div>
          </div>
          <div className="bg-[#2a2a2a]/30 p-3 rounded-xl text-center">
            <div className="text-xs text-gray-400">Max</div>
            <div className="text-lg font-bold text-white">
              {Math.max(...chartData.map(d => d.temperature)).toFixed(1)}°C
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ImprovedTemperatureChart.displayName = 'ImprovedTemperatureChart';

export default ImprovedTemperatureChart;
