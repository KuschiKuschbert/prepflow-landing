-- Menu Builder Database Schema Migration
-- Run this in your Supabase SQL Editor to add menu builder functionality

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- DISHES SYSTEM
-- =====================================================

-- Dishes table - Stores complete dishes (separate from menu_dishes)
CREATE TABLE IF NOT EXISTS dishes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dish_name VARCHAR(255) NOT NULL,
  description TEXT,
  selling_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dish recipes junction table - Many-to-many relationship between dishes and recipes
CREATE TABLE IF NOT EXISTS dish_recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dish_id UUID NOT NULL REFERENCES dishes(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  quantity DECIMAL(10,4) NOT NULL DEFAULT 1, -- number of recipe servings
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(dish_id, recipe_id)
);

-- Dish ingredients table - Standalone ingredients in dishes
CREATE TABLE IF NOT EXISTS dish_ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dish_id UUID NOT NULL REFERENCES dishes(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity DECIMAL(10,4) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(dish_id, ingredient_id)
);

-- =====================================================
-- MENUS SYSTEM
-- =====================================================

-- Menus table - Saved menu configurations
CREATE TABLE IF NOT EXISTS menus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu items table - Junction table for menus and dishes with ordering
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_id UUID NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
  dish_id UUID NOT NULL REFERENCES dishes(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL DEFAULT 'Uncategorized', -- e.g., "Appetizers", "Mains", "Desserts"
  position INTEGER NOT NULL DEFAULT 0, -- Order within category
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Dishes indexes
CREATE INDEX IF NOT EXISTS idx_dishes_dish_name ON dishes(dish_name);
CREATE INDEX IF NOT EXISTS idx_dishes_created_at ON dishes(created_at);

-- Dish recipes indexes
CREATE INDEX IF NOT EXISTS idx_dish_recipes_dish_id ON dish_recipes(dish_id);
CREATE INDEX IF NOT EXISTS idx_dish_recipes_recipe_id ON dish_recipes(recipe_id);

-- Dish ingredients indexes
CREATE INDEX IF NOT EXISTS idx_dish_ingredients_dish_id ON dish_ingredients(dish_id);
CREATE INDEX IF NOT EXISTS idx_dish_ingredients_ingredient_id ON dish_ingredients(ingredient_id);

-- Menus indexes
CREATE INDEX IF NOT EXISTS idx_menus_menu_name ON menus(menu_name);
CREATE INDEX IF NOT EXISTS idx_menus_created_at ON menus(created_at);

-- Menu items indexes - Composite index for efficient ordering
CREATE INDEX IF NOT EXISTS idx_menu_items_menu_id ON menu_items(menu_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_dish_id ON menu_items(dish_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_menu_category_position ON menu_items(menu_id, category, position);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Create or replace trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at on dishes and menus
DROP TRIGGER IF EXISTS update_dishes_updated_at ON dishes;
CREATE TRIGGER update_dishes_updated_at
  BEFORE UPDATE ON dishes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_menus_updated_at ON menus;
CREATE TRIGGER update_menus_updated_at
  BEFORE UPDATE ON menus
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
