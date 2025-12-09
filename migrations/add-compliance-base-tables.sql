-- Compliance Tracking Tables
-- Creates the base tables required for the compliance-records API

-- =====================================================
-- COMPLIANCE TYPES (license types, inspection types, etc.)
-- =====================================================
CREATE TABLE IF NOT EXISTS compliance_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type_name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100), -- 'license', 'inspection', 'certification', 'permit'
  reminder_default_days INTEGER DEFAULT 30, -- Default days before expiry to remind
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert common Australian compliance types
INSERT INTO compliance_types (type_name, description, category, reminder_default_days) VALUES
  ('Food Business License', 'Council food business registration/license', 'license', 60),
  ('Liquor License', 'State liquor license for serving alcohol', 'license', 90),
  ('Council Health Inspection', 'Local council health and safety inspection', 'inspection', 30),
  ('Fire Safety Certificate', 'Annual fire safety compliance certificate', 'certification', 60),
  ('Pest Control Certificate', 'Regular pest control treatment certificate', 'certification', 30),
  ('Food Safety Supervisor Certificate', 'Staff food safety supervisor certification', 'certification', 90),
  ('Public Liability Insurance', 'Public liability insurance policy', 'license', 30),
  ('Workers Compensation Insurance', 'Workers compensation insurance policy', 'license', 30)
ON CONFLICT DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_compliance_types_category ON compliance_types(category);
CREATE INDEX IF NOT EXISTS idx_compliance_types_active ON compliance_types(is_active);

-- =====================================================
-- COMPLIANCE RECORDS (actual records/documents)
-- =====================================================
CREATE TABLE IF NOT EXISTS compliance_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  compliance_type_id UUID REFERENCES compliance_types(id) ON DELETE CASCADE,
  document_name VARCHAR(255) NOT NULL,
  issue_date DATE,
  expiry_date DATE,
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'expired', 'pending', 'renewal_required'
  document_url TEXT, -- URL to stored document
  photo_url TEXT, -- URL to photo of document
  notes TEXT,
  reminder_enabled BOOLEAN DEFAULT true,
  reminder_days_before INTEGER, -- Days before expiry to send reminder (overrides type default)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_compliance_records_type ON compliance_records(compliance_type_id);
CREATE INDEX IF NOT EXISTS idx_compliance_records_expiry ON compliance_records(expiry_date);
CREATE INDEX IF NOT EXISTS idx_compliance_records_status ON compliance_records(status);

-- Function to update status based on expiry
CREATE OR REPLACE FUNCTION update_compliance_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.expiry_date IS NOT NULL THEN
    IF NEW.expiry_date < CURRENT_DATE THEN
      NEW.status := 'expired';
    ELSIF NEW.expiry_date <= CURRENT_DATE + INTERVAL '30 days' THEN
      NEW.status := 'renewal_required';
    ELSE
      NEW.status := 'active';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update status on insert/update
DROP TRIGGER IF EXISTS trigger_update_compliance_status ON compliance_records;
CREATE TRIGGER trigger_update_compliance_status
  BEFORE INSERT OR UPDATE ON compliance_records
  FOR EACH ROW
  EXECUTE FUNCTION update_compliance_status();
