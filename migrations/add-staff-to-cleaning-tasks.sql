-- Add staff assignment columns to cleaning_tasks table
-- Migration: add-staff-to-cleaning-tasks

-- Add assigned_to_employee_id column (who the task is assigned to)
ALTER TABLE cleaning_tasks
ADD COLUMN IF NOT EXISTS assigned_to_employee_id UUID REFERENCES employees(id) ON DELETE SET NULL;

-- Add assigned_by_employee_id column (who assigned the task - optional)
ALTER TABLE cleaning_tasks
ADD COLUMN IF NOT EXISTS assigned_by_employee_id UUID REFERENCES employees(id) ON DELETE SET NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_cleaning_tasks_assigned_to ON cleaning_tasks(assigned_to_employee_id);
CREATE INDEX IF NOT EXISTS idx_cleaning_tasks_assigned_by ON cleaning_tasks(assigned_by_employee_id);

-- Add comments to columns
COMMENT ON COLUMN cleaning_tasks.assigned_to_employee_id IS 'Employee assigned to complete this cleaning task';
COMMENT ON COLUMN cleaning_tasks.assigned_by_employee_id IS 'Employee who assigned this cleaning task';
-- Migration: add-staff-to-cleaning-tasks

-- Add assigned_to_employee_id column (who the task is assigned to)
ALTER TABLE cleaning_tasks
ADD COLUMN IF NOT EXISTS assigned_to_employee_id UUID REFERENCES employees(id) ON DELETE SET NULL;

-- Add assigned_by_employee_id column (who assigned the task - optional)
ALTER TABLE cleaning_tasks
ADD COLUMN IF NOT EXISTS assigned_by_employee_id UUID REFERENCES employees(id) ON DELETE SET NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_cleaning_tasks_assigned_to ON cleaning_tasks(assigned_to_employee_id);
CREATE INDEX IF NOT EXISTS idx_cleaning_tasks_assigned_by ON cleaning_tasks(assigned_by_employee_id);

-- Add comments to columns
COMMENT ON COLUMN cleaning_tasks.assigned_to_employee_id IS 'Employee assigned to complete this cleaning task';
COMMENT ON COLUMN cleaning_tasks.assigned_by_employee_id IS 'Employee who assigned this cleaning task';














