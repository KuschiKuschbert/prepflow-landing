import { ConfirmOptions } from '@/hooks/useConfirm';
import { logger } from '@/lib/logger';

export async function handleDeleteHelper(
  showConfirm: (options: ConfirmOptions) => Promise<boolean>,
  setDeletionRequested: (requested: boolean) => void,
  showSuccess: (message: string) => void,
  showError: (message: string) => void,
  setDeleting: (deleting: boolean) => void,
): Promise<void> {
  const confirmed = await showConfirm({
    title: 'Delete Your Account?',
    message:
      'Are you sure you want to delete your account? This action can&apos;t be undone. All your data will be permanently deleted after a 7-day grace period. You can cancel this request anytime before then.',
    variant: 'danger',
    confirmLabel: 'Yes, Delete My Account',
    cancelLabel: 'Cancel',
  });
  if (!confirmed) return;
  setDeleting(true);
  try {
    const response = await fetch('/api/account/delete', { method: 'POST' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || data.message || 'Failed to request deletion');
    setDeletionRequested(true);
    showSuccess(data.message || 'Account deletion requested successfully');
  } catch (error) {
    logger.error('Failed to request deletion:', error);
    showError(error instanceof Error ? error.message : 'Failed to request deletion');
  } finally {
    setDeleting(false);
  }
}
