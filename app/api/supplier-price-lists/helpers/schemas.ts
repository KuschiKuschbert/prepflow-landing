import { z } from 'zod';

export const createPriceListSchema = z.object({
  supplier_id: z.union([z.string(), z.number()]).transform(val => String(val)),
  document_name: z.string().min(1, 'Document name is required'),
  document_url: z.string().url('Invalid document URL').optional().nullable(),
  effective_date: z.string().datetime().optional().nullable(),
  expiry_date: z.string().datetime().optional().nullable(),
  notes: z.string().optional().nullable(),
  is_current: z.boolean().optional().default(false),
});
