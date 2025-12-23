'use client';


export interface ToggleProps {
  /**
   * Whether the toggle is checked/enabled
   */
  checked: boolean;
  /**
   * Callback when toggle state changes
   */
  onChange: (checked: boolean) => void;
  /**
   * Label for accessibility (required)
   */
  'aria-label': string;
  /**
   * Whether the toggle is disabled
   */
  disabled?: boolean;
  /**
   * Additional CSS classes for the toggle button
   */
  className?: string;
  /**
   * Variant style for the toggle
   */
  variant?: 'default' | 'gradient';
}

/**
 * Standardized toggle switch component following Cyber Carrot Design System.
 * Provides consistent sizing, accessibility, and styling across the application.
 *
 * @component
 * @param {ToggleProps} props - Component props
 * @returns {JSX.Element} Toggle switch button
 *
 * @example
 * ```tsx
 * <Toggle
 *   checked={isEnabled}
 *   onChange={setIsEnabled}
 *   aria-label="Enable notifications"
 *   disabled={loading}
 * />
 * ```
 */
export function Toggle({
  checked,
  onChange,
  'aria-label': ariaLabel,
  disabled = false,
  className = '',
  variant = 'default',
}: ToggleProps) {
  const baseClasses =
    'relative inline-flex items-center h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border transition-all focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--muted)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50';

  const borderClasses = checked
    ? 'border-[var(--primary)]/30'
    : 'border-[var(--border)]/60';

  const backgroundClasses =
    variant === 'gradient'
      ? checked
        ? 'bg-gradient-to-r from-[var(--primary)]/70 to-[var(--accent)]/70'
        : 'bg-[var(--muted)]'
      : checked
        ? 'bg-[var(--primary)]/70'
        : 'bg-[var(--muted)]';

  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`${baseClasses} ${borderClasses} ${backgroundClasses} ${className}`}
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      type="button"
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-gray-200 shadow-sm ring-0 transition-transform ${
          checked ? 'translate-x-[22px]' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}
