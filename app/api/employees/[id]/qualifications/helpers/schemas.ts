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
