-- PrepFlow Complete Database Setup Script for Supabase
-- Run this script in your Supabase SQL Editor

-- Drop existing tables if they exist (be careful in production!)
DROP TABLE IF EXISTS recipe_ingredients CASCADE;
DROP TABLE IF EXISTS recipes CASCADE;
DROP TABLE IF EXISTS ingredients CASCADE;
DROP TABLE IF EXISTS menu_dishes CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;

-- Create suppliers table first (referenced by ingredients)
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ingredients table
CREATE TABLE ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ingredient_name TEXT NOT NULL,
  brand TEXT,
  pack_size TEXT,
  pack_size_unit TEXT,
  pack_price DECIMAL(10,2),
  unit TEXT,
  cost_per_unit DECIMAL(10,4) NOT NULL DEFAULT 0,
  cost_per_unit_as_purchased DECIMAL(10,4),
  cost_per_unit_incl_trim DECIMAL(10,4),
  trim_peel_waste_percentage DECIMAL(5,2) DEFAULT 0,
  yield_percentage DECIMAL(5,2) DEFAULT 100,
  supplier TEXT,
  product_code TEXT,
  storage_location TEXT,
  min_stock_level INTEGER DEFAULT 0,
  current_stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recipes table
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  yield INTEGER DEFAULT 1,
  yield_unit TEXT DEFAULT 'serving',
  instructions TEXT,
  total_cost DECIMAL(10,2),
  cost_per_serving DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recipe_ingredients junction table
CREATE TABLE recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity DECIMAL(10,3) NOT NULL,
  unit TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create menu_dishes table
CREATE TABLE menu_dishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID REFERENCES recipes(id),
  name TEXT NOT NULL,
  selling_price DECIMAL(10,2),
  profit_margin DECIMAL(5,2),
  popularity_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
