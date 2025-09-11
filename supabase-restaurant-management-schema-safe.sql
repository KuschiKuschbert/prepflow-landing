-- PrepFlow Restaurant Management Features Database Schema (Safe Version)
-- This extends the existing PrepFlow schema with new restaurant management features
-- Uses IF NOT EXISTS to avoid conflicts with existing tables

-- =====================================================
-- CLEANING ROSTER SYSTEM
-- =====================================================

-- Cleaning areas that need to be maintained
CREATE TABLE IF NOT EXISTS cleaning_areas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  frequency_days INTEGER DEFAULT 7, -- How often it needs cleaning
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cleaning tasks/records
CREATE TABLE IF NOT EXISTS cleaning_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  area_id UUID REFERENCES cleaning_areas(id) ON DELETE CASCADE,
  assigned_date DATE NOT NULL,
  completed_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'pending', -- pending, completed, overdue
  notes TEXT,
  photo_url TEXT, -- URL to uploaded photo
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TEMPERATURE LOGGING SYSTEM
-- =====================================================

-- Temperature log entries
CREATE TABLE IF NOT EXISTS temperature_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  log_date DATE NOT NULL,
  log_time TIME NOT NULL,
  temperature_type VARCHAR(50) NOT NULL, -- fridge, freezer, food_cooking, storage
  temperature_celsius DECIMAL(5,2) NOT NULL,
  location VARCHAR(255), -- e.g., "Main Fridge", "Freezer 1", "Grill Station"
  notes TEXT,
  photo_url TEXT, -- Optional photo of thermometer reading
  logged_by VARCHAR(255), -- Staff member name
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Temperature alerts/thresholds
CREATE TABLE IF NOT EXISTS temperature_thresholds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  temperature_type VARCHAR(50) NOT NULL,
  min_temp_celsius DECIMAL(5,2),
  max_temp_celsius DECIMAL(5,2),
  alert_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- COMPLIANCE TRACKING SYSTEM
-- =====================================================

-- Compliance document types
CREATE TABLE IF NOT EXISTS compliance_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL, -- e.g., "Pest Control", "Council Inspection", "Food License"
  description TEXT,
  renewal_frequency_days INTEGER, -- How often it needs renewal
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Compliance records
CREATE TABLE IF NOT EXISTS compliance_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  compliance_type_id UUID REFERENCES compliance_types(id) ON DELETE CASCADE,
  document_name VARCHAR(255) NOT NULL,
  issue_date DATE,
  expiry_date DATE,
  status VARCHAR(50) DEFAULT 'active', -- active, expired, pending_renewal
  document_url TEXT, -- URL to uploaded document
  photo_url TEXT, -- Optional photo of physical document
  notes TEXT,
  reminder_enabled BOOLEAN DEFAULT true,
  reminder_days_before INTEGER DEFAULT 30, -- Days before expiry to send reminder
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SUPPLIER MANAGEMENT SYSTEM
-- =====================================================

-- Suppliers
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(255),
  address TEXT,
  website VARCHAR(255),
  payment_terms VARCHAR(255), -- e.g., "Net 30", "Cash on Delivery"
  delivery_schedule TEXT, -- e.g., "Monday, Wednesday, Friday"
  minimum_order_amount DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Supplier price lists (photos/documents)
CREATE TABLE IF NOT EXISTS supplier_price_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
  document_name VARCHAR(255) NOT NULL,
  document_url TEXT NOT NULL, -- URL to uploaded price list
  effective_date DATE,
  expiry_date DATE,
  is_current BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PAR LEVELS & INVENTORY MANAGEMENT
-- =====================================================

-- Par levels for ingredients
CREATE TABLE IF NOT EXISTS par_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
  par_quantity DECIMAL(10,3) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  auto_calculate BOOLEAN DEFAULT false, -- Future automation feature
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ORDER MANAGEMENT SYSTEM
-- =====================================================

