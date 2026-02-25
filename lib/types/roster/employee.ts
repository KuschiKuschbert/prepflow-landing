import type { EmployeeQualification, QualificationType } from './qualifications';

export interface Employee {
  id: string;
  user_id?: string | null;
  employee_id?: string | null;
  first_name: string;
  last_name: string;
  full_name?: string;
  email: string;
  phone?: string | null;
  role: 'admin' | 'manager' | 'staff';
  status: 'active' | 'inactive' | 'terminated';
  employment_type: 'full-time' | 'part-time' | 'casual';
  employment_start_date?: string | null;
  employment_end_date?: string | null;
  hourly_rate: number;
  saturday_rate?: number | null;
  sunday_rate?: number | null;
  skills?: string[] | null;
  bank_account_bsb?: string | null;
  bank_account_number?: string | null;
  tax_file_number?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  photo_url?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  employee_qualifications?: (EmployeeQualification & { qualification_types: QualificationType })[];
}
