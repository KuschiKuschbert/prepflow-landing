'use client';

import { logger } from '@/lib/logger';
import { useEffect, useState } from 'react';
import CustomerDisplay from '../../display/page';

/**
 * Public CurbOS display page (no authentication required)
 * Validates token and shows read-only display view
 */
export default function PublicCurbOSDisplay({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    async function validateToken() {
      const resolvedParams = await params;
      const tokenValue = resolvedParams.token;
      setToken(tokenValue);

      try {
        // Validate token via API (server-side validation)
        const response = await fetch(
          `/api/curbos/public/validate?token=${encodeURIComponent(tokenValue)}`,
        );
        if (response.ok) {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch (error) {
        logger.error('[Public CurbOS] Error validating token:', {
          error: error instanceof Error ? error.message : String(error),
        });
        setIsValid(false);
      }
    }

    validateToken();
  }, [params]);

  if (isValid === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-[#C0FF02]"></div>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Invalid Link</h1>
          <p className="text-gray-400">This display link is invalid or has been deactivated.</p>
        </div>
      </div>
    );
  }

  // Show read-only display (same component as /curbos/display but without admin controls)
  return <CustomerDisplay />;
}
