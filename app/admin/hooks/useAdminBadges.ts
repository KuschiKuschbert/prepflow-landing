import { logger } from '@/lib/logger';
import { useEffect, useState } from 'react';

export function useAdminBadges() {
  const [unresolvedTicketsCount, setUnresolvedTicketsCount] = useState(0);
  const [unresolvedErrorsCount, setUnresolvedErrorsCount] = useState(0);

  useEffect(() => {
    async function fetchUnresolvedCount() {
      try {
        // Fetch unresolved tickets (open or investigating)
        const [openResponse, investigatingResponse] = await Promise.all([
          fetch('/api/admin/support-tickets?status=open&pageSize=1'),
          fetch('/api/admin/support-tickets?status=investigating&pageSize=1'),
        ]);

        let count = 0;
        if (openResponse.ok) {
          const openData = await openResponse.json();
          count += openData.total || 0;
        }
        if (investigatingResponse.ok) {
          const investigatingData = await investigatingResponse.json();
          count += investigatingData.total || 0;
        }

        setUnresolvedTicketsCount(count);
      } catch (error) {
        // Don't break navigation, but log for debugging
        logger.dev('[useAdminBadges] Error fetching unresolved tickets count (non-blocking):', {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    fetchUnresolvedCount();
    const interval = setInterval(fetchUnresolvedCount, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchUnresolvedErrors() {
      try {
        // Fetch unresolved errors (new or investigating, safety or critical severity)
        const response = await fetch('/api/admin/errors?status=new&severity=safety&pageSize=1');
        if (response.ok) {
          const data = await response.json();
          // Also count critical errors
          const criticalResponse = await fetch(
            '/api/admin/errors?status=new&severity=critical&pageSize=1',
          );
          let count = data.total || 0;
          if (criticalResponse.ok) {
            const criticalData = await criticalResponse.json();
            count += criticalData.total || 0;
          }
          // Also count investigating status
          const investigatingResponse = await fetch(
            '/api/admin/errors?status=investigating&severity=safety&pageSize=1',
          );
          if (investigatingResponse.ok) {
            const investigatingData = await investigatingResponse.json();
            count += investigatingData.total || 0;
          }
          const investigatingCriticalResponse = await fetch(
            '/api/admin/errors?status=investigating&severity=critical&pageSize=1',
          );
          if (investigatingCriticalResponse.ok) {
            const investigatingCriticalData = await investigatingCriticalResponse.json();
            count += investigatingCriticalData.total || 0;
          }
          setUnresolvedErrorsCount(count);
        }
      } catch (error) {
        // Don't break navigation, but log for debugging
        logger.dev('[useAdminBadges] Error fetching unresolved errors count (non-blocking):', {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    fetchUnresolvedErrors();
    const interval = setInterval(fetchUnresolvedErrors, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return { unresolvedTicketsCount, unresolvedErrorsCount };
}
