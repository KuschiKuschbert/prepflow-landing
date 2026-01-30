import { loadEnvConfig } from '@next/env';
import { createClient } from '@supabase/supabase-js';

loadEnvConfig(process.cwd());

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function main() {
  const { data, error } = await supabase.from('ai_specials').select('*').limit(1);

  if (error) {
    console.error('Error:', error);
    return;
  }

  if (data && data.length > 0) {
    console.log('Keys:', Object.keys(data[0]));
    console.log('Sample Meta:', data[0].meta);
    console.log('Sample Cuisine Field:', data[0].cuisine); // Check if it exists
  } else {
    console.log('No data found');
  }
}

main();
