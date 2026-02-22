/**
 * Data usage section component.
 */
import { Icon } from '@/components/ui/Icon';
import { Database } from 'lucide-react';

interface DataUsage {
  usage: {
    ingredients: { count: number; size_bytes: number };
    recipes: { count: number; size_bytes: number };
    dishes: { count: number; size_bytes: number };
    temperature_logs: { count: number; size_bytes: number };
    cleaning_tasks: { count: number; size_bytes: number };
    compliance_records: { count: number; size_bytes: number };
  };
  total_size_bytes: number;
}

interface DataUsageSectionProps {
  dataUsage: DataUsage;
}

import { DATA_SIZE_CONSTANTS } from '@/lib/constants';

function formatFileSize(bytes: number) {
  if (bytes < DATA_SIZE_CONSTANTS.BYTES_PER_KB) return `${bytes} B`;
  if (bytes < DATA_SIZE_CONSTANTS.BYTES_PER_MB)
    return `${(bytes / DATA_SIZE_CONSTANTS.BYTES_PER_KB).toFixed(1)} KB`;
  return `${(bytes / DATA_SIZE_CONSTANTS.BYTES_PER_MB).toFixed(1)} MB`;
}

export function DataUsageSection({ dataUsage }: DataUsageSectionProps) {
  return (
    <div className="space-y-3 border-t border-[var(--border)] pt-4">
      <div className="flex items-center gap-2">
        <Icon icon={Database} size="md" className="text-[var(--primary)]" aria-hidden={true} />
        <h3 className="text-lg font-medium text-[var(--foreground)]">Data Usage</h3>
      </div>
      <div className="desktop:grid-cols-2 grid grid-cols-1 gap-3">
        {Object.entries(dataUsage.usage).map(([key, value]) => (
          <div
            key={key}
            className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/20 p-3"
          >
            <p className="text-xs text-[var(--foreground-subtle)] capitalize">
              {key.replace(/_/g, ' ')}
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <p className="text-lg font-semibold text-[var(--foreground)]">
                {value.count.toLocaleString()}
              </p>
              <p className="text-xs text-[var(--foreground-muted)]">
                ({formatFileSize(value.size_bytes)})
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/5 p-3">
        <p className="text-xs text-[var(--foreground-subtle)]">Total Storage</p>
        <p className="text-lg font-semibold text-[var(--primary)]">
          {formatFileSize(dataUsage.total_size_bytes)}
        </p>
      </div>
    </div>
  );
}
