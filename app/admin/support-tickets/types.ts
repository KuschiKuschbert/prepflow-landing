/**
 * Support Tickets Types
 */

export interface SupportTicket {
  id: string;
  user_id: string | null;
  user_email: string;
  subject: string;
  message: string;
  type: 'bug' | 'feature' | 'question' | 'other';
  severity: 'safety' | 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  related_error_id: string | null;
  admin_notes: string | null;
  resolved_at: string | null;
  resolved_by: string | null;
  created_at: string;
  updated_at: string;
}
