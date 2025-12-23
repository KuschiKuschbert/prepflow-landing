'use client';

import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Icon } from '@/components/ui/Icon';
import { useNotification } from '@/contexts/NotificationContext';
import { BarChart3 } from 'lucide-react';
import { useState } from 'react';
import { logger } from '@/lib/logger';

export default function TestDataGenerator() {
  const [isGeneratingTestData, setIsGeneratingTestData] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { showSuccess, showError } = useNotification();

  const handleGenerateTestData = () => {
    setShowConfirmDialog(true);
  };

  const confirmGenerateTestData = async () => {
    setShowConfirmDialog(false);
    setIsGeneratingTestData(true);
    try {
      const response = await fetch('/api/generate-test-temperature-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (data.success) {
        showSuccess(
          `Successfully generated ${data.data.totalLogs} temperature log entries for the last 3 months!`,
        );
      } else {
        showError(`Error: ${data.error || 'Failed to generate test data'}`);
      }
    } catch (error) {
      logger.error('[TestDataGenerator.tsx] Error in catch block:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

      showError('Connection issue while generating test data. Give it another go, chef.');
    } finally {
      setIsGeneratingTestData(false);
    }
  };

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <Icon icon={BarChart3} size="xl" className="text-[var(--foreground-muted)]" aria-hidden={true} />
        </div>
        <h3 className="mb-2 text-xl font-bold text-[var(--foreground)]">Test Data Generator</h3>
        <p className="mb-6 text-[var(--foreground-muted)]">
          Generate 3 months of realistic temperature log data for testing and demonstration
        </p>

        <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/50 p-4">
          <p className="text-sm text-[var(--foreground-secondary)]">
            <strong>Note:</strong> This will create thousands of temperature log entries across all
            your equipment for the past 3 months. Perfect for testing the analytics and monitoring
            features.
          </p>
        </div>

        <button
          onClick={handleGenerateTestData}
          disabled={isGeneratingTestData}
          className={`rounded-2xl px-6 py-3 font-semibold transition-all duration-200 ${
            isGeneratingTestData
              ? 'cursor-not-allowed bg-[var(--muted)] text-[var(--foreground-muted)]'
              : 'bg-gradient-to-r from-[var(--accent)] to-[var(--color-info)] text-[var(--button-active-text)] shadow-lg hover:from-[var(--accent)]/80 hover:to-[var(--color-info)]/80 hover:shadow-xl'
          }`}
        >
          {isGeneratingTestData ? (
            <span className="flex items-center justify-center space-x-2">
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-gray-400"></div>
              <span>Generating Data...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center space-x-2">
              <Icon icon={BarChart3} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
              <span>Generate Test Data</span>
            </span>
          )}
        </button>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Generate Test Data"
        message="This will generate 3 months of test temperature data. This may take a few minutes. Continue?"
        confirmLabel="Generate"
        cancelLabel="Cancel"
        onConfirm={confirmGenerateTestData}
        onCancel={() => setShowConfirmDialog(false)}
        variant="info"
      />
    </div>
  );
}
