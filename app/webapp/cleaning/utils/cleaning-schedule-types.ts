/**
 * Shared types for cleaning schedule print utilities.
 * Extracted to avoid circular dependencies.
 */

export interface CleaningTask {
  id: string | number;
  area_id: string | number;
  assigned_date: string;
  completed_date: string | null;
  status: 'pending' | 'completed' | 'overdue';
  notes: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
  cleaning_areas: {
    id: string | number;
    name: string;
    description: string;
    frequency_days: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
}

export interface CleaningArea {
  id: string | number;
  name: string;
  description: string;
  frequency_days: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
