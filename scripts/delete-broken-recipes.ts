
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
    console.log('Scanning for broken recipes to delete...');

    // Count total recipes
    const { count: total, error: countErr } = await supabase
        .from('ai_specials')
        .select('*', { count: 'exact', head: true });

    if (countErr) {
        console.error('Error counting:', countErr);
        return;
    }

    let deletedCount = 0;
    const offset = 0;
    const BATCH = 1000;
    // Processing in chunks

    // We need to loop carefully because deleting changes offsets if we are lucky/unlucky depending on sort order
    // But since we are scanning, maybe it's better to fetch by ID > last_id to avoid offset issues
    // For simplicity, we will fetch, identifying IDs, then delete them, then continue.
    // Actually, simple offset pagination on a changing table is risky.
    // Better to just fetch all IDs and ingredients, filter in memory?
    // 24k records -> not too big for memory (~10-20MB maybe).

    // Let's use a cursor approach or simple paging, collecting IDs first, then deleting.

    console.log(`Total records to scan: ${total}`);

    const allIdsToDelete: string[] = [];
    let checkedCount = 0;

    let currentOffset = 0;
    while(true) {
        const { data: batch, error } = await supabase
            .from('ai_specials')
            .select('id, ingredients')
            .order('id', { ascending: true })
            .range(currentOffset, currentOffset + BATCH - 1);

        if (error || !batch || batch.length === 0) break;

        for (const r of batch) {
            if (!Array.isArray(r.ingredients) || r.ingredients.length === 0) {
                 // Empty ingredients -> maybe delete? user said "broken ones".
                 // Let's stick to the heuristic for now.
                 continue;
            }

             // Heuristic: >50% ingredients are "1 pc"
            const badIngredients = r.ingredients.filter((i: any) => {
                const u = (i.unit || '').toLowerCase();
                const q = i.quantity;
                return (u === 'pc' || u === '') && (q === 1 || q == '1');
            }).length;

            if (badIngredients > (r.ingredients.length / 2)) {
                allIdsToDelete.push(r.id);
            }
        }

        checkedCount += batch.length;
        process.stdout.write(`\rScanning... Verified: ${checkedCount}/${total} | Marked for Deletion: ${allIdsToDelete.length}`);

        currentOffset += BATCH;
    }

    console.log(`\n\nscan complete. Found ${allIdsToDelete.length} broken recipes.`);

    if (allIdsToDelete.length === 0) {
        console.log('No broken recipes found to delete.');
        return;
    }

    console.log('Deleting...');

    // Delete in chunks of 100
    const DELETE_BATCH = 100;
    for (let i = 0; i < allIdsToDelete.length; i += DELETE_BATCH) {
        const batchIds = allIdsToDelete.slice(i, i + DELETE_BATCH);

        const { error: delError } = await supabase
            .from('ai_specials')
            .delete()
            .in('id', batchIds);

        if (delError) {
            console.error('\nError deleting batch:', delError);
        } else {
             deletedCount += batchIds.length;
             process.stdout.write(`\rDeleted: ${deletedCount}/${allIdsToDelete.length}`);
        }
    }

    console.log('\n\nDeletion Complete.');
}

main().catch(console.error);
