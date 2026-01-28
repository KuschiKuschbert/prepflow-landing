
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
    console.log('Checking repair status...');

    // Count total recipes
    const { count: total, error: countErr } = await supabase
        .from('ai_specials')
        .select('*', { count: 'exact', head: true });

    if (countErr || total === null) {
        console.error('Error counting:', countErr);
        return;
    }

    // Scan for broken ones
    // We can't easily filter JSON in Supabase for this specific complex condition efficiently without a function
    // So we'll scan chunks.

    let brokenCount = 0;
    let checkedCount = 0;
    let offset = 0;
    const BATCH = 1000;

    while(true) {
        const { data: batch, error } = await supabase
            .from('ai_specials')
            .select('ingredients')
            .range(offset, offset + BATCH - 1);

        if (error || !batch || batch.length === 0) break;

        for (const r of batch) {
            if (!Array.isArray(r.ingredients)) continue;
             // Heuristic: >50% ingredients are "1 pc"
            const badIngredients = r.ingredients.filter((i: { unit?: string; quantity?: number }) => {
                const u = (i.unit || '').toLowerCase();
                const q = i.quantity;
                return (u === 'pc' || u === '') && q === 1;
            }).length;

            if (badIngredients > (r.ingredients.length / 2)) {
                brokenCount++;
            }
        }

        checkedCount += batch.length;
        process.stdout.write(`\rScanned ${checkedCount}/${total} | Broken Found: ${brokenCount}`);

        offset += BATCH;
    }

    console.log('\n\n--- STATUS REPORT ---');
    console.log(`Total Recipes: ${total}`);
    console.log(`Broken Recipes Remaining: ${brokenCount}`);
    const denom = total || 1;
    console.log(`Percent Fixed: ${(((total || 0) - brokenCount) / denom * 100).toFixed(1)}%`);
}

main().catch(console.error);
