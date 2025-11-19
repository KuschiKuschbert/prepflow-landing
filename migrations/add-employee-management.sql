-- Employee Management System Migration
-- Adds tables for kitchen staff/food handlers, qualifications, and qualification types
-- Follows existing schema patterns from supabase-restaurant-management-schema-safe.sql

-- =====================================================
-- EMPLOYEE MANAGEMENT SYSTEM
-- =====================================================

-- Qualification types master list
CREATE TABLE IF NOT EXISTS qualification_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE, -- e.g., "Food Safety Supervisor", "Food Handler Certificate", "RSA"
  description TEXT,
  is_required BOOLEAN DEFAULT false, -- Whether this qualification is required for food handlers
  default_expiry_days INTEGER, -- Default expiry period in days (e.g., 1825 for 5 years)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employees (kitchen staff and food handlers only)
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(255), -- e.g., "Head Chef", "Sous Chef", "Line Cook", "Prep Cook", "Dishwasher", "Food Handler"
  employment_start_date DATE NOT NULL,
  employment_end_date DATE, -- NULL if still employed
  status VARCHAR(50) DEFAULT 'active', -- active, inactive, terminated
  phone VARCHAR(50),
  email VARCHAR(255),
  emergency_contact VARCHAR(255), -- Optional emergency contact name and phone
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employee qualifications/certifications
CREATE TABLE IF NOT EXISTS employee_qualifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  qualification_type_id UUID NOT NULL REFERENCES qualification_types(id) ON DELETE RESTRICT,
  certificate_number VARCHAR(255), -- Certificate/license number
  issue_date DATE NOT NULL,
  expiry_date DATE, -- NULL if no expiry
  issuing_authority VARCHAR(255), -- e.g., "Food Standards Australia", "RTO Name"
  document_url TEXT, -- URL to uploaded certificate document (Supabase Storage)
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Employee indexes
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
CREATE INDEX IF NOT EXISTS idx_employees_role ON employees(role);
CREATE INDEX IF NOT EXISTS idx_employees_employment_start_date ON employees(employment_start_date);

-- Qualification indexes
CREATE INDEX IF NOT EXISTS idx_employee_qualifications_employee_id ON employee_qualifications(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_qualifications_expiry_date ON employee_qualifications(expiry_date);
CREATE INDEX IF NOT EXISTS idx_employee_qualifications_qualification_type_id ON employee_qualifications(qualification_type_id);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_qualification_types_updated_at
  BEFORE UPDATE ON qualification_types
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employee_qualifications_updated_at
  BEFORE UPDATE ON employee_qualifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SEED DATA: QUALIFICATION TYPES
-- =====================================================

-- Insert default qualification types if they don't exist
INSERT INTO qualification_types (name, description, is_required, default_expiry_days, is_active)
VALUES
  ('Food Safety Supervisor', 'Food Safety Supervisor Certificate - Required in most Australian states for food businesses', true, 1825, true), -- 5 years
  ('Food Handler Certificate', 'Basic Food Handler Certificate - Required for all food handlers', true, 1095, true), -- 3 years
  ('RSA - Responsible Service of Alcohol', 'Responsible Service of Alcohol certificate - Required if serving alcohol', false, 1095, true), -- 3 years
  ('First Aid', 'First Aid Certificate - Recommended for kitchen staff', false, 1095, true), -- 3 years
  ('Allergen Management', 'Allergen Management Training - Recommended for food handlers', false, 730, true) -- 2 years
ON CONFLICT (name) DO NOTHING;

