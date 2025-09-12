-- PrepFlow Complete Database Fix
-- Run this in your Supabase SQL Editor to fix all missing tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ingredients table with correct column names
CREATE TABLE IF NOT EXISTS ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ingredient_name VARCHAR(255) NOT NULL,
  brand VARCHAR(255),
  pack_size VARCHAR(100),
  unit VARCHAR(50) NOT NULL,
  cost_per_unit DECIMAL(10,4) NOT NULL,
  cost_per_unit_as_purchased DECIMAL(10,4),
  cost_per_unit_incl_trim DECIMAL(10,4),
  trim_peel_waste_percentage DECIMAL(5,2) DEFAULT 0,
  yield_percentage DECIMAL(5,2) DEFAULT 100,
  supplier VARCHAR(255),
  storage VARCHAR(255),
  product_code VARCHAR(100),
  category VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_name VARCHAR(255) NOT NULL,
  description TEXT,
  yield INTEGER NOT NULL DEFAULT 1,
  yield_unit VARCHAR(50) NOT NULL DEFAULT 'servings',
  instructions TEXT,
  prep_time_minutes INTEGER,
  cook_time_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recipe_ingredients junction table
CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity DECIMAL(10,3) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fix menu_dishes table structure
ALTER TABLE menu_dishes ADD COLUMN IF NOT EXISTS dish_name VARCHAR(255);
UPDATE menu_dishes SET dish_name = name WHERE dish_name IS NULL AND name IS NOT NULL;
-- Don't drop the name column yet, keep both for compatibility

