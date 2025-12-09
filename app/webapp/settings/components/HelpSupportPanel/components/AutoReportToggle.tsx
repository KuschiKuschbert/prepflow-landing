import { Icon } from '@/components/ui/Icon';
import { Shield } from 'lucide-react';

interface AutoReportToggleProps {
  enabled: boolean;
  loading: boolean;
  onToggle: (enabled: boolean) => void;
}

/**
 * Auto-report toggle component
 */
export function AutoReportToggle({ enabled, loading, onToggle }: AutoReportToggleProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="mb-1 flex items-center gap-2">
          <Icon icon={Shield} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
          <h3 className="text-lg font-semibold text-white">Auto-Report Errors</h3>
        </div>
        <p className="text-sm text-gray-400">
          Automatically create support tickets for critical and safety errors. This helps us fix
          issues faster.
        </p>
      </div>
      <button
        onClick={() => onToggle(!enabled)}
        disabled={loading}
        className={`ml-4 flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${
          enabled ? 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7]' : 'bg-[#2a2a2a]'
        }`}
        aria-label={`${enabled ? 'Disable' : 'Enable'} auto-reporting`}
      >
        <span
          className={`h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}
