'use client';

import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { CheckCircle, XCircle, Shield, Clock } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import { fetchInParallel } from '@/lib/api/batch-utils';
import { useIsVisible } from '@/hooks/useIsVisible';

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

    const loadSecurityData = async () => {
      try {
        // Try to load from cache first for instant display
        const cachedSessions = getCachedData<Session[]>('security_sessions');
        const cachedHistory = getCachedData<LoginLog[]>('security_login_history');

        if (cachedSessions) {
          setSessions(cachedSessions);
        }
        if (cachedHistory) {
          setLoginHistory(cachedHistory);
        }

        // Fetch fresh data in parallel
        const [sessionsResult, historyResult] = await fetchInParallel(
          [
            async () => {
              const response = await fetch('/api/user/sessions');
              if (!response.ok) throw new Error('Failed to fetch sessions');
              const data = await response.json();
              return data.sessions || [];
            },
            async () => {
              const response = await fetch('/api/user/login-history?limit=10');
              if (!response.ok) throw new Error('Failed to fetch login history');
              const data = await response.json();
              return data.history || [];
            },
          ],
          {
            continueOnError: true,
            onError: (error, index) => {
              logger.error(`Failed to fetch security data (index ${index}):`, error);
            },
          },
        );

        // Update state with fresh data
        if (sessionsResult) {
          setSessions(sessionsResult);
          cacheData('security_sessions', sessionsResult, 2 * 60 * 1000); // 2 minutes
        }
        if (historyResult) {
          setLoginHistory(historyResult);
          cacheData('security_login_history', historyResult, 2 * 60 * 1000); // 2 minutes
        }
      } catch (error) {
        logger.error('Failed to load security data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSecurityData();
  }, [isVisible]);

  const handleRevokeSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to revoke this session? You will be signed out.')) {
      return;
    }

    setRevokingSession(sessionId);
    try {
      const response = await fetch(`/api/user/sessions/${sessionId}/revoke`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to revoke session');
      }

      if (data.sign_out_url) {
        // Redirect to sign out
        window.location.href = data.sign_out_url;
      } else {
        showSuccess('Session revoked successfully');
        // Reload sessions
        const sessionsResponse = await fetch('/api/user/sessions');
        if (sessionsResponse.ok) {
          const sessionsData = await sessionsResponse.json();
          setSessions(sessionsData.sessions || []);
        }
      }
    } catch (error) {
      logger.error('Failed to revoke session:', error);
      showError(error instanceof Error ? error.message : 'Failed to revoke session');
    } finally {
      setRevokingSession(null);
    }
  };

  const formatDate = (dateString: string) => {
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
  };

  const getLocationDisplay = (location: string | null, ip: string | null) => {
    if (location) return location;
    if (ip) return ip;
    return 'Unknown';
  };

  if (loading) {
    return (
      <div
        ref={ref}
        className="mb-6 space-y-4 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6"
      >
        <div className="h-6 w-48 animate-pulse rounded bg-[#2a2a2a]" />
        <div className="h-4 w-64 animate-pulse rounded bg-[#2a2a2a]" />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="mb-6 space-y-6 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6"
    >
      <div>
        <h2 className="text-xl font-semibold">Account Security</h2>
        <p className="mt-1 text-sm text-gray-300">
          Manage your account security settings and monitor login activity.
        </p>
      </div>

      {/* Password Management */}
      <div className="space-y-3 border-t border-[#2a2a2a] pt-4">
        <h3 className="text-lg font-medium">Password</h3>
        <p className="text-sm text-gray-400">
          Your password is managed by Auth0. To change your password, please visit your Auth0
          dashboard or use the password reset feature.
        </p>
        <div className="flex gap-3">
          <Link
            href="/api/auth/signout"
            className="rounded-2xl border border-[#2a2a2a] px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-[#2a2a2a]/40"
          >
            Sign Out
          </Link>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="space-y-3 border-t border-[#2a2a2a] pt-4">
        <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
        <p className="text-sm text-gray-400">
          2FA is managed through Auth0. Enable it in your Auth0 dashboard for enhanced security.
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Icon icon={Shield} size="sm" aria-hidden={true} />
          <span>Configure in Auth0 dashboard</span>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="space-y-3 border-t border-[#2a2a2a] pt-4">
        <h3 className="text-lg font-medium">Active Sessions</h3>
        {sessions.length === 0 ? (
          <p className="text-sm text-gray-400">No active sessions found.</p>
        ) : (
          <div className="space-y-3">
            {sessions.map(session => (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/20 p-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-white">{session.user_agent}</p>
                    {session.is_current && (
                      <span className="rounded-full bg-[#29E7CD]/10 px-2 py-0.5 text-xs text-[#29E7CD]">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-4 text-xs text-gray-400">
                    <span>{getLocationDisplay(session.location, session.ip_address)}</span>
                    <span className="flex items-center gap-1">
                      <Icon icon={Clock} size="xs" aria-hidden={true} />
                      {formatDate(session.created_at)}
                    </span>
                  </div>
                </div>
                {!session.is_current && (
                  <button
                    onClick={() => handleRevokeSession(session.id)}
                    disabled={revokingSession === session.id}
                    className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                  >
                    {revokingSession === session.id ? 'Revoking...' : 'Revoke'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Login History */}
      <div className="space-y-3 border-t border-[#2a2a2a] pt-4">
        <h3 className="text-lg font-medium">Recent Login History</h3>
        {loginHistory.length === 0 ? (
          <p className="text-sm text-gray-400">
            No login history found. History will be tracked after database migration is applied.
          </p>
        ) : (
          <div className="space-y-2">
            {loginHistory.map(log => (
              <div
                key={log.id}
                className="flex items-center justify-between rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/20 p-3"
              >
                <div className="flex items-center gap-3">
                  {log.successful ? (
                    <Icon
                      icon={CheckCircle}
                      size="sm"
                      className="text-green-400"
                      aria-hidden={true}
                    />
                  ) : (
                    <Icon icon={XCircle} size="sm" className="text-red-400" aria-hidden={true} />
                  )}
                  <div>
                    <p className="text-sm font-medium text-white">
                      {log.successful ? 'Successful login' : 'Failed login attempt'}
                    </p>
                    <div className="mt-0.5 flex items-center gap-3 text-xs text-gray-400">
                      <span>{getLocationDisplay(log.location, log.ip_address)}</span>
                      <span>{formatDate(log.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {loginHistory.length > 0 && (
          <Link
            href="/webapp/settings/security"
            className="block text-sm text-[#29E7CD] hover:underline"
          >
            View full login history →
          </Link>
        )}
      </div>
    </div>
  );
}
