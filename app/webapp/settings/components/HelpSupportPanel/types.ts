export interface UserError {
  id: string;
  error_message: string;
  severity: 'safety' | 'critical' | 'high' | 'medium' | 'low';
  category: string;
  created_at: string;
  status: string;
}

export type SupportRequestType = 'bug' | 'feature' | 'question' | 'error' | 'other';

export interface SupportFormData {
  subject: string;
  message: string;
  type: SupportRequestType;
  related_error_id?: string;
}
