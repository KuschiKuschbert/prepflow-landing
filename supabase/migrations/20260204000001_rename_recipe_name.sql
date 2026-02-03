-- Migration to rename name to recipe_name in recipes table
-- Purpose: Global consistency with dish_name and ingredient_name, fixing frontend display issues.

DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'name') THEN
        ALTER TABLE recipes RENAME COLUMN name TO recipe_name;
    END IF;
END $$;
