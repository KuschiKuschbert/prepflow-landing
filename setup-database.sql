-- PrepFlow Database Setup Script
-- Run this in your Supabase SQL Editor

-- Create ingredients table
CREATE TABLE IF NOT EXISTS ingredients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(255),
  pack_size DECIMAL(10,2),
  unit VARCHAR(50),
  cost_per_unit DECIMAL(10,4),
  trim_peel_waste_percent DECIMAL(5,2),
  yield_percent DECIMAL(5,2),
  supplier VARCHAR(255),
  storage VARCHAR(100),
  product_code VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  yield_servings INTEGER,
  instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recipe_ingredients table
CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id SERIAL PRIMARY KEY,
  recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id INTEGER REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity DECIMAL(10,3) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create menu_dishes table
CREATE TABLE IF NOT EXISTS menu_dishes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  recipe_id INTEGER REFERENCES recipes(id),
  selling_price DECIMAL(10,2),
  food_cost DECIMAL(10,2),
  gross_profit DECIMAL(10,2),
  gross_profit_percentage DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sales_data table
CREATE TABLE IF NOT EXISTS sales_data (
  id SERIAL PRIMARY KEY,
  dish_id INTEGER REFERENCES menu_dishes(id) ON DELETE CASCADE,
  number_sold INTEGER NOT NULL DEFAULT 0,
  popularity_percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table (if not exists)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
