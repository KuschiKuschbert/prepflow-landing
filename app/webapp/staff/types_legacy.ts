export interface QualificationType {
  id: string;
  name: string;
  description: string | null;
  is_required: boolean;
  default_expiry_days: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmployeeQualification {
  id: string;
  employee_id: string;
  qualification_type_id: string;
  certificate_number: string | null;
  issue_date: string;
  expiry_date: string | null;
  issuing_authority: string | null;
  document_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  qualification_types?: QualificationType;
}

export interface Employee {
  id: string;
  employee_id: string | null;
  full_name: string;
  role: string | null;
  employment_start_date: string;
  employment_end_date: string | null;
  status: 'active' | 'inactive' | 'terminated';
  phone: string | null;
  email: string | null;
  emergency_contact: string | null;
  photo_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  employee_qualifications?: EmployeeQualification[];
}

export interface EmployeeFormData {
  employee_id: string;
  full_name: string;
  role: string;
  employment_start_date: string;
  employment_end_date: string;
  status: 'active' | 'inactive' | 'terminated';
  phone: string;
  email: string;
  emergency_contact: string;
  photo_url: string;
  notes: string;
}
