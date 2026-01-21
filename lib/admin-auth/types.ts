export type AdminRole = 'admin' | 'super_admin';

export interface SupabaseAdmin {
  from: (table: string) => any;
}

export interface AdminUser {
  id: string;
  email: string;
  role: AdminRole;
}
