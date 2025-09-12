'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { PerformanceItem } from '../types';

interface PerformanceChartsProps {
  performanceItems: PerformanceItem[];
}

export default function PerformanceCharts({ performanceItems }: PerformanceChartsProps) {
  const chartData = [
    {
      name: 'Chef\'s Kiss',
      profit: performanceItems.filter(item => item.menu_item_class === 'Chef\'s Kiss').reduce((acc, item) => acc + item.gross_profit_percentage, 0) / Math.max(1, performanceItems.filter(item => item.menu_item_class === 'Chef\'s Kiss').length)
    },
    {
      name: 'Hidden Gem',
      profit: performanceItems.filter(item => item.menu_item_class === 'Hidden Gem').reduce((acc, item) => acc + item.gross_profit_percentage, 0) / Math.max(1, performanceItems.filter(item => item.menu_item_class === 'Hidden Gem').length)
    },
    {
      name: 'Bargain Bucket',
      profit: performanceItems.filter(item => item.menu_item_class === 'Bargain Bucket').reduce((acc, item) => acc + item.gross_profit_percentage, 0) / Math.max(1, performanceItems.filter(item => item.menu_item_class === 'Bargain Bucket').length)
    },
    {
      name: 'Burnt Toast',
      profit: performanceItems.filter(item => item.menu_item_class === 'Burnt Toast').reduce((acc, item) => acc + item.gross_profit_percentage, 0) / Math.max(1, performanceItems.filter(item => item.menu_item_class === 'Burnt Toast').length)
    }
  ];

  const pieData = [
    { name: 'Chef\'s Kiss', value: performanceItems.filter(item => item.menu_item_class === 'Chef\'s Kiss').length, color: '#22c55e' },
    { name: 'Hidden Gem', value: performanceItems.filter(item => item.menu_item_class === 'Hidden Gem').length, color: '#3b82f6' },
    { name: 'Bargain Bucket', value: performanceItems.filter(item => item.menu_item_class === 'Bargain Bucket').length, color: '#f97316' },
    { name: 'Burnt Toast', value: performanceItems.filter(item => item.menu_item_class === 'Burnt Toast').length, color: '#ef4444' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Bar Chart - Profit by Category */}
      <div className="bg-[#1f1f1f] rounded-2xl border border-[#2a2a2a] p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Profit by Category</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis 
                dataKey="name" 
                stroke="#9ca3af"
                fontSize={12}
                tick={{ fill: '#9ca3af' }}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={12}
                tick={{ fill: '#9ca3af' }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(31, 31, 31, 0.95)',
                  border: '1px solid #29E7CD',
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
                labelStyle={{ color: '#ffffff' }}
                formatter={(value: any) => [`${value.toFixed(1)}%`, 'Average Profit']}
              />
              <Bar 
                dataKey="profit" 
                fill="#29E7CD"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart - Category Distribution */}
      <div className="bg-[#1f1f1f] rounded-2xl border border-[#2a2a2a] p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Category Distribution</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(31, 31, 31, 0.95)',
                  border: '1px solid #29E7CD',
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
                labelStyle={{ color: '#ffffff' }}
              />
              <Legend 
                wrapperStyle={{ color: '#ffffff' }}
                verticalAlign="bottom"
                height={36}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
