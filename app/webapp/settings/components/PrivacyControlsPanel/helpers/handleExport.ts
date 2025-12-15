/**
 * Handle data export.
 */
import { logger } from '@/lib/logger';

export async function handleExportHelper(
  showSuccess: (message: string) => void,
  showError: (message: string) => void,
  setExporting: (exporting: boolean) => void,
): Promise<void> {
  setExporting(true);
  try {
    const response = await fetch('/api/account/export');
    if (!response.ok) throw new Error('Failed to export data');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prepflow-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    showSuccess('Data exported successfully');
  } catch (error) {
    logger.error('Failed to export data:', error);
    showError('Failed to export data');
  } finally {
    setExporting(false);
  }
}
