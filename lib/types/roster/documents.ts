export type DocumentType = 'id' | 'contract' | 'tax_form' | 'bank_details';

export interface OnboardingDocument {
  id: string;
  employee_id: string;
  document_type: DocumentType;
  file_url?: string | null;
  signature_data?: string | null;
  signed_at?: string | null;
  created_at: string;
  updated_at: string;
}
