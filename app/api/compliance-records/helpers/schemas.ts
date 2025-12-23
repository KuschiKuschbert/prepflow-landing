import { z } from 'zod';

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
