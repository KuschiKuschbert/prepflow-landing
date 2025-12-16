'use client';

import { Icon } from '@/components/ui/Icon';
import { useNotification } from '@/contexts/NotificationContext';
import { useIsVisible } from '@/hooks/useIsVisible';
import { Shield } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ActiveSessionsSection } from './SecurityPanel/components/ActiveSessionsSection';
import { LoginHistorySection } from './SecurityPanel/components/LoginHistorySection';
import { loadSecurityDataHelper } from './SecurityPanel/helpers/loadSecurityData';
import { handleRevokeSessionHelper } from './SecurityPanel/helpers/handleRevokeSession';

interface Session {
  id: string;
  user_agent: string;
  ip_address: string | null;
  location: string | null;
  created_at: string;
  expires_at: number | null;
  is_current: boolean;
}

interface LoginLog {
  id: string;
  ip_address: string | null;
  user_agent: string | null;
  location: string | null;
  successful: boolean;
  created_at: string;
}

/**
 * Security panel component for settings page.
 * Displays security settings, active sessions, and login history.
 *
 * @component
 * @returns {JSX.Element} Security panel
 */
export function SecurityPanel() {
  const { showSuccess, showError } = useNotification();
  const [ref, isVisible] = useIsVisible<HTMLDivElement>({ threshold: 0.1 });
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loginHistory, setLoginHistory] = useState<LoginLog[]>([]);
  const [revokingSession, setRevokingSession] = useState<string | null>(null);

  useEffect(() => {
    if (!isVisible) return;
    loadSecurityDataHelper(setSessions, setLoginHistory, setLoading);
  }, [isVisible]);

  const handleRevokeSession = (sessionId: string) =>
    handleRevokeSessionHelper(sessionId, setRevokingSession, setSessions, showSuccess, showError);

  if (loading) {
    return (
      <div
        ref={ref}
        className="mb-6 space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50 p-6"
      >
        <div className="h-6 w-48 animate-pulse rounded bg-[var(--muted)]" />
        <div className="h-4 w-64 animate-pulse rounded bg-[var(--muted)]" />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="mb-6 space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50 p-6"
    >
      <div>
        <h2 className="text-xl font-semibold">Account Security</h2>
        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Manage your account security settings and monitor login activity.
        </p>
      </div>

      {/* Password Management */}
      <div className="space-y-3 border-t border-[var(--border)] pt-4">
        <h3 className="text-lg font-medium">Password</h3>
        <p className="text-sm text-[var(--foreground-muted)]">
          Your password is managed by Auth0. To change your password, please visit your Auth0
          dashboard or use the password reset feature.
        </p>
        <div className="flex gap-3">
          <Link
            href="/api/auth/signout"
            className="rounded-2xl border border-[var(--border)] px-4 py-2 text-sm text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--muted)]/40"
          >
            Sign Out
          </Link>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="space-y-3 border-t border-[var(--border)] pt-4">
        <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
        <p className="text-sm text-[var(--foreground-muted)]">
          2FA is managed through Auth0. Enable it in your Auth0 dashboard for enhanced security.
        </p>
        <div className="flex items-center gap-2 text-sm text-[var(--foreground-subtle)]">
          <Icon icon={Shield} size="sm" aria-hidden={true} />
          <span>Configure in Auth0 dashboard</span>
        </div>
      </div>

      <ActiveSessionsSection
        sessions={sessions}
        revokingSession={revokingSession}
        onRevokeSession={handleRevokeSession}
      />
      <LoginHistorySection loginHistory={loginHistory} />
    </div>
  );
}
