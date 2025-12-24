import { useState, useEffect } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';

/**
 * Hook for managing auto-report preference
 */
export function useAutoReport(userEmail: string | undefined) {
  const { showSuccess, showError } = useNotification();
  const [autoReport, setAutoReport] = useState(false);

  useEffect(() => {
    if (!userEmail) return;

    async function fetchAutoReportPreference() {
      try {
        const response = await fetch('/api/user/error-reporting-preferences');
        if (response.ok) {
          const data = await response.json();
          setAutoReport(data.autoReport || false);
        }
      } catch (error) {
        logger.error('Failed to fetch auto-report preference:', error);
      }
    }

    fetchAutoReportPreference();
  }, [userEmail]);

  const handleAutoReportToggle = async (enabled: boolean) => {
    // Store original state for rollback
    const originalAutoReport = autoReport;

    // Optimistically update UI immediately
    setAutoReport(enabled);

    try {
      const response = await fetch('/api/user/error-reporting-preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ autoReport: enabled }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Error - revert optimistic update
        setAutoReport(originalAutoReport);
        throw new Error(data.error || data.message || 'Failed to update preference');
      }

      // Success - state already updated optimistically
      showSuccess(
        enabled ? 'Auto-reporting enabled for critical errors' : 'Auto-reporting disabled',
      );
    } catch (error) {
      // Error - revert optimistic update
      setAutoReport(originalAutoReport);
      logger.error('Failed to update auto-report preference:', error);
      showError(error instanceof Error ? error.message : 'Failed to update preference');
    }
  };

  return {
    autoReport,
    handleAutoReportToggle,
  };
}
