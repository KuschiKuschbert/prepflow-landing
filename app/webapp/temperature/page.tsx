'use client';

import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { useCountryFormatting } from '@/hooks/useCountryFormatting';
import { useEffect, useState } from 'react';
import { TemperatureEquipment, TemperatureLog } from './types';

// Direct imports to eliminate skeleton flashes
import TemperatureEquipmentTab from './components/TemperatureEquipmentTab';
import TemperatureLogsTab from './components/TemperatureLogsTab';

import { useTemperatureWarnings } from '@/hooks/useTemperatureWarnings';
import { PageHeader } from './components/PageHeader';
import { TabNavigation } from './components/TabNavigation';
import TemperatureAnalyticsTab from './components/TemperatureAnalyticsTab';
import { useTemperatureLogsQuery } from './hooks/useTemperatureLogsQuery';

function TemperatureLogsPageContent() {
  const { formatDate } = useCountryFormatting();

  // Helper function to format time strings
  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  // Helper function to format date strings
  const formatDateString = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return formatDate(date);
  };

  const [logs, setLogs] = useState<TemperatureLog[]>([]);
  const [allLogs, setAllLogs] = useState<TemperatureLog[]>([]);
  const [equipment, setEquipment] = useState<TemperatureEquipment[]>([]);
  const [loading, setLoading] = useState(false); // Start with false to prevent skeleton showing
  const [isInitialLoad, setIsInitialLoad] = useState(false); // Start with false to prevent skeleton flash
  const [activeTab, setActiveTab] = useState<'logs' | 'equipment' | 'analytics'>('analytics');
  const [quickTempLoading, setQuickTempLoading] = useState<{ [key: string]: boolean }>({});
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [newLog, setNewLog] = useState({
    log_date: '',
    log_time: '',
    temperature_type: 'fridge',
    temperature_celsius: '',
    location: '',
    notes: '',
    logged_by: '',
  });
  const [showAddLog, setShowAddLog] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const { data: logsData, isLoading: logsLoading } = useTemperatureLogsQuery(
    selectedDate,
    selectedType,
    page,
    pageSize,
  );

  // Initialize temperature warnings
  useTemperatureWarnings({ allLogs, equipment });

  // Replace fetchLogs usage when activeTab is logs
  useEffect(() => {
    const ld = logsData as any;
    if (ld?.items) setLogs(ld.items);
  }, [logsData]);

  const total = (logsData as any)?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const temperatureTypes = [
    { value: 'fridge', label: 'Fridge', icon: '🧊' },
    { value: 'freezer', label: 'Freezer', icon: '❄️' },
    { value: 'food_cooking', label: 'Food Cooking', icon: '🔥' },
    { value: 'food_hot_holding', label: 'Food Hot Holding', icon: '🍲' },
    { value: 'food_cold_holding', label: 'Food Cold Holding', icon: '🥗' },
    { value: 'storage', label: 'Storage', icon: '📦' },
  ];

  const fetchLogs = async () => {
    try {
      let url = '/api/temperature-logs';
      const params = new URLSearchParams();
      if (selectedDate) params.append('date', selectedDate);
      if (selectedType !== 'all') params.append('type', selectedType);
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        // If no data for selected date, automatically switch to most recent date with data
        if (data.data.length === 0 && allLogs.length > 0) {
          const datesWithLogs = [...new Set(allLogs.map(log => log.log_date))].sort().reverse();
          if (datesWithLogs.length > 0) {
            const mostRecentDate = datesWithLogs[0];
            console.log(`No data for ${selectedDate}, switching to ${mostRecentDate}`);
            setSelectedDate(mostRecentDate);
            // Fetch logs for the most recent date
            const fallbackUrl = `/api/temperature-logs?date=${mostRecentDate}${selectedType !== 'all' ? `&type=${selectedType}` : ''}`;
            const fallbackResponse = await fetch(fallbackUrl);
            const fallbackData = await fallbackResponse.json();
            if (fallbackData.success) {
              setLogs(fallbackData.data);
            }
            return;
          }
        }
        setLogs(data.data);
      }
    } catch (error) {
      console.error('fetchLogs - Error:', error);
    }
  };

  const fetchAllLogs = async () => {
    try {
      const response = await fetch('/api/temperature-logs');
      const data = await response.json();
      console.log('fetchAllLogs - API response:', data);
      if (data.success && data.data) {
        console.log('fetchAllLogs - Setting allLogs:', data.data.length, 'logs');
        setAllLogs(data.data);
      }
    } catch (error) {
      console.error('fetchAllLogs - Error:', error);
    }
  };

  const fetchEquipment = async () => {
    try {
      const response = await fetch('/api/temperature-equipment');
      const data = await response.json();
      console.log('fetchEquipment - API response:', data);
      if (data.success) {
        console.log('fetchEquipment - Setting equipment:', data.data.length, 'equipment');
        setEquipment(data.data);
      }
    } catch (error) {
      console.error('fetchEquipment - Error:', error);
    }
  };

  useEffect(() => {
    // Initialize date/time values on client side to prevent hydration mismatch
    const now = new Date();
    setSelectedDate(now.toISOString().split('T')[0]);
    setNewLog(prev => ({
      ...prev,
      log_date: now.toISOString().split('T')[0],
      log_time: now.toTimeString().split(' ')[0].substring(0, 5),
    }));
  }, []);

  // Set default date to most recent date with data after initial load
  useEffect(() => {
    if (allLogs.length > 0 && !isInitialLoad) {
      // Find the most recent date with logs
      const datesWithLogs = [...new Set(allLogs.map(log => log.log_date))].sort().reverse();
      if (datesWithLogs.length > 0) {
        setSelectedDate(datesWithLogs[0]);
        setIsInitialLoad(true); // Mark as processed
      }
    }
  }, [allLogs, isInitialLoad]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Load all data in parallel for better performance
        await Promise.all([fetchLogs(), fetchEquipment(), fetchAllLogs()]);

        // No artificial delay needed
      } catch (error) {
        console.error('Error loading temperature data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Watch for changes in selectedDate or selectedType and refetch logs
  useEffect(() => {
    if (selectedDate) {
      // Query will refetch automatically via key
    }
  }, [selectedDate, selectedType]);

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/temperature-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newLog,
          temperature_celsius: parseFloat(newLog.temperature_celsius),
        }),
      });

      const data = await response.json();
      if (data.success) {
        setNewLog({
          log_date: new Date().toISOString().split('T')[0],
          log_time: new Date().toTimeString().split(' ')[0].substring(0, 5),
          temperature_type: 'fridge',
          temperature_celsius: '',
          location: '',
          notes: '',
          logged_by: '',
        });
        setShowAddLog(false);
        fetchLogs();
        fetchAllLogs();
      }
    } catch (error) {
      // Handle add log error gracefully
    }
  };

  const handleDeleteLog = async (logId: number) => {
    try {
      const response = await fetch(`/api/temperature-logs/${logId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        fetchLogs();
        fetchAllLogs();
      }
    } catch (error) {
      // Handle delete error gracefully
    }
  };

  const handleQuickTempLog = async (
    equipmentId: string,
    equipmentName: string,
    equipmentType: string,
  ) => {
    setQuickTempLoading(prev => ({ ...prev, [equipmentId]: true }));
    try {
      const response = await fetch('/api/temperature-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          log_date: new Date().toISOString().split('T')[0],
          log_time: new Date().toTimeString().split(' ')[0].substring(0, 5),
          temperature_type: equipmentType,
          temperature_celsius: 0, // Will be updated by user
          location: equipmentName,
          notes: 'Quick log',
          logged_by: 'System',
        }),
      });

      const data = await response.json();
      if (data.success) {
        fetchLogs();
        fetchAllLogs();
      }
    } catch (error) {
      // Handle logging error gracefully
      alert('Failed to log temperature. Please try again.');
    } finally {
      setQuickTempLoading(prev => ({ ...prev, [equipmentId]: false }));
    }
  };

  const handleUpdateEquipment = async (
    equipmentId: string,
    updates: Partial<TemperatureEquipment>,
  ) => {
    try {
      const response = await fetch(`/api/temperature-equipment/${equipmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      if (data.success) {
        fetchEquipment();
      }
    } catch (error) {
      // Handle update error gracefully
    }
  };

  const handleCreateEquipment = async (
    name: string,
    equipmentType: string,
    location: string | null,
    minTemp: number | null,
    maxTemp: number | null,
  ) => {
    try {
      const response = await fetch('/api/temperature-equipment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          equipment_type: equipmentType,
          location,
          min_temp_celsius: minTemp,
          max_temp_celsius: maxTemp,
          is_active: true,
        }),
      });

      const data = await response.json();
      if (data.success) {
        fetchEquipment();
      }
    } catch (error) {
      // Handle create error gracefully
    }
  };

  const handleDeleteEquipment = async (equipmentId: string) => {
    try {
      const response = await fetch(`/api/temperature-equipment/${equipmentId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        fetchEquipment();
      }
    } catch (error) {
      // Handle delete error gracefully
    }
  };

  const getTypeIcon = (type: string) => {
    const typeInfo = temperatureTypes.find(t => t.value === type);
    return typeInfo?.icon || '🌡️';
  };

  const getTypeLabel = (type: string) => {
    const typeInfo = temperatureTypes.find(t => t.value === type);
    return typeInfo?.label || type;
  };

  const getFoodSafetyStatus = (temp: number, logTime: string, logDate: string, type: string) => {
    if (type !== 'food_cooking' && type !== 'food_hot_holding' && type !== 'food_cold_holding') {
      return null;
    }

    if (temp < 5 || temp > 60) {
      return {
        status: 'safe',
        message: 'Outside danger zone',
        color: 'text-green-400',
        icon: '✅',
      };
    }

    const logDateTime = new Date(`${logDate}T${logTime}`);
    const now = new Date();
    const hoursInDangerZone = (now.getTime() - logDateTime.getTime()) / (1000 * 60 * 60);

    if (hoursInDangerZone < 2) {
      return {
        status: 'safe',
        message: `${(2 - hoursInDangerZone).toFixed(1)}h remaining - can refrigerate`,
        color: 'text-green-400',
        icon: '✅',
      };
    } else if (hoursInDangerZone < 4) {
      return {
        status: 'warning',
        message: `${(4 - hoursInDangerZone).toFixed(1)}h remaining - use immediately`,
        color: 'text-yellow-400',
        icon: '⚠️',
      };
    } else {
      return {
        status: 'danger',
        message: `${hoursInDangerZone.toFixed(1)}h in danger zone - DISCARD`,
        color: 'text-red-400',
        icon: '🚨',
      };
    }
  };

  // Only show content when data is ready
  if (equipment.length === 0) {
    return (
      <div className="min-h-screen bg-transparent p-4 sm:p-6">
        <div className="mx-auto max-w-7xl">
          {/* Empty state - no skeleton, just dark background */}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <PageHeader />

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        {activeTab === 'logs' && (
          <>
            <TemperatureLogsTab
              logs={logs}
              equipment={equipment}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              showAddLog={showAddLog}
              setShowAddLog={setShowAddLog}
              newLog={newLog}
              setNewLog={setNewLog}
              onAddLog={handleAddLog}
              onRefreshLogs={() => {}}
            />
            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-400">
                Page {page} of {totalPages} ({total} items)
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-lg bg-[#2a2a2a] px-3 py-2 text-sm text-white disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="rounded-lg bg-[#2a2a2a] px-3 py-2 text-sm text-white disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'equipment' && (
          <TemperatureEquipmentTab
            equipment={equipment}
            quickTempLoading={quickTempLoading}
            onUpdateEquipment={handleUpdateEquipment}
            onCreateEquipment={handleCreateEquipment}
            onDeleteEquipment={handleDeleteEquipment}
            onQuickTempLog={handleQuickTempLog}
          />
        )}

        {activeTab === 'analytics' && (
          <TemperatureAnalyticsTab allLogs={allLogs} equipment={equipment} />
        )}
      </div>
    </div>
  );
}

export default function TemperatureLogsPage() {
  return (
    <ErrorBoundary>
      <TemperatureLogsPageContent />
    </ErrorBoundary>
  );
}
