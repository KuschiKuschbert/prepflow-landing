/**
 * Login history section component.
 */
import { Icon } from '@/components/ui/Icon';
import { CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

interface LoginLog {
  id: string;
  ip_address: string | null;
  user_agent: string | null;
  location: string | null;
  successful: boolean;
  created_at: string;
}

interface LoginHistorySectionProps {
  loginHistory: LoginLog[];
}

function formatDate(dateString: string) {
  try {
    return new Date(dateString).toLocaleString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Invalid date';
  }
}

function getLocationDisplay(location: string | null, ip: string | null) {
  if (location) return location;
  if (ip) return ip;
  return 'Unknown';
}

export function LoginHistorySection({ loginHistory }: LoginHistorySectionProps) {
  return (
    <div className="space-y-3 border-t border-[var(--border)] pt-4">
      <h3 className="text-lg font-medium">Recent Login History</h3>
      {loginHistory.length === 0 ? (
        <p className="text-sm text-[var(--foreground-muted)]">
          No login history found. History will be tracked after data structure updates are applied.
        </p>
      ) : (
        <>
          <div className="space-y-2">
            {loginHistory.map(log => (
              <div
                key={log.id}
                className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--muted)]/20 p-3"
              >
                <div className="flex items-center gap-3">
                  {log.successful ? (
                    <Icon
                      icon={CheckCircle}
                      size="sm"
                      className="text-[var(--color-success)]"
                      aria-hidden={true}
                    />
                  ) : (
                    <Icon icon={XCircle} size="sm" className="text-[var(--color-error)]" aria-hidden={true} />
                  )}
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      {log.successful ? 'Successful login' : 'Failed login attempt'}
                    </p>
                    <div className="mt-0.5 flex items-center gap-3 text-xs text-[var(--foreground-muted)]">
                      <span>{getLocationDisplay(log.location, log.ip_address)}</span>
                      <span>{formatDate(log.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {loginHistory.length > 0 && (
            <Link
              href="/webapp/settings/security"
              className="block text-sm text-[var(--primary)] hover:underline"
            >
              View full login history →
            </Link>
          )}
        </>
      )}
    </div>
  );
}
