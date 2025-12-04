import { logger } from '@/lib/logger';
import { useNotification } from '@/contexts/NotificationContext';

export async function handleGenerateSampleData(
  equipment: any[],
  showError: (msg: string) => void,
  showSuccess: (msg: string) => void,
  setIsGenerating: (val: boolean) => void,
  onRefreshLogs?: () => Promise<void>,
) {
  if (equipment.length === 0) {
    showError('Please add equipment first before generating sample logs');
    return;
  }
  setIsGenerating(true);
  try {
    const response = await fetch('/api/temperature-logs/generate-sample', { method: 'POST' });
    const data = await response.json();
    if (data.success) {
      showSuccess(
        `Successfully generated ${data.data.totalLogs} temperature log entries (5 per equipment, spread across last 2 weeks)`,
      );
      if (onRefreshLogs) {
        await new Promise(resolve => setTimeout(resolve, 500));
        await onRefreshLogs();
      } else {
        setTimeout(() => {
          window.location.hash = 'equipment';
          window.location.reload();
        }, 1500);
      }
    } else {
      showError(data.error || 'Failed to generate sample data');
    }
  } catch (error) {
    logger.error('Error generating sample data:', error);
    showError(
      "Couldn't whip up that sample data. Give it another shot - sometimes the kitchen needs a moment.",
    );
  } finally {
    setIsGenerating(false);
  }
}
