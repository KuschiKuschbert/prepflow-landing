-- Migrate Existing Recipe Cards to Cross-Referencing Structure
-- This migration updates existing recipe cards to use the new cross-referencing system

-- Step 1: Create junction table links for existing cards
-- For each existing card, create a link from menu_item_id to card
INSERT INTO menu_item_recipe_card_links (menu_item_id, recipe_card_id)
SELECT menu_item_id, id as recipe_card_id
FROM menu_recipe_cards
WHERE menu_item_id IS NOT NULL
ON CONFLICT (menu_item_id, recipe_card_id) DO NOTHING;

-- Step 2: Create a function to calculate recipe signature for a dish
CREATE OR REPLACE FUNCTION calculate_dish_recipe_signature(p_dish_id UUID)
RETURNS TEXT AS $$
DECLARE
  recipe_ids TEXT[];
  signature TEXT;
BEGIN
  -- Get all recipe IDs for this dish, sorted
  SELECT ARRAY_AGG(recipe_id::TEXT ORDER BY recipe_id)
  INTO recipe_ids
  FROM dish_recipes
  WHERE dish_id = p_dish_id;

  -- If dish has recipes, join them with ":"
  IF array_length(recipe_ids, 1) > 0 THEN
    signature := array_to_string(recipe_ids, ':');
  ELSE
    -- Dish has no recipes, use dish_id format
    signature := 'dish:' || p_dish_id::TEXT;
  END IF;

  RETURN signature;
END;
$$ LANGUAGE plpgsql;

-- Step 3: Deduplicate BEFORE setting unique constraint fields
-- For each recipe_id, keep only the oldest card and update all links to point to it

-- RECIPES
CREATE TEMP TABLE temp_cards_to_merge_recipes AS
WITH recipe_groups AS (
  SELECT
    mi.recipe_id,
    MIN(mrc.created_at) as oldest_created_at
  FROM menu_recipe_cards mrc
  INNER JOIN menu_items mi ON mrc.menu_item_id = mi.id
  WHERE mi.recipe_id IS NOT NULL
  GROUP BY mi.recipe_id
),
cards_to_keep_recipes AS (
  SELECT mrc.id, rg.recipe_id
  FROM menu_recipe_cards mrc
  INNER JOIN menu_items mi ON mrc.menu_item_id = mi.id
  INNER JOIN recipe_groups rg ON mi.recipe_id = rg.recipe_id
  WHERE mrc.created_at = rg.oldest_created_at
)
SELECT
    mrc.id as old_card_id,
    ctk.id as keep_card_id,
    ctk.recipe_id
FROM menu_recipe_cards mrc
INNER JOIN menu_items mi ON mrc.menu_item_id = mi.id
INNER JOIN recipe_groups rg ON mi.recipe_id = rg.recipe_id
INNER JOIN cards_to_keep_recipes ctk ON rg.recipe_id = ctk.recipe_id
WHERE mrc.id != ctk.id;

-- Logic for recipes: INSERT new mapping (ignoringdupes), then DELETE old
INSERT INTO menu_item_recipe_card_links (menu_item_id, recipe_card_id)
SELECT t1.menu_item_id, ctm.keep_card_id
FROM menu_item_recipe_card_links t1
JOIN temp_cards_to_merge_recipes ctm ON t1.recipe_card_id = ctm.old_card_id
ON CONFLICT (menu_item_id, recipe_card_id) DO NOTHING;

DELETE FROM menu_item_recipe_card_links
WHERE recipe_card_id IN (SELECT old_card_id FROM temp_cards_to_merge_recipes);

DROP TABLE temp_cards_to_merge_recipes;

-- DELETE duplicate recipe cards entirely
WITH recipe_groups AS (
  SELECT
    mi.recipe_id,
    MIN(mrc.created_at) as oldest_created_at
  FROM menu_recipe_cards mrc
  INNER JOIN menu_items mi ON mrc.menu_item_id = mi.id
  WHERE mi.recipe_id IS NOT NULL
  GROUP BY mi.recipe_id
),
cards_to_keep_recipes AS (
  SELECT mrc.id
  FROM menu_recipe_cards mrc
  INNER JOIN menu_items mi ON mrc.menu_item_id = mi.id
  INNER JOIN recipe_groups rg ON mi.recipe_id = rg.recipe_id
  WHERE mrc.created_at = rg.oldest_created_at
)
DELETE FROM menu_recipe_cards
WHERE id IN (
  SELECT mrc.id
  FROM menu_recipe_cards mrc
  INNER JOIN menu_items mi ON mrc.menu_item_id = mi.id
  WHERE mi.recipe_id IS NOT NULL
    AND mrc.id NOT IN (SELECT id FROM cards_to_keep_recipes)
);


