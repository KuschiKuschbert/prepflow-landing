'use client';

/**
 * Active sessions section component.
 */
import { Icon } from '@/components/ui/Icon';
import { Clock } from 'lucide-react';

interface Session {
  id: string;
  user_agent: string;
  ip_address: string | null;
  location: string | null;
  created_at: string;
  expires_at: number | null;
  is_current: boolean;
}

interface ActiveSessionsSectionProps {
  sessions: Session[];
  revokingSession: string | null;
  onRevokeSession: (sessionId: string) => void;
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

export function ActiveSessionsSection({
  sessions,
  revokingSession,
  onRevokeSession,
}: ActiveSessionsSectionProps) {
  return (
    <div className="space-y-3 border-t border-[var(--border)] pt-4">
      <h3 className="text-lg font-medium">Active Sessions</h3>
      {sessions.length === 0 ? (
        <p className="text-sm text-[var(--foreground-muted)]">No active sessions found.</p>
      ) : (
        <div className="space-y-3">
          {sessions.map(session => (
            <div
              key={session.id}
              className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--muted)]/20 p-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-[var(--foreground)]">{session.user_agent}</p>
                  {session.is_current && (
                    <span className="rounded-full bg-[var(--primary)]/10 px-2 py-0.5 text-xs text-[var(--primary)]">
                      Current
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-4 text-xs text-[var(--foreground-muted)]">
                  <span>{getLocationDisplay(session.location, session.ip_address)}</span>
                  <span className="flex items-center gap-1">
                    <Icon icon={Clock} size="xs" aria-hidden={true} />
                    {formatDate(session.created_at)}
                  </span>
                </div>
              </div>
              {!session.is_current && (
                <button
                  onClick={() => onRevokeSession(session.id)}
                  disabled={revokingSession === session.id}
                  className="rounded-xl border border-[var(--color-error)]/30 bg-[var(--color-error)]/10 px-3 py-1.5 text-xs text-[var(--color-error)] transition-colors hover:bg-[var(--color-error)]/20 disabled:opacity-50"
                >
                  {revokingSession === session.id ? 'Revoking...' : 'Revoke'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
