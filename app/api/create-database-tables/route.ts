import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ 
        error: 'Database connection not available',
        message: 'Supabase admin client not initialized'
      }, { status: 500 });
    }

    console.log('Creating database tables...');

    const results = [];
    const errors = [];

    // Define the tables to create with their SQL
    const tables = [
      {
        name: 'ingredients',
        sql: `CREATE TABLE IF NOT EXISTS ingredients (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
        )`
      },
      {
        name: 'recipes',
        sql: `CREATE TABLE IF NOT EXISTS recipes (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          recipe_name VARCHAR(255) NOT NULL,
          description TEXT,
          yield INTEGER NOT NULL DEFAULT 1,
          yield_unit VARCHAR(50) NOT NULL DEFAULT 'servings',
          instructions TEXT,
          prep_time_minutes INTEGER,
          cook_time_minutes INTEGER,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`
      },
      {
        name: 'recipe_ingredients',
        sql: `CREATE TABLE IF NOT EXISTS recipe_ingredients (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
          ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
          quantity DECIMAL(10,3) NOT NULL,
          unit VARCHAR(50) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`
      },
      {
        name: 'temperature_equipment',
        sql: `CREATE TABLE IF NOT EXISTS temperature_equipment (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(255) NOT NULL,
          equipment_type VARCHAR(50) NOT NULL,
          location VARCHAR(255),
          min_temp_celsius DECIMAL(5,2),
          max_temp_celsius DECIMAL(5,2),
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`
      },
      {
        name: 'temperature_logs',
        sql: `CREATE TABLE IF NOT EXISTS temperature_logs (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          equipment_id UUID REFERENCES temperature_equipment(id) ON DELETE CASCADE,
          temperature_celsius DECIMAL(5,2) NOT NULL,
          recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          recorded_by VARCHAR(255),
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`
      },
      {
        name: 'cleaning_areas',
        sql: `CREATE TABLE IF NOT EXISTS cleaning_areas (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          area_name VARCHAR(255) NOT NULL,
          description TEXT,
          cleaning_frequency VARCHAR(50),
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`
      },
      {
        name: 'cleaning_tasks',
        sql: `CREATE TABLE IF NOT EXISTS cleaning_tasks (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          area_id UUID REFERENCES cleaning_areas(id) ON DELETE CASCADE,
          task_name VARCHAR(255) NOT NULL,
          description TEXT,
          frequency VARCHAR(50),
          estimated_duration_minutes INTEGER,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`
      },
      {
        name: 'suppliers',
        sql: `CREATE TABLE IF NOT EXISTS suppliers (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          supplier_name VARCHAR(255) NOT NULL,
          contact_person VARCHAR(255),
          email VARCHAR(255),
          phone VARCHAR(50),
          address TEXT,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`
      },
      {
        name: 'compliance_types',
        sql: `CREATE TABLE IF NOT EXISTS compliance_types (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          type_name VARCHAR(255) NOT NULL,
          description TEXT,
          frequency VARCHAR(50),
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`
      },
      {
        name: 'compliance_records',
        sql: `CREATE TABLE IF NOT EXISTS compliance_records (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          compliance_type_id UUID REFERENCES compliance_types(id) ON DELETE CASCADE,
          record_date DATE NOT NULL,
          status VARCHAR(50) NOT NULL,
          notes TEXT,
          recorded_by VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`
      },
      {
        name: 'par_levels',
        sql: `CREATE TABLE IF NOT EXISTS par_levels (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
          minimum_level DECIMAL(10,3) NOT NULL,
          maximum_level DECIMAL(10,3) NOT NULL,
          current_stock DECIMAL(10,3) DEFAULT 0,
          unit VARCHAR(50) NOT NULL,
          last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`
      },
      {
        name: 'order_lists',
        sql: `CREATE TABLE IF NOT EXISTS order_lists (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          order_date DATE NOT NULL DEFAULT CURRENT_DATE,
          supplier_id UUID REFERENCES suppliers(id),
          status VARCHAR(50) DEFAULT 'pending',
          total_amount DECIMAL(10,2),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`
      },
      {
        name: 'order_items',
        sql: `CREATE TABLE IF NOT EXISTS order_items (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          order_list_id UUID REFERENCES order_lists(id) ON DELETE CASCADE,
          ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
          quantity_ordered DECIMAL(10,3) NOT NULL,
          unit VARCHAR(50) NOT NULL,
          unit_price DECIMAL(10,4),
          total_price DECIMAL(10,2),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`
      },
      {
        name: 'kitchen_sections',
        sql: `CREATE TABLE IF NOT EXISTS kitchen_sections (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          section_name VARCHAR(255) NOT NULL,
          description TEXT,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`
      },
      {
        name: 'prep_lists',
        sql: `CREATE TABLE IF NOT EXISTS prep_lists (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          prep_date DATE NOT NULL DEFAULT CURRENT_DATE,
          section_id UUID REFERENCES kitchen_sections(id),
          status VARCHAR(50) DEFAULT 'pending',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`
      },
      {
        name: 'prep_list_items',
        sql: `CREATE TABLE IF NOT EXISTS prep_list_items (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          prep_list_id UUID REFERENCES prep_lists(id) ON DELETE CASCADE,
          ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
          quantity_needed DECIMAL(10,3) NOT NULL,
          unit VARCHAR(50) NOT NULL,
          is_completed BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`
      },
      {
        name: 'ai_specials',
        sql: `CREATE TABLE IF NOT EXISTS ai_specials (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          special_name VARCHAR(255) NOT NULL,
          description TEXT,
          suggested_price DECIMAL(10,2),
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`
      },
      {
        name: 'ai_specials_ingredients',
        sql: `CREATE TABLE IF NOT EXISTS ai_specials_ingredients (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          ai_special_id UUID REFERENCES ai_specials(id) ON DELETE CASCADE,
          ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
          quantity DECIMAL(10,3) NOT NULL,
          unit VARCHAR(50) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`
      },
      {
        name: 'users',
        sql: `CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
        )`
      }
    ];

    // Try to create each table
    for (const table of tables) {
      try {
        console.log(`Creating table: ${table.name}`);
        
        // Check if table already exists
        const { data: existingTable, error: checkError } = await supabaseAdmin
          .from(table.name)
          .select('id')
          .limit(1);

        if (existingTable && existingTable.length > 0) {
          results.push({
            table: table.name,
            status: 'already_exists',
            message: 'Table already exists'
          });
          continue;
        }

        // Since we can't execute raw SQL directly, we'll create a simple test record
        // to trigger table creation if it doesn't exist
        const { data, error } = await supabaseAdmin
          .from(table.name)
          .insert({})
          .select();

        if (error && error.code === 'PGRST116') {
          // Table doesn't exist, we need to create it manually
          results.push({
            table: table.name,
            status: 'needs_manual_creation',
            message: 'Table needs to be created manually in Supabase dashboard',
            sql: table.sql
          });
        } else if (error) {
          errors.push({
            table: table.name,
            error: error.message,
            code: error.code
          });
        } else {
          // Table exists, delete the test record
          if (data && data.length > 0) {
            await supabaseAdmin
              .from(table.name)
              .delete()
              .eq('id', data[0].id);
          }
          
          results.push({
            table: table.name,
            status: 'exists',
            message: 'Table exists and is accessible'
          });
        }
      } catch (err) {
        errors.push({
          table: table.name,
          error: err instanceof Error ? err.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      success: errors.length === 0,
      message: errors.length === 0 
        ? 'Database table check completed successfully!' 
        : 'Database table check completed with some issues',
      results: results,
      errors: errors,
      instructions: {
        note: 'Some tables may need to be created manually in Supabase dashboard.',
        nextSteps: [
          'Go to Supabase Dashboard > SQL Editor',
          'Copy and paste the COMPLETE_DATABASE_FIX.sql script',
          'Execute the script manually',
          'Then run /api/setup-database to populate sample data'
        ],
        manualTables: results
          .filter(r => r.status === 'needs_manual_creation')
          .map(r => ({ name: r.table, sql: r.sql }))
      }
    });

  } catch (err) {
    console.error('Unexpected error during database setup:', err);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: 'Failed to setup database',
      details: err instanceof Error ? err.message : 'Unknown error',
      instructions: {
        note: 'Automatic setup failed. Please create tables manually.',
        steps: [
          'Go to Supabase Dashboard > SQL Editor',
          'Copy and paste the COMPLETE_DATABASE_FIX.sql script',
          'Execute the script manually',
          'Then run /api/setup-database to populate sample data'
        ]
      }
    }, { status: 500 });
  }
}
