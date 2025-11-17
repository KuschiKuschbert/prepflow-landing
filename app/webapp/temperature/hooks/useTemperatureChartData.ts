'use client';

import { useMemo } from 'react';
import { TemperatureEquipment, TemperatureLog } from '../types';

interface ChartDataPoint {
  timestamp: string;
  temperature: number;
  date: string;
  time: string;
  index: number;
  timeValue: number;
  xIndex: number;
}

export function useTemperatureChartData(logs: TemperatureLog[], equipment: TemperatureEquipment) {
  const chartData = useMemo(() => {
    return logs
      .map((log, index) => {
        const timeWithSeconds =
          log.log_time.includes(':') && log.log_time.split(':').length === 2
            ? `${log.log_time}:00`
            : log.log_time;
        const timestamp = `${log.log_date}T${timeWithSeconds}`;
        const dateObj = new Date(timestamp);
        const validTimestamp = isNaN(dateObj.getTime())
          ? `${log.log_date} ${log.log_time}`
          : timestamp;
        const chartDate = isNaN(dateObj.getTime()) ? new Date() : dateObj;

        return {
          timestamp: validTimestamp,
          temperature: log.temperature_celsius,
          date: log.log_date,
          time: log.log_time,
          index,
          timeValue: chartDate.getTime(),
          xIndex: 0,
        };
      })
      .filter(item => typeof item.temperature === 'number' && !isNaN(item.temperature))
      .sort((a, b) => {
        const timeA = a.timeValue || new Date(a.timestamp).getTime();
        const timeB = b.timeValue || new Date(b.timestamp).getTime();
        return timeA - timeB;
      })
      .map((item, index) => ({ ...item, xIndex: index }));
  }, [logs]);

  return chartData;
}