-- Order lists
CREATE TABLE IF NOT EXISTS order_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_date DATE NOT NULL,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'draft', -- draft, sent, received, cancelled
  total_amount DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES order_lists(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity DECIMAL(10,3) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  unit_price DECIMAL(10,2),
  total_price DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- DISH SECTIONS & PREP LISTS
-- =====================================================

-- Kitchen sections/stations
CREATE TABLE IF NOT EXISTS kitchen_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL, -- e.g., "Grill", "Salad Station", "Breakfast"
  description TEXT,
  color_code VARCHAR(7), -- Hex color for UI
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Link dishes to kitchen sections
CREATE TABLE IF NOT EXISTS dish_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dish_id UUID REFERENCES menu_dishes(id) ON DELETE CASCADE,
  section_id UUID REFERENCES kitchen_sections(id) ON DELETE CASCADE,
  prep_priority INTEGER DEFAULT 1, -- 1 = high priority, 2 = medium, 3 = low
  prep_time_minutes INTEGER, -- Estimated prep time
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(dish_id, section_id)
);

-- Prep lists
CREATE TABLE IF NOT EXISTS prep_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prep_date DATE NOT NULL,
  section_id UUID REFERENCES kitchen_sections(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'draft', -- draft, active, completed
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prep list items (dishes to prep)
CREATE TABLE IF NOT EXISTS prep_list_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prep_list_id UUID REFERENCES prep_lists(id) ON DELETE CASCADE,
  dish_id UUID REFERENCES menu_dishes(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  prep_status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, completed
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- RECIPE SHARING SYSTEM
-- =====================================================

-- Shared recipes
CREATE TABLE IF NOT EXISTS shared_recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  share_token VARCHAR(255) UNIQUE NOT NULL, -- Unique token for sharing
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- AI SPECIALS GENERATOR
-- =====================================================

-- AI-generated specials
CREATE TABLE IF NOT EXISTS ai_specials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  ingredients_used TEXT[], -- Array of ingredient names
  estimated_cost DECIMAL(10,2),
  suggested_price DECIMAL(10,2),
  image_url TEXT, -- Photo of the dish
  ai_prompt TEXT, -- The prompt used to generate this special
  status VARCHAR(50) DEFAULT 'generated', -- generated, approved, rejected, active
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SYSTEM SETTINGS
-- =====================================================

-- System configuration
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key VARCHAR(255) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type VARCHAR(50) DEFAULT 'string', -- string, number, boolean, json
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE (IF NOT EXISTS)
-- =====================================================

-- Cleaning tasks indexes
CREATE INDEX IF NOT EXISTS idx_cleaning_tasks_area_id ON cleaning_tasks(area_id);
CREATE INDEX IF NOT EXISTS idx_cleaning_tasks_assigned_date ON cleaning_tasks(assigned_date);
CREATE INDEX IF NOT EXISTS idx_cleaning_tasks_status ON cleaning_tasks(status);

-- Temperature logs indexes
CREATE INDEX IF NOT EXISTS idx_temperature_logs_date ON temperature_logs(log_date);
CREATE INDEX IF NOT EXISTS idx_temperature_logs_type ON temperature_logs(temperature_type);

-- Compliance records indexes
CREATE INDEX IF NOT EXISTS idx_compliance_records_type_id ON compliance_records(compliance_type_id);
CREATE INDEX IF NOT EXISTS idx_compliance_records_expiry_date ON compliance_records(expiry_date);
CREATE INDEX IF NOT EXISTS idx_compliance_records_status ON compliance_records(status);

-- Supplier indexes
CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers(name);
CREATE INDEX IF NOT EXISTS idx_suppliers_active ON suppliers(is_active);

-- Order management indexes
CREATE INDEX IF NOT EXISTS idx_order_lists_supplier_id ON order_lists(supplier_id);
CREATE INDEX IF NOT EXISTS idx_order_lists_date ON order_lists(order_date);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Prep list indexes
CREATE INDEX IF NOT EXISTS idx_prep_lists_date ON prep_lists(prep_date);
CREATE INDEX IF NOT EXISTS idx_prep_lists_section_id ON prep_lists(section_id);
CREATE INDEX IF NOT EXISTS idx_dish_sections_dish_id ON dish_sections(dish_id);

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
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at column (DROP IF EXISTS first)
DROP TRIGGER IF EXISTS update_cleaning_areas_updated_at ON cleaning_areas;
DROP TRIGGER IF EXISTS update_cleaning_tasks_updated_at ON cleaning_tasks;
DROP TRIGGER IF EXISTS update_temperature_logs_updated_at ON temperature_logs;
DROP TRIGGER IF EXISTS update_temperature_thresholds_updated_at ON temperature_thresholds;
DROP TRIGGER IF EXISTS update_compliance_types_updated_at ON compliance_types;
DROP TRIGGER IF EXISTS update_compliance_records_updated_at ON compliance_records;
DROP TRIGGER IF EXISTS update_suppliers_updated_at ON suppliers;
DROP TRIGGER IF EXISTS update_supplier_price_lists_updated_at ON supplier_price_lists;
DROP TRIGGER IF EXISTS update_par_levels_updated_at ON par_levels;
DROP TRIGGER IF EXISTS update_order_lists_updated_at ON order_lists;
DROP TRIGGER IF EXISTS update_order_items_updated_at ON order_items;
DROP TRIGGER IF EXISTS update_kitchen_sections_updated_at ON kitchen_sections;
DROP TRIGGER IF EXISTS update_dish_sections_updated_at ON dish_sections;
DROP TRIGGER IF EXISTS update_prep_lists_updated_at ON prep_lists;
DROP TRIGGER IF EXISTS update_prep_list_items_updated_at ON prep_list_items;
DROP TRIGGER IF EXISTS update_shared_recipes_updated_at ON shared_recipes;
DROP TRIGGER IF EXISTS update_ai_specials_updated_at ON ai_specials;
DROP TRIGGER IF EXISTS update_system_settings_updated_at ON system_settings;

-- Create triggers
CREATE TRIGGER update_cleaning_areas_updated_at BEFORE UPDATE ON cleaning_areas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cleaning_tasks_updated_at BEFORE UPDATE ON cleaning_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_temperature_logs_updated_at BEFORE UPDATE ON temperature_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_temperature_thresholds_updated_at BEFORE UPDATE ON temperature_thresholds FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_compliance_types_updated_at BEFORE UPDATE ON compliance_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_compliance_records_updated_at BEFORE UPDATE ON compliance_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_supplier_price_lists_updated_at BEFORE UPDATE ON supplier_price_lists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_par_levels_updated_at BEFORE UPDATE ON par_levels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_order_lists_updated_at BEFORE UPDATE ON order_lists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_order_items_updated_at BEFORE UPDATE ON order_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_kitchen_sections_updated_at BEFORE UPDATE ON kitchen_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dish_sections_updated_at BEFORE UPDATE ON dish_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prep_lists_updated_at BEFORE UPDATE ON prep_lists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prep_list_items_updated_at BEFORE UPDATE ON prep_list_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shared_recipes_updated_at BEFORE UPDATE ON shared_recipes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_specials_updated_at BEFORE UPDATE ON ai_specials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SAMPLE DATA INSERTION (ON CONFLICT DO NOTHING)
-- =====================================================

-- Insert default cleaning areas
INSERT INTO cleaning_areas (name, description, frequency_days) VALUES
('Kitchen Floors', 'Daily floor cleaning and mopping', 1),
('Prep Tables', 'Sanitizing all prep surfaces', 1),
('Deep Clean Fridge', 'Weekly deep clean of all refrigerators', 7),
('Deep Clean Freezer', 'Weekly deep clean of all freezers', 7),
('Equipment Cleaning', 'Deep clean of cooking equipment', 3),
('Dining Area', 'Cleaning dining tables and chairs', 1),
('Bathroom', 'Restroom cleaning and sanitizing', 1),
('Storage Areas', 'Organizing and cleaning storage spaces', 7)
ON CONFLICT (id) DO NOTHING;

-- Insert default temperature thresholds
INSERT INTO temperature_thresholds (temperature_type, min_temp_celsius, max_temp_celsius) VALUES
('fridge', 0, 4),
('freezer', -18, -15),
('food_cooking', 75, 100),
('storage', 15, 25)
ON CONFLICT (id) DO NOTHING;

-- Insert default compliance types
INSERT INTO compliance_types (name, description, renewal_frequency_days) VALUES
('Pest Control', 'Regular pest control inspections and treatments', 90),
('Council Inspection', 'Local council health and safety inspections', 365),
('Food License', 'Food service license renewal', 365),
('Fire Safety', 'Fire safety equipment and inspection', 365),
('Insurance', 'Business insurance renewal', 365)
ON CONFLICT (id) DO NOTHING;

-- Insert default kitchen sections
INSERT INTO kitchen_sections (name, description, color_code) VALUES
('Grill Station', 'Grilling and hot food preparation', '#FF6B6B'),
('Salad Station', 'Cold food and salad preparation', '#4ECDC4'),
('Breakfast Station', 'Morning meal preparation', '#45B7D1'),
('Dessert Station', 'Dessert and pastry preparation', '#96CEB4'),
('Prep Station', 'General food preparation', '#FFEAA7'),
('Service Station', 'Final plating and service', '#DDA0DD')
ON CONFLICT (id) DO NOTHING;

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description) VALUES
('work_week_start_day', '1', 'number', 'Day of week to start work week (1=Monday, 7=Sunday)'),
('prep_list_reminder_time', '18:00', 'string', 'Time to send prep list reminders (HH:MM format)'),
('temperature_log_reminder_enabled', 'true', 'boolean', 'Enable temperature logging reminders'),
('cleaning_reminder_enabled', 'true', 'boolean', 'Enable cleaning task reminders'),
('compliance_reminder_enabled', 'true', 'boolean', 'Enable compliance document reminders'),
('par_level_auto_calculate', 'false', 'boolean', 'Enable automatic par level calculation'),
('ai_specials_enabled', 'true', 'boolean', 'Enable AI specials generator'),
('recipe_sharing_enabled', 'true', 'boolean', 'Enable recipe sharing functionality')
ON CONFLICT (setting_key) DO NOTHING;

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE cleaning_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE cleaning_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE temperature_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE temperature_thresholds ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_price_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE par_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE kitchen_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE dish_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE prep_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE prep_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_specials ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON cleaning_areas;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON cleaning_tasks;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON temperature_logs;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON temperature_thresholds;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON compliance_types;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON compliance_records;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON suppliers;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON supplier_price_lists;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON par_levels;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON order_lists;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON order_items;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON kitchen_sections;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON dish_sections;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON prep_lists;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON prep_list_items;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON shared_recipes;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON ai_specials;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON system_settings;

-- Create policies for authenticated users (for now, allow all operations)
-- In production, you would create more restrictive policies based on user roles

CREATE POLICY "Allow all operations for authenticated users" ON cleaning_areas FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON cleaning_tasks FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON temperature_logs FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON temperature_thresholds FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON compliance_types FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON compliance_records FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON suppliers FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON supplier_price_lists FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON par_levels FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON order_lists FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON order_items FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON kitchen_sections FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON dish_sections FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON prep_lists FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON prep_list_items FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON shared_recipes FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON ai_specials FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON system_settings FOR ALL TO authenticated USING (true);

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE cleaning_areas IS 'Areas that need regular cleaning maintenance';
COMMENT ON TABLE cleaning_tasks IS 'Individual cleaning tasks with photo verification';
COMMENT ON TABLE temperature_logs IS 'Temperature readings for food safety compliance';
COMMENT ON TABLE temperature_thresholds IS 'Temperature limits and alert settings';
COMMENT ON TABLE compliance_types IS 'Types of compliance documents (pest control, licenses, etc.)';
COMMENT ON TABLE compliance_records IS 'Individual compliance documents with expiry tracking';
COMMENT ON TABLE suppliers IS 'Supplier contact information and details';
COMMENT ON TABLE supplier_price_lists IS 'Uploaded price lists from suppliers';
COMMENT ON TABLE par_levels IS 'Minimum stock levels for ingredients';
COMMENT ON TABLE order_lists IS 'Purchase orders to suppliers';
COMMENT ON TABLE order_items IS 'Individual items in purchase orders';
COMMENT ON TABLE kitchen_sections IS 'Kitchen stations/sections for organization';
COMMENT ON TABLE dish_sections IS 'Assignment of dishes to kitchen sections';
COMMENT ON TABLE prep_lists IS 'Daily prep lists for kitchen sections';
COMMENT ON TABLE prep_list_items IS 'Individual dishes in prep lists';
COMMENT ON TABLE shared_recipes IS 'Recipe sharing with unique tokens';
COMMENT ON TABLE ai_specials IS 'AI-generated specials with image recognition';
COMMENT ON TABLE system_settings IS 'System configuration and settings';
