export interface ComplianceType {
  id: number;
  name: string;
  description: string;
  renewal_frequency_days: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ComplianceRecord {
  id: number;
  compliance_type_id: number;
  document_name: string;
  issue_date: string | null;
  expiry_date: string | null;
  status: 'active' | 'expired' | 'pending_renewal';
  document_url: string | null;
  photo_url: string | null;
  notes: string | null;
  reminder_enabled: boolean;
  reminder_days_before: number;
  created_at: string;
  updated_at: string;
  compliance_types: ComplianceType;
}

export interface ComplianceRecordFormData {
  id?: string;
  compliance_type_id: string;
  document_name: string;
  issue_date: string;
  expiry_date: string;
  document_url: string;
  photo_url: string;
  notes: string;
  reminder_enabled: boolean;
  reminder_days_before: number;
}

export interface ComplianceTypeFormData {
  name: string;
  description: string;
  renewal_frequency_days: string;
}
