'use client';

/**
 * Notification overlay container.
 * Renders the list of active toasts in two regions:
 *  - Personality toasts: prominent, vertically aligned below the header
 *  - Regular toasts: standard top-center position
 *
 * Used exclusively by {@link NotificationProvider}.
 */

import { Toast } from './Toast';
import type { ToastType } from './Toast';

/** Shape of a single in-flight notification */
export interface Notification {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface NotificationContainerProps {
  notifications: Notification[];
}

/**
 * Renders all active notifications in their correct regions.
 * Returns null when there are no active notifications.
 *
 * @param {NotificationContainerProps} props
 * @returns {JSX.Element | null}
 */
export function NotificationContainer({ notifications }: NotificationContainerProps) {
  if (notifications.length === 0) return null;

  const personalityNotifications = notifications.filter(n => n.type === 'personality');
  const regularNotifications = notifications.filter(n => n.type !== 'personality');

  return (
    <>
      {personalityNotifications.length > 0 && (
        <div
          role="status"
          aria-live="assertive"
          className="desktop:top-[calc(var(--header-height-desktop,64px)+var(--safe-area-inset-top,0px)+24px)] fixed top-[calc(var(--header-height-mobile,56px)+var(--safe-area-inset-top,0px)+24px)] left-1/2 z-[60] flex w-full max-w-lg -translate-x-1/2 flex-col gap-3 px-4"
        >
          {personalityNotifications.map(n => (
            <Toast key={n.id} type={n.type} message={n.message} />
          ))}
        </div>
      )}

      {regularNotifications.length > 0 && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-20 left-1/2 z-50 flex w-full max-w-md -translate-x-1/2 flex-col gap-2 px-4"
        >
          {regularNotifications.map(n => (
            <Toast key={n.id} type={n.type} message={n.message} />
          ))}
        </div>
      )}
    </>
  );
}
