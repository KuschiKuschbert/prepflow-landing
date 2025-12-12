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
        <Icon icon={AlertCircle} size="xl" className="text-yellow-400" aria-hidden={true} />
        <div>
          <h2 id="dialog-title" className="text-fluid-xl font-bold text-white">
            Changes Detected While Menu Was Locked
          </h2>
          <p id="dialog-description" className="mt-1 text-sm text-gray-400">
            {summary} changed while this menu was locked. Prices need to be recalculated.
          </p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-white focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
        aria-label="Close dialog"
      >
        <Icon icon={X} size="md" aria-hidden={true} />
      </button>
    </div>
  );
}




