import { config } from 'dotenv';
import path from 'path';
config({ path: path.resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data, error } = await supabase.from('temperature_logs').select('equipment_id').limit(1);

  if (error) {
    console.log('equipment_id DOES NOT EXIST:', error.message);
  } else {
    console.log('equipment_id EXISTS. Sample:', JSON.stringify(data));
  }
}

main();
