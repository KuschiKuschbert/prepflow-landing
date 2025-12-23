import { z } from 'zod';

export const createEmployeeSchema = z.object({
  employee_id: z.string().optional(),
  full_name: z.string().min(1, 'full_name is required'),
  employment_start_date: z.string().min(1, 'employment_start_date is required'),
  role: z.string().optional(),
  employment_end_date: z.string().optional(),
  status: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  emergency_contact: z.string().optional(),
  photo_url: z.string().url().optional().or(z.literal('')),
  notes: z.string().optional(),
});

export const updateEmployeeSchema = z.object({
  id: z.string().min(1, 'Employee ID is required'),
  full_name: z.string().optional(),
  role: z.string().optional(),
  employment_start_date: z.string().optional(),
  employment_end_date: z.string().optional(),
  status: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  emergency_contact: z.string().optional(),
  photo_url: z.string().url().optional().or(z.literal('')),
  notes: z.string().optional(),
});

export const EMPLOYEE_SELECT = `*, employee_qualifications (*, qualification_types (id, name, description, is_required, default_expiry_days))`;

