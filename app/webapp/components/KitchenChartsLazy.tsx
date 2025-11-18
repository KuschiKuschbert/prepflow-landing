'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface PerformanceSummary {
  topSellers: Array<{
    id: string;
    name: string;
    number_sold: number;
  }>;
}

interface KitchenChartsLazyProps {
  performanceData: PerformanceSummary | null;
  temperatureChecks: Array<{ date: string; count: number }>;
}

const COLORS = {
  primary: '#29E7CD',
  secondary: '#3B82F6',
  accent: '#D925C7',
  warning: '#F59E0B',
  success: '#10B981',
  danger: '#EF4444',
};

export default function KitchenChartsLazy({
  performanceData,
  temperatureChecks,
}: KitchenChartsLazyProps) {
  // Prepare chart data
  const topDishesData =
    performanceData?.topSellers.slice(0, 5).map((item, index) => ({
      name: item.name.length > 15 ? `${item.name.substring(0, 15)}...` : item.name,
      fullName: item.name,
      value: item.number_sold,
      color: index === 0 ? COLORS.primary : index === 1 ? COLORS.secondary : COLORS.accent,
    })) || [];

  const temperatureData =
    temperatureChecks.length > 0
      ? temperatureChecks.map(item => ({
          date: new Date(item.date).toLocaleDateString('en-AU', { month: 'short', day: 'numeric' }),
          count: item.count,
        }))
      : [];

  const hasData = topDishesData.length > 0 || temperatureData.length > 0;

  if (!hasData) {
    return null;
  }

  return (
    <div className="tablet:mb-8 tablet:block tablet:rounded-3xl tablet:p-6 mb-6 hidden rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-lg">
      <div className="tablet:mb-6 mb-4">
        <h2 className="text-fluid-lg tablet:text-fluid-xl font-semibold text-white">
          Kitchen Insights
        </h2>
        <p className="text-fluid-xs tablet:text-fluid-sm mt-1 text-gray-400">
          Visual data for operational decisions
        </p>
      </div>

      <div className="desktop:grid-cols-2 grid grid-cols-1 gap-4">
        {/* Top 5 Selling Dishes */}
        {topDishesData.length > 0 && (
          <div className="tablet:rounded-2xl tablet:p-4 rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-3">
            <h3 className="text-fluid-sm tablet:text-fluid-base mb-3 font-medium text-white">
              Top 5 Selling Dishes (Last 7 Days)
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topDishesData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" opacity={0.5} />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  stroke="#ffffff"
                  tick={{ fill: '#ffffff', fontSize: 10 }}
                />
                <YAxis stroke="#ffffff" tick={{ fill: '#ffffff', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f1f1f',
                    border: '1px solid #2a2a2a',
                    color: '#fff',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number, name: string, props: any) => [
                    `${value} sold`,
                    props.payload.fullName,
                  ]}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {topDishesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Temperature Compliance */}
        {temperatureData.length > 0 && (
          <div className="tablet:rounded-2xl tablet:p-4 rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-3">
            <h3 className="text-fluid-sm tablet:text-fluid-base mb-3 font-medium text-white">
              Temperature Checks (Last 7 Days)
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart
                data={temperatureData}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" opacity={0.5} />
                <XAxis dataKey="date" stroke="#ffffff" tick={{ fill: '#ffffff', fontSize: 10 }} />
                <YAxis stroke="#ffffff" tick={{ fill: '#ffffff', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f1f1f',
                    border: '1px solid #2a2a2a',
                    color: '#fff',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`${value} checks`, 'Temperature']}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke={COLORS.primary}
                  strokeWidth={2}
                  dot={{ fill: COLORS.primary, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
