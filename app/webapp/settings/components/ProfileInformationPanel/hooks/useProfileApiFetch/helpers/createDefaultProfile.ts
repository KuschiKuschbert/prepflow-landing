/**
 * Create default profile from session email.
 */
import type { ProfileData } from '../../../types';

export function createDefaultProfile(sessionEmail: string): ProfileData {
  return {
    email: sessionEmail,
    first_name: null,
    last_name: null,
    business_name: null,
    created_at: null,
    last_login: null,
    email_verified: false,
  };
}
