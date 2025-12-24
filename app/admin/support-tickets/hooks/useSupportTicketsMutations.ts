import { useState, useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import type { SupportTicket } from '../types';
import { logger } from '@/lib/logger';

/**
 * Hook for support ticket mutations (update status, save notes).
 * Handles API calls for updating support ticket status and saving admin notes.
 *
 * @param {Function} refresh - Function to refresh tickets after mutation
 * @returns {Object} Mutation functions and loading state
 * @returns {string | null} returns.updatingStatus - ID of ticket currently being updated
 * @returns {Function} returns.updateStatus - Function to update ticket status
 * @returns {Function} returns.saveNotes - Function to save admin notes for a ticket
 */
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
        logger.error('[useSupportTicketsMutations.ts] Error in catch block:', {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });

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
        logger.error('[useSupportTicketsMutations.ts] Error in catch block:', {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });

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
