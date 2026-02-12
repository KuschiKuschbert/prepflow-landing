-- PrepFlow Complete Table Structure Fix
-- Run this in your Supabase SQL Editor to add missing columns to existing tables

-- Fix cleaning_areas table
ALTER TABLE cleaning_areas ADD COLUMN IF NOT EXISTS area_name VARCHAR(255);
ALTER TABLE cleaning_areas ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE cleaning_areas ADD COLUMN IF NOT EXISTS cleaning_frequency VARCHAR(50);
ALTER TABLE cleaning_areas ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE cleaning_areas ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE cleaning_areas ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Fix cleaning_tasks table
ALTER TABLE cleaning_tasks ADD COLUMN IF NOT EXISTS area_id UUID REFERENCES cleaning_areas(id) ON DELETE CASCADE;
ALTER TABLE cleaning_tasks ADD COLUMN IF NOT EXISTS task_name VARCHAR(255);
ALTER TABLE cleaning_tasks ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE cleaning_tasks ADD COLUMN IF NOT EXISTS frequency VARCHAR(50);
ALTER TABLE cleaning_tasks ADD COLUMN IF NOT EXISTS estimated_duration_minutes INTEGER;
ALTER TABLE cleaning_tasks ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE cleaning_tasks ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE cleaning_tasks ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Fix suppliers table (add missing columns to existing structure)
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS supplier_name VARCHAR(255);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS contact_person VARCHAR(255);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS address TEXT;

