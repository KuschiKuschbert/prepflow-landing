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

// Custom Material Design 3 Line Drawing Animation Plugin
const materialLineDrawingPlugin = {
  id: 'materialLineDrawing',
  beforeDraw: (chart: any) => {
    const { ctx, data } = chart;
    const dataset = data.datasets[0];
    
    if (!dataset || !dataset.data || dataset.data.length === 0) return;
    
    // Get the line path
    const meta = chart.getDatasetMeta(0);
    if (!meta || !meta.data) return;
    
    // Create gradient for the line
    const gradient = ctx.createLinearGradient(0, 0, chart.width, 0);
    gradient.addColorStop(0, 'rgba(41, 231, 205, 0.8)');
    gradient.addColorStop(0.5, '#29E7CD');
    gradient.addColorStop(1, 'rgba(41, 231, 205, 0.8)');
    
    // Draw the line with Material Design 3 styling
    ctx.save();
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = 'rgba(41, 231, 205, 0.3)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 2;
    
    // Draw the path
    ctx.beginPath();
    meta.data.forEach((point: any, index: number) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.stroke();
    ctx.restore();
  }
};

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  materialLineDrawingPlugin
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

  // Chart.js configuration with Material Design 3 styling
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
        tension: 0.1, // Smooth curves for Material Design 3
        pointBackgroundColor: '#29E7CD',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        // Animation properties
        borderOpacity: 0, // Start invisible for animation
        pointOpacity: 0, // Start invisible for animation
        // Material Design 3 gradient fill
        backgroundColor: (context: any) => {
          const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, context.chart.height);
          gradient.addColorStop(0, 'rgba(41, 231, 205, 0.3)');
          gradient.addColorStop(0.5, 'rgba(41, 231, 205, 0.1)');
          gradient.addColorStop(1, 'rgba(41, 231, 205, 0.05)');
          return gradient;
        },
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    // Material Design 3 Animation Configuration
    animation: {
      duration: 1000, // 1 second line drawing animation
      easing: 'easeInOutQuart', // Smooth Material Design easing
      delay: (context: any) => {
        // Staggered animation for multiple datasets
        return context.type === 'data' && context.mode === 'default' ? context.dataIndex * 50 : 0;
      },
      // Line drawing animation
      onProgress: (animation: any) => {
        // This creates the path drawing effect
        const progress = animation.currentStep / animation.numSteps;
        // Update line opacity and point visibility based on progress
        if (animation.chart.data.datasets[0]) {
          animation.chart.data.datasets[0].borderOpacity = progress;
          animation.chart.data.datasets[0].pointOpacity = progress;
        }
      },
      onComplete: (animation: any) => {
        // Ensure final state is fully visible
        if (animation.chart.data.datasets[0]) {
          animation.chart.data.datasets[0].borderOpacity = 1;
          animation.chart.data.datasets[0].pointOpacity = 1;
        }
      },
    },
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
        // Material Design 3 tooltip styling
        cornerRadius: 12,
        displayColors: false,
        titleFont: {
          size: 14,
          weight: '500',
        },
        bodyFont: {
          size: 13,
        },
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(42, 42, 42, 0.5)',
          drawBorder: false,
        },
        ticks: {
          color: '#9ca3af',
          maxTicksLimit: chartData.length > 1000 ? 10 : 20,
          font: {
            size: 12,
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          color: 'rgba(42, 42, 42, 0.5)',
          drawBorder: false,
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 12,
          },
        },
        border: {
          display: false,
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
        hoverBorderColor: '#ffffff',
        hoverBorderWidth: 3,
        hoverRadius: 8,
      },
      line: {
        borderCapStyle: 'round', // Rounded line caps for Material Design 3
        borderJoinStyle: 'round', // Rounded line joins
      },
    },
    // Material Design 3 interaction configuration
    interaction: {
      intersect: false,
      mode: 'index',
    },
    // Hover effects
    hover: {
      animationDuration: 200,
    },
  };

  return (
    <div className="w-full h-96">
      <Line data={data} options={options} />
    </div>
  );
}
