import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        {
          error: 'Missing Supabase configuration',
          message: 'Please check your environment variables',
        },
        { status: 400 },
      );
    }

    // Try to disable RLS using direct SQL execution
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${serviceRoleKey}`,
          apikey: serviceRoleKey,
        },
        body: JSON.stringify({
          sql: 'ALTER TABLE ingredients DISABLE ROW LEVEL SECURITY;',
        }),
      });

      const result = await response.json();

      if (response.ok) {
        return NextResponse.json({
          success: true,
          message: 'RLS disabled successfully on ingredients table!',
          data: result,
        });
      } else {
        return NextResponse.json(
          {
            error: 'Failed to disable RLS',
            message: 'Please disable RLS manually in Supabase dashboard',
            instructions: `
            1. Go to: https://supabase.com/dashboard/project/dulkrqgjfohsuxhsmofo
            2. Navigate to: Database → Tables → ingredients
            3. Click the 'Settings' tab
            4. Toggle OFF 'Enable Row Level Security'
            5. Click 'Save'
          `,
            errorDetails: result,
          },
          { status: 400 },
        );
      }
    } catch (fetchError) {
      return NextResponse.json(
        {
          error: 'Could not disable RLS automatically',
          message: 'Please disable RLS manually in Supabase dashboard',
          instructions: `
          1. Go to: https://supabase.com/dashboard/project/dulkrqgjfohsuxhsmofo
          2. Navigate to: Database → Tables → ingredients
          3. Click the 'Settings' tab
          4. Toggle OFF 'Enable Row Level Security'
          5. Click 'Save'
        `,
          errorDetails: fetchError instanceof Error ? fetchError.message : 'Unknown error',
        },
        { status: 400 },
      );
    }
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
