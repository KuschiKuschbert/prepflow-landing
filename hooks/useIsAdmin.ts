'use client';

import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';

/**
 * Hook to check if current user is an admin (email in ALLOWED_EMAILS)
 *
 * @returns {Object} Admin status hook
 * @returns {boolean} returns.isAdmin - True if user is admin
 * @returns {boolean} returns.loading - Loading state
 *
 * @example
 * ```typescript
 * const { isAdmin, loading } = useIsAdmin();
 * if (isAdmin) {
 *   // Show admin features
 * }
 * ```
 */
export function useIsAdmin(): { isAdmin: boolean; loading: boolean } {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch('/api/admin/check');
        const data = await response.json();

        if (response.ok) {
          setIsAdmin(data.isAdmin || false);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        logger.error('[useIsAdmin] Error checking admin status:', {
          error: error instanceof Error ? error.message : String(error),
        });
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  return { isAdmin, loading };
}



