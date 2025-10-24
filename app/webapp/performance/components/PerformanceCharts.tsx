'use client';

import { useState, useEffect } from 'react';
import { BarChart, PieChart } from '@/components/ui/LightweightChart';
import { PerformanceItem } from '../types';

interface PerformanceChartsProps {
  performanceItems: PerformanceItem[];
}

export default function PerformanceCharts({ performanceItems }: PerformanceChartsProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  const chartData = [
    {
      name: 'Chef\'s Kiss',
      value: performanceItems.filter(item => item.menu_item_class === 'Chef\'s Kiss').reduce((acc, item) => acc + item.gross_profit_percentage, 0) / Math.max(1, performanceItems.filter(item => item.menu_item_class === 'Chef\'s Kiss').length),
      color: '#22c55e'
    },
    {
      name: 'Hidden Gem',
      value: performanceItems.filter(item => item.menu_item_class === 'Hidden Gem').reduce((acc, item) => acc + item.gross_profit_percentage, 0) / Math.max(1, performanceItems.filter(item => item.menu_item_class === 'Hidden Gem').length),
      color: '#3b82f6'
    },
    {
      name: 'Bargain Bucket',
      value: performanceItems.filter(item => item.menu_item_class === 'Bargain Bucket').reduce((acc, item) => acc + item.gross_profit_percentage, 0) / Math.max(1, performanceItems.filter(item => item.menu_item_class === 'Bargain Bucket').length),
      color: '#f97316'
    },
    {
      name: 'Burnt Toast',
      value: performanceItems.filter(item => item.menu_item_class === 'Burnt Toast').reduce((acc, item) => acc + item.gross_profit_percentage, 0) / Math.max(1, performanceItems.filter(item => item.menu_item_class === 'Burnt Toast').length),
      color: '#ef4444'
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
      <div>
        <h3 className="text-lg md:text-xl font-semibold text-white mb-4">Profit by Category</h3>
        <BarChart 
          data={chartData} 
          height={isMobile ? 250 : 300}
          showValues={true}
          className="w-full"
        />
      </div>

      {/* Pie Chart - Category Distribution */}
      <div>
        <h3 className="text-lg md:text-xl font-semibold text-white mb-4">Category Distribution</h3>
        <PieChart 
          data={pieData} 
          size={isMobile ? 180 : 220}
          showLabels={true}
          className="w-full"
        />
      </div>
    </div>
  );
}
