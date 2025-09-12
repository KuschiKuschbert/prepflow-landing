"use client";

import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TemperatureLog {
  id: number;
  log_date: string;
  log_time: string;
  temperature_celsius: number;
  location: string;
  temperature_type: string;
  food_item_name?: string;
}

interface Equipment {
  id: number;
  name: string;
  min_temp_celsius: number;
  max_temp_celsius: number;
  location: string;
}

interface ChartJSTemperatureChartProps {
  logs: TemperatureLog[];
  equipment: Equipment | null;
  timeFilter: string;
}

export default function ChartJSTemperatureChart({ 
  logs, 
  equipment, 
  timeFilter 
}: ChartJSTemperatureChartProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Filter logs based on time range and equipment
  const getFilteredLogs = () => {
    // First filter by equipment name (matching log.location with equipment.name)
    let equipmentFilteredLogs = logs;
    if (equipment && equipment.name) {
      equipmentFilteredLogs = logs.filter(log => log.location === equipment.name);
    }

    console.log('🔍 Chart.js Filter Debug:', {
      totalLogs: logs.length,
      equipmentName: equipment?.name,
      equipmentFilteredCount: equipmentFilteredLogs.length,
      timeFilter,
      sampleEquipmentLogs: equipmentFilteredLogs.slice(0, 3)
    });

    // Then filter by time range
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
      default:
        // 'all' - no time filtering
        return equipmentFilteredLogs;
    }

    return equipmentFilteredLogs.filter(log => {
      const logDate = new Date(`${log.log_date} ${log.log_time}`);
      return logDate >= cutoffDate;
    });
  };

  const filteredLogs = getFilteredLogs();

  // Create chart data
  const chartData = filteredLogs
    .map(log => ({
      timestamp: `${log.log_date} ${log.log_time}`,
      temperature: log.temperature_celsius,
      date: log.log_date,
      time: log.log_time,
    }))
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  console.log('🔍 Chart.js Data Structure:', {
    chartDataLength: chartData.length,
    sampleChartData: chartData.slice(0, 3),
    timestampFormat: chartData.length > 0 ? chartData[0].timestamp : 'N/A',
    temperatureValues: chartData.slice(0, 3).map(d => d.temperature)
  });

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
      <div className="w-full h-96 bg-gray-800 rounded-lg flex items-center justify-center">
        <div className="text-gray-400">Loading chart...</div>
      </div>
    );
  }

  // Chart.js configuration
  const data = {
    labels: chartData.map(point => {
      const date = new Date(point.timestamp);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: chartData.map(point => point.temperature),
        borderColor: '#29E7CD',
        backgroundColor: 'rgba(41, 231, 205, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.1,
        pointBackgroundColor: '#29E7CD',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#29E7CD',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(42, 42, 42, 0.5)',
        },
        ticks: {
          color: '#9ca3af',
          maxTicksLimit: chartData.length > 1000 ? 10 : 20,
        },
      },
      y: {
        grid: {
          color: 'rgba(42, 42, 42, 0.5)',
        },
        ticks: {
          color: '#9ca3af',
        },
        // Add threshold lines
        afterBuildTicks: (axis: any) => {
          if (equipment) {
            axis.ticks.push({
              value: equipment.min_temp_celsius,
              label: `Min: ${equipment.min_temp_celsius}°C`,
            });
            axis.ticks.push({
              value: equipment.max_temp_celsius,
              label: `Max: ${equipment.max_temp_celsius}°C`,
            });
          }
        },
      },
    },
    elements: {
      point: {
        hoverBackgroundColor: '#29E7CD',
      },
    },
  };

  return (
    <div className="w-full h-96">
      <Line data={data} options={options} />
    </div>
  );
}
