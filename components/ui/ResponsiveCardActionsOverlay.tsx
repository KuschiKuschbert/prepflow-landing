'use client';
import type { Action } from './ResponsiveCardActions';

export interface ResponsiveCardActionsOverlayProps {
  actions: Action[];
  /** Design system theme */
  theme?: 'curbos' | 'prepflow';
  /** Custom className for overlay container */
  className?: string;
  /** Called after any action is executed */
  onActionComplete?: () => void;
}

/**
 * Responsive card actions overlay component (desktop hover overlay)
 */
export function ResponsiveCardActionsOverlay({
  actions,
  theme = 'curbos',
  className = '',
  onActionComplete,
}: ResponsiveCardActionsOverlayProps) {
  if (!actions || actions.length === 0) {
    return null;
  }

  const handleAction = (action: Action) => {
    if (action.disabled) return;

    action.onClick();
    onActionComplete?.();
  };

  // Theme-based styling
  const themeStyles = {
    curbos: {
      container: 'bg-black/40 backdrop-blur-[2px]',
      buttonPrimary: 'bg-[#C0FF02] text-black hover:bg-background',
      buttonSecondary: 'bg-neutral-900/90 text-white',
      buttonDanger:
        'bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white',
    },
    prepflow: {
      container: 'bg-[var(--muted)]/90 backdrop-blur-sm',
      buttonPrimary: 'bg-[var(--primary)] text-[var(--primary-text)]',
      buttonSecondary: 'bg-[var(--muted)] text-[var(--foreground)]',
      buttonDanger:
        'bg-[var(--color-error-bg)] text-[var(--color-error)] border border-[var(--color-error-border)]',
    },
  };

  const styles = themeStyles[theme];

  return (
    <div
      className={`hover-capable-show absolute inset-0 flex ${styles.container} z-20 translate-y-4 items-center justify-center gap-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 ${className}`}
    >
      {actions.map(action => {
        const Icon = action.icon;
        const buttonClass =
          action.variant === 'primary'
            ? styles.buttonPrimary
            : action.variant === 'danger'
              ? styles.buttonDanger
              : styles.buttonSecondary;

        return (
          <button
            key={action.id}
            onClick={e => {
              e.stopPropagation();
              handleAction(action);
            }}
            disabled={action.disabled}
            className={`rounded-full p-3 shadow-lg transition-all hover:scale-110 ${buttonClass} ${
              action.disabled ? 'cursor-not-allowed opacity-50' : ''
            }`}
            title={action.label}
            aria-label={action.label}
          >
            <Icon size={18} strokeWidth={2.5} />
          </button>
        );
      })}
    </div>
  );
}
