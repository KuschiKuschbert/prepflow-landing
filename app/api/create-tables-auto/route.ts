import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = createSupabaseAdmin();

    // SQL script to create all tables
    const createTablesSQL = `
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
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Create users table
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
    `;

    // Create tables one by one using Supabase REST API
    const tables = [
      {
        name: 'ingredients',
        sql: `CREATE TABLE IF NOT EXISTS ingredients (
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
        );`,
      },
      {
        name: 'recipes',
        sql: `CREATE TABLE IF NOT EXISTS recipes (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          yield_servings INTEGER,
          instructions TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );`,
      },
      {
        name: 'recipe_ingredients',
        sql: `CREATE TABLE IF NOT EXISTS recipe_ingredients (
          id SERIAL PRIMARY KEY,
          recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
          ingredient_id INTEGER REFERENCES ingredients(id) ON DELETE CASCADE,
          quantity DECIMAL(10,3) NOT NULL,
          unit VARCHAR(50) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );`,
      },
      {
        name: 'menu_dishes',
        sql: `CREATE TABLE IF NOT EXISTS menu_dishes (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          recipe_id INTEGER REFERENCES recipes(id),
          selling_price DECIMAL(10,2),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );`,
      },
      {
        name: 'users',
        sql: `CREATE TABLE IF NOT EXISTS users (
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
        );`,
      },
    ];

    const results = [];

    for (const table of tables) {
      try {
        // Check if table already exists
        const { data: existingTable, error: checkError } = await supabaseAdmin
          .from(table.name)
          .select('id')
          .limit(1);

        if (checkError && checkError.code === 'PGRST204') {
          // Table doesn't exist, try to create it using a simple approach
          console.log(`Table ${table.name} doesn't exist, attempting to create...`);

          // For now, we'll return instructions for manual creation
          results.push({
            table: table.name,
            status: 'needs_manual_creation',
            message: 'Please create this table manually in Supabase dashboard',
          });
        } else if (!checkError) {
          results.push({ table: table.name, status: 'already_exists' });
        } else {
          results.push({ table: table.name, status: 'error', error: checkError.message });
        }
      } catch (err) {
        console.error(`Error checking table ${table.name}:`, err);
        results.push({
          table: table.name,
          status: 'error',
          error: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Table status checked. Some tables may need manual creation.',
      results: results,
      instructions:
        'Visit Supabase dashboard to create missing tables using the SQL script from /api/create-tables',
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
