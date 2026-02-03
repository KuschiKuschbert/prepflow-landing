import { z } from 'zod';
import { createShiftSchema } from './schemas';

export type CreateShiftInput = z.infer<typeof createShiftSchema>;

export interface Shift {
  id: string;
  employee_id: string;
  shift_date: string;
  start_time: string;
  end_time: string;
  status: 'draft' | 'published' | 'completed' | 'cancelled';
  role: string | null;
  break_duration_minutes: number;
  notes: string | null;
  template_shift_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ShiftQueryParams {
  employee_id?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  shift_date?: string;
  page: number;
  pageSize: number;
  userId: string;
}
