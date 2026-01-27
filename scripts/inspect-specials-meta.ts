
import { loadEnvConfig } from '@next/env';
import { createClient } from '@supabase/supabase-js';

// Load env
loadEnvConfig(process.cwd());

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log('Fetching samples...');
    const { data, error } = await supabase
        .from('ai_specials')
        .select('name, meta, ingredients')
        .limit(5);

    if (error) {
        console.error(error);
        return;
    }

    data.forEach((r, i) => {
        console.log(`\n--- Recipe ${i+1}: ${r.name} ---`);
        console.log('Meta:', JSON.stringify(r.meta, null, 2));
        console.log('Ingredients Sample:', JSON.stringify(r.ingredients.slice(0, 2)));
    });
}

main();
