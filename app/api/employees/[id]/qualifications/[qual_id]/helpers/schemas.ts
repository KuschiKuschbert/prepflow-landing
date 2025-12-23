import { z } from 'zod';

export const updateQualificationSchema = z.object({
  certificate_number: z.string().optional(),
  issue_date: z.string().optional(),
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
