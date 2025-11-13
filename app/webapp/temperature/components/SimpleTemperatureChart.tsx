'use client';

import { useCountryFormatting } from '@/hooks/useCountryFormatting';
import { useEffect, useRef } from 'react';
import {
    CartesianGrid,
    Line,
    LineChart as ReLineChart,
    ReferenceArea,
    ReferenceLine,
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
  height?: number;
}

export default function SimpleTemperatureChart({
  logs,
  equipment,
  timeFilter,
  height,
}: SimpleTemperatureChartProps) {
  const { formatDate } = useCountryFormatting();
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Debug logging with proper ref timing
  useEffect(() => {
    // Use setTimeout to ensure ref is set after render
    const timer = setTimeout(() => {
      if (chartContainerRef.current) {
        console.log('📈 SimpleTemperatureChart container dimensions:', {
          width: chartContainerRef.current.offsetWidth,
          height: chartContainerRef.current.offsetHeight,
          clientWidth: chartContainerRef.current.clientWidth,
          clientHeight: chartContainerRef.current.clientHeight,
        });
      } else {
        console.warn('⚠️ Chart container ref is still null');
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [logs.length, equipment.name, timeFilter]);

  console.log('📈 SimpleTemperatureChart rendering:', {
    logsCount: logs.length,
    equipmentName: equipment.name,
    timeFilter,
    incomingLogsFirst3: logs.slice(0, 3).map(l => ({ date: l.log_date, time: l.log_time, temp: l.temperature_celsius })),
    incomingLogsLast3: logs.slice(-3).map(l => ({ date: l.log_date, time: l.log_time, temp: l.temperature_celsius })),
    incomingOrder: logs.length > 1 ? (() => {
      const first = new Date(`${logs[0].log_date}T${logs[0].log_time}`).getTime();
      const last = new Date(`${logs[logs.length - 1].log_date}T${logs[logs.length - 1].log_time}`).getTime();
      return first > last ? 'descending (newest first)' : 'ascending (oldest first)';
    })() : 'N/A',
  });

  const chartData = logs
    .map((log, index) => {
      // Ensure proper timestamp format for date parsing
      // log_time is in "HH:MM" format, need to add seconds
      const timeWithSeconds = log.log_time.includes(':') && log.log_time.split(':').length === 2
        ? `${log.log_time}:00`
        : log.log_time;
      const timestamp = `${log.log_date}T${timeWithSeconds}`;
      const dateObj = new Date(timestamp);

      // Fallback to index if date parsing fails
      const validTimestamp = isNaN(dateObj.getTime())
        ? `${log.log_date} ${log.log_time}`
        : timestamp;

      // Ensure we have a valid date for the chart
      const chartDate = isNaN(dateObj.getTime()) ? new Date() : dateObj;

      return {
        timestamp: validTimestamp,
        temperature: log.temperature_celsius,
        date: log.log_date,
        time: log.log_time,
        index, // Add index for unique key if needed
        // Add a numeric timestamp for tooltip/display
        timeValue: chartDate.getTime(),
        // Use array index for X-axis positioning (0 = oldest, N = newest)
        // This ensures Recharts displays data in exact array order
        xIndex: 0, // Will be set after sorting
      };
    })
    .filter(item => {
      // Filter out invalid temperatures
      return typeof item.temperature === 'number' && !isNaN(item.temperature);
    })
    .sort((a, b) => {
      // Sort ascending: oldest first (left side), newest last (right side)
      // Use timeValue for sorting if available, otherwise fall back to timestamp parsing
      if (a.timeValue && b.timeValue) {
        // Ascending: smaller timestamp (older) comes first (left side)
        return a.timeValue - b.timeValue;
      }
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      // If dates are invalid, sort by index
      if (isNaN(dateA) || isNaN(dateB)) {
        return a.index - b.index;
      }
      // Ascending: older dates (smaller timestamps) first (left side)
      return dateA - dateB;
    });

  // Ensure data is in chronological order: OLDEST FIRST (left), NEWEST LAST (right)
  // chartData is sorted ascending (oldest → newest)
  // Recharts displays data left-to-right in array order
  // CRITICAL: Even if data appears sorted correctly, we need to ensure oldest is definitely first
  const finalChartData = (() => {
    if (chartData.length < 2) return chartData;

    // Find the actual oldest and newest timestamps
    const allTimes = chartData.map(d => d.timeValue || new Date(d.timestamp).getTime());
    const oldestTime = Math.min(...allTimes);
    const newestTime = Math.max(...allTimes);

    const firstTime = chartData[0].timeValue || new Date(chartData[0].timestamp).getTime();
    const lastTime = chartData[chartData.length - 1].timeValue || new Date(chartData[chartData.length - 1].timestamp).getTime();

    // Determine if we need to reverse
    // If first element is NOT the oldest, or last element is NOT the newest, reverse the array
    const needsReverse = firstTime !== oldestTime || lastTime !== newestTime;

    if (needsReverse) {
      console.warn('⚠️ Chart data needs reversal: first element is not oldest, reversing array...', {
        firstElement: { date: chartData[0].date, time: chartData[0].time, timestamp: new Date(firstTime).toISOString() },
        lastElement: { date: chartData[chartData.length - 1].date, time: chartData[chartData.length - 1].time, timestamp: new Date(lastTime).toISOString() },
        actualOldest: { timestamp: new Date(oldestTime).toISOString() },
        actualNewest: { timestamp: new Date(newestTime).toISOString() },
      });
      const reversed = [...chartData].reverse();
      return reversed.map((item, idx) => ({
        ...item,
        xIndex: idx, // Explicit index: 0 = oldest (left), N = newest (right)
      }));
    }

    // Data is correctly sorted: oldest first, newest last
    // Add xIndex to each point for explicit ordering (0 = oldest/left, N = newest/right)
    // xIndex is used as the X-axis dataKey to ensure correct display order
    const sortedData = chartData.map((item, idx) => ({
      ...item,
      xIndex: idx, // Explicit index: 0 = oldest (left), N = newest (right)
    }));

    console.log('✅ Chart data is correctly sorted: oldest → newest (left → right)', {
      oldest: { date: sortedData[0].date, time: sortedData[0].time, timestamp: new Date(oldestTime).toISOString(), xIndex: 0 },
      newest: { date: sortedData[sortedData.length - 1].date, time: sortedData[sortedData.length - 1].time, timestamp: new Date(newestTime).toISOString(), xIndex: sortedData.length - 1 },
      arrayOrder: 'First element (left) = oldest, Last element (right) = newest',
    });

    return sortedData;
  })();

  // Use index-based X-axis (0 to length-1) to ensure correct order
  // Generate evenly spaced ticks based on array indices
  const generateXAxisTicks = () => {
    if (finalChartData.length === 0) return [];
    // For small datasets, show all points; for larger datasets, show up to 7 ticks
    const tickCount = finalChartData.length <= 7
      ? finalChartData.length
      : Math.min(7, Math.max(3, Math.floor(finalChartData.length / 5)));

    if (tickCount === finalChartData.length) {
      // Show all points
      return finalChartData.map((_, idx) => idx);
    }

    const tickInterval = (finalChartData.length - 1) / (tickCount - 1);
    const ticks: number[] = [];
    for (let i = 0; i < tickCount; i++) {
      const tickIndex = Math.round(tickInterval * i);
      // Ensure we don't exceed array bounds
      ticks.push(Math.min(tickIndex, finalChartData.length - 1));
    }
    // Ensure last tick is the last index
    if (ticks.length > 0 && ticks[ticks.length - 1] !== finalChartData.length - 1) {
      ticks[ticks.length - 1] = finalChartData.length - 1;
    }
    // Remove duplicates while preserving order
    return Array.from(new Set(ticks));
  };
  const xAxisTicks = finalChartData.length > 0 ? generateXAxisTicks() : undefined;
  const xAxisDomain = finalChartData.length > 0 ? [0, finalChartData.length - 1] : undefined;

  // Calculate Y-axis domain to include both data and equipment thresholds
  const dataMin = finalChartData.length > 0 ? Math.min(...finalChartData.map(d => d.temperature)) : null;
  const dataMax = finalChartData.length > 0 ? Math.max(...finalChartData.map(d => d.temperature)) : null;

  // Determine Y-axis bounds including equipment thresholds
  let yAxisMin: number | string = 'dataMin - 1';
  let yAxisMax: number | string = 'dataMax + 1';

  if (dataMin !== null && dataMax !== null) {
    const minWithThreshold = equipment.min_temp_celsius !== null
      ? Math.min(dataMin, equipment.min_temp_celsius)
      : dataMin;
    const maxWithThreshold = equipment.max_temp_celsius !== null
      ? Math.max(dataMax, equipment.max_temp_celsius)
      : dataMax;

    // Add padding to ensure thresholds are visible
    const padding = Math.max(1, (maxWithThreshold - minWithThreshold) * 0.1);
    yAxisMin = minWithThreshold - padding;
    yAxisMax = maxWithThreshold + padding;
  }

  console.log('📈 Chart data prepared:', {
    chartDataLength: finalChartData.length,
    firstDataPoint: finalChartData[0] ? { timestamp: finalChartData[0].timestamp, date: finalChartData[0].date, time: finalChartData[0].time, temperature: finalChartData[0].temperature } : null,
    lastDataPoint: finalChartData.length > 0 ? { timestamp: finalChartData[finalChartData.length - 1].timestamp, date: finalChartData[finalChartData.length - 1].date, time: finalChartData[finalChartData.length - 1].time, temperature: finalChartData[finalChartData.length - 1].temperature } : null,
    hasValidData: finalChartData.length > 0,
    dataRange: dataMin !== null && dataMax !== null ? {
      min: dataMin,
      max: dataMax,
    } : null,
    equipmentThresholds: {
      min: equipment.min_temp_celsius,
      max: equipment.max_temp_celsius,
    },
    yAxisDomain: [yAxisMin, yAxisMax],
    sortOrder: 'oldest first (left) → newest last (right)',
    displayOrder: 'X-axis should show: ' + (finalChartData[0] ? finalChartData[0].date + ' ' + finalChartData[0].time : 'N/A') + ' (left) → ' + (finalChartData.length > 0 ? finalChartData[finalChartData.length - 1].date + ' ' + finalChartData[finalChartData.length - 1].time : 'N/A') + ' (right)',
  });

  // Additional validation
  if (finalChartData.length > 0) {
    const invalidTemps = finalChartData.filter(d => typeof d.temperature !== 'number' || isNaN(d.temperature));
    if (invalidTemps.length > 0) {
      console.warn('⚠️ Invalid temperatures found:', invalidTemps);
    }
    const invalidTimestamps = finalChartData.filter(d => {
      const date = new Date(d.timestamp);
      return isNaN(date.getTime());
    });
    if (invalidTimestamps.length > 0) {
      console.warn('⚠️ Invalid timestamps found:', invalidTimestamps.slice(0, 3));
    }
  }

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

  // Check if all data points are from the same day
  const allSameDay = (() => {
    if (finalChartData.length < 2) return true;
    const firstDate = new Date(finalChartData[0].timeValue);
    const lastDate = new Date(finalChartData[finalChartData.length - 1].timeValue);
    return (
      firstDate.getDate() === lastDate.getDate() &&
      firstDate.getMonth() === lastDate.getMonth() &&
      firstDate.getFullYear() === lastDate.getFullYear()
    );
  })();

  const formatXAxisLabel = (tickItem: number | string) => {
    try {
      // tickItem is the array index (0, 1, 2, ...)
      const index = typeof tickItem === 'number' ? Math.round(tickItem) : parseInt(tickItem as string, 10);

      if (isNaN(index) || index < 0 || index >= finalChartData.length) {
        return String(tickItem);
      }

      // Get the actual data point at this index
      const dataPoint = finalChartData[index];
      if (!dataPoint) {
        return String(tickItem);
      }

      // Use the timestamp from the data point - try timeValue first, then parse timestamp
      let date: Date;
      if (dataPoint.timeValue && !isNaN(dataPoint.timeValue)) {
        date = new Date(dataPoint.timeValue);
      } else {
        // Parse the timestamp string
        const timeWithSeconds = dataPoint.time.includes(':') && dataPoint.time.split(':').length === 2
          ? `${dataPoint.time}:00`
          : dataPoint.time;
        date = new Date(`${dataPoint.date}T${timeWithSeconds}`);
      }

      if (isNaN(date.getTime())) {
        // Fallback to showing the time string directly
        return dataPoint.time || String(tickItem);
      }

      // If all data is from the same day, show time; otherwise show date
      if (timeFilter === '24h' || allSameDay) {
        return (
          date.getHours().toString().padStart(2, '0') +
          ':' +
          date.getMinutes().toString().padStart(2, '0')
        );
      } else {
        // Use regional date formatting for x-axis
        const day = date.getDate();
        const month = date.toLocaleDateString('en-AU', { month: 'short' });
        return `${day} ${month}`;
      }
    } catch (error) {
      console.error('Error formatting X axis label:', error, tickItem);
      return String(tickItem);
    }
  };

  const formatTooltipLabel = (label: number | string, payload?: any) => {
    try {
      // When using xIndex, Recharts passes the xIndex value to the tooltip
      // We need to look up the actual data point to get the timestamp
      let index: number;
      if (typeof label === 'number') {
        index = Math.round(label);
      } else {
        index = parseInt(label as string, 10);
      }

      // If we have a payload with the actual data point, use it
      if (payload && payload.length > 0 && payload[0].payload) {
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

      // Fallback: use index to look up data point
      if (!isNaN(index) && index >= 0 && index < finalChartData.length) {
        const dataPoint = finalChartData[index];
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
    } catch (error) {
      console.error('Error formatting tooltip label:', error, label);
      return String(label);
    }
  };

  const formatTooltipValue = (value: number) => {
    return `${value?.toFixed(1)}°C`;
  };

  if (!finalChartData || finalChartData.length === 0) {
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
    <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-lg sm:p-6">
      <div
        ref={chartContainerRef}
        className="relative w-full"
        style={{
          height: height ? `${height}px` : '200px',
          minHeight: height ? `${height}px` : '200px',
          maxHeight: height ? `${height}px` : '300px'
        }}
      >
        {finalChartData.length > 0 ? (
          <div className="temperature-chart-container h-full w-full" style={{ position: 'relative', overflow: 'visible' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ReLineChart
                data={finalChartData}
                margin={{ top: 10, right: 20, left: 10, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" opacity={0.5} />
                <XAxis
                  dataKey="xIndex"
                  type="number"
                  domain={xAxisDomain}
                  ticks={xAxisTicks}
                  tickFormatter={formatXAxisLabel}
                  stroke="#ffffff"
                  style={{ fontSize: '12px' }}
                  tick={{ fill: '#ffffff' }}
                  scale="linear"
                />
                <YAxis
                  domain={[yAxisMin, yAxisMax]}
                  stroke="#ffffff"
                  tickFormatter={(v: number | string) => {
                    const num = typeof v === 'number' ? v : parseFloat(String(v));
                    return isNaN(num) ? String(v) : `${num.toFixed(1)}°`;
                  }}
                  style={{ fontSize: '12px' }}
                  tick={{ fill: '#ffffff' }}
                />
                <Tooltip
                  labelFormatter={formatTooltipLabel}
                  formatter={(value: any) => [formatTooltipValue(value as number), 'Temp']}
                  contentStyle={{
                    backgroundColor: '#1f1f1f',
                    border: '1px solid #2a2a2a',
                    color: '#fff',
                    borderRadius: '8px',
                  }}
                />
                {/* Danger zones - temperatures outside safe range */}
                {equipment.min_temp_celsius !== null && equipment.max_temp_celsius !== null && (
                  <>
                    {/* Danger zone below minimum (if Y-axis extends below min) */}
                    {typeof yAxisMin === 'number' && yAxisMin < equipment.min_temp_celsius && (
                      <ReferenceArea
                        y1={yAxisMin}
                        y2={equipment.min_temp_celsius}
                        fill="#ef4444"
                        fillOpacity={0.1}
                        stroke="#ef4444"
                        strokeDasharray="3 3"
                        strokeOpacity={0.3}
                        ifOverflow="extendDomain"
                      />
                    )}
                    {/* Safe temperature range */}
                    <ReferenceArea
                      y1={Math.min(equipment.min_temp_celsius, equipment.max_temp_celsius)}
                      y2={Math.max(equipment.min_temp_celsius, equipment.max_temp_celsius)}
                      fill="#29E7CD"
                      fillOpacity={0.15}
                      stroke="#29E7CD"
                      strokeDasharray="5 5"
                      strokeOpacity={0.4}
                      ifOverflow="extendDomain"
                    />
                    {/* Danger zone above maximum (if Y-axis extends above max) */}
                    {typeof yAxisMax === 'number' && yAxisMax > equipment.max_temp_celsius && (
                      <ReferenceArea
                        y1={equipment.max_temp_celsius}
                        y2={yAxisMax}
                        fill="#ef4444"
                        fillOpacity={0.1}
                        stroke="#ef4444"
                        strokeDasharray="3 3"
                        strokeOpacity={0.3}
                        ifOverflow="extendDomain"
                      />
                    )}
                  </>
                )}
                {/* Danger zone for single threshold (min only) */}
                {equipment.min_temp_celsius !== null && equipment.max_temp_celsius === null && (
                  <>
                    {/* Danger zone below minimum */}
                    {typeof yAxisMin === 'number' && yAxisMin < equipment.min_temp_celsius && (
                      <ReferenceArea
                        y1={yAxisMin}
                        y2={equipment.min_temp_celsius}
                        fill="#ef4444"
                        fillOpacity={0.1}
                        stroke="#ef4444"
                        strokeDasharray="3 3"
                        strokeOpacity={0.3}
                        ifOverflow="extendDomain"
                      />
                    )}
                    {/* Safe zone above minimum */}
                    {typeof yAxisMax === 'number' && yAxisMax > equipment.min_temp_celsius && (
                      <ReferenceArea
                        y1={equipment.min_temp_celsius}
                        y2={yAxisMax}
                        fill="#29E7CD"
                        fillOpacity={0.15}
                        stroke="#29E7CD"
                        strokeDasharray="5 5"
                        strokeOpacity={0.4}
                        ifOverflow="extendDomain"
                      />
                    )}
                  </>
                )}
                {/* Reference lines for min/max thresholds */}
                {equipment.min_temp_celsius !== null && (
                  <ReferenceLine
                    y={equipment.min_temp_celsius}
                    stroke="#29E7CD"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    strokeOpacity={0.7}
                    label={{
                      value: `Min: ${equipment.min_temp_celsius}°C`,
                      position: 'right',
                      fill: '#29E7CD',
                      fontSize: 11,
                      fontWeight: 'bold',
                    }}
                    ifOverflow="extendDomain"
                  />
                )}
                {equipment.max_temp_celsius !== null && (
                  <ReferenceLine
                    y={equipment.max_temp_celsius}
                    stroke="#29E7CD"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    strokeOpacity={0.7}
                    label={{
                      value: `Max: ${equipment.max_temp_celsius}°C`,
                      position: 'right',
                      fill: '#29E7CD',
                      fontSize: 11,
                      fontWeight: 'bold',
                    }}
                    ifOverflow="extendDomain"
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#29E7CD"
                  strokeWidth={3}
                  dot={{ fill: '#29E7CD', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#29E7CD' }}
                  isAnimationActive={true}
                />
              </ReLineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            No chart data available
          </div>
        )}
      </div>
    </div>
  );
}
