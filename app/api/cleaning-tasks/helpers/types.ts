export interface DBCleaningTask {
  id: string;
  task_name: string;
  frequency_type: 'daily' | 'bi-daily' | 'weekly' | 'monthly' | '3-monthly';
  area_id?: string | null;
  assigned_date?: string | null;
  equipment_id?: string | null;
  section_id?: string | null;
  is_standard_task?: boolean;
  standard_task_type?: string | null;
  description?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
  // Join fields
  completions?: DBCleaningTaskCompletion[];
}

export interface DBCleaningTaskCompletion {
  id: string;
  task_id: string;
  completion_date: string;
  status?: string | null;
  completed_by?: string | null;
  notes?: string | null;
  photo_url?: string | null;
  verified_by?: string | null;
  verified_at?: string | null;
  created_at?: string;
}

export interface CleaningTaskWithCompletions extends DBCleaningTask {
  completions: DBCleaningTaskCompletion[];
}

export interface CreateCleaningTaskInput {
  task_name?: string;
  frequency_type?: string;
  area_id?: string;
  assigned_date?: string;
  equipment_id?: string | null;
  section_id?: string | null;
  is_standard_task?: boolean;
  standard_task_type?: string | null;
  description?: string | null;
  notes?: string | null;
  assigned_to_employee_id?: string | null;
  assigned_by_employee_id?: string | null;
}

export interface CleaningTaskJoinResult extends DBCleaningTask {
  cleaning_areas?: {
    id: string;
    area_name: string;
    description?: string;
    cleaning_frequency?: string;
  } | null;
  temperature_equipment?: {
    id: string;
    name: string;
    equipment_type: string;
    location?: string;
  } | null;
  kitchen_sections?: {
    id: string;
    section_name: string;
    description?: string;
  } | null;
  assigned_to_employee?: {
    id: string;
    full_name: string;
    role: string;
  } | null;
  assigned_by_employee?: {
    id: string;
    full_name: string;
    role: string;
  } | null;
}

export interface UpdateCleaningTaskInput {
  status?: string;
  completed_date?: string | null;
  notes?: string | null;
  photo_url?: string | null;
}
