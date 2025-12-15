// Roster System Types
// TypeScript types for ShiftSync roster system

// Employee Types
export interface Employee {
  id: string;
  user_id?: string | null;
  first_name: string;
  last_name: string;
  full_name?: string; // Legacy field from existing employees table
  email: string;
  phone?: string | null;
  role: 'admin' | 'manager' | 'staff';
  employment_type: 'full-time' | 'part-time' | 'casual';
  hourly_rate: number;
  saturday_rate?: number | null;
  sunday_rate?: number | null;
  skills?: string[] | null; // Array of skills (e.g., ['chef', 'dishhand', 'barista'])
  bank_account_bsb?: string | null;
  bank_account_number?: string | null;
  tax_file_number?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  created_at: string;
  updated_at: string;
}

// Roster Template Types
export interface RosterTemplate {
  id: string;
  name: string;
  description?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Template Shift Types
export interface TemplateShift {
  id: string;
  template_id: string;
  day_of_week: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
  start_time: string; // TIME format (HH:MM:SS)
  end_time: string; // TIME format (HH:MM:SS)
  role_required?: string | null;
  min_employees: number;
  created_at: string;
  updated_at: string;
}

// Shift Types
export type ShiftStatus = 'draft' | 'published' | 'completed' | 'cancelled';

export interface Shift {
  id: string;
  employee_id: string;
  template_shift_id?: string | null;
  shift_date: string; // DATE format (YYYY-MM-DD)
  start_time: string; // TIMESTAMP WITH TIME ZONE
  end_time: string; // TIMESTAMP WITH TIME ZONE
  status: ShiftStatus;
  role?: string | null;
  break_duration_minutes: number;
  notes?: string | null;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
  // Computed/joined fields
  employee?: Employee;
}

// Availability Types
export interface Availability {
  id: string;
  employee_id: string;
  day_of_week: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
  start_time?: string | null; // TIME format (HH:MM:SS)
  end_time?: string | null; // TIME format (HH:MM:SS)
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

// Leave Request Types
export type LeaveType = 'annual' | 'sick' | 'personal' | 'unpaid';
export type LeaveRequestStatus = 'pending' | 'approved' | 'rejected';

export interface LeaveRequest {
  id: string;
  employee_id: string;
  start_date: string; // DATE format (YYYY-MM-DD)
  end_date: string; // DATE format (YYYY-MM-DD)
  leave_type: LeaveType;
  status: LeaveRequestStatus;
  reason?: string | null;
  approved_by?: string | null;
  approved_at?: string | null;
  created_at: string;
  updated_at: string;
  // Computed/joined fields
  employee?: Employee;
  approved_by_employee?: Employee;
}

// Time Attendance Types
export interface TimeAttendance {
  id: string;
  employee_id: string;
  shift_id?: string | null;
  clock_in_time: string; // TIMESTAMP WITH TIME ZONE
  clock_out_time?: string | null; // TIMESTAMP WITH TIME ZONE
  clock_in_latitude?: number | null;
  clock_in_longitude?: number | null;
  clock_out_latitude?: number | null;
  clock_out_longitude?: number | null;
  is_geofence_valid: boolean;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  // Computed/joined fields
  employee?: Employee;
  shift?: Shift;
}

// Onboarding Document Types
export type DocumentType = 'id' | 'contract' | 'tax_form' | 'bank_details';

export interface OnboardingDocument {
  id: string;
  employee_id: string;
  document_type: DocumentType;
  file_url?: string | null;
  signature_data?: string | null; // Base64 signature data
  signed_at?: string | null;
  created_at: string;
  updated_at: string;
}

// Roster Builder State Types
export interface RosterWeek {
  startDate: Date;
  endDate: Date;
  shifts: Shift[];
}

export interface ShiftValidationWarning {
  type: 'availability_clash' | 'skill_gap' | 'compliance_violation' | 'overlap';
  message: string;
  shiftId: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ComplianceValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  violations: Array<{
    rule: string;
    message: string;
    severity: 'error' | 'warning';
  }>;
}

// Payroll Calculation Types
export interface ShiftCostCalculation {
  shiftId: string;
  employeeId: string;
  baseHours: number;
  breakHours: number;
  paidHours: number;
  baseRate: number;
  dayOfWeek: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
  rateMultiplier: number; // 1.0 for weekdays, >1.0 for weekends
  totalCost: number;
  breakCost: number;
  netCost: number;
}

export interface RosterBudget {
  totalShifts: number;
  totalHours: number;
  totalCost: number;
  forecastRevenue?: number | null;
  laborCostPercentage?: number | null;
  shiftsByDay: Record<string, ShiftCostCalculation[]>;
}

// Template Application Types
export interface TemplateApplicationRequest {
  templateId: string;
  targetWeekStartDate: string; // DATE format (YYYY-MM-DD)
  overwriteExisting?: boolean;
}

export interface TemplateApplicationResult {
  success: boolean;
  shiftsCreated: number;
  shiftsUpdated: number;
  shiftsSkipped: number;
  errors: string[];
}

// API Response Types
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

// Geofencing Types
export interface VenueLocation {
  latitude: number;
  longitude: number;
  radiusMeters: number; // Geofence radius in meters
}

export interface GeofenceValidationResult {
  isValid: boolean;
  distance: number; // Distance in meters
  isWithinRadius: boolean;
  message: string;
}

