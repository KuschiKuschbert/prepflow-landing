// ============================================================================
// Licenses & Business Info
// ============================================================================

export interface ReportLicense {
  id: string;
  license_type: string;
  license_number: string | null;
  issued_date: string | null;
  expiry_date: string | null;
  status: string;
  issuing_authority: string | null;
  notes: string | null;
}

// ============================================================================
// Employees & Qualifications
// ============================================================================

export interface ReportEmployee {
  id: string;
  employee_id: string | null;
  full_name: string;
  role: string | null;
  employment_start_date: string;
  employment_end_date: string | null;
  status: string;
  phone: string | null;
  email: string | null;
  emergency_contact: string | null;
  photo_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Qualifications when joined
  employee_qualifications?: Array<{
    id?: string;
    qualification_name?: string;
    expiry_date?: string;
    [key: string]: unknown;
  }>;
}

export interface ReportQualification {
  id: string;
  employee_id: string;
  qualification_type_id: string;
  expiry_date: string | null;
  status: string;
  document_url: string | null;
  employee_name?: string;
  qualification_types?: {
    id: string;
    name: string;
    type_name?: string;
  };
  employees?: {
    id: string;
    full_name: string;
  };
}
