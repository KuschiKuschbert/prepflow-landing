interface UserProfile {
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  first_name_display: string | null;
  email: string;
  name?: string | null;
}

interface BuildProfileDataParams {
  userData: any;
  userEmail?: string | null;
  userName?: string | null;
}

/**
 * Build profile data from API response
 */
export function buildProfileData({
  userData,
  userEmail,
  userName,
}: BuildProfileDataParams): UserProfile {
  return {
    email: userData.email || userEmail || '',
    first_name: userData.first_name || null,
    last_name: userData.last_name || null,
    display_name: userData.display_name || null,
    first_name_display: userData.first_name_display || null,
    name: userData.name || userName || null,
  };
}
