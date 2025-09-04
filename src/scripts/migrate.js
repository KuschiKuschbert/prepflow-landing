const { supabaseAdmin } = require('../config/supabase');

const createTables = async () => {
  try {
    console.log('🔄 Starting Supabase database migration...');

    // Create users table
    const { error: usersError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          business_name VARCHAR(255),
          business_type VARCHAR(100),
          country VARCHAR(100) DEFAULT 'AU',
          currency VARCHAR(3) DEFAULT 'AUD',
          tax_system VARCHAR(20) DEFAULT 'GST',
          timezone VARCHAR(50) DEFAULT 'Australia/Sydney',
          is_admin BOOLEAN DEFAULT FALSE,
          is_active BOOLEAN DEFAULT TRUE,
          email_verified BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
    });

    if (usersError) {
      console.log('⚠️ Users table creation:', usersError.message);
    } else {
      console.log('✅ Users table created/verified');
    }

    // Create subscriptions table
    const { error: subscriptionsError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS subscriptions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          stripe_customer_id VARCHAR(255) UNIQUE,
          stripe_subscription_id VARCHAR(255) UNIQUE,
          plan_type VARCHAR(50) NOT NULL,
          status VARCHAR(50) NOT NULL,
          current_period_start TIMESTAMP,
          current_period_end TIMESTAMP,
          cancel_at_period_end BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
    });

    if (subscriptionsError) {
      console.log('⚠️ Subscriptions table creation:', subscriptionsError.message);
    } else {
      console.log('✅ Subscriptions table created/verified');
    }

    // Create ingredients table
    const { error: ingredientsError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS ingredients (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          ingredient_name VARCHAR(255) NOT NULL,
          brand VARCHAR(255),
          pack_size DECIMAL(10,2),
          unit VARCHAR(50) NOT NULL,
          cost_per_unit DECIMAL(10,2) NOT NULL,
          trim_waste_percentage DECIMAL(5,2) DEFAULT 0,
          yield_percentage DECIMAL(5,2) DEFAULT 100,
          supplier VARCHAR(255),
          storage_location VARCHAR(255),
          product_code VARCHAR(100),
          cost_per_unit_as_purchased DECIMAL(10,2),
          cost_per_unit_incl_trim DECIMAL(10,2),
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
    });

    if (ingredientsError) {
      console.log('⚠️ Ingredients table creation:', ingredientsError.message);
    } else {
      console.log('✅ Ingredients table created/verified');
    }

    // Create recipes table
    const { error: recipesError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS recipes (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          recipe_name VARCHAR(255) NOT NULL,
          description TEXT,
          category VARCHAR(100),
          yield_quantity DECIMAL(10,2) NOT NULL,
          yield_unit VARCHAR(50) NOT NULL,
          labor_cost_per_unit DECIMAL(10,2) DEFAULT 0,
          overhead_percentage DECIMAL(5,2) DEFAULT 0,
          cooking_method TEXT,
          preparation_time_minutes INTEGER,
          cooking_time_minutes INTEGER,
          difficulty_level VARCHAR(20),
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
    });

    if (recipesError) {
      console.log('⚠️ Recipes table creation:', recipesError.message);
    } else {
      console.log('✅ Recipes table created/verified');
    }

    // Create recipe_items table
    const { error: recipeItemsError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS recipe_items (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
          ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
          quantity DECIMAL(10,2) NOT NULL,
          unit VARCHAR(50) NOT NULL,
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
    });

    if (recipeItemsError) {
      console.log('⚠️ Recipe items table creation:', recipeItemsError.message);
    } else {
      console.log('✅ Recipe items table created/verified');
    }

    // Create menu_dishes table
    const { error: menuDishesError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS menu_dishes (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          recipe_id UUID REFERENCES recipes(id) ON DELETE SET NULL,
          dish_name VARCHAR(255) NOT NULL,
          description TEXT,
          category VARCHAR(100),
          selling_price DECIMAL(10,2) NOT NULL,
          cost_price DECIMAL(10,2) NOT NULL,
          gross_profit DECIMAL(10,2) NOT NULL,
          gross_profit_percentage DECIMAL(5,2) NOT NULL,
          contributing_margin DECIMAL(10,2) NOT NULL,
          popularity_score INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
    });

    if (menuDishesError) {
      console.log('⚠️ Menu dishes table creation:', menuDishesError.message);
    } else {
      console.log('✅ Menu dishes table created/verified');
    }

    // Create sales_data table
    const { error: salesDataError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS sales_data (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          menu_dish_id UUID REFERENCES menu_dishes(id) ON DELETE CASCADE,
          quantity_sold INTEGER NOT NULL,
          total_revenue DECIMAL(10,2) NOT NULL,
          date DATE NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
    });

    if (salesDataError) {
      console.log('⚠️ Sales data table creation:', salesDataError.message);
    } else {
      console.log('✅ Sales data table created/verified');
    }

    // Create impersonation_logs table
    const { error: impersonationLogsError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS impersonation_logs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          admin_user_id UUID REFERENCES users(id),
          impersonated_user_id UUID REFERENCES users(id),
          started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          ended_at TIMESTAMP,
          actions_performed JSONB
        )
      `
    });

    if (impersonationLogsError) {
      console.log('⚠️ Impersonation logs table creation:', impersonationLogsError.message);
    } else {
      console.log('✅ Impersonation logs table created/verified');
    }

    // Create indexes
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
      'CREATE INDEX IF NOT EXISTS idx_ingredients_user_id ON ingredients(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON recipes(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_menu_dishes_user_id ON menu_dishes(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_sales_data_user_id ON sales_data(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_sales_data_date ON sales_data(date)'
    ];

    for (const indexSql of indexes) {
      const { error: indexError } = await supabaseAdmin.rpc('exec_sql', { sql: indexSql });
      if (indexError) {
        console.log('⚠️ Index creation:', indexError.message);
      }
    }

    console.log('✅ Database migration completed successfully!');
    
    // Create default admin user if not exists
    await createDefaultAdmin();
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.log('💡 Note: You may need to create tables manually in Supabase dashboard');
    console.log('📝 Go to: https://dulkrqgjfohsuxhsmofo.supabase.co/project/default/sql');
    process.exit(1);
  }
};

const createDefaultAdmin = async () => {
  try {
    const bcrypt = require('bcryptjs');
    
    // Check if admin user exists
    const { data: existingAdmin, error: checkError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', 'admin@prepflow.org')
      .limit(1);
    
    if (checkError) {
      console.log('⚠️ Could not check for existing admin:', checkError.message);
      return;
    }
    
    if (!existingAdmin || existingAdmin.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      const { error: insertError } = await supabaseAdmin
        .from('users')
        .insert({
          email: 'admin@prepflow.org',
          password_hash: hashedPassword,
          first_name: 'Admin',
          last_name: 'User',
          business_name: 'PrepFlow Admin',
          is_admin: true,
          email_verified: true
        });
      
      if (insertError) {
        console.log('⚠️ Failed to create admin user:', insertError.message);
      } else {
        console.log('👤 Default admin user created: admin@prepflow.org / admin123');
      }
    } else {
      console.log('👤 Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Failed to create admin user:', error);
  }
};

// Run migration if this file is executed directly
if (require.main === module) {
  createTables();
}

module.exports = { createTables };
