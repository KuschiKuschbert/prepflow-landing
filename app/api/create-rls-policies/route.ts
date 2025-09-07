import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({
        error: 'Missing Supabase configuration',
        message: 'Please check your environment variables'
      }, { status: 400 });
    }

    // Use Supabase REST API to create policies
    const policies = [
      {
        name: 'Allow public read access to ingredients',
        operation: 'SELECT',
        using: 'true'
      },
      {
        name: 'Allow public insert to ingredients',
        operation: 'INSERT',
        with_check: 'true'
      },
      {
        name: 'Allow public update to ingredients',
        operation: 'UPDATE',
        using: 'true'
      },
      {
        name: 'Allow public delete to ingredients',
        operation: 'DELETE',
        using: 'true'
      }
    ];

    const results = [];

    for (const policy of policies) {
      try {
        // First enable RLS on the table
        const enableRLSResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey
          },
          body: JSON.stringify({
            sql: 'ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;'
          })
        });

        // Create the policy
        const createPolicyResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey
          },
          body: JSON.stringify({
            sql: `
              CREATE POLICY "${policy.name}" ON ingredients
              FOR ${policy.operation}
              ${policy.using ? `USING (${policy.using})` : ''}
              ${policy.with_check ? `WITH CHECK (${policy.with_check})` : ''};
            `
          })
        });

        const policyResult = await createPolicyResponse.json();

        if (createPolicyResponse.ok) {
          results.push({
            policy: policy.name,
            status: 'created',
            message: 'Policy created successfully'
          });
        } else {
          if (policyResult.message?.includes('already exists')) {
            results.push({
              policy: policy.name,
              status: 'already_exists',
              message: 'Policy already exists'
            });
          } else {
            results.push({
              policy: policy.name,
              status: 'error',
              error: policyResult.message || 'Unknown error'
            });
          }
        }
      } catch (err) {
        results.push({
          policy: policy.name,
          status: 'error',
          error: err instanceof Error ? err.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'RLS policy creation completed',
      results: results,
      instructions: 'If automatic creation failed, create policies manually in Supabase dashboard: Authentication → Policies → ingredients table'
    });

  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({
      error: 'Internal server error',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
}
