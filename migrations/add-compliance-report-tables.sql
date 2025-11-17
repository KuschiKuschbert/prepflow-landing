-- Additional Compliance Tables for Comprehensive Health Inspector Reports
-- These tables support detailed compliance tracking for Australian council inspections

-- =====================================================
-- SANITIZER LOGS
-- =====================================================
CREATE TABLE IF NOT EXISTS sanitizer_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  log_date DATE NOT NULL,
  log_time TIME NOT NULL,
  sanitizer_type VARCHAR(50) NOT NULL, -- chlorine, quaternary, etc.
  concentration_ppm DECIMAL(6,2), -- Parts per million
  test_method VARCHAR(50), -- test_strip, digital_meter, etc.
  location VARCHAR(255), -- Where sanitizer is used
  tested_by VARCHAR(255), -- Staff member name
  is_within_range BOOLEAN DEFAULT true,
  corrective_action TEXT, -- If out of range
  notes TEXT,
  photo_url TEXT, -- Optional photo of test result
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sanitizer_logs_date ON sanitizer_logs(log_date DESC);
CREATE INDEX IF NOT EXISTS idx_sanitizer_logs_within_range ON sanitizer_logs(is_within_range);

-- =====================================================
-- STAFF HEALTH DECLARATIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS staff_health_declarations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  declaration_date DATE NOT NULL,
  declaration_time TIME NOT NULL,
  is_healthy BOOLEAN NOT NULL DEFAULT true,
  has_symptoms BOOLEAN DEFAULT false,
  symptoms_description TEXT, -- If has symptoms
  has_been_exposed BOOLEAN DEFAULT false, -- Exposed to illness
  excluded_from_work BOOLEAN DEFAULT false, -- Sent home
  exclusion_reason TEXT,
  exclusion_end_date DATE,
  declared_by VARCHAR(255), -- Staff member name
  supervisor_approval VARCHAR(255), -- Supervisor who reviewed
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_staff_health_date ON staff_health_declarations(declaration_date DESC);
CREATE INDEX IF NOT EXISTS idx_staff_health_employee ON staff_health_declarations(employee_id);
CREATE INDEX IF NOT EXISTS idx_staff_health_excluded ON staff_health_declarations(excluded_from_work);

-- =====================================================
-- INCIDENT REPORTS
-- =====================================================
CREATE TABLE IF NOT EXISTS incident_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_date DATE NOT NULL,
  incident_time TIME NOT NULL,
  incident_type VARCHAR(50) NOT NULL, -- food_contamination, customer_complaint, equipment_failure, pest_sighting, temperature_violation, etc.
  severity VARCHAR(50) DEFAULT 'low', -- low, medium, high, critical
  location VARCHAR(255),
  description TEXT NOT NULL,
  reported_by VARCHAR(255), -- Staff member who reported
  affected_items TEXT, -- Food items affected (if applicable)
  corrective_action TEXT, -- Actions taken
  preventive_action TEXT, -- Preventive measures implemented
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_date DATE,
  follow_up_notes TEXT,
  status VARCHAR(50) DEFAULT 'open', -- open, investigating, resolved, closed
  resolved_date DATE,
  resolved_by VARCHAR(255),
  photo_url TEXT, -- Optional photo evidence
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_incident_date ON incident_reports(incident_date DESC);
CREATE INDEX IF NOT EXISTS idx_incident_type ON incident_reports(incident_type);
CREATE INDEX IF NOT EXISTS idx_incident_severity ON incident_reports(severity);
CREATE INDEX IF NOT EXISTS idx_incident_status ON incident_reports(status);

-- =====================================================
-- HACCP RECORDS
-- =====================================================
CREATE TABLE IF NOT EXISTS haccp_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  record_date DATE NOT NULL,
  haccp_step VARCHAR(255) NOT NULL, -- e.g., "Receiving", "Storage", "Preparation", "Cooking", "Cooling", "Reheating", "Service"
  critical_control_point VARCHAR(255), -- Specific CCP being monitored
  hazard_type VARCHAR(50), -- biological, chemical, physical
  monitoring_method VARCHAR(255), -- How it's monitored
  target_value VARCHAR(255), -- Target value/range
  actual_value VARCHAR(255), -- Actual value observed
  is_within_limit BOOLEAN DEFAULT true,
  corrective_action TEXT, -- If out of limit
  monitored_by VARCHAR(255), -- Staff member name
  reviewed_by VARCHAR(255), -- Supervisor who reviewed
  notes TEXT,
  photo_url TEXT, -- Optional photo evidence
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_haccp_date ON haccp_records(record_date DESC);
CREATE INDEX IF NOT EXISTS idx_haccp_step ON haccp_records(haccp_step);
CREATE INDEX IF NOT EXISTS idx_haccp_within_limit ON haccp_records(is_within_limit);

