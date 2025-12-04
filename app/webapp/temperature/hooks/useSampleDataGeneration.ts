import { useState } from 'react';
import { useNotification } from '@/contexts/NotificationContext';

import { logger } from '@/lib/logger';
interface UseSampleDataGenerationProps {
  onRefreshLogs?: () => void;
}

export function useSampleDataGeneration({ onRefreshLogs }: UseSampleDataGenerationProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { showSuccess, showError } = useNotification();

  const handleGenerateSampleData = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/temperature-logs/generate-sample', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        showSuccess(
          `Successfully generated ${data.data.totalLogs} temperature log entries (5 per equipment)`,
        );
        // Refresh logs if callback provided - wait a bit for DB to be ready
        if (onRefreshLogs) {
          setTimeout(() => {
            onRefreshLogs();
          }, 500);
        } else {
          // Reload page to refresh data
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }
      } else {
        showError(
          data.error ||
            "Couldn't whip up that sample data. Give it another shot - sometimes the kitchen needs a moment.",
        );
      }
    } catch (error) {
      logger.error('Error generating sample data:', error);
      showError(
        "Couldn't whip up that sample data. Give it another shot - sometimes the kitchen needs a moment.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    handleGenerateSampleData,
  };
}
