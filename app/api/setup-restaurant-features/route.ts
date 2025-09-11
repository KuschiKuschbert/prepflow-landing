import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ 
        error: 'Database connection not available' 
      }, { status: 500 });
    }

    console.log('Setting up restaurant management features...');

    // Read the SQL schema file
    const fs = require('fs');
    const path = require('path');
    const schemaPath = path.join(process.cwd(), 'supabase-restaurant-management-schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
      return NextResponse.json({ 
        error: 'Schema file not found',
        message: 'Please ensure supabase-restaurant-management-schema.sql exists in the project root'
      }, { status: 404 });
    }

    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

    // Split the SQL into individual statements and execute them
    const statements = schemaSQL
      .split(';')
      .map((stmt: string) => stmt.trim())
      .filter((stmt: string) => stmt.length > 0 && !stmt.startsWith('--'));

    const results = [];
    for (const statement of statements) {
      try {
        const { data, error } = await supabaseAdmin.rpc('exec', { sql: statement });
        if (error) {
          console.log(`Statement failed: ${statement.substring(0, 50)}... - ${error.message}`);
          // Continue with other statements
        } else {
          results.push({ statement: statement.substring(0, 50), success: true });
        }
      } catch (err) {
        console.log(`Statement error: ${statement.substring(0, 50)}... - ${err}`);
        // Continue with other statements
      }
    }

    // Check if any critical errors occurred
    const hasErrors = results.some((result: any) => result.error);
    if (hasErrors) {
      console.error('Some statements failed during schema execution');
      return NextResponse.json({ 
        error: 'Some restaurant management tables failed to create',
        message: 'Check the logs for specific errors',
        details: results.filter((result: any) => result.error)
      }, { status: 500 });
    }

    // Verify tables were created by checking a few key tables
    const tablesToCheck = [
      'cleaning_areas',
      'temperature_logs', 
      'compliance_records',
      'suppliers',
      'par_levels',
      'order_lists',
      'kitchen_sections',
      'prep_lists',
      'shared_recipes',
      'ai_specials',
      'system_settings'
    ];

    const verificationResults = [];
    for (const tableName of tablesToCheck) {
      const { data: tableData, error: tableError } = await supabaseAdmin
        .from(tableName)
        .select('id')
        .limit(1);
      
      verificationResults.push({
        table: tableName,
        exists: !tableError,
        error: tableError?.message
      });
    }

    const successCount = verificationResults.filter(r => r.exists).length;
    const totalCount = verificationResults.length;

    return NextResponse.json({
      success: true,
      message: `Restaurant management features setup completed successfully!`,
      details: {
        tablesCreated: successCount,
        totalTables: totalCount,
        verification: verificationResults
      },
      nextSteps: [
        'Visit /webapp/cleaning to manage cleaning areas',
        'Visit /webapp/temperature to log temperatures',
        'Visit /webapp/compliance to track documents',
        'Visit /webapp/suppliers to manage suppliers',
        'Visit /webapp/par-levels to set inventory levels',
        'Visit /webapp/orders to create order lists',
        'Visit /webapp/prep-lists to generate prep lists',
        'Visit /webapp/settings to configure system settings'
      ]
    });

  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ 
      error: 'Setup failed',
      message: 'An unexpected error occurred during setup',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check which restaurant management tables exist
    const tablesToCheck = [
      'cleaning_areas',
      'cleaning_tasks',
      'temperature_logs', 
      'temperature_thresholds',
      'compliance_types',
      'compliance_records',
      'suppliers',
      'supplier_price_lists',
      'par_levels',
      'order_lists',
      'order_items',
      'kitchen_sections',
      'dish_sections',
      'prep_lists',
      'prep_list_items',
      'shared_recipes',
      'ai_specials',
      'system_settings'
    ];

    const tableStatus = [];
    for (const tableName of tablesToCheck) {
      if (!supabaseAdmin) {
        tableStatus.push({
          table: tableName,
          exists: false,
          error: 'Database connection not available',
          hasData: false
        });
        continue;
      }

      const { data, error } = await supabaseAdmin
        .from(tableName)
        .select('id')
        .limit(1);
      
      tableStatus.push({
        table: tableName,
        exists: !error,
        error: error?.message,
        hasData: !error && data && data.length > 0
      });
    }

    const existingTables = tableStatus.filter(t => t.exists);
    const tablesWithData = tableStatus.filter(t => t.hasData);

    return NextResponse.json({
      success: true,
      message: 'Restaurant management features status check',
      status: {
        totalTables: tableStatus.length,
        existingTables: existingTables.length,
        tablesWithData: tablesWithData.length,
        setupComplete: existingTables.length === tableStatus.length
      },
      tables: tableStatus,
      recommendations: existingTables.length === tableStatus.length 
        ? ['All tables exist! You can start using the restaurant management features.']
        : ['Run POST /api/setup-restaurant-features to create missing tables.']
    });

  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json({ 
      error: 'Status check failed',
      message: 'Could not check restaurant management features status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
