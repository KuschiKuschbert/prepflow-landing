export interface RosterTemplate {
  id: string;
  name: string;
  description?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TemplateShift {
  id: string;
  template_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  role_required?: string | null;
  min_employees: number;
  created_at: string;
  updated_at: string;
}
