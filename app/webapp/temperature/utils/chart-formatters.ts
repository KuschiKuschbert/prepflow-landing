'use client';

import { useCountryFormatting } from '@/hooks/useCountryFormatting';
import { useMemo } from 'react';

interface ChartDataPoint {
  timestamp: string;
  date: string;
  time: string;
  timeValue: number;
  xIndex: number;
}

type TooltipPayload = Array<{ payload?: ChartDataPoint }>;

export function useChartFormatters(
  chartData: ChartDataPoint[],
  timeFilter: '24h' | '7d' | '30d' | 'all',
) {
  const { formatDate } = useCountryFormatting();

  const allSameDay = useMemo(() => {
    if (chartData.length < 2) return true;
    const firstDate = new Date(chartData[0].timeValue);
    const lastDate = new Date(chartData[chartData.length - 1].timeValue);
    return (
      firstDate.getDate() === lastDate.getDate() &&
      firstDate.getMonth() === lastDate.getMonth() &&
      firstDate.getFullYear() === lastDate.getFullYear()
    );
  }, [chartData]);

  const formatXAxisLabel = (tickItem: number | string) => {
    try {
      const index =
        typeof tickItem === 'number' ? Math.round(tickItem) : parseInt(tickItem as string, 10);
      if (isNaN(index) || index < 0 || index >= chartData.length) return String(tickItem);

      const dataPoint = chartData[index];
      if (!dataPoint) return String(tickItem);

      let date: Date;
      if (dataPoint.timeValue && !isNaN(dataPoint.timeValue)) {
        date = new Date(dataPoint.timeValue);
      } else {
        const timeWithSeconds =
          dataPoint.time.includes(':') && dataPoint.time.split(':').length === 2
            ? `${dataPoint.time}:00`
            : dataPoint.time;
        date = new Date(`${dataPoint.date}T${timeWithSeconds}`);
      }

      if (isNaN(date.getTime())) return dataPoint.time || String(tickItem);

      if (timeFilter === '24h' || allSameDay) {
        return (
          date.getHours().toString().padStart(2, '0') +
          ':' +
          date.getMinutes().toString().padStart(2, '0')
        );
      } else {
        const day = date.getDate();
        const month = date.toLocaleDateString('en-AU', { month: 'short' });
        return `${day} ${month}`;
      }
    } catch {
      return String(tickItem);
    }
  };

  const formatTooltipLabel = (label: number | string, payload?: TooltipPayload) => {
    try {
      let index: number;
      if (typeof label === 'number') {
        index = Math.round(label);
      } else {
        index = parseInt(label as string, 10);
      }

      if (payload && payload.length > 0 && payload[0]?.payload) {
        const dataPoint = payload[0].payload;
        if (dataPoint.timeValue) {
          const date = new Date(dataPoint.timeValue);
          if (!isNaN(date.getTime())) {
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const formattedDate = formatDate(date);
            return `${formattedDate}, ${hours}:${minutes}`;
          }
        }
      }

      if (!isNaN(index) && index >= 0 && index < chartData.length) {
        const dataPoint = chartData[index];
        if (dataPoint && dataPoint.timeValue) {
          const date = new Date(dataPoint.timeValue);
          if (!isNaN(date.getTime())) {
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const formattedDate = formatDate(date);
            return `${formattedDate}, ${hours}:${minutes}`;
          }
        }
      }

      return String(label);
    } catch {
      return String(label);
    }
  };

  const formatTooltipValue = (value: number) => `${value?.toFixed(1)}°C`;

  return { formatXAxisLabel, formatTooltipLabel, formatTooltipValue };
}
