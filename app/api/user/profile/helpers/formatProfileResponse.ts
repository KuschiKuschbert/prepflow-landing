import type { UserProfile } from './types';

/**
 * Format profile response data
 */
export function formatProfileResponse(
  data: Record<string, unknown>,
  userEmail: string,
): UserProfile {
  return {
    email: (data.email as string) || userEmail,
    first_name: data.first_name as string | null | undefined,
    last_name: data.last_name as string | null | undefined,
    business_name: data.business_name as string | null | undefined,
    created_at: data.created_at as string | undefined,
    last_login: data.last_login as string | null | undefined,
    email_verified: (data.email_verified as boolean) || false,
  };
}
