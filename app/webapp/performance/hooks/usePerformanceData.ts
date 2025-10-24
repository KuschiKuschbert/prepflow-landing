'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useRef, useState } from 'react';
import { PerformanceState } from '../types';

export function usePerformanceData() {
  const [state, setState] = useState<PerformanceState>({
    performanceItems: [],
    metadata: null,
    performanceAlerts: [],
    performanceScore: 0,
    realtimeEnabled: false,
    lastUpdate: null,
    showCharts: false,
    showImportModal: false,
    csvData: '',
    importing: false,
    filters: {
      profitCategory: [],
      popularityCategory: [],
      menuItemClass: [],
    },
    sortBy: 'name',
    sortOrder: 'asc',
    loading: false,
    error: null,
  });

  const realtimeSubscription = useRef<any>(null);

  const fetchPerformanceData = async () => {
    try {
      const response = await fetch('/api/performance');
      if (!response.ok) {
        throw new Error('Failed to fetch performance data');
      }

      const data = await response.json();

      setState(prev => ({
        ...prev,
        performanceItems: data.performanceItems || [],
        metadata: data.metadata || null,
        performanceAlerts: data.performanceAlerts || [],
        performanceScore: data.performanceScore || 0,
        lastUpdate: new Date(),
      }));
    } catch (error) {
      console.error('Error fetching performance data:', error);
      setState(prev => ({
        ...prev,
        performanceAlerts: [
          ...prev.performanceAlerts,
          {
            id: Date.now().toString(),
            message: 'Failed to fetch performance data',
            timestamp: new Date(),
          },
        ],
      }));
    }
  };

  const setupRealtimeSubscription = () => {
    if (realtimeSubscription.current) {
      realtimeSubscription.current.unsubscribe();
    }

    realtimeSubscription.current = supabase
      .channel('performance-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sales_data' }, payload => {
        console.log('Performance data updated:', payload);
        fetchPerformanceData();
      })
      .subscribe();
  };

  const handleImport = async () => {
    if (!state.csvData.trim()) return;

    setState(prev => ({ ...prev, importing: true }));

    try {
      const lines = state.csvData.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim());

      if (headers.length < 3) {
        throw new Error('CSV must have at least 3 columns: Dish, Number Sold, Popularity %');
      }

      const salesData = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        return {
          dish_name: values[0],
          number_sold: parseInt(values[1]) || 0,
          popularity_percentage: parseFloat(values[2]) || 0,
        };
      });

      const response = await fetch('/api/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ salesData }),
      });

      if (!response.ok) {
        throw new Error('Failed to import sales data');
      }

      setState(prev => ({
        ...prev,
        csvData: '',
        showImportModal: false,
        importing: false,
      }));

      // Refresh data after import
      await fetchPerformanceData();
    } catch (error) {
      console.error('Error importing data:', error);
      setState(prev => ({
        ...prev,
        importing: false,
        performanceAlerts: [
          ...prev.performanceAlerts,
          {
            id: Date.now().toString(),
            message: 'Failed to import sales data',
            timestamp: new Date(),
          },
        ],
      }));
    }
  };

  const handleExportCSV = () => {
    const csvContent = [
      'Dish,Number Sold,Popularity %,Total Revenue ex GST,Total Cost,Total Profit ex GST,Gross Profit %,Profit Cat,Popularity Cat,Menu Item Class',
      ...state.performanceItems.map(item =>
        [
          item.name,
          item.number_sold,
          item.popularity_percentage.toFixed(2),
          ((item.selling_price * item.number_sold) / 1.1).toFixed(2),
          (item.food_cost * item.number_sold).toFixed(2),
          (item.gross_profit * item.number_sold).toFixed(2),
          item.gross_profit_percentage.toFixed(2),
          item.profit_category,
          item.popularity_category,
          item.menu_item_class,
        ].join(','),
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-data-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const updateState = (updates: Partial<PerformanceState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  return {
    state,
    updateState,
    fetchPerformanceData,
    setupRealtimeSubscription,
    handleImport,
    handleExportCSV,
    realtimeSubscription,
  };
}
