export interface Availability {
  id: string;
  employee_id: string;
  day_of_week: number;
  start_time?: string | null;
  end_time?: string | null;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}
