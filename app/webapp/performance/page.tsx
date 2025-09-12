'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { PageSkeleton, LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

// Direct imports to eliminate skeleton flashes
import { BarChart, PieChart, Bar, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MenuDish {
  id: string;
  name: string;
  selling_price: number;
  profit_margin: number;
  popularity_score: number;
  food_cost: number;
  gross_profit: number;
  gross_profit_percentage: number;
}

interface PerformanceItem extends MenuDish {
  number_sold: number;
  popularity_percentage: number;
  profit_category: 'High' | 'Low';
  popularity_category: 'High' | 'Low';
  menu_item_class: 'Chef\'s Kiss' | 'Hidden Gem' | 'Bargain Bucket' | 'Burnt Toast';
}

export default function PerformancePage() {
  const { t } = useTranslation();
  const [performanceItems, setPerformanceItems] = useState<PerformanceItem[]>([]);
  const [loading, setLoading] = useState(false); // Start with false to prevent skeleton flash
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('gross_profit_percentage');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showImportModal, setShowImportModal] = useState(false);
  const [csvData, setCsvData] = useState<string>('');
  const [importing, setImporting] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [realtimeEnabled, setRealtimeEnabled] = useState(false);
  const [performanceScore, setPerformanceScore] = useState(85);
  const [performanceAlerts, setPerformanceAlerts] = useState<any[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const realtimeSubscription = useRef<any>(null);

  // Fetch dishes and sales data
  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/performance');
      const result = await response.json();
      
      if (result.success) {
        setPerformanceItems(result.data);
        setMetadata(result.metadata);
      } else {
        setError(result.message || 'Failed to fetch performance data');
      }
    } catch (err) {
      setError('Error fetching performance data');
      // Handle fetch error gracefully
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!csvData.trim()) return;
    
    setImporting(true);
    try {
      const lines = csvData.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const row: any = {};
        
        headers.forEach((header, index) => {
          row[header.toLowerCase().replace(/\s+/g, '_')] = values[index];
        });
        
        // Find matching dish by name
        const dish = performanceItems.find(d => 
          d.name.toLowerCase() === row.dish?.toLowerCase()
        );
        
        if (dish && row.number_sold && row.popularity_percentage) {
          await fetch('/api/performance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              dish_id: dish.id,
              number_sold: parseInt(row.number_sold),
              popularity_percentage: parseFloat(row.popularity_percentage),
              date: new Date().toISOString().split('T')[0]
            })
          });
        }
      }
      
      setShowImportModal(false);
      setCsvData('');
      fetchPerformanceData(); // Refresh data
    } catch (err) {
      // Handle import error gracefully
    } finally {
      setImporting(false);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Dish', 
      'Number Sold', 
      'Popularity %', 
      'Total Revenue ex GST', 
      'Total Cost', 
      'Total Profit ex GST', 
      'Gross Profit %', 
      'Profit Cat', 
      'Popularity Cat', 
      'Menu Item Class'
    ];
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedItems.map(item => [
        item.name,
        item.number_sold,
        item.popularity_percentage.toFixed(2),
        ((item.selling_price * item.number_sold) / 1.1).toFixed(2),
        (item.food_cost * item.number_sold).toFixed(2),
        (item.gross_profit * item.number_sold).toFixed(2),
        item.gross_profit_percentage.toFixed(2),
        item.profit_category,
        item.popularity_category,
        item.menu_item_class
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'performance-analysis.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredAndSortedItems = useMemo(() => {
    let filtered = performanceItems;

    if (filterCategory !== 'all') {
      filtered = filtered.filter(item => item.profit_category === filterCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.profit_category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.popularity_category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return [...filtered].sort((a, b) => {
      let valA: any;
      let valB: any;

      switch (sortBy) {
        case 'name':
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
          break;
        case 'number_sold':
          valA = a.number_sold;
          valB = b.number_sold;
          break;
        case 'popularity_percentage':
          valA = a.popularity_percentage;
          valB = b.popularity_percentage;
          break;
        case 'gross_profit_percentage':
        default:
          valA = a.gross_profit_percentage;
          valB = b.gross_profit_percentage;
          break;
      }

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });
  }, [performanceItems, filterCategory, searchTerm, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);
  const paginatedItems = filteredAndSortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Chef\'s Kiss':
        return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'Hidden Gem':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'Bargain Bucket':
        return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
      case 'Burnt Toast':
        return 'bg-red-500/20 text-red-400 border border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  const formatPercentage = (percentage: number) => `${percentage.toFixed(2)}%`;

  // Mock realtime subscription setup
  const setupRealtimeSubscription = () => {
    // Mock implementation for now
    setLastUpdate(new Date());
  };

  if (loading) {
    return <PageSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-400 mb-2">Error</h2>
            <p className="text-red-300">{error}</p>
            <button
              onClick={fetchPerformanceData}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Performance Score and Real-time Status */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Performance Analysis
              </h1>
              <p className="text-gray-300 text-lg">
                Analyze your menu performance and profitability
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-400">Performance Score</div>
                <div className={`text-2xl font-bold ${
                  performanceScore >= 90 ? 'text-green-400' :
                  performanceScore >= 70 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {performanceScore}/100
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  realtimeEnabled ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                }`}></div>
                <span className="text-sm text-gray-300">
                  {realtimeEnabled ? 'Live' : 'Offline'}
                </span>
              </div>
              {lastUpdate && (
                <div className="text-right">
                  <div className="text-xs text-gray-400">Last Update</div>
                  <div className="text-xs text-gray-300">
                    {lastUpdate.toLocaleTimeString()}
                  </div>
                </div>
              )}
            </div>
          </div>
          {performanceAlerts.length > 0 && (
            <div className="mb-4 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                <span className="text-yellow-400 font-medium">Performance Alerts</span>
              </div>
              <div className="space-y-1">
                {performanceAlerts.slice(-3).map((alert) => (
                  <div key={alert.id} className="text-sm text-yellow-300">
                    {alert.message}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

         {/* Dynamic Thresholds Display */}
         {metadata && (
           <div className="bg-[#1f1f1f] rounded-2xl border border-[#2a2a2a] p-6 mb-8">
             <h3 className="text-xl font-semibold text-white mb-4">PrepFlow COGS Dynamic Methodology</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <div className="text-center">
                 <div className="text-sm text-gray-400 mb-1">Methodology</div>
                 <div className="text-lg font-semibold text-[#29E7CD]">{metadata.methodology}</div>
               </div>
               <div className="text-center">
                 <div className="text-sm text-gray-400 mb-1">Average Profit Margin</div>
                 <div className="text-lg font-semibold text-white">{metadata.averageProfitMargin?.toFixed(1)}%</div>
               </div>
               <div className="text-center">
                 <div className="text-sm text-gray-400 mb-1">Average Popularity</div>
                 <div className="text-lg font-semibold text-white">{metadata.averagePopularity?.toFixed(1)}%</div>
               </div>
               <div className="text-center">
                 <div className="text-sm text-gray-400 mb-1">Popularity Threshold</div>
                 <div className="text-lg font-semibold text-[#D925C7]">{metadata.popularityThreshold?.toFixed(1)}%</div>
               </div>
             </div>
             <div className="mt-4 text-sm text-gray-300">
               <p><strong>Profit Check:</strong> HIGH if above menu average ({metadata.averageProfitMargin?.toFixed(1)}%), LOW if below</p>
               <p><strong>Popularity Check:</strong> HIGH if ≥ 80% of average popularity ({metadata.popularityThreshold?.toFixed(1)}%), LOW if below</p>
             </div>
           </div>
         )}

         {/* Controls */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-300 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 bg-[#2a2a2a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
            />
          </div>
          
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-300 mb-2">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 bg-[#2a2a2a] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="Chef's Kiss">Chef's Kiss</option>
              <option value="Hidden Gem">Hidden Gem</option>
              <option value="Bargain Bucket">Bargain Bucket</option>
              <option value="Burnt Toast">Burnt Toast</option>
            </select>
          </div>
          
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-300 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-[#2a2a2a] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
            >
              <option value="gross_profit_percentage">Gross Profit %</option>
              <option value="number_sold">Number Sold</option>
              <option value="popularity_percentage">Popularity %</option>
              <option value="name">Name</option>
            </select>
          </div>
          
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-300 mb-2">Order</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="px-4 py-2 bg-[#2a2a2a] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setShowImportModal(true)}
            className="bg-[#29E7CD] hover:bg-[#29E7CD]/80 text-black px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
            </svg>
            Import Sales Data
          </button>
          <button
            onClick={handleExportCSV}
            className="bg-[#3B82F6] hover:bg-[#3B82F6]/80 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
            </svg>
            Export CSV
          </button>
          <button
            onClick={() => setShowCharts(!showCharts)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d={showCharts ? "M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" : "M10 12a2 2 0 100-4 2 2 0 000 4zM3.05 13a1 1 0 011.414 0L9 16.536V19a1 1 0 11-2 0v-2.464L4.464 13a1 1 0 010-1.414zM16.95 7a1 1 0 010 1.414L14.536 10H17a1 1 0 110 2h-2.464l2.414 2.414a1 1 0 11-1.414 1.414L12 13.414V16a1 1 0 11-2 0v-2.586l-2.414 2.414a1 1 0 11-1.414-1.414L10.536 12H8a1 1 0 110-2h2.536L8.122 7.586a1 1 0 111.414-1.414L12 8.586V6a1 1 0 112 0v2.586l2.414-2.414A1 1 0 0116.95 7z"}/>
            </svg>
            {showCharts ? 'Hide Charts' : 'Show Charts'}
          </button>
          <button
            onClick={() => {
              setRealtimeEnabled(!realtimeEnabled);
              if (!realtimeEnabled) {
                setupRealtimeSubscription();
              } else {
                if (realtimeSubscription.current) {
                  realtimeSubscription.current.unsubscribe();
                }
              }
            }}
            className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              realtimeEnabled
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
          >
            <div className={`w-3 h-3 rounded-full ${
              realtimeEnabled ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
            }`}></div>
            {realtimeEnabled ? 'Disable Real-time' : 'Enable Real-time'}
          </button>
        </div>

        {/* Charts */}
        {showCharts && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Bar Chart - Profit by Category */}
            <div className="bg-[#1f1f1f] rounded-2xl border border-[#2a2a2a] p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Profit by Category</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
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
                    ]}
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
                      data={[
                        { name: 'Chef\'s Kiss', value: performanceItems.filter(item => item.menu_item_class === 'Chef\'s Kiss').length, color: '#22c55e' },
                        { name: 'Hidden Gem', value: performanceItems.filter(item => item.menu_item_class === 'Hidden Gem').length, color: '#3b82f6' },
                        { name: 'Bargain Bucket', value: performanceItems.filter(item => item.menu_item_class === 'Bargain Bucket').length, color: '#f97316' },
                        { name: 'Burnt Toast', value: performanceItems.filter(item => item.menu_item_class === 'Burnt Toast').length, color: '#ef4444' }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: 'Chef\'s Kiss', value: performanceItems.filter(item => item.menu_item_class === 'Chef\'s Kiss').length, color: '#22c55e' },
                        { name: 'Hidden Gem', value: performanceItems.filter(item => item.menu_item_class === 'Hidden Gem').length, color: '#3b82f6' },
                        { name: 'Bargain Bucket', value: performanceItems.filter(item => item.menu_item_class === 'Bargain Bucket').length, color: '#f97316' },
                        { name: 'Burnt Toast', value: performanceItems.filter(item => item.menu_item_class === 'Burnt Toast').length, color: '#ef4444' }
                      ].map((entry, index) => (
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
        )}

         {/* Data Table - Simplified Format */}
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
                 {paginatedItems.map((item, index) => (
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg transition-colors"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {/* Import Modal */}
        {showImportModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#1f1f1f] rounded-2xl border border-[#2a2a2a] p-6 w-full max-w-2xl">
              <h3 className="text-xl font-semibold text-white mb-4">Import Sales Data</h3>
              <p className="text-gray-300 mb-4">
                Paste your CSV data below. Format: Dish, Number Sold, Popularity %
              </p>
              <textarea
                value={csvData}
                onChange={(e) => setCsvData(e.target.value)}
                placeholder="Dish, Number Sold, Popularity %&#10;Double Cheese Burger, 175, 10.85&#10;Hot Dog, 158, 9.80"
                className="w-full h-40 px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent resize-none"
              />
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  disabled={importing || !csvData.trim()}
                  className="px-6 py-2 bg-[#29E7CD] hover:bg-[#29E7CD]/80 disabled:bg-gray-600 text-black rounded-lg transition-colors"
                >
                  {importing ? 'Importing...' : 'Import'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}