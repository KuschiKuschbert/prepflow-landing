-- Ingredient Alias Table for Fuzzy Matching
-- This syncs with lib/ingredient-normalization.ts INGREDIENT_ALIASES
-- When updating one, update the other!

DROP TABLE IF EXISTS ingredient_aliases;

CREATE TABLE ingredient_aliases (
    id SERIAL PRIMARY KEY,
    base_ingredient TEXT NOT NULL,
    alias TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for fast lookup
CREATE INDEX idx_ingredient_aliases_alias ON ingredient_aliases(LOWER(alias));
CREATE INDEX idx_ingredient_aliases_base ON ingredient_aliases(LOWER(base_ingredient));

-- Insert alias data from lib/ingredient-normalization.ts
INSERT INTO ingredient_aliases (base_ingredient, alias) VALUES
-- Salts
('salt', 'salt'),
('salt', 'kosher salt'),
('salt', 'sea salt'),
('salt', 'kosher sea salt'),
('salt', 'table salt'),
('salt', 'fine salt'),
('salt', 'coarse salt'),
('salt', 'fleur de sel'),
('salt', 'himalayan salt'),
('salt', 'pink salt'),
('salt', 'rock salt'),

-- Peppers
('pepper', 'pepper'),
('pepper', 'black pepper'),
('pepper', 'white pepper'),
('pepper', 'ground pepper'),
('pepper', 'cracked pepper'),
('pepper', 'peppercorns'),
('pepper', 'freshly ground pepper'),

-- Oils
('oil', 'oil'),
('oil', 'vegetable oil'),
('oil', 'canola oil'),
('oil', 'sunflower oil'),
('oil', 'neutral oil'),
('oil', 'cooking oil'),
('olive oil', 'olive oil'),
('olive oil', 'extra virgin olive oil'),
('olive oil', 'evoo'),
('olive oil', 'light olive oil'),
('olive oil', 'pure olive oil'),
('olive oil', 'extra-virgin olive oil'),

-- Butter & Fats
('butter', 'butter'),
('butter', 'unsalted butter'),
('butter', 'salted butter'),
('butter', 'clarified butter'),
('butter', 'melted butter'),
('butter', 'softened butter'),

-- Onions & Aromatics
('onion', 'onion'),
('onion', 'onions'),
('onion', 'brown onion'),
('onion', 'yellow onion'),
('onion', 'white onion'),
('onion', 'spanish onion'),
('onion', 'diced onion'),
('garlic', 'garlic'),
('garlic', 'garlic clove'),
('garlic', 'garlic cloves'),
('garlic', 'minced garlic'),
('garlic', 'fresh garlic'),
('garlic', 'crushed garlic'),

-- Sugars
('sugar', 'sugar'),
('sugar', 'white sugar'),
('sugar', 'granulated sugar'),
('sugar', 'caster sugar'),
('sugar', 'superfine sugar'),
('brown sugar', 'brown sugar'),
('brown sugar', 'light brown sugar'),
('brown sugar', 'dark brown sugar'),
('brown sugar', 'muscovado'),

-- Flour
('flour', 'flour'),
('flour', 'plain flour'),
('flour', 'all-purpose flour'),
('flour', 'all purpose flour'),
('flour', 'ap flour'),
('flour', 'wheat flour'),

-- Eggs
('eggs', 'eggs'),
('eggs', 'egg'),
('eggs', 'large eggs'),
('eggs', 'medium eggs'),
('eggs', 'free range eggs'),
('eggs', 'chicken eggs'),

-- Milk & Cream
('milk', 'milk'),
('milk', 'whole milk'),
('milk', 'full cream milk'),
('milk', 'full fat milk'),
('milk', '2% milk'),
('milk', 'skim milk'),
('cream', 'cream'),
('cream', 'heavy cream'),
('cream', 'thickened cream'),
('cream', 'whipping cream'),
('cream', 'double cream'),
('cream', 'single cream'),
('cream', 'light whipping cream'),

-- Chicken
('chicken', 'chicken'),
('chicken', 'chicken breast'),
('chicken', 'chicken thigh'),
('chicken', 'chicken drumstick'),
('chicken', 'chicken leg'),
('chicken', 'chicken wing'),
('chicken breast', 'chicken breast'),
('chicken breast', 'skinless chicken breast'),
('chicken breast', 'boneless chicken breast'),
('chicken breast', 'chicken fillet'),

-- Beef
('beef', 'beef'),
('beef', 'beef mince'),
('beef', 'ground beef'),
('beef', 'beef steak'),
('beef', 'stewing beef'),
('beef mince', 'beef mince'),
('beef mince', 'ground beef'),
('beef mince', 'minced beef'),
('beef mince', 'hamburger meat'),

-- Herbs
('parsley', 'parsley'),
('parsley', 'flat leaf parsley'),
('parsley', 'curly parsley'),
('parsley', 'italian parsley'),
('parsley', 'fresh parsley'),
('parsley', 'chopped parsley'),
('parsley', 'chopped fresh parsley'),
('basil', 'basil'),
('basil', 'fresh basil'),
('basil', 'sweet basil'),
('basil', 'thai basil'),
('cilantro', 'cilantro'),
('cilantro', 'coriander'),
('cilantro', 'fresh coriander'),
('cilantro', 'coriander leaves'),
('thyme', 'thyme'),
('thyme', 'fresh thyme'),
('thyme', 'thyme leaves'),
('rosemary', 'rosemary'),
('rosemary', 'fresh rosemary'),
('rosemary', 'rosemary sprig'),

-- Tomatoes
('tomato', 'tomato'),
('tomato', 'tomatoes'),
('tomato', 'roma tomato'),
('tomato', 'cherry tomato'),
('tomato', 'grape tomato'),
('tomato', 'plum tomato'),
('tomato', 'vine tomato'),
('canned tomatoes', 'canned tomatoes'),
('canned tomatoes', 'diced tomatoes'),
('canned tomatoes', 'crushed tomatoes'),
('canned tomatoes', 'tomato puree'),
('canned tomatoes', 'tinned tomatoes'),

-- Cheese
('cheese', 'cheese'),
('cheese', 'cheddar'),
('cheese', 'cheddar cheese'),
('cheese', 'mozzarella'),
('parmesan', 'parmesan'),
('parmesan', 'parmesan cheese'),
('parmesan', 'parmigiano reggiano'),
('parmesan', 'grated parmesan'),
('parmesan', 'freshly shredded parmesan cheese'),
('parmesan', 'finely grated parmesan'),

-- Stock/Broth
('stock', 'stock'),
('stock', 'broth'),
('chicken stock', 'chicken stock'),
('chicken stock', 'chicken broth'),
('chicken stock', 'chicken bouillon'),
('chicken stock', 'unsalted chicken stock'),

-- Mushrooms
('mushrooms', 'mushrooms'),
('mushrooms', 'portobello mushrooms'),
('mushrooms', 'baby bella mushrooms'),
('mushrooms', 'sliced mushrooms'),

-- Pasta
('pasta', 'pasta'),
('pasta', 'penne pasta'),
('pasta', 'fettuccine pasta'),
('pasta', 'dry fettuccine pasta'),

-- Potatoes
('potatoes', 'potatoes'),
('potatoes', 'potato')

ON CONFLICT (alias) DO NOTHING;
