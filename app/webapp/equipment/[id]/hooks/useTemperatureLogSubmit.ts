import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { useOnTemperatureLogged } from '@/lib/personality/hooks';
import type { TemperatureEquipment, TemperatureLog } from './useEquipmentData';

interface UseTemperatureLogSubmitProps {
  equipment: TemperatureEquipment | null;
  recentLogs: TemperatureLog[];
  setRecentLogs: React.Dispatch<React.SetStateAction<TemperatureLog[]>>;
  temperature: string;
  setTemperature: (temp: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
}

export function useTemperatureLogSubmit({
  equipment,
  recentLogs,
  setRecentLogs,
  temperature,
  setTemperature,
  notes,
  setNotes,
}: UseTemperatureLogSubmitProps) {
  const { showSuccess, showError } = useNotification();
  const onTemperatureLogged = useOnTemperatureLogged();

  const handleSubmitTemperature = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!temperature || !equipment) return;

    // Store original state for rollback
    const originalLogs = [...recentLogs];
    const tempTemperature = parseFloat(temperature);
    const tempNotes = notes || null;
    const tempEquipmentId = equipment.id;

    // Create temporary log for optimistic update
    const tempId = `temp-${Date.now()}`;
    const tempLog: TemperatureLog = {
      id: tempId,
      equipment_id: tempEquipmentId,
      temperature_celsius: tempTemperature,
      log_date: new Date().toISOString().split('T')[0],
      log_time: new Date().toTimeString().split(' ')[0].substring(0, 5),
      logged_by: null,
      notes: tempNotes,
      created_at: new Date().toISOString(),
    };

    // Optimistically add to UI immediately (at the top of the list)
    setRecentLogs(prev => [tempLog, ...prev.slice(0, 4)]); // Keep only top 5
    setTemperature('');
    setNotes('');

    // Trigger personality hook for temperature logging
    onTemperatureLogged();

    try {
      const response = await fetch('/api/temperature-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equipment_id: tempEquipmentId,
          temperature_celsius: tempTemperature,
          notes: tempNotes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to log temperature');
      }

      const data = await response.json();
      if (data.success && data.data) {
        // Replace temp log with real one from server
        setRecentLogs(prev => prev.map(log => (log.id === tempId ? data.data : log)));
        showSuccess('Temperature logged successfully');
      } else {
        // Error - revert optimistic update
        setRecentLogs(originalLogs);
        showError(data.message || data.error || 'Failed to log temperature');
      }
    } catch (error) {
      // Error - revert optimistic update
      setRecentLogs(originalLogs);
      logger.error('Error logging temperature:', error);
      showError("Couldn't log that temperature, chef. Give it another shot.");
    }
  };

  return { handleSubmitTemperature };
}
