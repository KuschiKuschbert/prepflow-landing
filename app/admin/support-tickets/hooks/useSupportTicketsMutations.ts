/**
 * Hook for support ticket mutations (update status, save notes)
 */

import { useState, useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import type { SupportTicket } from '../types';

export function useSupportTicketsMutations(refresh: () => Promise<void>) {
  const { showSuccess, showError } = useNotification();
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const updateStatus = useCallback(
    async (ticketId: string, newStatus: string) => {
      setUpdatingStatus(ticketId);
      try {
        const response = await fetch(`/api/admin/support-tickets/${ticketId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });

        if (response.ok) {
          showSuccess('Ticket status updated successfully');
          await refresh();
          return true;
        } else {
          const data = await response.json();
          showError(data.error || data.message || 'Failed to update status');
          return false;
        }
      } catch (error) {
        showError('Failed to update ticket status');
        return false;
      } finally {
        setUpdatingStatus(null);
      }
    },
    [refresh, showSuccess, showError],
  );

  const saveNotes = useCallback(
    async (ticketId: string, notes: string) => {
      setUpdatingStatus(ticketId);
      try {
        const response = await fetch(`/api/admin/support-tickets/${ticketId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ admin_notes: notes }),
        });

        if (response.ok) {
          showSuccess('Notes saved successfully');
          const data = await response.json();
          return data.ticket;
        } else {
          const data = await response.json();
          showError(data.error || data.message || 'Failed to save notes');
          return null;
        }
      } catch (error) {
        showError('Failed to save notes');
        return null;
      } finally {
        setUpdatingStatus(null);
      }
    },
    [showSuccess, showError],
  );

  return {
    updatingStatus,
    updateStatus,
    saveNotes,
  };
}
