// ============================================================================
// Compliance Records
// ============================================================================

export interface ReportComplianceRecord {
  id: string;
  document_name: string;
  issue_date: string | null;
  expiry_date: string | null;
  status: string;
  document_url: string | null;
  notes: string | null;
  compliance_types?: {
    id: string;
    name?: string;
    type_name?: string;
  };
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Supplier Verification
// ============================================================================

export interface ReportSupplierVerification {
  id: string;
  supplier_id: string;
  verification_date: string;
  verification_type: string | null;
  certificate_type: string | null;
  certificate_number: string | null;
  expiry_date: string | null;
  is_valid: boolean;
  verification_result: string | null;
  verified_by: string | null;
  document_url: string | null;
  notes: string | null;
  suppliers?: {
    id: string;
    supplier_name: string;
  };
  created_at: string;
}

// ============================================================================
// Compliance Gaps
// ============================================================================

export interface ReportComplianceGap {
  id: string;
  gap_type: string;
  type?: string;
  description: string;
  severity: string;
  identified_date: string;
  due_date: string | null;
  status: string;
  assigned_to: string | null;
  employee_name?: string;
  employee_role?: string;
  missing_item?: string;
  corrective_action: string | null;
  resolution_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
