-- Migration: Populate sample stock data for testing
-- Run this in Supabase SQL Editor AFTER running add-current-stock-to-ingredients.sql

-- Update some common ingredients with stock values
-- This is sample data - adjust quantities as needed for your kitchen

UPDATE ingredients SET current_stock = 2000 WHERE ingredient_name ILIKE '%salt%' OR ingredient_name ILIKE '%sea salt%';
UPDATE ingredients SET current_stock = 500 WHERE ingredient_name ILIKE '%pepper%' OR ingredient_name ILIKE '%black pepper%';
UPDATE ingredients SET current_stock = 1000 WHERE ingredient_name ILIKE '%olive oil%' OR ingredient_name ILIKE 'oil%';
UPDATE ingredients SET current_stock = 500 WHERE ingredient_name ILIKE '%butter%';
UPDATE ingredients SET current_stock = 2000 WHERE ingredient_name ILIKE '%onion%';
UPDATE ingredients SET current_stock = 500 WHERE ingredient_name ILIKE '%garlic%';
UPDATE ingredients SET current_stock = 2000 WHERE ingredient_name ILIKE '%flour%';
UPDATE ingredients SET current_stock = 1000 WHERE ingredient_name ILIKE '%sugar%';
UPDATE ingredients SET current_stock = 24 WHERE ingredient_name ILIKE '%egg%';
UPDATE ingredients SET current_stock = 2000 WHERE ingredient_name ILIKE '%milk%';
UPDATE ingredients SET current_stock = 1000 WHERE ingredient_name ILIKE '%cream%';
UPDATE ingredients SET current_stock = 500 WHERE ingredient_name ILIKE '%cheese%' AND ingredient_name ILIKE '%cheddar%';
UPDATE ingredients SET current_stock = 200 WHERE ingredient_name ILIKE '%parmesan%';
UPDATE ingredients SET current_stock = 1000 WHERE ingredient_name ILIKE '%chicken%';
UPDATE ingredients SET current_stock = 500 WHERE ingredient_name ILIKE '%beef%' OR ingredient_name ILIKE '%mince%';
UPDATE ingredients SET current_stock = 500 WHERE ingredient_name ILIKE '%bacon%';
UPDATE ingredients SET current_stock = 1000 WHERE ingredient_name ILIKE '%tomato%';
UPDATE ingredients SET current_stock = 1000 WHERE ingredient_name ILIKE '%potato%';
UPDATE ingredients SET current_stock = 500 WHERE ingredient_name ILIKE '%carrot%';
UPDATE ingredients SET current_stock = 200 WHERE ingredient_name ILIKE '%basil%';
UPDATE ingredients SET current_stock = 200 WHERE ingredient_name ILIKE '%parsley%';
UPDATE ingredients SET current_stock = 100 WHERE ingredient_name ILIKE '%thyme%';
UPDATE ingredients SET current_stock = 100 WHERE ingredient_name ILIKE '%rosemary%';
UPDATE ingredients SET current_stock = 1000 WHERE ingredient_name ILIKE '%pasta%' OR ingredient_name ILIKE '%spaghetti%';
UPDATE ingredients SET current_stock = 1000 WHERE ingredient_name ILIKE '%rice%';

-- Verify the updates
SELECT ingredient_name, current_stock, unit
FROM ingredients
WHERE current_stock > 0
ORDER BY ingredient_name;
