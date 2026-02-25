import type { Availability } from './availability';
import type { Employee } from './employee';
import type { LeaveRequest } from './leave';
import type { RosterTemplate } from './template';
import type { Shift } from './shift';
import type { TimeAttendance } from './time-attendance';

export interface ShiftsResponse {
  success: boolean;
  shifts: Shift[];
  count?: number;
  page?: number;
  pageSize?: number;
}

export interface EmployeesResponse {
  success: boolean;
  employees: Employee[];
  count?: number;
  page?: number;
  pageSize?: number;
}

export interface TemplatesResponse {
  success: boolean;
  templates: RosterTemplate[];
  count?: number;
}

export interface AvailabilityResponse {
  success: boolean;
  availability: Availability[];
}

export interface LeaveRequestsResponse {
  success: boolean;
  leaveRequests: LeaveRequest[];
  count?: number;
}

export interface TimeAttendanceResponse {
  success: boolean;
  records: TimeAttendance[];
  count?: number;
}
