/**
 * Staff/Employees Sync Service
 * Handles bidirectional synchronization between Square Team Members and PrepFlow Employees
 *
 * 📚 Complete Reference: See `docs/SQUARE_API_REFERENCE.md` (Sync Operations section) for
 * detailed sync operation documentation and usage examples.
 */

// Export types
export interface SyncResult {
  success: boolean;
  synced: number;
  created: number;
  updated: number;
  errors: number;
  errorMessages?: string[];
  metadata?: Record<string, unknown>;
}

export interface Employee {
  id: string;
  employee_id?: string | null;
  full_name: string;
  role?: string | null;
  employment_start_date: string;
  employment_end_date?: string | null;
  status: 'active' | 'inactive' | 'terminated';
  phone?: string | null;
  email?: string | null;
  emergency_contact?: string | null;
  photo_url?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Re-export sync functions
export { syncStaffBidirectional } from './staff/syncBidirectional';
export { syncStaffFromSquare } from './staff/syncFromSquare';
export { syncStaffToSquare } from './staff/syncToSquare';
