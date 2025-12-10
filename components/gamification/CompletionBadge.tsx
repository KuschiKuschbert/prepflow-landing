/**
 * Completion Badge Component
 *
 * Small contextual badges showing progress hints.
 * Example: "Add 3 more ingredients to unlock Stock Master 🥬"
 */

'use client';

interface CompletionBadgeProps {
  /**
   * Badge message
   */
  message: string;

  /**
   * Optional icon/emoji
   */
  icon?: string;

  /**
   * Optional variant
   */
  variant?: 'info' | 'hint' | 'milestone';

  /**
   * Optional className
   */
  className?: string;
}

const variantStyles = {
  info: 'border-[#29E7CD]/30 bg-[#29E7CD]/10 text-[#29E7CD]',
  hint: 'border-[#2a2a2a] bg-[#1f1f1f] text-gray-300',
  milestone: 'border-[#FF6B00]/30 bg-[#FF6B00]/10 text-[#FF6B00]',
};

export function CompletionBadge({
  message,
  icon,
  variant = 'hint',
  className = '',
}: CompletionBadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {icon && <span>{icon}</span>}
      <span>{message}</span>
    </div>
  );
}



