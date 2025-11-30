/**
 * Quick temperature log handler.
 */

interface QuickTempLogProps {
  equipmentId: string;
  equipmentName: string;
  equipmentType: string;
  activeTab: 'logs' | 'equipment' | 'analytics';
  fetchAllLogs: (limit?: number, forceRefresh?: boolean) => Promise<void>;
  setQuickTempLoading: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  showError: (message: string) => void;
}

/**
 * Handle quick temperature log creation.
 *
 * @param {QuickTempLogProps} props - Quick temp log props
 * @returns {Promise<boolean>} Success status
 */
export async function handleQuickTempLog({
  equipmentId,
  equipmentName,
  equipmentType,
  activeTab,
  fetchAllLogs,
  setQuickTempLoading,
  showError,
}: QuickTempLogProps): Promise<boolean> {
  setQuickTempLoading(prev => ({ ...prev, [equipmentId]: true }));
  try {
    const response = await fetch('/api/temperature-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        log_date: new Date().toISOString().split('T')[0],
        log_time: new Date().toTimeString().split(' ')[0].substring(0, 5),
        temperature_type: equipmentType,
        temperature_celsius: 0,
        location: equipmentName,
        notes: 'Quick log',
        logged_by: 'System',
      }),
    });
    const data = await response.json();
    if (data.success) {
      if (activeTab === 'analytics') {
        fetchAllLogs(1000).catch(() => {});
      }
      return true;
    }
    return false;
  } catch (error) {
    showError('Failed to log temperature. Please try again.');
    return false;
  } finally {
    setQuickTempLoading(prev => ({ ...prev, [equipmentId]: false }));
  }
}
