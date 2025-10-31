'use client';

import {
  CartesianGrid,
  Line,
  LineChart as ReLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { TemperatureEquipment, TemperatureLog } from '../types';

interface SimpleTemperatureChartProps {
  logs: TemperatureLog[];
  equipment: TemperatureEquipment;
  timeFilter: '24h' | '7d' | '30d' | 'all';
}

export default function SimpleTemperatureChart({
  logs,
  equipment,
  timeFilter,
}: SimpleTemperatureChartProps) {
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
  const latestStatus =
    latestTemperature !== null && latestTemperature !== undefined
      ? isTemperatureInRange(latestTemperature)
        ? 'In Range'
        : 'Out of Range'
      : 'N/A';
  const statusColor = latestStatus === 'In Range' ? 'text-green-400' : 'text-red-400';

  const formatXAxisLabel = (tickItem: string) => {
    const date = new Date(tickItem);
    if (timeFilter === '24h') {
      return (
        date.getHours().toString().padStart(2, '0') +
        ':' +
        date.getMinutes().toString().padStart(2, '0')
      );
    } else {
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      return months[date.getMonth()] + ' ' + date.getDate();
    }
  };

  const formatTooltipLabel = (label: string) => {
    const date = new Date(label);
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}, ${hours}:${minutes}`;
  };

  const formatTooltipValue = (value: number) => {
    return `${value?.toFixed(1)}°C`;
  };

  if (!chartData || chartData.length === 0) {
    return (
      <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">{equipment.name}</h3>
          <div className="flex items-center space-x-2">
            <div className={`h-2 w-2 rounded-full ${statusColor.replace('text-', 'bg-')}`}></div>
            <span className={`text-sm ${statusColor}`}>{latestStatus}</span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20">
            <svg
              className="h-10 w-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h4 className="mb-2 text-lg font-medium text-white">No Temperature Data</h4>
          <p className="max-w-sm text-sm text-gray-400">
            No temperature logs found for this equipment. Add some temperature readings to see the
            chart.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{equipment.name}</h3>
        <div className="flex items-center space-x-2">
          <div className={`h-2 w-2 rounded-full ${statusColor.replace('text-', 'bg-')}`}></div>
          <span className={`text-sm ${statusColor}`}>{latestStatus}</span>
        </div>
      </div>

      <div className="mb-2 text-2xl font-bold text-white">
        {latestTemperature ? `${latestTemperature.toFixed(1)}°C` : '--'}
      </div>

      <div className="mb-4 text-xs text-gray-400">{chartData.length} readings</div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ReLineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis dataKey="timestamp" tickFormatter={formatXAxisLabel} stroke="#9ca3af" />
            <YAxis
              domain={['dataMin - 1', 'dataMax + 1']}
              stroke="#9ca3af"
              tickFormatter={(v: number | string) => `${v}°`}
            />
            <Tooltip
              labelFormatter={formatTooltipLabel}
              formatter={(value: any) => [formatTooltipValue(value as number), 'Temp']}
              contentStyle={{
                backgroundColor: '#1f1f1f',
                border: '1px solid #2a2a2a',
                color: '#fff',
              }}
            />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#29E7CD"
              strokeWidth={2}
              dot={false}
              isAnimationActive
            />
          </ReLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
