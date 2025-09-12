'use client';

import { PerformanceItem } from '../types';

interface PerformanceTableProps {
  performanceItems: PerformanceItem[];
}

export default function PerformanceTable({ performanceItems }: PerformanceTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="bg-[#1f1f1f] rounded-2xl border border-[#2a2a2a] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                Dish
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                Number Sold
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                Popularity %
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                Total Revenue ex GST
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                Total Cost
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                Total Profit ex GST
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                Gross Profit %
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                Profit Cat
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                Popularity Cat
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                Menu Item Class
              </th>
            </tr>
          </thead>
          <tbody>
            {performanceItems.map((item, index) => (
              <tr key={item.id} className="border-t border-[#2a2a2a] hover:bg-[#2a2a2a]/20 transition-colors">
                <td className="px-4 py-3 text-white font-medium">
                  {item.name}
                </td>
                <td className="px-4 py-3 text-gray-300 text-center">
                  {item.number_sold}
                </td>
                <td className="px-4 py-3 text-gray-300 text-center">
                  {item.popularity_percentage.toFixed(2)}%
                </td>
                <td className="px-4 py-3 text-gray-300 text-center">
                  {formatCurrency((item.selling_price * item.number_sold) / 1.1)}
                </td>
                <td className="px-4 py-3 text-gray-300 text-center">
                  {formatCurrency(item.food_cost * item.number_sold)}
                </td>
                <td className="px-4 py-3 text-gray-300 text-center">
                  {formatCurrency(item.gross_profit * item.number_sold)}
                </td>
                <td className="px-4 py-3 text-gray-300 text-center">
                  {formatPercentage(item.gross_profit_percentage)}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.profit_category === 'High' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {item.profit_category}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.popularity_category === 'High' 
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                      : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  }`}>
                    {item.popularity_category}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.menu_item_class === 'Chef\'s Kiss' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    item.menu_item_class === 'Hidden Gem' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    item.menu_item_class === 'Bargain Bucket' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                    'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {item.menu_item_class}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