-- Create temperature_equipment table
CREATE TABLE IF NOT EXISTS temperature_equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  equipment_type VARCHAR(50) NOT NULL,
  location VARCHAR(255),
  min_temp_celsius DECIMAL(5,2),
  max_temp_celsius DECIMAL(5,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create temperature_logs table
CREATE TABLE IF NOT EXISTS temperature_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipment_id UUID REFERENCES temperature_equipment(id) ON DELETE CASCADE,
  temperature_celsius DECIMAL(5,2) NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  recorded_by VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cleaning_areas table
CREATE TABLE IF NOT EXISTS cleaning_areas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  area_name VARCHAR(255) NOT NULL,
  description TEXT,
  cleaning_frequency VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cleaning_tasks table
CREATE TABLE IF NOT EXISTS cleaning_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  area_id UUID REFERENCES cleaning_areas(id) ON DELETE CASCADE,
  task_name VARCHAR(255) NOT NULL,
  description TEXT,
  frequency VARCHAR(50),
  estimated_duration_minutes INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create compliance_types table
CREATE TABLE IF NOT EXISTS compliance_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type_name VARCHAR(255) NOT NULL,
  description TEXT,
  frequency VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create compliance_records table
CREATE TABLE IF NOT EXISTS compliance_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  compliance_type_id UUID REFERENCES compliance_types(id) ON DELETE CASCADE,
  record_date DATE NOT NULL,
  status VARCHAR(50) NOT NULL,
  notes TEXT,
  recorded_by VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create par_levels table
CREATE TABLE IF NOT EXISTS par_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
  minimum_level DECIMAL(10,3) NOT NULL,
  maximum_level DECIMAL(10,3) NOT NULL,
  current_stock DECIMAL(10,3) DEFAULT 0,
  unit VARCHAR(50) NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_lists table
CREATE TABLE IF NOT EXISTS order_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  supplier_id UUID REFERENCES suppliers(id),
  status VARCHAR(50) DEFAULT 'pending',
  total_amount DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table (not order_list_items)
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_list_id UUID REFERENCES order_lists(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity_ordered DECIMAL(10,3) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  unit_price DECIMAL(10,4),
  total_price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create kitchen_sections table
CREATE TABLE IF NOT EXISTS kitchen_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_name VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create prep_lists table
CREATE TABLE IF NOT EXISTS prep_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prep_date DATE NOT NULL DEFAULT CURRENT_DATE,
  section_id UUID REFERENCES kitchen_sections(id),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create prep_list_items table
CREATE TABLE IF NOT EXISTS prep_list_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prep_list_id UUID REFERENCES prep_lists(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity_needed DECIMAL(10,3) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_specials table
CREATE TABLE IF NOT EXISTS ai_specials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  special_name VARCHAR(255) NOT NULL,
  description TEXT,
  suggested_price DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_specials_ingredients table
CREATE TABLE IF NOT EXISTS ai_specials_ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ai_special_id UUID REFERENCES ai_specials(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity DECIMAL(10,3) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  business_name VARCHAR(255),
  subscription_status VARCHAR(50) DEFAULT 'trial',
  subscription_expires TIMESTAMP WITH TIME ZONE,
  stripe_customer_id VARCHAR(255),
  email_verified BOOLEAN DEFAULT FALSE,
  email_verification_token VARCHAR(255),
  email_verification_expires TIMESTAMP WITH TIME ZONE,
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMP WITH TIME ZONE,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data for testing
INSERT INTO ingredients (ingredient_name, unit, cost_per_unit, category) VALUES
('Tomatoes', 'kg', 4.50, 'Vegetables'),
('Onions', 'kg', 2.30, 'Vegetables'),
('Garlic', 'kg', 8.90, 'Vegetables'),
('Olive Oil', 'L', 12.50, 'Oils'),
('Salt', 'kg', 1.20, 'Seasonings')
ON CONFLICT DO NOTHING;

INSERT INTO cleaning_areas (area_name, description, cleaning_frequency) VALUES
('Kitchen Floor', 'Main kitchen floor area', 'Daily'),
('Prep Station', 'Food preparation area', 'After each use'),
('Storage Area', 'Dry storage and cold storage', 'Weekly')
ON CONFLICT DO NOTHING;

INSERT INTO cleaning_tasks (area_id, task_name, description, frequency, estimated_duration_minutes) VALUES
((SELECT id FROM cleaning_areas WHERE area_name = 'Kitchen Floor' LIMIT 1), 'Sweep and Mop', 'Clean kitchen floor thoroughly', 'Daily', 30),
((SELECT id FROM cleaning_areas WHERE area_name = 'Prep Station' LIMIT 1), 'Sanitize Surfaces', 'Clean and sanitize all prep surfaces', 'After each use', 15),
((SELECT id FROM cleaning_areas WHERE area_name = 'Storage Area' LIMIT 1), 'Organize Storage', 'Check dates and organize storage areas', 'Weekly', 45)
ON CONFLICT DO NOTHING;

INSERT INTO suppliers (supplier_name, contact_person, email, phone) VALUES
('Fresh Produce Co', 'John Smith', 'john@freshproduce.com', '0412 345 678'),
('Meat Suppliers Ltd', 'Sarah Johnson', 'sarah@meatsuppliers.com', '0413 456 789'),
('Dairy Direct', 'Mike Brown', 'mike@dairydirect.com', '0414 567 890')
ON CONFLICT DO NOTHING;

INSERT INTO compliance_types (type_name, description, frequency) VALUES
('Temperature Check', 'Monitor food storage temperatures', 'Daily'),
('Cleaning Schedule', 'Verify cleaning tasks completion', 'Daily'),
('Stock Rotation', 'Check for expired products', 'Weekly')
ON CONFLICT DO NOTHING;

INSERT INTO temperature_equipment (name, equipment_type, location, min_temp_celsius, max_temp_celsius) VALUES
('Main Refrigerator', 'Cold Storage', 'Kitchen', 0, 5),
('Walk-in Freezer', 'Freezer', 'Storage Room', -24, -18),
('Hot Holding Cabinet', 'Hot Holding', 'Service Area', 60, 75)
ON CONFLICT DO NOTHING;