-- =====================================================
-- ALLERGEN MANAGEMENT
-- =====================================================
CREATE TABLE IF NOT EXISTS allergen_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  record_date DATE NOT NULL,
  record_type VARCHAR(50) NOT NULL, -- ingredient_check, menu_review, training, cross_contamination_check, customer_inquiry
  item_name VARCHAR(255), -- Ingredient, dish, or menu item
  allergens_present TEXT[], -- Array of allergens: ['gluten', 'dairy', 'nuts', etc.]
  allergens_declared TEXT[], -- Allergens declared to customers
  is_accurate BOOLEAN DEFAULT true, -- Whether declaration is accurate
  cross_contamination_risk VARCHAR(50), -- low, medium, high
  prevention_measures TEXT, -- Measures to prevent cross-contamination
  reviewed_by VARCHAR(255), -- Staff member who reviewed
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_allergen_date ON allergen_records(record_date DESC);
CREATE INDEX IF NOT EXISTS idx_allergen_type ON allergen_records(record_type);

-- =====================================================
-- EQUIPMENT MAINTENANCE RECORDS
-- =====================================================
CREATE TABLE IF NOT EXISTS equipment_maintenance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipment_name VARCHAR(255) NOT NULL,
  equipment_type VARCHAR(50), -- fridge, freezer, oven, dishwasher, etc.
  maintenance_date DATE NOT NULL,
  maintenance_type VARCHAR(50) NOT NULL, -- scheduled, repair, calibration, inspection
  service_provider VARCHAR(255), -- Company/person who performed maintenance
  description TEXT NOT NULL,
  cost DECIMAL(10,2),
  next_maintenance_date DATE,
  is_critical BOOLEAN DEFAULT false, -- Critical for food safety
  performed_by VARCHAR(255), -- Staff member or service provider
  notes TEXT,
  photo_url TEXT, -- Optional photo evidence
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_equipment_maintenance_date ON equipment_maintenance(maintenance_date DESC);
CREATE INDEX IF NOT EXISTS idx_equipment_maintenance_type ON equipment_maintenance(equipment_type);
CREATE INDEX IF NOT EXISTS idx_equipment_maintenance_critical ON equipment_maintenance(is_critical);

-- =====================================================
-- WASTE MANAGEMENT RECORDS
-- =====================================================
CREATE TABLE IF NOT EXISTS waste_management_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  log_date DATE NOT NULL,
  waste_type VARCHAR(50) NOT NULL, -- food_waste, recyclable, general, hazardous, grease
  quantity DECIMAL(10,2), -- Weight or volume
  unit VARCHAR(20), -- kg, litres, bags, etc.
  disposal_method VARCHAR(50), -- landfill, compost, recycling, grease_trap, etc.
  contractor_name VARCHAR(255), -- Waste contractor (if applicable)
  collection_date DATE,
  disposal_location VARCHAR(255), -- Where waste was disposed
  logged_by VARCHAR(255), -- Staff member name
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_waste_date ON waste_management_logs(log_date DESC);
CREATE INDEX IF NOT EXISTS idx_waste_type ON waste_management_logs(waste_type);

-- =====================================================
-- FOOD SAFETY PROCEDURES DOCUMENTATION
-- =====================================================
CREATE TABLE IF NOT EXISTS food_safety_procedures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  procedure_name VARCHAR(255) NOT NULL, -- e.g., "Receiving Procedures", "Storage Procedures", "Cooking Procedures"
  procedure_type VARCHAR(50) NOT NULL, -- receiving, storage, preparation, cooking, cooling, reheating, service, cleaning
  description TEXT NOT NULL,
  last_reviewed_date DATE,
  next_review_date DATE,
  reviewed_by VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  document_url TEXT, -- URL to procedure document
  version VARCHAR(20), -- Version number
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_procedures_type ON food_safety_procedures(procedure_type);
CREATE INDEX IF NOT EXISTS idx_procedures_active ON food_safety_procedures(is_active);
CREATE INDEX IF NOT EXISTS idx_procedures_review_date ON food_safety_procedures(next_review_date);

-- =====================================================
-- SUPPLIER VERIFICATION RECORDS
-- =====================================================
CREATE TABLE IF NOT EXISTS supplier_verification (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
  verification_date DATE NOT NULL,
  verification_type VARCHAR(50) NOT NULL, -- certification_check, product_inspection, audit, document_review
  certificate_type VARCHAR(255), -- Food Safety Certificate, HACCP Certificate, Organic Certification, etc.
  certificate_number VARCHAR(255),
  expiry_date DATE,
  is_valid BOOLEAN DEFAULT true,
  verification_result VARCHAR(50), -- approved, rejected, pending
  verified_by VARCHAR(255), -- Staff member who verified
  notes TEXT,
  document_url TEXT, -- URL to certificate/document
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_supplier_verification_date ON supplier_verification(verification_date DESC);
CREATE INDEX IF NOT EXISTS idx_supplier_verification_supplier ON supplier_verification(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_verification_valid ON supplier_verification(is_valid);
