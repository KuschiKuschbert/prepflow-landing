-- Migration: add-staff-onboarding-infrastructure
-- Adds infrastructure for paperless onboarding (documents, status, storage)

-- 1. Add onboarding_status to employees
ALTER TABLE employees
ADD COLUMN IF NOT EXISTS onboarding_status VARCHAR(50) DEFAULT 'pending';

-- 2. Create onboarding_documents table
CREATE TABLE IF NOT EXISTS onboarding_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL, -- 'id', 'contract', 'tax_form', 'bank_details'
  file_url TEXT, -- URL to stored document in onboarding-docs bucket
  signature_data TEXT, -- Base64 signature data (svg/png)
  signed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_onboarding_documents_employee ON onboarding_documents(employee_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_documents_type ON onboarding_documents(document_type);

-- 3. Add trigger for updated_at
DROP TRIGGER IF EXISTS update_onboarding_documents_updated_at ON onboarding_documents;
CREATE TRIGGER update_onboarding_documents_updated_at
  BEFORE UPDATE ON onboarding_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 4. Seed new qualification types for ID
INSERT INTO qualification_types (name, description, is_required, default_expiry_days, is_active)
VALUES
  ('Identity Document', 'Government issued ID (Passport, Drivers License)', true, NULL, true)
ON CONFLICT (name) DO NOTHING;

-- 5. Create storage bucket (if inserts are allowed in your environment)
-- Note: This might require different permissions, usually done via dashboard or CLI
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('onboarding-docs', 'onboarding-docs', false)
-- ON CONFLICT (id) DO NOTHING;
