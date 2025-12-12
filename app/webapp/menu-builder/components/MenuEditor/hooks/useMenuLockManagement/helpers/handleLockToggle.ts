import { logger } from '@/lib/logger';
import { MenuChangeTracking } from '@/lib/menu-lock/change-tracking';

interface MenuLockStatus {
  is_locked: boolean;
  locked_at?: string;
  locked_by?: string;
}

interface HandleLockToggleParams {
  menuId: string;
  lock: boolean;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  onMenuUpdated: () => void;
  setMenuLockStatus: React.Dispatch<React.SetStateAction<MenuLockStatus>>;
  setUnlockChanges: React.Dispatch<React.SetStateAction<MenuChangeTracking[] | null>>;
  setShowUnlockDialog: React.Dispatch<React.SetStateAction<boolean>>;
  justUpdatedLockRef: React.MutableRefObject<boolean>;
}

export async function handleLockToggle({
  menuId,
  lock,
  showError,
  showSuccess,
  onMenuUpdated,
  setMenuLockStatus,
  setUnlockChanges,
  setShowUnlockDialog,
  justUpdatedLockRef,
}: HandleLockToggleParams): Promise<void> {
  logger.dev(`[MenuEditor] handleLockToggle CALLED - lock=${lock} for menu ${menuId}`);
  try {
    const response = await fetch(`/api/menus/${menuId}/lock`, {
      method: lock ? 'POST' : 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      logger.error(`[MenuEditor] ${lock ? 'Lock' : 'Unlock'} menu failed:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });

      if (response.status === 401) {
        const errorMsg = 'Your session has expired. Please sign in again to continue.';
        showError(errorMsg);
        setTimeout(() => {
          window.location.href = '/api/auth/login';
        }, 2000);
        return;
      }

      const errorMsg =
        response.status === 404
          ? `Menu ${lock ? 'lock' : 'unlock'} endpoint not found. ${lock ? 'This may be a Next.js routing issue. Please restart the dev server and try again.' : 'Please refresh the page and try again.'}`
          : errorData.error || errorData.message || `Failed to ${lock ? 'lock' : 'unlock'} menu`;
      showError(errorMsg);
      return;
    }
    const data = await response.json();
    if (data.success) {
      const newStatus = lock
        ? { is_locked: true, locked_at: data.menu.locked_at, locked_by: data.menu.locked_by }
        : { is_locked: false, locked_at: undefined, locked_by: undefined };

      logger.dev(`[MenuEditor] handleLockToggle SUCCESS - Setting lock status:`, newStatus);

      // Update lock status immediately for instant UI feedback
      setMenuLockStatus(newStatus);

      // Set ref to prevent sync hook from overriding our update
      logger.dev('[MenuEditor] handleLockToggle - Setting justUpdatedLockRef = true');
      justUpdatedLockRef.current = true;

      setTimeout(() => {
        logger.dev(
          '[MenuEditor] handleLockToggle - Resetting justUpdatedLockRef = false (500ms timeout)',
        );
        justUpdatedLockRef.current = false;
      }, 500);

      // Refresh menu data to ensure menu prop is updated
      logger.dev('[MenuEditor] handleLockToggle - Calling onMenuUpdated()');
      onMenuUpdated();

      // Show success message immediately
      if (!lock && data.hasChanges && data.changes && data.changes.length > 0) {
        logger.dev('[MenuEditor] Changes detected on unlock:', {
          changeCount: data.changes.length,
        });
        setUnlockChanges(data.changes);
        setShowUnlockDialog(true);
        // Don't show success message here - dialog will handle it
      } else {
        // Show success message immediately for lock/unlock without changes
        showSuccess(`Menu ${lock ? 'locked' : 'unlocked'} successfully`);
      }

      if (lock) {
        logger.dev('[MenuEditor] handleLockToggle - Menu locked, should show MenuLockedView');
      } else {
        logger.dev('[MenuEditor] handleLockToggle - Menu unlocked, should show MenuEditor');
      }
    } else {
      logger.error(`[MenuEditor] ${lock ? 'Lock' : 'Unlock'} API returned success=false:`, data);
      showError(data.error || data.message || `Failed to ${lock ? 'lock' : 'unlock'} menu`);
    }
  } catch (err) {
    logger.error(`[MenuEditor] Error ${lock ? 'locking' : 'unlocking'} menu:`, err);
    showError(
      `Failed to ${lock ? 'lock' : 'unlock'} menu. Please check your connection and try again.`,
    );
  }
}