-- DISHES
CREATE TEMP TABLE temp_cards_to_merge_dishes AS
WITH dish_groups AS (
  SELECT
    mi.dish_id,
    calculate_dish_recipe_signature(mi.dish_id) as signature,
    MIN(mrc.created_at) as oldest_created_at
  FROM menu_recipe_cards mrc
  INNER JOIN menu_items mi ON mrc.menu_item_id = mi.id
  WHERE mi.dish_id IS NOT NULL
  GROUP BY mi.dish_id, calculate_dish_recipe_signature(mi.dish_id)
),
cards_to_keep_dishes AS (
  SELECT mrc.id, dg.dish_id, dg.signature
  FROM menu_recipe_cards mrc
  INNER JOIN menu_items mi ON mrc.menu_item_id = mi.id
  INNER JOIN dish_groups dg ON mi.dish_id = dg.dish_id
    AND calculate_dish_recipe_signature(mi.dish_id) = dg.signature
  WHERE mrc.created_at = dg.oldest_created_at
)
SELECT
    mrc.id as old_card_id,
    ctk.id as keep_card_id
FROM menu_recipe_cards mrc
INNER JOIN menu_items mi ON mrc.menu_item_id = mi.id
INNER JOIN dish_groups dg ON mi.dish_id = dg.dish_id
    AND calculate_dish_recipe_signature(mi.dish_id) = dg.signature
INNER JOIN cards_to_keep_dishes ctk ON dg.dish_id = ctk.dish_id
    AND dg.signature = ctk.signature
WHERE mrc.id != ctk.id;


-- Logic for dishes: INSERT new mapping (ignoring dupes), then DELETE old
INSERT INTO menu_item_recipe_card_links (menu_item_id, recipe_card_id)
SELECT t1.menu_item_id, ctm.keep_card_id
FROM menu_item_recipe_card_links t1
JOIN temp_cards_to_merge_dishes ctm ON t1.recipe_card_id = ctm.old_card_id
ON CONFLICT (menu_item_id, recipe_card_id) DO NOTHING;

DELETE FROM menu_item_recipe_card_links
WHERE recipe_card_id IN (SELECT old_card_id FROM temp_cards_to_merge_dishes);


DROP TABLE temp_cards_to_merge_dishes;


-- Delete duplicate dish cards entirely
WITH dish_groups AS (
  SELECT
    mi.dish_id,
    calculate_dish_recipe_signature(mi.dish_id) as signature,
    MIN(mrc.created_at) as oldest_created_at
  FROM menu_recipe_cards mrc
  INNER JOIN menu_items mi ON mrc.menu_item_id = mi.id
  WHERE mi.dish_id IS NOT NULL
  GROUP BY mi.dish_id, calculate_dish_recipe_signature(mi.dish_id)
),
cards_to_keep_dishes AS (
  SELECT mrc.id
  FROM menu_recipe_cards mrc
  INNER JOIN menu_items mi ON mrc.menu_item_id = mi.id
  INNER JOIN dish_groups dg ON mi.dish_id = dg.dish_id
    AND calculate_dish_recipe_signature(mi.dish_id) = dg.signature
  WHERE mrc.created_at = dg.oldest_created_at
)
DELETE FROM menu_recipe_cards
WHERE id IN (
  SELECT mrc.id
  FROM menu_recipe_cards mrc
  INNER JOIN menu_items mi ON mrc.menu_item_id = mi.id
  WHERE mi.dish_id IS NOT NULL
    AND mrc.id NOT IN (SELECT id FROM cards_to_keep_dishes)
);

-- Step 4: Now update the remaining cards with recipe_id, dish_id, and recipe_signature
-- At this point, there should be only one card per recipe_id or (dish_id + signature)

-- For direct recipe menu items
UPDATE menu_recipe_cards mrc
SET recipe_id = mi.recipe_id
FROM menu_items mi
WHERE mrc.menu_item_id = mi.id
  AND mi.recipe_id IS NOT NULL
  AND mrc.recipe_id IS NULL;

-- For dish menu items
UPDATE menu_recipe_cards mrc
SET
  dish_id = mi.dish_id,
  recipe_signature = calculate_dish_recipe_signature(mi.dish_id)
FROM menu_items mi
WHERE mrc.menu_item_id = mi.id
  AND mi.dish_id IS NOT NULL
  AND mrc.dish_id IS NULL;

-- Clean up function
DROP FUNCTION IF EXISTS calculate_dish_recipe_signature(UUID);

-- Step 4: Add comment explaining migration
COMMENT ON TABLE menu_item_recipe_card_links IS 'Migrated from menu_recipe_cards.menu_item_id. Now supports cross-referencing where multiple menu items can share the same card.';
