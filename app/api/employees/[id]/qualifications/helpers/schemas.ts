import { z } from 'zod';

export const createQualificationSchema = z.object({
  qualification_type_id: z.string().min(1, 'qualification_type_id is required'),
  issue_date: z.string().min(1, 'issue_date is required'),
  certificate_number: z.string().optional(),
  expiry_date: z.string().optional(),
  issuing_authority: z.string().optional(),
  document_url: z.string().url().optional().or(z.literal('')),
  notes: z.string().optional(),
});

export const QUALIFICATION_SELECT = `
  *,
  qualification_types (
    id,
    name,
    description,
    is_required,
    default_expiry_days
  )
`;

export interface Qualification {
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
  qualification_types: {
    id: string;
    name: string;
    description: string | null;
    is_required: boolean;
    default_expiry_days: number | null;
  } | null;
}
