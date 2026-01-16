import { z } from 'zod';

export type CreateComplianceRecordInput = z.infer<typeof createComplianceRecordSchema>;
export type UpdateComplianceRecordInput = z.infer<typeof updateComplianceRecordSchema>;

export interface ComplianceRecord {
  id: string;
  user_id: string;
  compliance_type_id: string;
  document_name: string;
  issue_date?: string | null;
  expiry_date?: string | null;
  document_url?: string | null;
  photo_url?: string | null;
  notes?: string | null;
  reminder_enabled?: boolean;
  reminder_days_before?: number;
  status: 'valid' | 'expired' | 'expiring_soon' | 'missing'; // Derived or stored? Assuming stored or calculated.
  created_at: string;
  updated_at: string;
  compliance_types?: {
    id: string;
    type_name: string;
    description?: string | null;
  };
}

export const createComplianceRecordSchema = z.object({
  compliance_type_id: z.string().min(1, 'compliance_type_id is required'),
  document_name: z.string().min(1, 'document_name is required'),
  issue_date: z.string().optional(),
  expiry_date: z.string().optional(),
  document_url: z.string().url().optional().or(z.literal('')),
  photo_url: z.string().url().optional().or(z.literal('')),
  notes: z.string().optional(),
  reminder_enabled: z.boolean().optional(),
  reminder_days_before: z.number().int().positive().optional(),
});

export const updateComplianceRecordSchema = z.object({
  id: z.string().min(1, 'Compliance record ID is required'),
  document_name: z.string().optional(),
  issue_date: z.string().optional(),
  expiry_date: z.string().optional(),
  document_url: z.string().url().optional().or(z.literal('')),
  photo_url: z.string().url().optional().or(z.literal('')),
  notes: z.string().optional(),
  reminder_enabled: z.boolean().optional(),
  reminder_days_before: z.number().int().positive().optional(),
});

export const COMPLIANCE_TYPES_SELECT = `*, compliance_types (id, type_name, description)`;
