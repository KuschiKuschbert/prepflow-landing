import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      message: 'Here are the correct SQL commands to run in Supabase SQL Editor',
      sqlCommands: [
        {
          step: 1,
          description: 'Enable RLS on ingredients table',
          sql: 'ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;'
        },
        {
          step: 2,
          description: 'Create SELECT policy for public read access',
          sql: `CREATE POLICY "public can read ingredients" 
ON public.ingredients 
FOR SELECT 
TO anon 
USING (true);`
        },
        {
          step: 3,
          description: 'Create INSERT policy for public insert access',
          sql: `CREATE POLICY "public can insert ingredients" 
ON public.ingredients 
FOR INSERT 
TO anon 
WITH CHECK (true);`
        },
        {
          step: 4,
          description: 'Create UPDATE policy for public update access',
          sql: `CREATE POLICY "public can update ingredients" 
ON public.ingredients 
FOR UPDATE 
TO anon 
USING (true);`
        },
        {
          step: 5,
          description: 'Create DELETE policy for public delete access',
          sql: `CREATE POLICY "public can delete ingredients" 
ON public.ingredients 
FOR DELETE 
TO anon 
USING (true);`
        }
      ],
      instructions: `
        1. Go to: https://supabase.com/dashboard/project/dulkrqgjfohsuxhsmofo
        2. Navigate to: SQL Editor
        3. Click "New query"
        4. Copy and paste each SQL command above one by one
        5. Click "Run" after each command
        6. Refresh your webapp to see the changes
      `
    });

  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({
      error: 'Internal server error',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
}
