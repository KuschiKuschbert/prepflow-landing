-- ShiftSync Roster System Migration
-- Adds comprehensive staff administration and rostering system
-- Extends existing employees table and adds roster-specific tables

-- =====================================================
-- EXTEND EMPLOYEES TABLE FOR ROSTERING
-- =====================================================

-- Add roster-specific fields to existing employees table
ALTER TABLE employees ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS first_name VARCHAR(100);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'staff'; -- 'admin', 'manager', 'staff'
ALTER TABLE employees ADD COLUMN IF NOT EXISTS employment_type VARCHAR(20) DEFAULT 'casual'; -- 'full-time', 'part-time', 'casual'
ALTER TABLE employees ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10,2) DEFAULT 0;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS saturday_rate DECIMAL(10,2); -- Multiplier or absolute rate
ALTER TABLE employees ADD COLUMN IF NOT EXISTS sunday_rate DECIMAL(10,2); -- Multiplier or absolute rate
ALTER TABLE employees ADD COLUMN IF NOT EXISTS skills TEXT[]; -- Array of skills (e.g., ['chef', 'dishhand', 'barista'])
ALTER TABLE employees ADD COLUMN IF NOT EXISTS bank_account_bsb VARCHAR(6);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS bank_account_number VARCHAR(20);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS tax_file_number VARCHAR(11);

-- Update existing full_name to populate first_name and last_name if needed
UPDATE employees SET first_name = SPLIT_PART(full_name, ' ', 1), last_name = SPLIT_PART(full_name, ' ', 2) WHERE first_name IS NULL AND full_name IS NOT NULL;

-- =====================================================
-- ROSTER TEMPLATES SYSTEM
-- =====================================================

-- Roster templates (e.g., "Week A", "Week B")
CREATE TABLE IF NOT EXISTS roster_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Template shifts (pattern shifts within templates)
CREATE TABLE IF NOT EXISTS template_shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES roster_templates(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 1=Monday, ..., 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  role_required VARCHAR(50), -- e.g., 'chef', 'dishhand'
  min_employees INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SHIFTS SYSTEM
-- =====================================================

-- Actual scheduled shifts
CREATE TABLE IF NOT EXISTS shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  template_shift_id UUID REFERENCES template_shifts(id) ON DELETE SET NULL,
  shift_date DATE NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'completed', 'cancelled')),
  role VARCHAR(50), -- Override template role if needed
  break_duration_minutes INTEGER DEFAULT 0,
  notes TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- AVAILABILITY SYSTEM
-- =====================================================

-- Staff availability
CREATE TABLE IF NOT EXISTS availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 1=Monday, ..., 6=Saturday
  start_time TIME,
  end_time TIME,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(employee_id, day_of_week)
);

-- =====================================================
-- LEAVE MANAGEMENT
-- =====================================================

-- Leave requests
CREATE TABLE IF NOT EXISTS leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  leave_type VARCHAR(50) NOT NULL CHECK (leave_type IN ('annual', 'sick', 'personal', 'unpaid')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reason TEXT,
  approved_by UUID REFERENCES employees(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (end_date >= start_date)
);

-- =====================================================
-- TIME & ATTENDANCE
-- =====================================================

-- Time attendance (clock in/out)
CREATE TABLE IF NOT EXISTS time_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  shift_id UUID REFERENCES shifts(id) ON DELETE SET NULL,
  clock_in_time TIMESTAMP WITH TIME ZONE NOT NULL,
  clock_out_time TIMESTAMP WITH TIME ZONE,
  clock_in_latitude DECIMAL(10,8),
  clock_in_longitude DECIMAL(11,8),
  clock_out_latitude DECIMAL(10,8),
  clock_out_longitude DECIMAL(11,8),
  is_geofence_valid BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ONBOARDING DOCUMENTS
-- =====================================================

-- Onboarding documents (paperless onboarding)
CREATE TABLE IF NOT EXISTS onboarding_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('id', 'contract', 'tax_form', 'bank_details')),
  file_url TEXT, -- Supabase Storage URL
  signature_data TEXT, -- Base64 signature data
  signed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Shifts indexes