-- Fix compliance_types table
ALTER TABLE compliance_types ADD COLUMN IF NOT EXISTS type_name VARCHAR(255);
ALTER TABLE compliance_types ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE compliance_types ADD COLUMN IF NOT EXISTS frequency VARCHAR(50);
ALTER TABLE compliance_types ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE compliance_types ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE compliance_types ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Fix compliance_records table
ALTER TABLE compliance_records ADD COLUMN IF NOT EXISTS compliance_type_id UUID REFERENCES compliance_types(id) ON DELETE CASCADE;
ALTER TABLE compliance_records ADD COLUMN IF NOT EXISTS record_date DATE;
ALTER TABLE compliance_records ADD COLUMN IF NOT EXISTS status VARCHAR(50);
ALTER TABLE compliance_records ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE compliance_records ADD COLUMN IF NOT EXISTS recorded_by VARCHAR(255);
ALTER TABLE compliance_records ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE compliance_records ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Fix par_levels table
ALTER TABLE par_levels ADD COLUMN IF NOT EXISTS ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE;
ALTER TABLE par_levels ADD COLUMN IF NOT EXISTS minimum_level DECIMAL(10,3);
ALTER TABLE par_levels ADD COLUMN IF NOT EXISTS maximum_level DECIMAL(10,3);
ALTER TABLE par_levels ADD COLUMN IF NOT EXISTS current_stock DECIMAL(10,3) DEFAULT 0;
ALTER TABLE par_levels ADD COLUMN IF NOT EXISTS unit VARCHAR(50);
ALTER TABLE par_levels ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE par_levels ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE par_levels ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Fix order_lists table
ALTER TABLE order_lists ADD COLUMN IF NOT EXISTS order_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE order_lists ADD COLUMN IF NOT EXISTS supplier_id UUID REFERENCES suppliers(id);
ALTER TABLE order_lists ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE order_lists ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10,2);
ALTER TABLE order_lists ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE order_lists ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Fix order_items table
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS order_list_id UUID REFERENCES order_lists(id) ON DELETE CASCADE;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS quantity_ordered DECIMAL(10,3);
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS unit VARCHAR(50);
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS unit_price DECIMAL(10,4);
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS total_price DECIMAL(10,2);
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Fix kitchen_sections table
ALTER TABLE kitchen_sections ADD COLUMN IF NOT EXISTS section_name VARCHAR(255);
ALTER TABLE kitchen_sections ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE kitchen_sections ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE kitchen_sections ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE kitchen_sections ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Fix prep_lists table
ALTER TABLE prep_lists ADD COLUMN IF NOT EXISTS prep_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE prep_lists ADD COLUMN IF NOT EXISTS section_id UUID REFERENCES kitchen_sections(id);
ALTER TABLE prep_lists ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE prep_lists ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE prep_lists ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Fix prep_list_items table
ALTER TABLE prep_list_items ADD COLUMN IF NOT EXISTS prep_list_id UUID REFERENCES prep_lists(id) ON DELETE CASCADE;
ALTER TABLE prep_list_items ADD COLUMN IF NOT EXISTS ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE;
ALTER TABLE prep_list_items ADD COLUMN IF NOT EXISTS quantity_needed DECIMAL(10,3);
ALTER TABLE prep_list_items ADD COLUMN IF NOT EXISTS unit VARCHAR(50);
ALTER TABLE prep_list_items ADD COLUMN IF NOT EXISTS is_completed BOOLEAN DEFAULT false;
ALTER TABLE prep_list_items ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE prep_list_items ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Fix ai_specials table
ALTER TABLE ai_specials ADD COLUMN IF NOT EXISTS special_name VARCHAR(255);
ALTER TABLE ai_specials ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE ai_specials ADD COLUMN IF NOT EXISTS suggested_price DECIMAL(10,2);
ALTER TABLE ai_specials ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE ai_specials ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE ai_specials ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Fix ai_specials_ingredients table
ALTER TABLE ai_specials_ingredients ADD COLUMN IF NOT EXISTS ai_special_id UUID REFERENCES ai_specials(id) ON DELETE CASCADE;
ALTER TABLE ai_specials_ingredients ADD COLUMN IF NOT EXISTS ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE;
ALTER TABLE ai_specials_ingredients ADD COLUMN IF NOT EXISTS quantity DECIMAL(10,3);
ALTER TABLE ai_specials_ingredients ADD COLUMN IF NOT EXISTS unit VARCHAR(50);
ALTER TABLE ai_specials_ingredients ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE ai_specials_ingredients ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Fix users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS business_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50) DEFAULT 'trial';
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_expires TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verification_token VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verification_expires TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Fix temperature_logs table (add missing columns to existing structure)
ALTER TABLE temperature_logs ADD COLUMN IF NOT EXISTS equipment_id UUID REFERENCES temperature_equipment(id) ON DELETE CASCADE;
ALTER TABLE temperature_logs ADD COLUMN IF NOT EXISTS recorded_by VARCHAR(255);

-- Insert sample data for testing

-- Insert cleaning areas
INSERT INTO cleaning_areas (area_name, description, cleaning_frequency) VALUES
('Kitchen Floor', 'Main kitchen floor area', 'Daily'),
('Prep Station', 'Food preparation area', 'After each use'),
('Storage Area', 'Dry storage and cold storage', 'Weekly'),
('Dining Area', 'Customer dining tables and chairs', 'After each service'),
('Bathroom', 'Staff and customer bathrooms', 'Every 2 hours'),
('Equipment', 'Kitchen equipment and appliances', 'After each use'),
('Windows & Doors', 'All windows and entry doors', 'Weekly'),
('Garbage Area', 'Garbage bins and waste disposal area', 'Daily')
ON CONFLICT (area_name) DO NOTHING;

