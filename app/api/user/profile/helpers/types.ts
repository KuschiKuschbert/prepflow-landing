import { z } from 'zod';

export const profileUpdateSchema = z.object({
  first_name: z.string().max(100).optional(),
  last_name: z.string().max(100).optional(),
  business_name: z.string().max(255).optional(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

export interface UserProfile {
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  business_name?: string | null;
  created_at?: string;
  last_login?: string | null;
  email_verified: boolean;
}

export interface UserRecord {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  business_name?: string | null;
  created_at: string;
  updated_at: string;
  last_login?: string | null;
  email_verified?: boolean;
}
