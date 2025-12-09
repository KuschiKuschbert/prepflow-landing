import { useState, useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import type { SupportFormData, UserError } from '../types';

/**
 * Hook for managing support form state and submission
 */
export function useSupportForm(userEmail: string | undefined, onSuccess?: () => void) {
  const { showSuccess, showError } = useNotification();
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<SupportFormData>({
    subject: '',
    message: '',
    type: 'question',
    related_error_id: undefined,
  });

  const handleReportError = useCallback((error: UserError) => {
    setFormData({
      subject: `Error Report: ${error.error_message.substring(0, 150)}`,
      message: `I encountered this error:\n\nError: ${error.error_message}\nSeverity: ${error.severity}\nCategory: ${error.category}\n\nPlease investigate and fix this issue.`,
      type: 'error',
      related_error_id: error.id,
    });
    setShowForm(true);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);

      try {
        const response = await fetch('/api/support/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subject: formData.subject,
            message: formData.message,
            type: formData.type,
            related_error_id: formData.related_error_id || undefined,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || data.message || 'Failed to submit request');
        }

        showSuccess('Support request submitted successfully. We will respond within 48 hours.');
        setFormData({ subject: '', message: '', type: 'question', related_error_id: undefined });
        setShowForm(false);
        onSuccess?.();
      } catch (error) {
        logger.error('Failed to submit support request:', error);
        showError(error instanceof Error ? error.message : 'Failed to submit support request');
      } finally {
        setSubmitting(false);
      }
    },
    [formData, showSuccess, showError, onSuccess],
  );

  const resetForm = useCallback(() => {
    setFormData({ subject: '', message: '', type: 'question', related_error_id: undefined });
    setShowForm(false);
  }, []);

  return {
    formData,
    setFormData,
    submitting,
    showForm,
    setShowForm,
    handleSubmit,
    handleReportError,
    resetForm,
  };
}
