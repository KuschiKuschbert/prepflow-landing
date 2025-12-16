import { Icon } from '@/components/ui/Icon';
import { AlertCircle, X } from 'lucide-react';

interface DialogHeaderProps {
  summary: string;
  onClose: () => void;
}

/**
 * Component for the dialog header
 */
export function DialogHeader({ summary, onClose }: DialogHeaderProps) {
  return (
    <div className="mb-6 flex items-start justify-between">
      <div className="flex items-center gap-3">
        <Icon icon={AlertCircle} size="xl" className="text-[var(--color-warning)]" aria-hidden={true} />
        <div>
          <h2 id="dialog-title" className="text-fluid-xl font-bold text-[var(--foreground)]">
            Changes Detected While Menu Was Locked
          </h2>
          <p id="dialog-description" className="mt-1 text-sm text-[var(--foreground-muted)]">
            {summary} changed while this menu was locked. Prices need to be recalculated.
          </p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="rounded-lg p-2 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
        aria-label="Close dialog"
      >
        <Icon icon={X} size="md" aria-hidden={true} />
      </button>
    </div>
  );
}



