export interface ProfileData {
  email: string;
  first_name: string | null;
  last_name: string | null;
  business_name: string | null;
  created_at: string | null;
  last_login: string | null;
  email_verified: boolean;
}

export interface ProfileFormData {
  first_name: string;
  last_name: string;
  business_name: string;
}
