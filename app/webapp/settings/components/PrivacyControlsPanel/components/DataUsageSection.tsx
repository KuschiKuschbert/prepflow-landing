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

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DataUsageSection({ dataUsage }: DataUsageSectionProps) {
  return (
    <div className="space-y-3 border-t border-[#2a2a2a] pt-4">
      <div className="flex items-center gap-2">
        <Icon icon={Database} size="md" className="text-[#29E7CD]" aria-hidden={true} />
        <h3 className="text-lg font-medium">Data Usage</h3>
      </div>
      <div className="desktop:grid-cols-2 grid grid-cols-1 gap-3">
        {Object.entries(dataUsage.usage).map(([key, value]) => (
          <div key={key} className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/20 p-3">
            <p className="text-xs text-gray-500 capitalize">{key.replace(/_/g, ' ')}</p>
            <div className="mt-1 flex items-baseline gap-2">
              <p className="text-lg font-semibold text-white">{value.count.toLocaleString()}</p>
              <p className="text-xs text-gray-400">({formatFileSize(value.size_bytes)})</p>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-[#29E7CD]/20 bg-[#29E7CD]/5 p-3">
        <p className="text-xs text-gray-500">Total Storage</p>
        <p className="text-lg font-semibold text-[#29E7CD]">
          {formatFileSize(dataUsage.total_size_bytes)}
        </p>
      </div>
    </div>
  );
}
