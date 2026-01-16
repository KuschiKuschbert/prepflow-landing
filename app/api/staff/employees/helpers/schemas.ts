import { z } from 'zod';

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;

export interface Employee {
  id: string;
  user_id?: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  role: 'admin' | 'manager' | 'staff';
  employment_type: 'full-time' | 'part-time' | 'casual';
  hourly_rate: number;
  saturday_rate?: number | null;
  sunday_rate?: number | null;
  skills?: string[] | null;
  bank_account_bsb?: string | null;
  bank_account_number?: string | null;
  tax_file_number?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const createEmployeeSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional().nullable(),
  role: z.enum(['admin', 'manager', 'staff']).optional().default('staff'),
  employment_type: z.enum(['full-time', 'part-time', 'casual']).optional().default('casual'),
  hourly_rate: z.number().nonnegative().optional().default(0),
  saturday_rate: z.number().nonnegative().optional().nullable(),
  sunday_rate: z.number().nonnegative().optional().nullable(),
  skills: z.array(z.string()).optional().nullable(),
  bank_account_bsb: z.string().optional().nullable(),
  bank_account_number: z.string().optional().nullable(),
  tax_file_number: z.string().optional().nullable(),
  emergency_contact_name: z.string().optional().nullable(),
  emergency_contact_phone: z.string().optional().nullable(),
  user_id: z.string().uuid().optional().nullable(),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = Partial<CreateEmployeeInput>;

export interface Employee extends CreateEmployeeInput {
  id: string;
  created_at: string;
  updated_at: string;
  // Add other DB fields if necessary
}
