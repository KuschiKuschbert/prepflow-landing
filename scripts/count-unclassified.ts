import { loadEnvConfig } from '@next/env';
import { createClient } from '@supabase/supabase-js';

loadEnvConfig(process.cwd());

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { count, error } = await supabase
    .from('ai_specials')
    .select('*', { count: 'exact', head: true })
    .is('cuisine', null);

  if (error) {
    console.error('Error counting:', error);
  } else {
    console.log(`Remaining unclassified recipes: ${count}`);

    // Also get total count
    const { count: total } = await supabase
      .from('ai_specials')
      .select('*', { count: 'exact', head: true });

    console.log(`Total recipes: ${total}`);
    if (total && count) {
      const progress = ((total - count) / total) * 100;
      console.log(`Progress: ${progress.toFixed(2)}%`);
    }
  }
}

main();
