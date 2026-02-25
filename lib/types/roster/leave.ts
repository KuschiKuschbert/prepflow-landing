import type { Employee } from './employee';

export type LeaveType = 'annual' | 'sick' | 'personal' | 'unpaid';
export type LeaveRequestStatus = 'pending' | 'approved' | 'rejected';

export interface LeaveRequest {
  id: string;
  employee_id: string;
  start_date: string;
  end_date: string;
  leave_type: LeaveType;
  status: LeaveRequestStatus;
  reason?: string | null;
  approved_by?: string | null;
  approved_at?: string | null;
  created_at: string;
  updated_at: string;
  employee?: Employee;
  approved_by_employee?: Employee;
}
