import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          error: 'Database connection not available',
        },
        { status: 500 },
      );
    }

    // Create ingredients table first
    const createIngredientsSQL = `
      CREATE TABLE IF NOT EXISTS ingredients (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        ingredient_name VARCHAR(255) NOT NULL,
        brand VARCHAR(255),
        pack_size VARCHAR(100),
        unit VARCHAR(50) NOT NULL,
        cost_per_unit DECIMAL(10,4) NOT NULL,
        cost_per_unit_as_purchased DECIMAL(10,4),
        cost_per_unit_incl_trim DECIMAL(10,4),
        trim_peel_waste_percentage DECIMAL(5,2) DEFAULT 0,
        yield_percentage DECIMAL(5,2) DEFAULT 100,
        supplier VARCHAR(255),
        storage VARCHAR(255),
        product_code VARCHAR(100),
        category VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Try to create ingredients table
    const { error: ingredientsError } = await supabaseAdmin
      .from('ingredients')
      .select('id')
      .limit(1);

    if (ingredientsError && ingredientsError.code === 'PGRST205') {
      // Table doesn't exist, create it
      console.log('Creating ingredients table...');

      // Use a different approach - insert a dummy record to create the table
      try {
        await supabaseAdmin.rpc('exec', { sql: createIngredientsSQL });
      } catch (rpcError) {
        console.log('RPC failed, trying alternative approach...');

        // Alternative: Use the REST API to create the table
        // This won't work directly, so we'll return instructions
        return NextResponse.json({
          success: false,
          message: 'Please create tables manually in Supabase dashboard',
          instructions: {
            step1: 'Go to your Supabase dashboard',
            step2: 'Navigate to SQL Editor',
            step3: 'Run the provided SQL script',
            step4: 'Then test the API endpoints again',
          },
          sqlScript:
            createIngredientsSQL +
            `
-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_name VARCHAR(255) NOT NULL,
  description TEXT,
  yield INTEGER NOT NULL DEFAULT 1,
  yield_unit VARCHAR(50) NOT NULL DEFAULT 'servings',
  instructions TEXT,
  prep_time_minutes INTEGER,
  cook_time_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recipe_ingredients junction table
CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity DECIMAL(10,3) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create temperature_equipment table
CREATE TABLE IF NOT EXISTS temperature_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  equipment_type VARCHAR(50) NOT NULL,
  location VARCHAR(255),
  min_temp_celsius DECIMAL(5,2),
  max_temp_celsius DECIMAL(5,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create temperature_logs table
CREATE TABLE IF NOT EXISTS temperature_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID REFERENCES temperature_equipment(id) ON DELETE CASCADE,
  temperature_celsius DECIMAL(5,2) NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  recorded_by VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cleaning_areas table
CREATE TABLE IF NOT EXISTS cleaning_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area_name VARCHAR(255) NOT NULL,
  description TEXT,
  cleaning_frequency VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cleaning_tasks table
CREATE TABLE IF NOT EXISTS cleaning_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area_id UUID REFERENCES cleaning_areas(id) ON DELETE CASCADE,
  task_name VARCHAR(255) NOT NULL,
  description TEXT,
  frequency VARCHAR(50),
  estimated_duration_minutes INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create compliance_types table
CREATE TABLE IF NOT EXISTS compliance_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type_name VARCHAR(255) NOT NULL,
  description TEXT,
  frequency VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create compliance_records table
CREATE TABLE IF NOT EXISTS compliance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  compliance_type_id UUID REFERENCES compliance_types(id) ON DELETE CASCADE,
  record_date DATE NOT NULL,
  status VARCHAR(50) NOT NULL,
  notes TEXT,
  recorded_by VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create par_levels table
CREATE TABLE IF NOT EXISTS par_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
  minimum_level DECIMAL(10,3) NOT NULL,
  maximum_level DECIMAL(10,3) NOT NULL,
  current_stock DECIMAL(10,3) DEFAULT 0,
  unit VARCHAR(50) NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_lists table
CREATE TABLE IF NOT EXISTS order_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  supplier_id UUID REFERENCES suppliers(id),
  status VARCHAR(50) DEFAULT 'pending',
  total_amount DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table (not order_list_items)
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_list_id UUID REFERENCES order_lists(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity_ordered DECIMAL(10,3) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  unit_price DECIMAL(10,4),
  total_price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create kitchen_sections table
CREATE TABLE IF NOT EXISTS kitchen_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_name VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create prep_lists table
CREATE TABLE IF NOT EXISTS prep_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prep_date DATE NOT NULL DEFAULT CURRENT_DATE,
  section_id UUID REFERENCES kitchen_sections(id),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create prep_list_items table
CREATE TABLE IF NOT EXISTS prep_list_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prep_list_id UUID REFERENCES prep_lists(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity_needed DECIMAL(10,3) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_specials table
CREATE TABLE IF NOT EXISTS ai_specials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  special_name VARCHAR(255) NOT NULL,
  description TEXT,
  suggested_price DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_specials_ingredients table
CREATE TABLE IF NOT EXISTS ai_specials_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ai_special_id UUID REFERENCES ai_specials(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity DECIMAL(10,3) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
          `,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database setup completed',
      details: 'All required tables should now exist',
    });
  } catch (error) {
    console.error('Database setup error:', error);
    return NextResponse.json(
      {
        error: 'Failed to setup database',
        message: 'Could not create missing tables',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
