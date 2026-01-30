import { z } from 'zod';

export const createQualificationSchema = z.object({
  qualification_type_id: z.string().uuid('Invalid qualification type ID'),
  issue_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  certificate_number: z.string().optional().nullable(),
  expiry_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
    .optional()
    .nullable(),
  issuing_authority: z.string().optional().nullable(),
  document_url: z.string().url().optional().nullable().or(z.literal('')),
  notes: z.string().optional().nullable(),
});

export const onboardingDocumentSchema = z.object({
  document_type: z.enum(['id', 'contract', 'tax_form', 'bank_details']),
  file_url: z.string().url().optional().nullable(),
  signature_data: z.string().optional().nullable(),
  signed_at: z.string().optional().nullable(),
});

export const createEmployeeSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional().nullable(),
  role: z.enum(['admin', 'manager', 'staff']).optional().default('staff'),
  status: z.enum(['active', 'inactive', 'terminated']).optional().default('active'),
  onboarding_status: z.enum(['pending', 'in_progress', 'completed']).optional().default('pending'),
  employment_type: z.enum(['full-time', 'part-time', 'casual']).optional().default('casual'),
  employment_start_date: z.string().optional().nullable(),
  employment_end_date: z.string().optional().nullable(),
  hourly_rate: z.number().nonnegative().optional().default(0),
  saturday_rate: z.number().nonnegative().optional().nullable(),
  sunday_rate: z.number().nonnegative().optional().nullable(),
  skills: z.array(z.string()).optional().nullable(),
  bank_account_bsb: z.string().optional().nullable(),
  bank_account_number: z.string().optional().nullable(),
  tax_file_number: z.string().optional().nullable(),
  emergency_contact_name: z.string().optional().nullable(),
  emergency_contact_phone: z.string().optional().nullable(),
  photo_url: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  user_id: z.string().uuid().optional().nullable(),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = Partial<CreateEmployeeInput>;

export interface QualificationType {
  id: string;
  name: string;
  description: string | null;
  is_required: boolean;
  default_expiry_days: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmployeeQualification {
  id: string;
  employee_id: string;
  qualification_type_id: string;
  certificate_number: string | null;
  issue_date: string;
  expiry_date: string | null;
  issuing_authority: string | null;
  document_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  qualification_types?: QualificationType;
}

export interface Employee extends CreateEmployeeInput {
  id: string;
  created_at: string;
  updated_at: string;
  full_name?: string;
  employee_qualifications?: (EmployeeQualification & { qualification_types: QualificationType })[];
}
