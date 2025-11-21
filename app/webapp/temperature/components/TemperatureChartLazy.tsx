'use client';

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
import { TemperatureEquipment } from '../types';

interface ChartDataPoint {
  timestamp: string;
  temperature: number;
  date: string;
  time: string;
  timeValue: number;
  xIndex: number;
}

interface TemperatureChartContentProps {
  chartData: ChartDataPoint[];
  equipment: TemperatureEquipment;
  yAxisMin: number | string;
  yAxisMax: number | string;
  xAxisDomain: [number, number];
  xAxisTicks: number[];
  formatXAxisLabel: (tickItem: number | string) => string;
  formatTooltipLabel: (label: number | string) => string;
  formatTooltipValue: (value: number) => string;
}

export default function TemperatureChartLazy({
  chartData,
  equipment,
  yAxisMin,
  yAxisMax,
  xAxisDomain,
  xAxisTicks,
  formatXAxisLabel,
  formatTooltipLabel,
  formatTooltipValue,
}: TemperatureChartContentProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ReLineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>
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
        {equipment.min_temp_celsius !== null && equipment.max_temp_celsius !== null && (
          <>
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
            <ReferenceArea
              y1={Math.min(equipment.min_temp_celsius, equipment.max_temp_celsius)}
              y2={Math.max(equipment.min_temp_celsius, equipment.max_temp_celsius)}
              fill="#29E7CD"
              fillOpacity={0.2}
              stroke="#29E7CD"
              strokeDasharray="5 5"
              strokeOpacity={0.5}
              strokeWidth={1}
              ifOverflow="extendDomain"
            />
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
        {equipment.min_temp_celsius !== null && equipment.max_temp_celsius === null && (
          <>
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
        {equipment.min_temp_celsius !== null && (
          <ReferenceLine
            y={equipment.min_temp_celsius}
            stroke="#29E7CD"
            strokeWidth={3}
            strokeDasharray="6 4"
            strokeOpacity={0.9}
            label={{
              value: `Min: ${equipment.min_temp_celsius}°C`,
              position: 'right',
              fill: '#29E7CD',
              fontSize: 12,
              fontWeight: 'bold',
              offset: 10,
            }}
            ifOverflow="extendDomain"
          />
        )}
        {equipment.max_temp_celsius !== null && (
          <ReferenceLine
            y={equipment.max_temp_celsius}
            stroke="#29E7CD"
            strokeWidth={3}
            strokeDasharray="6 4"
            strokeOpacity={0.9}
            label={{
              value: `Max: ${equipment.max_temp_celsius}°C`,
              position: 'right',
              fill: '#29E7CD',
              fontSize: 12,
              fontWeight: 'bold',
              offset: 10,
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
  );
}
