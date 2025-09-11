-- Fix sales_data table structure
-- Run this in your Supabase SQL Editor

-- Drop the existing sales_data table if it exists
DROP TABLE IF EXISTS sales_data;

-- Create the sales_data table with correct structure
CREATE TABLE sales_data (
  id SERIAL PRIMARY KEY,
  dish_id UUID REFERENCES menu_dishes(id) ON DELETE CASCADE,
  number_sold INTEGER NOT NULL DEFAULT 0,
  popularity_percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on dish_id for better performance
CREATE INDEX idx_sales_data_dish_id ON sales_data(dish_id);

-- Create an index on date for better performance
CREATE INDEX idx_sales_data_date ON sales_data(date);
