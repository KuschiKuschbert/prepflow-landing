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
  console.log('Checking Inventory...');
  const { data: stock, error } = await supabase
    .from('ingredients')
    .select('ingredient_name, current_stock')
    .gt('current_stock', 0)
    .limit(100);

  if (error) {
    console.error(error);
    return;
  }

  console.log(`Found ${stock.length} items in stock (limit 100 display).`);
  console.log(stock.map(s => `${s.ingredient_name}: ${s.current_stock}`).join('\n'));
}

main();
