interface UserProfile {
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  first_name_display: string | null;
  email: string;
  name?: string | null;
}

/**
 * Build fallback profile from session data
 */
export function buildFallbackProfile(
  userEmail?: string | null,
  userName?: string | null,
): UserProfile {
  return {
    email: userEmail || '',
    first_name: null,
    last_name: null,
    display_name: null,
    first_name_display: null,
    name: userName || null,
  };
}

