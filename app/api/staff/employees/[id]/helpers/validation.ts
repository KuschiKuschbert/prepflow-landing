import { z } from 'zod';

export const updateEmployeeSchema = z.object({
  first_name: z.string().min(1, 'First name is required').optional(),
  last_name: z.string().min(1, 'Last name is required').optional(),
  email: z.string().email('Invalid email format').optional(),
  phone: z.string().optional().nullable(),
  role: z.enum(['admin', 'manager', 'staff']).optional(),
  employment_type: z.enum(['full-time', 'part-time', 'casual']).optional(),
  hourly_rate: z.number().nonnegative().optional(),
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

export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
