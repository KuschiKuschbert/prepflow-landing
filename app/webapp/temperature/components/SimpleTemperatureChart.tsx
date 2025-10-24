'use client';

import { LineChart } from '@/components/ui/LightweightChart';
import { TemperatureLog, TemperatureEquipment } from '../types';
import { format } from 'date-fns';

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

  const getUniqueDates = () => {
    const dates = [...new Set(chartData.map(d => d.timestamp.split(' ')[0]))].sort();
    return dates;
  };

  const getDateMarkers = () => {
    const uniqueDates = getUniqueDates();
    const markers: Array<{ date: string; timestamp: string; index: number }> = [];

    uniqueDates.forEach((date, index) => {
      const dayData = chartData.filter(d => d.timestamp.startsWith(date));
      if (dayData.length > 0) {
        markers.push({
          date,
          timestamp: dayData[0].timestamp,
          index,
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

    const markers: Array<{ hour: number; timestamp: string; index: number; label: string }> = [];

    // Create 6-hour markers (0, 6, 12, 18)
    for (let hour = 0; hour < 24; hour += 6) {
      const hourString = hour.toString().padStart(2, '0');
      const closestEntry = todayData.find(d => d.time.startsWith(hourString));

      if (closestEntry) {
        markers.push({
          hour,
          timestamp: closestEntry.timestamp,
          index: todayData.indexOf(closestEntry),
          label: `${hourString}:00`,
        });
      }
    }

    return markers;
  };

  const formatXAxisLabel = (tickItem: string) => {
    const date = new Date(tickItem);
    if (timeFilter === '24h') {
      // Show time for 24h view
      return (
        date.getHours().toString().padStart(2, '0') +
        ':' +
        date.getMinutes().toString().padStart(2, '0')
      );
    } else {
      // Show date for other views
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

  // Convert chart data to lightweight format
  const lightweightData = chartData.map((item, index) => ({
    x: index,
    y: item.temperature,
    label: `${formatTooltipLabel(item.timestamp)}: ${item.temperature.toFixed(1)}°C`,
  }));

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

      {/* Temperature thresholds display */}
      <div className="mb-4 flex flex-wrap gap-4 text-xs">
        {equipment.min_temp_celsius !== null && (
          <div className="flex items-center space-x-1">
            <div className="h-2 w-2 rounded-full bg-red-500"></div>
            <span className="text-gray-400">Min: {equipment.min_temp_celsius}°C</span>
          </div>
        )}
        {equipment.max_temp_celsius !== null && (
          <div className="flex items-center space-x-1">
            <div className="h-2 w-2 rounded-full bg-red-500"></div>
            <span className="text-gray-400">Max: {equipment.max_temp_celsius}°C</span>
          </div>
        )}
      </div>

      <div className="h-64 w-full">
        <LineChart
          data={lightweightData}
          height={256}
          width={400}
          showGrid={true}
          showValues={true}
          className="w-full"
        />
      </div>
    </div>
  );
}
