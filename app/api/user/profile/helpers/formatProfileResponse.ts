/**
 * Format profile response data
 */
export function formatProfileResponse(data: any, userEmail: string): any {
  return {
    email: data.email || userEmail,
    first_name: data.first_name,
    last_name: data.last_name,
    business_name: data.business_name,
    created_at: data.created_at,
    last_login: data.last_login,
    email_verified: data.email_verified || false,
  };
}
