-- Consolidate Allergens Migration
-- Maps old allergen codes to consolidated codes:
-- crustacea + molluscs → shellfish
-- peanuts + tree_nuts → nuts
-- wheat → gluten
-- Then deduplicates arrays

-- Update ingredients.allergens JSONB arrays
UPDATE ingredients
SET allergens = (
  SELECT jsonb_agg(DISTINCT new_code)
  FROM (
    SELECT CASE
      WHEN value::text = '"crustacea"' OR value::text = '"molluscs"' THEN '"shellfish"'
      WHEN value::text = '"peanuts"' OR value::text = '"tree_nuts"' THEN '"nuts"'
      WHEN value::text = '"wheat"' THEN '"gluten"'
      ELSE value
    END AS new_code
    FROM jsonb_array_elements(COALESCE(allergens, '[]'::jsonb))
  ) AS mapped
)
WHERE allergens IS NOT NULL
  AND jsonb_array_length(COALESCE(allergens, '[]'::jsonb)) > 0;

-- Update recipes.allergens JSONB arrays
UPDATE recipes
SET allergens = (
  SELECT jsonb_agg(DISTINCT new_code)
  FROM (
    SELECT CASE
      WHEN value::text = '"crustacea"' OR value::text = '"molluscs"' THEN '"shellfish"'
      WHEN value::text = '"peanuts"' OR value::text = '"tree_nuts"' THEN '"nuts"'
      WHEN value::text = '"wheat"' THEN '"gluten"'
      ELSE value
    END AS new_code
    FROM jsonb_array_elements(COALESCE(allergens, '[]'::jsonb))
  ) AS mapped
)
WHERE allergens IS NOT NULL
  AND jsonb_array_length(COALESCE(allergens, '[]'::jsonb)) > 0;

-- Update dishes.allergens JSONB arrays
UPDATE dishes
SET allergens = (
  SELECT jsonb_agg(DISTINCT new_code)
  FROM (
    SELECT CASE
      WHEN value::text = '"crustacea"' OR value::text = '"molluscs"' THEN '"shellfish"'
      WHEN value::text = '"peanuts"' OR value::text = '"tree_nuts"' THEN '"nuts"'
      WHEN value::text = '"wheat"' THEN '"gluten"'
      ELSE value
    END AS new_code
    FROM jsonb_array_elements(COALESCE(allergens, '[]'::jsonb))
  ) AS mapped
)
WHERE allergens IS NOT NULL
  AND jsonb_array_length(COALESCE(allergens, '[]'::jsonb)) > 0;

-- Update allergen_records.allergens_present TEXT[] arrays
UPDATE allergen_records
SET allergens_present = (
  SELECT array_agg(DISTINCT new_code)
  FROM (
    SELECT CASE
      WHEN unnest = 'crustacea' OR unnest = 'molluscs' THEN 'shellfish'
      WHEN unnest = 'peanuts' OR unnest = 'tree_nuts' THEN 'nuts'
      WHEN unnest = 'wheat' THEN 'gluten'
      ELSE unnest
    END AS new_code
    FROM unnest(COALESCE(allergens_present, ARRAY[]::text[]))
  ) AS mapped
)
WHERE allergens_present IS NOT NULL
  AND array_length(allergens_present, 1) > 0;

-- Update allergen_records.allergens_declared TEXT[] arrays
UPDATE allergen_records
SET allergens_declared = (
  SELECT array_agg(DISTINCT new_code)
  FROM (
    SELECT CASE
      WHEN unnest = 'crustacea' OR unnest = 'molluscs' THEN 'shellfish'
      WHEN unnest = 'peanuts' OR unnest = 'tree_nuts' THEN 'nuts'
      WHEN unnest = 'wheat' THEN 'gluten'
      ELSE unnest
    END AS new_code
    FROM unnest(COALESCE(allergens_declared, ARRAY[]::text[]))
  ) AS mapped
)
WHERE allergens_declared IS NOT NULL
  AND array_length(allergens_declared, 1) > 0;

-- Update ingredient_composition_cache.detected_allergens JSONB arrays
UPDATE ingredient_composition_cache
SET detected_allergens = (
  SELECT jsonb_agg(DISTINCT new_code)
  FROM (
    SELECT CASE
      WHEN value::text = '"crustacea"' OR value::text = '"molluscs"' THEN '"shellfish"'
      WHEN value::text = '"peanuts"' OR value::text = '"tree_nuts"' THEN '"nuts"'
      WHEN value::text = '"wheat"' THEN '"gluten"'
      ELSE value
    END AS new_code
    FROM jsonb_array_elements(COALESCE(detected_allergens, '[]'::jsonb))
  ) AS mapped
)
WHERE detected_allergens IS NOT NULL
  AND jsonb_array_length(COALESCE(detected_allergens, '[]'::jsonb)) > 0;
