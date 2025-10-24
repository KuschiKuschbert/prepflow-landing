import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST() {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin client not available' }, { status: 500 });
  }

  try {
    const results = [];
    const errors = [];

    // Fix cleaning_areas table
    console.log('🔧 Fixing cleaning_areas table...');
    const cleaningAreasColumns = [
      'ALTER TABLE cleaning_areas ADD COLUMN IF NOT EXISTS area_name VARCHAR(255)',
      'ALTER TABLE cleaning_areas ADD COLUMN IF NOT EXISTS description TEXT',
      'ALTER TABLE cleaning_areas ADD COLUMN IF NOT EXISTS cleaning_frequency VARCHAR(50)',
      'ALTER TABLE cleaning_areas ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true',
      'ALTER TABLE cleaning_areas ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
      'ALTER TABLE cleaning_areas ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
    ];

    for (const sql of cleaningAreasColumns) {
      try {
        const { error } = await supabaseAdmin.rpc('exec_sql', { sql });
        if (error) {
          errors.push({ table: 'cleaning_areas', sql, error: error.message });
        } else {
          results.push({ table: 'cleaning_areas', action: 'added_column', sql });
        }
      } catch (err: any) {
        errors.push({ table: 'cleaning_areas', sql, error: err.message });
      }
    }

    // Fix cleaning_tasks table
    console.log('🔧 Fixing cleaning_tasks table...');
    const cleaningTasksColumns = [
      'ALTER TABLE cleaning_tasks ADD COLUMN IF NOT EXISTS area_id UUID REFERENCES cleaning_areas(id) ON DELETE CASCADE',
      'ALTER TABLE cleaning_tasks ADD COLUMN IF NOT EXISTS task_name VARCHAR(255)',
      'ALTER TABLE cleaning_tasks ADD COLUMN IF NOT EXISTS description TEXT',
      'ALTER TABLE cleaning_tasks ADD COLUMN IF NOT EXISTS frequency VARCHAR(50)',
      'ALTER TABLE cleaning_tasks ADD COLUMN IF NOT EXISTS estimated_duration_minutes INTEGER',
      'ALTER TABLE cleaning_tasks ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true',
      'ALTER TABLE cleaning_tasks ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
      'ALTER TABLE cleaning_tasks ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
    ];

    for (const sql of cleaningTasksColumns) {
      try {
        const { error } = await supabaseAdmin.rpc('exec_sql', { sql });
        if (error) {
          errors.push({ table: 'cleaning_tasks', sql, error: error.message });
        } else {
          results.push({ table: 'cleaning_tasks', action: 'added_column', sql });
        }
      } catch (err: any) {
        errors.push({ table: 'cleaning_tasks', sql, error: err.message });
      }
    }

    // Fix suppliers table
    console.log('🔧 Fixing suppliers table...');
    const suppliersColumns = [
      'ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS supplier_name VARCHAR(255)',
      'ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS contact_person VARCHAR(255)',
      'ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS email VARCHAR(255)',
      'ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS phone VARCHAR(50)',
      'ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS address TEXT',
      'ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true',
      'ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
      'ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
    ];

    for (const sql of suppliersColumns) {
      try {
        const { error } = await supabaseAdmin.rpc('exec_sql', { sql });
        if (error) {
          errors.push({ table: 'suppliers', sql, error: error.message });
        } else {
          results.push({ table: 'suppliers', action: 'added_column', sql });
        }
      } catch (err: any) {
        errors.push({ table: 'suppliers', sql, error: err.message });
      }
    }

    // Fix compliance_types table
    console.log('🔧 Fixing compliance_types table...');
    const complianceTypesColumns = [
      'ALTER TABLE compliance_types ADD COLUMN IF NOT EXISTS type_name VARCHAR(255)',
      'ALTER TABLE compliance_types ADD COLUMN IF NOT EXISTS description TEXT',
      'ALTER TABLE compliance_types ADD COLUMN IF NOT EXISTS frequency VARCHAR(50)',
      'ALTER TABLE compliance_types ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true',
      'ALTER TABLE compliance_types ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
      'ALTER TABLE compliance_types ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
    ];

    for (const sql of complianceTypesColumns) {
      try {
        const { error } = await supabaseAdmin.rpc('exec_sql', { sql });
        if (error) {
          errors.push({ table: 'compliance_types', sql, error: error.message });
        } else {
          results.push({ table: 'compliance_types', action: 'added_column', sql });
        }
      } catch (err: any) {
        errors.push({ table: 'compliance_types', sql, error: err.message });
      }
    }

    // Fix compliance_records table
    console.log('🔧 Fixing compliance_records table...');
    const complianceRecordsColumns = [
      'ALTER TABLE compliance_records ADD COLUMN IF NOT EXISTS compliance_type_id UUID REFERENCES compliance_types(id) ON DELETE CASCADE',
      'ALTER TABLE compliance_records ADD COLUMN IF NOT EXISTS record_date DATE',
      'ALTER TABLE compliance_records ADD COLUMN IF NOT EXISTS status VARCHAR(50)',
      'ALTER TABLE compliance_records ADD COLUMN IF NOT EXISTS notes TEXT',
      'ALTER TABLE compliance_records ADD COLUMN IF NOT EXISTS recorded_by VARCHAR(255)',
      'ALTER TABLE compliance_records ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
      'ALTER TABLE compliance_records ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
    ];

    for (const sql of complianceRecordsColumns) {
      try {
        const { error } = await supabaseAdmin.rpc('exec_sql', { sql });
        if (error) {
          errors.push({ table: 'compliance_records', sql, error: error.message });
        } else {
          results.push({ table: 'compliance_records', action: 'added_column', sql });
        }
      } catch (err: any) {
        errors.push({ table: 'compliance_records', sql, error: err.message });
      }
    }

    // Fix kitchen_sections table
    console.log('🔧 Fixing kitchen_sections table...');
    const kitchenSectionsColumns = [
      'ALTER TABLE kitchen_sections ADD COLUMN IF NOT EXISTS section_name VARCHAR(255)',
      'ALTER TABLE kitchen_sections ADD COLUMN IF NOT EXISTS description TEXT',
      'ALTER TABLE kitchen_sections ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true',
      'ALTER TABLE kitchen_sections ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
      'ALTER TABLE kitchen_sections ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
    ];

    for (const sql of kitchenSectionsColumns) {
      try {
        const { error } = await supabaseAdmin.rpc('exec_sql', { sql });
        if (error) {
          errors.push({ table: 'kitchen_sections', sql, error: error.message });
        } else {
          results.push({ table: 'kitchen_sections', action: 'added_column', sql });
        }
      } catch (err: any) {
        errors.push({ table: 'kitchen_sections', sql, error: err.message });
      }
    }

    // Fix prep_lists table
    console.log('🔧 Fixing prep_lists table...');
    const prepListsColumns = [
      'ALTER TABLE prep_lists ADD COLUMN IF NOT EXISTS prep_date DATE DEFAULT CURRENT_DATE',
      'ALTER TABLE prep_lists ADD COLUMN IF NOT EXISTS section_id UUID REFERENCES kitchen_sections(id)',
      "ALTER TABLE prep_lists ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending'",
      'ALTER TABLE prep_lists ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
      'ALTER TABLE prep_lists ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
    ];

    for (const sql of prepListsColumns) {
      try {
        const { error } = await supabaseAdmin.rpc('exec_sql', { sql });
        if (error) {
          errors.push({ table: 'prep_lists', sql, error: error.message });
        } else {
          results.push({ table: 'prep_lists', action: 'added_column', sql });
        }
      } catch (err: any) {
        errors.push({ table: 'prep_lists', sql, error: err.message });
      }
    }

    // Fix prep_list_items table
    console.log('🔧 Fixing prep_list_items table...');
    const prepListItemsColumns = [
      'ALTER TABLE prep_list_items ADD COLUMN IF NOT EXISTS prep_list_id UUID REFERENCES prep_lists(id) ON DELETE CASCADE',
      'ALTER TABLE prep_list_items ADD COLUMN IF NOT EXISTS ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE',
      'ALTER TABLE prep_list_items ADD COLUMN IF NOT EXISTS quantity_needed DECIMAL(10,3)',
      'ALTER TABLE prep_list_items ADD COLUMN IF NOT EXISTS unit VARCHAR(50)',
      'ALTER TABLE prep_list_items ADD COLUMN IF NOT EXISTS is_completed BOOLEAN DEFAULT false',
      'ALTER TABLE prep_list_items ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
      'ALTER TABLE prep_list_items ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
    ];

    for (const sql of prepListItemsColumns) {
      try {
        const { error } = await supabaseAdmin.rpc('exec_sql', { sql });
        if (error) {
          errors.push({ table: 'prep_list_items', sql, error: error.message });
        } else {
          results.push({ table: 'prep_list_items', action: 'added_column', sql });
        }
      } catch (err: any) {
        errors.push({ table: 'prep_list_items', sql, error: err.message });
      }
    }

    // Fix order_lists table
    console.log('🔧 Fixing order_lists table...');
    const orderListsColumns = [
      'ALTER TABLE order_lists ADD COLUMN IF NOT EXISTS order_date DATE DEFAULT CURRENT_DATE',
      'ALTER TABLE order_lists ADD COLUMN IF NOT EXISTS supplier_id UUID REFERENCES suppliers(id)',
      "ALTER TABLE order_lists ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending'",
      'ALTER TABLE order_lists ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10,2)',
      'ALTER TABLE order_lists ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
      'ALTER TABLE order_lists ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
    ];

    for (const sql of orderListsColumns) {
      try {
        const { error } = await supabaseAdmin.rpc('exec_sql', { sql });
        if (error) {
          errors.push({ table: 'order_lists', sql, error: error.message });
        } else {
          results.push({ table: 'order_lists', action: 'added_column', sql });
        }
      } catch (err: any) {
        errors.push({ table: 'order_lists', sql, error: err.message });
      }
    }

    // Fix order_items table
    console.log('🔧 Fixing order_items table...');
    const orderItemsColumns = [
      'ALTER TABLE order_items ADD COLUMN IF NOT EXISTS order_list_id UUID REFERENCES order_lists(id) ON DELETE CASCADE',
      'ALTER TABLE order_items ADD COLUMN IF NOT EXISTS ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE',
      'ALTER TABLE order_items ADD COLUMN IF NOT EXISTS quantity_ordered DECIMAL(10,3)',
      'ALTER TABLE order_items ADD COLUMN IF NOT EXISTS unit VARCHAR(50)',
      'ALTER TABLE order_items ADD COLUMN IF NOT EXISTS unit_price DECIMAL(10,4)',
      'ALTER TABLE order_items ADD COLUMN IF NOT EXISTS total_price DECIMAL(10,2)',
      'ALTER TABLE order_items ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
      'ALTER TABLE order_items ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
    ];

    for (const sql of orderItemsColumns) {
      try {
        const { error } = await supabaseAdmin.rpc('exec_sql', { sql });
        if (error) {
          errors.push({ table: 'order_items', sql, error: error.message });
        } else {
          results.push({ table: 'order_items', action: 'added_column', sql });
        }
      } catch (err: any) {
        errors.push({ table: 'order_items', sql, error: err.message });
      }
    }

    // Fix temperature_logs table
    console.log('🔧 Fixing temperature_logs table...');
    const temperatureLogsColumns = [
      'ALTER TABLE temperature_logs ADD COLUMN IF NOT EXISTS equipment_id UUID REFERENCES temperature_equipment(id) ON DELETE CASCADE',
      'ALTER TABLE temperature_logs ADD COLUMN IF NOT EXISTS temperature_celsius DECIMAL(5,2)',
      'ALTER TABLE temperature_logs ADD COLUMN IF NOT EXISTS recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
      'ALTER TABLE temperature_logs ADD COLUMN IF NOT EXISTS recorded_by VARCHAR(255)',
      'ALTER TABLE temperature_logs ADD COLUMN IF NOT EXISTS notes TEXT',
      'ALTER TABLE temperature_logs ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
    ];

    for (const sql of temperatureLogsColumns) {
      try {
        const { error } = await supabaseAdmin.rpc('exec_sql', { sql });
        if (error) {
          errors.push({ table: 'temperature_logs', sql, error: error.message });
        } else {
          results.push({ table: 'temperature_logs', action: 'added_column', sql });
        }
      } catch (err: any) {
        errors.push({ table: 'temperature_logs', sql, error: err.message });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Table structure fixes completed',
      summary: {
        fixed: results.length,
        errors: errors.length,
      },
      results: results.slice(0, 10), // Show first 10 results
      errors: errors.slice(0, 10), // Show first 10 errors
      nextSteps: [
        'Run /api/populate-test-data again to populate with correct structure',
        'Check /webapp to see populated data',
      ],
    });
  } catch (err: any) {
    console.error('Error during table structure fix:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error during table structure fix',
        details: err.message,
      },
      { status: 500 },
    );
  }
}
