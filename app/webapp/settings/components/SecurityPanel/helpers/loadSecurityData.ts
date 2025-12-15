/**
 * Load security data (sessions and login history).
 */
import { fetchInParallel } from '@/lib/api/batch-utils';
import { cacheData, getCachedData } from '@/lib/cache/data-cache';
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

interface LoginLog {
  id: string;
  ip_address: string | null;
  user_agent: string | null;
  location: string | null;
  successful: boolean;
  created_at: string;
}

export async function loadSecurityDataHelper(
  setSessions: (sessions: Session[]) => void,
  setLoginHistory: (history: LoginLog[]) => void,
  setLoading: (loading: boolean) => void,
): Promise<void> {
  try {
    const cachedSessions = getCachedData<Session[]>('security_sessions');
    const cachedHistory = getCachedData<LoginLog[]>('security_login_history');
    if (cachedSessions) setSessions(cachedSessions);
    if (cachedHistory) setLoginHistory(cachedHistory);
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
    if (sessionsResult) {
      setSessions(sessionsResult);
      cacheData('security_sessions', sessionsResult, 2 * 60 * 1000);
    }
    if (historyResult) {
      setLoginHistory(historyResult);
      cacheData('security_login_history', historyResult, 2 * 60 * 1000);
    }
  } catch (error) {
    logger.error('Failed to load security data:', error);
  } finally {
    setLoading(false);
  }
}
