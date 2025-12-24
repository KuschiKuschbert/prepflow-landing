'use client';

import { Icon } from '@/components/ui/Icon';
import { Toggle } from '@/components/ui/Toggle';
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
          <Icon icon={Shield} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Auto-Report Errors</h3>
        </div>
        <p className="text-sm text-[var(--foreground-muted)]">
          Automatically create support tickets for critical and safety errors. This helps us fix
          issues faster.
        </p>
      </div>
      <Toggle
        checked={enabled}
        onChange={onToggle}
        aria-label={`${enabled ? 'Disable' : 'Enable'} auto-reporting`}
        disabled={loading}
        variant="gradient"
        className="ml-4"
      />
    </div>
  );
}
