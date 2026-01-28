-- 1. Check Matching Status
DO $$
DECLARE
    total_count INT;
    missing_count INT;
BEGIN
    SELECT COUNT(*) INTO total_count FROM ai_specials;
    SELECT COUNT(*) INTO missing_count FROM ai_specials WHERE ingredient_tags IS NULL;

    RAISE NOTICE 'Total Recipes: %, Missing Tags: %', total_count, missing_count;
END $$;

-- 2. Run Backfill (Only updates rows where tags are missing)
-- This might take a few seconds for 24k rows.
UPDATE ai_specials
SET ingredient_tags = generate_ingredient_tags(ingredients)
WHERE ingredient_tags IS NULL;

-- 3. Verify Result
SELECT
    COUNT(*) as total_recipes,
    COUNT(ingredient_tags) as tagged_recipes
FROM ai_specials;
