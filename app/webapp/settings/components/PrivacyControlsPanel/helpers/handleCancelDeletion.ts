/**
 * Handle cancel account deletion.
 */
import { logger } from '@/lib/logger';

export async function handleCancelDeletionHelper(
  showConfirm: (options: any) => Promise<boolean>,
  setDeletionRequested: (requested: boolean) => void,
  showSuccess: (message: string) => void,
  showError: (message: string) => void,
): Promise<void> {
  const confirmed = await showConfirm({
    title: 'Cancel Account Deletion?',
    message:
      'Are you sure you want to cancel the account deletion request? Your account will remain active.',
    variant: 'info',
    confirmLabel: 'Yes, Cancel Deletion',
    cancelLabel: 'Keep Deletion Request',
  });
  if (!confirmed) return;
  try {
    const response = await fetch('/api/account/delete?cancel=true', { method: 'POST' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || data.message || 'Failed to cancel deletion');
    setDeletionRequested(false);
    showSuccess(data.message || 'Account deletion cancelled');
  } catch (error) {
    logger.error('Failed to cancel deletion:', error);
    showError(error instanceof Error ? error.message : 'Failed to cancel deletion');
  }
}
