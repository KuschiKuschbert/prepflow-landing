import type { Employee } from './employee';

export type ShiftStatus = 'draft' | 'published' | 'completed' | 'cancelled';

export interface Shift {
  id: string;
  employee_id: string;
  template_shift_id?: string | null;
  shift_date: string;
  start_time: string;
  end_time: string;
  status: ShiftStatus;
  role?: string | null;
  break_duration_minutes: number;
  notes?: string | null;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
  employee?: Employee;
}
