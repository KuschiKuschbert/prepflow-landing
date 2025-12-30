const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing Env Vars');
    return;
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const testEmail = 'derkusch@gmail.com';

  console.log(`Testing Supabase Admin for email: ${testEmail}`);

  try {
    // 1. Try to select from the table
    const { data, error } = await supabase
      .from('curbos_public_tokens')
      .select('*')
      .eq('user_email', testEmail);

    if (error) {
      console.error('Select Error:', error);
      if (error.code === '42P01') {
        console.error('TABLE DOES NOT EXIST!');
      }
    } else {
      console.log('Select Success:', data);
    }

    // 2. Try a simple health check if table fails
    const { data: health, error: healthError } = await supabase.from('menu_items').select('count', { count: 'exact', head: true });
    if (healthError) {
      console.error('General Health Check Error:', healthError);
    } else {
      console.log('General Health Check Success (menu_items exists)');
    }

  } catch (err) {
    console.error('Unexpected Error:', err);
  }
}

testSupabase();
