'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

/**
 * Hook to check if a feature flag is enabled.
 * Fetches feature flag status from the API endpoint.
 *
 * @param {string} flagKey - Feature flag key to check
 * @returns {boolean} True if feature is enabled, false otherwise
 */
export function useFeatureFlag(flagKey: string): boolean {
  const { user } = useUser();
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkFeatureFlag() {
      try {
        const response = await fetch(`/api/features/${encodeURIComponent(flagKey)}`);
        if (response.ok) {
          const data = await response.json();
          setEnabled(data.enabled || false);
        } else {
          // If API fails, default to disabled
          setEnabled(false);
        }
      } catch (error) {
        // On error, default to disabled
        setEnabled(false);
      } finally {
        setLoading(false);
      }
    }

    checkFeatureFlag();
  }, [flagKey, user]);

  // Return false while loading to prevent flash of content
  return loading ? false : enabled;
}




