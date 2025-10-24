import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = createSupabaseAdmin();

    // Create RLS policy to allow public read access to ingredients
    const { data, error } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        -- Enable RLS on ingredients table
        ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
        
        -- Create policy to allow public read access
        CREATE POLICY "Allow public read access to ingredients" ON ingredients
        FOR SELECT USING (true);
        
        -- Create policy to allow public insert (for adding ingredients)
        CREATE POLICY "Allow public insert to ingredients" ON ingredients
        FOR INSERT WITH CHECK (true);
        
        -- Create policy to allow public update (for editing ingredients)
        CREATE POLICY "Allow public update to ingredients" ON ingredients
        FOR UPDATE USING (true);
        
        -- Create policy to allow public delete (for removing ingredients)
        CREATE POLICY "Allow public delete to ingredients" ON ingredients
        FOR DELETE USING (true);
      `,
    });

    if (error) {
      console.error('Error creating RLS policies:', error);
      return NextResponse.json(
        {
          error: 'Failed to create RLS policies',
          message:
            'The exec_sql function might not be available. Please create the policies manually in Supabase dashboard.',
          instructions: `
          1. Go to Supabase Dashboard → Authentication → Policies
          2. Select the 'ingredients' table
          3. Create these policies:
             - SELECT: "Allow public read access to ingredients" (USING: true)
             - INSERT: "Allow public insert to ingredients" (WITH CHECK: true)
             - UPDATE: "Allow public update to ingredients" (USING: true)
             - DELETE: "Allow public delete to ingredients" (USING: true)
        `,
          errorDetails: error,
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'RLS policies created successfully!',
      data: data,
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