-- Insert cleaning tasks
INSERT INTO cleaning_tasks (area_id, task_name, description, frequency, estimated_duration_minutes) VALUES
((SELECT id FROM cleaning_areas WHERE area_name = 'Kitchen Floor' LIMIT 1), 'Sweep and Mop', 'Clean kitchen floor thoroughly', 'Daily', 30),
((SELECT id FROM cleaning_areas WHERE area_name = 'Prep Station' LIMIT 1), 'Sanitize Surfaces', 'Clean and sanitize all prep surfaces', 'After each use', 15),
((SELECT id FROM cleaning_areas WHERE area_name = 'Storage Area' LIMIT 1), 'Organize Storage', 'Check dates and organize storage areas', 'Weekly', 45),
((SELECT id FROM cleaning_areas WHERE area_name = 'Dining Area' LIMIT 1), 'Clean Tables', 'Wipe down all dining tables and chairs', 'After each service', 20),
((SELECT id FROM cleaning_areas WHERE area_name = 'Bathroom' LIMIT 1), 'Deep Clean', 'Clean toilets, sinks, and restock supplies', 'Every 2 hours', 25),
((SELECT id FROM cleaning_areas WHERE area_name = 'Equipment' LIMIT 1), 'Sanitize Equipment', 'Clean and sanitize all cooking equipment', 'After each use', 30),
((SELECT id FROM cleaning_areas WHERE area_name = 'Windows & Doors' LIMIT 1), 'Clean Glass', 'Clean all windows and door glass', 'Weekly', 60),
((SELECT id FROM cleaning_areas WHERE area_name = 'Garbage Area' LIMIT 1), 'Empty Bins', 'Empty garbage bins and clean area', 'Daily', 15)
ON CONFLICT DO NOTHING;

-- Insert suppliers (update existing ones)
UPDATE suppliers SET supplier_name = 'Fresh Produce Co', contact_person = 'John Smith', email = 'john@freshproduce.com', phone = '0412 345 678', address = '123 Market St, Brisbane QLD 4000' WHERE name = 'Fresh Produce Co' OR supplier_name = 'Fresh Produce Co' OR id IN (SELECT id FROM suppliers LIMIT 1);

INSERT INTO suppliers (supplier_name, contact_person, email, phone, address) VALUES
('Meat Suppliers Ltd', 'Sarah Johnson', 'sarah@meatsuppliers.com', '0413 456 789', '456 Industrial Ave, Brisbane QLD 4000'),
('Dairy Direct', 'Mike Brown', 'mike@dairydirect.com', '0414 567 890', '789 Farm Rd, Brisbane QLD 4000'),
('Local Grower', 'Emma Wilson', 'emma@localgrower.com', '0415 678 901', '321 Green St, Brisbane QLD 4000'),
('Seafood Direct', 'Tom Davis', 'tom@seafooddirect.com', '0416 789 012', '654 Harbor View, Brisbane QLD 4000'),
('Bulk Foods', 'Lisa Chen', 'lisa@bulkfoods.com', '0417 890 123', '987 Warehouse Blvd, Brisbane QLD 4000'),
('Local Butcher', 'Dave Roberts', 'dave@localbutcher.com', '0418 901 234', '147 Butcher St, Brisbane QLD 4000'),
('Masterfoods', 'Karen Lee', 'karen@masterfoods.com', '0419 012 345', '258 Spice Ave, Brisbane QLD 4000')
ON CONFLICT (supplier_name) DO NOTHING;

-- Insert compliance types
INSERT INTO compliance_types (type_name, description, frequency) VALUES
('Temperature Check', 'Monitor food storage temperatures', 'Daily'),
('Cleaning Schedule', 'Verify cleaning tasks completion', 'Daily'),
('Stock Rotation', 'Check for expired products', 'Weekly'),
('Food Safety Training', 'Staff food safety training records', 'Monthly'),
('Pest Control', 'Pest control inspection and treatment', 'Monthly'),
('Equipment Maintenance', 'Kitchen equipment maintenance checks', 'Weekly'),
('Health Inspection', 'Council health inspection preparation', 'Quarterly'),
('Allergen Management', 'Allergen control and labeling verification', 'Daily')
ON CONFLICT (type_name) DO NOTHING;

-- Insert kitchen sections
INSERT INTO kitchen_sections (section_name, description) VALUES
('Hot Kitchen', 'Main cooking area with stoves and ovens'),
('Cold Kitchen', 'Salad and cold food preparation area'),
('Grill Station', 'Grilled items and BBQ preparation'),
('Pastry Section', 'Desserts and baked goods preparation'),
('Prep Station', 'General food preparation and mise en place'),
('Dishwashing', 'Dishwashing and cleaning station'),
('Storage', 'Dry and cold storage areas'),
('Service', 'Food plating and service area')
ON CONFLICT (section_name) DO NOTHING;