CREATE INDEX IF NOT EXISTS idx_shifts_employee_date ON shifts(employee_id, shift_date);
CREATE INDEX IF NOT EXISTS idx_shifts_date_status ON shifts(shift_date, status);
CREATE INDEX IF NOT EXISTS idx_shifts_start_time ON shifts(start_time);
CREATE INDEX IF NOT EXISTS idx_shifts_status ON shifts(status);

-- Template shifts indexes
CREATE INDEX IF NOT EXISTS idx_template_shifts_template_id ON template_shifts(template_id);
CREATE INDEX IF NOT EXISTS idx_template_shifts_day ON template_shifts(day_of_week);

-- Availability indexes
CREATE INDEX IF NOT EXISTS idx_availability_employee_day ON availability(employee_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_availability_employee ON availability(employee_id);

-- Leave requests indexes
CREATE INDEX IF NOT EXISTS idx_leave_requests_employee_dates ON leave_requests(employee_id, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON leave_requests(status);
CREATE INDEX IF NOT EXISTS idx_leave_requests_dates ON leave_requests(start_date, end_date);

-- Time attendance indexes
CREATE INDEX IF NOT EXISTS idx_time_attendance_employee_date ON time_attendance(employee_id, clock_in_time);
CREATE INDEX IF NOT EXISTS idx_time_attendance_shift ON time_attendance(shift_id);
CREATE INDEX IF NOT EXISTS idx_time_attendance_date ON time_attendance(clock_in_time);

-- Onboarding documents indexes
CREATE INDEX IF NOT EXISTS idx_onboarding_documents_employee ON onboarding_documents(employee_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_documents_type ON onboarding_documents(document_type);

-- Employees indexes (for roster queries)
CREATE INDEX IF NOT EXISTS idx_employees_user_id ON employees(user_id);
CREATE INDEX IF NOT EXISTS idx_employees_role ON employees(role);
CREATE INDEX IF NOT EXISTS idx_employees_employment_type ON employees(employment_type);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- =====================================================

-- Function to update updated_at timestamp (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_roster_templates_updated_at
  BEFORE UPDATE ON roster_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_template_shifts_updated_at
  BEFORE UPDATE ON template_shifts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shifts_updated_at
  BEFORE UPDATE ON shifts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_availability_updated_at
  BEFORE UPDATE ON availability
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leave_requests_updated_at
  BEFORE UPDATE ON leave_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_time_attendance_updated_at
  BEFORE UPDATE ON time_attendance
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_onboarding_documents_updated_at
  BEFORE UPDATE ON onboarding_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE roster_templates IS 'Roster templates for recurring shift patterns (e.g., Week A, Week B)';
COMMENT ON TABLE template_shifts IS 'Pattern shifts within templates (day of week, time, role requirements)';
COMMENT ON TABLE shifts IS 'Actual scheduled shifts for employees (can be draft or published)';
COMMENT ON TABLE availability IS 'Staff availability by day of week';
COMMENT ON TABLE leave_requests IS 'Employee leave requests (annual, sick, personal, unpaid)';
COMMENT ON TABLE time_attendance IS 'Clock in/out records with geofencing validation';
COMMENT ON TABLE onboarding_documents IS 'Paperless onboarding documents (ID, contracts, signatures)';

COMMENT ON COLUMN employees.hourly_rate IS 'Base hourly rate in AUD';
COMMENT ON COLUMN employees.saturday_rate IS 'Saturday rate (multiplier or absolute rate in AUD)';
COMMENT ON COLUMN employees.sunday_rate IS 'Sunday rate (multiplier or absolute rate in AUD)';
COMMENT ON COLUMN employees.skills IS 'Array of employee skills (e.g., ["chef", "dishhand", "barista"])';
COMMENT ON COLUMN shifts.status IS 'Shift status: draft (invisible), published (visible), completed, cancelled';
COMMENT ON COLUMN shifts.published_at IS 'Timestamp when shift was published (moved from draft to published)';













