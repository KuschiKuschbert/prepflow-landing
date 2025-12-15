/**
 * Handle session revocation.
 */
import { logger } from '@/lib/logger';

interface Session {
  id: string;
  user_agent: string;
  ip_address: string | null;
  location: string | null;
  created_at: string;
  expires_at: number | null;
  is_current: boolean;
}

export async function handleRevokeSessionHelper(
  sessionId: string,
  setRevokingSession: (id: string | null) => void,
  setSessions: (sessions: Session[]) => void,
  showSuccess: (message: string) => void,
  showError: (message: string) => void,
): Promise<void> {
  if (!confirm('Are you sure you want to revoke this session? You will be signed out.')) return;
  setRevokingSession(sessionId);
  try {
    const response = await fetch(`/api/user/sessions/${sessionId}/revoke`, { method: 'POST' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || data.message || 'Failed to revoke session');
    if (data.sign_out_url) {
      window.location.href = data.sign_out_url;
    } else {
      showSuccess('Session revoked successfully');
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
}