-- Insert temperature equipment (update existing ones)
UPDATE temperature_equipment SET name = 'Main Refrigerator', equipment_type = 'Cold Storage', location = 'Kitchen', min_temp_celsius = 0, max_temp_celsius = 5 WHERE name = 'Main Refrigerator' OR id IN (SELECT id FROM temperature_equipment LIMIT 1);

INSERT INTO temperature_equipment (name, equipment_type, location, min_temp_celsius, max_temp_celsius) VALUES
('Walk-in Freezer', 'Freezer', 'Storage Room', -24, -18),
('Hot Holding Cabinet', 'Hot Holding', 'Service Area', 60, 75),
('Display Fridge', 'Cold Storage', 'Service Area', 0, 5),
('Ice Machine', 'Ice Production', 'Bar Area', -2, 0),
('Beer Cooler', 'Cold Storage', 'Bar Area', 2, 8),
('Wine Fridge', 'Cold Storage', 'Storage Room', 10, 15),
('Prep Fridge', 'Cold Storage', 'Prep Station', 0, 5)
ON CONFLICT (name) DO NOTHING;

-- Insert compliance records for today
INSERT INTO compliance_records (compliance_type_id, record_date, status, notes, recorded_by) VALUES
((SELECT id FROM compliance_types WHERE type_name = 'Temperature Check' LIMIT 1), CURRENT_DATE, 'Completed', 'All temperatures within safe range', 'System Admin'),
((SELECT id FROM compliance_types WHERE type_name = 'Cleaning Schedule' LIMIT 1), CURRENT_DATE, 'Completed', 'All cleaning tasks completed on schedule', 'System Admin'),
((SELECT id FROM compliance_types WHERE type_name = 'Stock Rotation' LIMIT 1), CURRENT_DATE, 'Completed', 'Stock rotation checked, no expired items', 'System Admin'),
((SELECT id FROM compliance_types WHERE type_name = 'Allergen Management' LIMIT 1), CURRENT_DATE, 'Completed', 'All allergen labels verified and up to date', 'System Admin')
ON CONFLICT DO NOTHING;

-- Insert prep lists for today
INSERT INTO prep_lists (prep_date, section_id, status) VALUES
(CURRENT_DATE, (SELECT id FROM kitchen_sections WHERE section_name = 'Hot Kitchen' LIMIT 1), 'Pending'),
(CURRENT_DATE, (SELECT id FROM kitchen_sections WHERE section_name = 'Cold Kitchen' LIMIT 1), 'Pending'),
(CURRENT_DATE, (SELECT id FROM kitchen_sections WHERE section_name = 'Grill Station' LIMIT 1), 'Pending'),
(CURRENT_DATE, (SELECT id FROM kitchen_sections WHERE section_name = 'Pastry Section' LIMIT 1), 'Pending'),
(CURRENT_DATE, (SELECT id FROM kitchen_sections WHERE section_name = 'Prep Station' LIMIT 1), 'Pending')
ON CONFLICT DO NOTHING;

-- Insert order lists for today
INSERT INTO order_lists (order_date, supplier_id, status, total_amount) VALUES
(CURRENT_DATE, (SELECT id FROM suppliers WHERE supplier_name = 'Fresh Produce Co' LIMIT 1), 'Draft', 0),
(CURRENT_DATE, (SELECT id FROM suppliers WHERE supplier_name = 'Meat Suppliers Ltd' LIMIT 1), 'Draft', 0),
(CURRENT_DATE, (SELECT id FROM suppliers WHERE supplier_name = 'Dairy Direct' LIMIT 1), 'Draft', 0)
ON CONFLICT DO NOTHING;
