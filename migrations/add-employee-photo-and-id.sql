-- Add employee_id and photo_url columns to employees table
-- Migration: add-employee-photo-and-id

-- Add employee_id column (custom employee identifier)
ALTER TABLE employees
ADD COLUMN IF NOT EXISTS employee_id VARCHAR(50) UNIQUE;

-- Add photo_url column (URL to employee photo stored in Supabase Storage or external)
ALTER TABLE employees
ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Create index on employee_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_employees_employee_id ON employees(employee_id);

-- Add comment to columns
COMMENT ON COLUMN employees.employee_id IS 'Custom employee identifier (e.g., EMP001, STAFF-2024-001)';
COMMENT ON COLUMN employees.photo_url IS 'URL to employee photo stored in Supabase Storage or external storage';

