import { Icon } from '@/components/ui/Icon';
import { Shield } from 'lucide-react';
import Link from 'next/link';

interface SafetyError {
  id: string;
  error_message: string;
  severity: string;
  status: string;
  created_at: string;
}

interface CriticalAlertsProps {
  criticalErrors: number;
  recentSafetyErrors: SafetyError[];
}

export function CriticalAlerts({ criticalErrors, recentSafetyErrors }: CriticalAlertsProps) {
  if (criticalErrors === 0 && recentSafetyErrors.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
      <div className="mb-4 flex items-center gap-3">
        <Icon icon={Shield} size="lg" className="text-red-400" />
        <h2 className="text-xl font-bold text-red-400">Critical Safety Issues</h2>
      </div>
      {criticalErrors > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-white">
            <span className="font-bold text-red-400">{criticalErrors}</span> critical errors require
            immediate attention
          </p>
          <Link
            href="/admin/errors?severity=safety&severity=critical&status=new&status=investigating"
            className="text-[#29E7CD] underline transition-colors hover:text-[#29E7CD]/80"
          >
            View Critical Errors →
          </Link>
        </div>
      )}
      {recentSafetyErrors.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-gray-300">Recent Safety Issues:</p>
          <ul className="space-y-2">
            {recentSafetyErrors.map(error => (
              <li key={error.id} className="text-sm text-gray-300">
                <Link
                  href={`/admin/errors?search=${encodeURIComponent(error.error_message.substring(0, 50))}`}
                  className="transition-colors hover:text-[#29E7CD]"
                >
                  {error.error_message.substring(0, 100)}
                  {error.error_message.length > 100 ? '...' : ''}
                </Link>
                <span className="ml-2 text-gray-500">
                  {new Date(error.created_at).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
