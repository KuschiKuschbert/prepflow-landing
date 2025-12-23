import { z } from 'zod';

export const createSupplierSchema = z.object({
  supplier_name: z.string().min(1, 'Supplier name is required'),
  contact_name: z.string().optional(),
  contact_email: z.string().email().optional().or(z.literal('')),
  contact_phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  is_active: z.boolean().optional(),
});

export const updateSupplierSchema = z.object({
  id: z.string().min(1, 'Supplier ID is required'),
  supplier_name: z.string().optional(),
  contact_name: z.string().optional(),
  contact_email: z.string().email().optional().or(z.literal('')),
  contact_phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  is_active: z.boolean().optional(),
});
