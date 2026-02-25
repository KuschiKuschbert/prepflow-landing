import type { Employee } from './employee';
import type { Shift } from './shift';

export interface TimeAttendance {
  id: string;
  employee_id: string;
  shift_id?: string | null;
  clock_in_time: string;
  clock_out_time?: string | null;
  clock_in_latitude?: number | null;
  clock_in_longitude?: number | null;
  clock_out_latitude?: number | null;
  clock_out_longitude?: number | null;
  is_geofence_valid: boolean;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  employee?: Employee;
  shift?: Shift;
}
