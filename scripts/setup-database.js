const { createClient } = require('@supabase/supabase-js');

// Use the complete service role key you provided
const supabaseUrl = 'https://dulkrqgjfohsuxhsmofo.supabase.co';
const supabaseServiceKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bGtycWdqZm9oc3V4aHNtb2ZvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njk3NjAwMywiZXhwIjoyMDcyNTUyMDAzfQ.YourServiceRoleKeyHere';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  try {
    console.log('Setting up database tables...');

    // Create ingredients table
    const { error: ingredientsError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS ingredients (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          name TEXT NOT NULL,
          brand TEXT,
          pack_size DECIMAL(10, 2),
          unit TEXT,
          cost_per_unit DECIMAL(10, 4),
          trim_peel_waste_percent DECIMAL(5, 2) DEFAULT 0,
          yield_percent DECIMAL(5, 2) DEFAULT 100,
          supplier TEXT,
          product_code TEXT,
          storage TEXT
        );
      `,
    });

    if (ingredientsError) {
      console.error('Error creating ingredients table:', ingredientsError);
    } else {
      console.log('✅ Ingredients table created successfully!');
    }

    // Create recipes table
    const { error: recipesError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS recipes (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          name TEXT NOT NULL,
          yield_portions INTEGER,
          instructions TEXT
        );
      `,
    });

    if (recipesError) {
      console.error('Error creating recipes table:', recipesError);
    } else {
      console.log('✅ Recipes table created successfully!');
    }

    // Create recipe_ingredients table
    const { error: recipeIngredientsError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS recipe_ingredients (
          recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
          ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
          quantity DECIMAL(10, 2) NOT NULL,
          unit TEXT,
          PRIMARY KEY (recipe_id, ingredient_id)
        );
      `,
    });

    if (recipeIngredientsError) {
      console.error('Error creating recipe_ingredients table:', recipeIngredientsError);
    } else {
      console.log('✅ Recipe ingredients table created successfully!');
    }

    // Create menu_dishes table
    const { error: menuDishesError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS menu_dishes (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          name TEXT NOT NULL,
          recipe_id UUID REFERENCES recipes(id) ON DELETE SET NULL,
          selling_price DECIMAL(10, 2),
          target_profit_margin_percent DECIMAL(5, 2)
        );
      `,
    });

    if (menuDishesError) {
      console.error('Error creating menu_dishes table:', menuDishesError);
    } else {
      console.log('✅ Menu dishes table created successfully!');
    }

    console.log('🎉 Database setup completed!');
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

setupDatabase();
