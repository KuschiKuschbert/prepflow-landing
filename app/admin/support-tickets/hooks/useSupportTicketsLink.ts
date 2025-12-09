import { useState, useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import type { SupportTicket } from '../types';

/**
 * Hook for linking support tickets to error logs.
 * Handles API calls for associating tickets with error log entries.
 *
 * @returns {Object} Linking state and function
 * @returns {string | null} returns.linkingStatus - ID of ticket currently being linked
 * @returns {Function} returns.linkError - Function to link ticket to error log
 */
export function useSupportTicketsLink() {
  const { showSuccess, showError } = useNotification();
  const [linkingStatus, setLinkingStatus] = useState<string | null>(null);

  const linkError = useCallback(
    async (ticketId: string, errorId: string) => {
      setLinkingStatus(ticketId);
      try {
        const response = await fetch(`/api/admin/support-tickets/${ticketId}/link-error`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error_id: errorId }),
        });

        if (response.ok) {
          showSuccess('Ticket linked to error log successfully');
          const data = await response.json();
          return data.ticket;
        } else {
          const data = await response.json();
          showError(data.error || data.message || 'Failed to link error');
          return null;
        }
      } catch (error) {
        showError('Failed to link error');
        return null;
      } finally {
        setLinkingStatus(null);
      }
    },
    [showSuccess, showError],
  );

  return {
    linkingStatus,
    linkError,
  };
}
