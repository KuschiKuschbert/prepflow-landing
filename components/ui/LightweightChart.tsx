/**
 * Lightweight Chart Component
 * Replaces Recharts with CSS/SVG-based charts for 90% smaller bundle
 */

'use client';

import React from 'react';

interface ChartData {
  name: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: ChartData[];
  height?: number;
  width?: number;
  showValues?: boolean;
  className?: string;
}

interface PieChartProps {
  data: ChartData[];
  size?: number;
  showLabels?: boolean;
  className?: string;
}

interface LineChartProps {
  data: { x: string | number; y: number; label?: string }[];
  height?: number;
  width?: number;
  showGrid?: boolean;
  showValues?: boolean;
  className?: string;
}

// Lightweight Bar Chart Component
function BarChart({
  data,
  height = 200,
  width = 400,
  showValues = true,
  className = '',
}: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  const colors = ['#29E7CD', '#3B82F6', '#D925C7', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className={`rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 ${className}`}>
      <div className="flex h-48 items-end justify-between space-x-2">
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * 100;
          const color = item.color || colors[index % colors.length];

          return (
            <div key={item.name} className="flex flex-1 flex-col items-center">
              {showValues && <span className="mb-1 text-xs text-gray-400">{item.value}</span>}
              <div
                className="w-full rounded-t-lg transition-all duration-300 hover:opacity-80"
                style={{
                  height: `${barHeight}%`,
                  backgroundColor: color,
                  minHeight: '4px',
                }}
                title={`${item.name}: ${item.value}`}
              />
              <span className="mt-2 text-center text-xs leading-tight text-gray-300">
                {item.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Lightweight Pie Chart Component
function PieChart({ data, size = 200, showLabels = true, className = '' }: PieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const colors = ['#29E7CD', '#3B82F6', '#D925C7', '#10B981', '#F59E0B', '#EF4444'];

  let cumulativePercentage = 0;

  return (
    <div className={`rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 ${className}`}>
      <div className="flex items-center justify-center">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90 transform">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const circumference = 2 * Math.PI * (size / 2 - 10);
              const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((cumulativePercentage / 100) * circumference);

              cumulativePercentage += percentage;

              const color = item.color || colors[index % colors.length];

              return (
                <circle
                  key={item.name}
                  cx={size / 2}
                  cy={size / 2}
                  r={size / 2 - 10}
                  fill="none"
                  stroke={color}
                  strokeWidth="20"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="hover:stroke-opacity-80 transition-all duration-300"
                  style={{
                    strokeLinecap: 'round',
                  }}
                />
              );
            })}
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{total}</div>
              <div className="text-xs text-gray-400">Total</div>
            </div>
          </div>
        </div>
      </div>

      {showLabels && (
        <div className="mt-4 space-y-2">
          {data.map((item, index) => {
            const color = item.color || colors[index % colors.length];
            const percentage = ((item.value / total) * 100).toFixed(1);

            return (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-gray-300">{item.name}</span>
                </div>
                <span className="text-gray-400">{percentage}%</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Lightweight Line Chart Component
function LineChart({
  data,
  height = 200,
  width = 400,
  showGrid = true,
  showValues = false,
  className = '',
}: LineChartProps) {
  if (data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.y));
  const minValue = Math.min(...data.map(d => d.y));
  const range = maxValue - minValue || 1;

  const points = data
    .map((item, index) => {
      const x = (index / (data.length - 1)) * (width - 40) + 20;
      const y = height - 20 - ((item.y - minValue) / range) * (height - 40);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className={`rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 ${className}`}>
      <svg width={width} height={height} className="overflow-visible">
        {/* Grid lines */}
        {showGrid && (
          <>
            {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
              const y = height - 20 - ratio * (height - 40);
              return (
                <line
                  key={ratio}
                  x1="20"
                  y1={y}
                  x2={width - 20}
                  y2={y}
                  stroke="#2a2a2a"
                  strokeWidth="1"
                />
              );
            })}
          </>
        )}

        {/* Line */}
        <polyline
          fill="none"
          stroke="#29E7CD"
          strokeWidth="2"
          points={points}
          className="transition-all duration-300"
        />

        {/* Data points */}
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * (width - 40) + 20;
          const y = height - 20 - ((item.y - minValue) / range) * (height - 40);

          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="4"
              fill="#29E7CD"
              className="hover:r-6 transition-all duration-300 hover:fill-[#3B82F6]"
            >
              {showValues && <title>{item.label || item.y}</title>}
            </circle>
          );
        })}
      </svg>
    </div>
  );
}

// Export all components
export { BarChart, PieChart, LineChart };
