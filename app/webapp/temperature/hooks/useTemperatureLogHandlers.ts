import { useOnTemperatureLogged } from '@/lib/personality/hooks';
import { useState } from 'react';

interface UseTemperatureLogHandlersProps {
  activeTab: 'logs' | 'equipment' | 'analytics';
  fetchAllLogs: (limit?: number, forceRefresh?: boolean) => Promise<void>;
}

// Helper function to get current date/time in correct format
const getCurrentDate = () => new Date().toISOString().split('T')[0];
const getCurrentTime = () => new Date().toTimeString().split(' ')[0].substring(0, 5);

export function useTemperatureLogHandlers({
  activeTab,
  fetchAllLogs,
}: UseTemperatureLogHandlersProps) {
  const onTemperatureLogged = useOnTemperatureLogged();
  const [newLog, setNewLog] = useState({
    log_date: getCurrentDate(),
    log_time: getCurrentTime(),
    temperature_type: 'fridge',
    temperature_celsius: '',
    location: '',
    notes: '',
    logged_by: '',
  });
  const [showAddLog, setShowAddLog] = useState(false);

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
        // Trigger personality hook for temperature logging
        onTemperatureLogged();

        setNewLog({
          log_date: getCurrentDate(),
          log_time: getCurrentTime(),
          temperature_type: 'fridge',
          temperature_celsius: '',
          location: '',
          notes: '',
          logged_by: '',
        });
        setShowAddLog(false);
        if (activeTab === 'analytics') {
          fetchAllLogs(1000).catch(() => {});
        }
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
        if (activeTab === 'analytics') {
          fetchAllLogs(1000).catch(() => {});
        }
      }
    } catch (error) {
      // Handle delete error gracefully
    }
  };

  return {
    newLog,
    setNewLog,
    showAddLog,
    setShowAddLog,
    handleAddLog,
    handleDeleteLog,
  };
}
