/**
 * Error Logs Types
 */

export interface ErrorLog {
  id: string;
  user_id: string | null;
  endpoint: string | null;
  error_message: string;
  stack_trace: string | null;
  context: any;
  created_at: string;
  severity: 'safety' | 'critical' | 'high' | 'medium' | 'low';
  status: 'new' | 'investigating' | 'resolved' | 'ignored';
  category: 'security' | 'database' | 'api' | 'client' | 'system' | 'other';
  notes: string | null;
  resolved_at: string | null;
  resolved_by: string | null;
}
