
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load environmental variables
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const parts = trimmed.split('=');
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
      process.env[key] = val;
    }
  });
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

function cleanTitle(title: string): string | null {
    let newTitle = title;

    // 1. Decode HTML common entities
    newTitle = newTitle
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"');

    // 2. Remove "Recipe by Tasty" and variations
    // Handle double attribution first: "Carne Asada by X Recipe by Tasty"
    // Heuristic: If it ends with "Recipe by Tasty", cut it.
    newTitle = newTitle.replace(/\s+Recipe by Tasty$/i, '');
    newTitle = newTitle.replace(/\s+by Tasty$/i, '');

    // 3. Remove "With Step-by-Step Video"
    newTitle = newTitle.replace(/\s+With Step-by-Step Video$/i, '');

    // 4. Remove trailing " Recipe"
    newTitle = newTitle.replace(/\s+Recipe$/i, '');

    // 4. Remove author attributions in Tasty titles like " by Gabriel Barajas ... Recipe by Tasty"
    // This is trickier. If we already removed "Recipe by Tasty", we might have "Carne Asada by Gabriel Barajas".
    // If the user wants specific extras removed, we can try to look for the " by " pattern specifically in Tasty recipes?
    // User said "some have annexes like 'by tasty' i don't want that".
    // Let's stick to the explicit "Recipe by Tasty" removal first as that is safe.
    // The previous regex already handled the trailing part.

    if (newTitle !== title) {
        return newTitle.trim();
    }
    return null;
}

async function main() {
    console.log('🧹 Starting Recipe Title Cleanup...');

    let offset = 0;
    const batchSize = 1000;
    let totalUpdated = 0;

    while (true) {
        // Fetch batch
        const { data: recipes, error } = await supabase
            .from('ai_specials')
            .select('id, name')
            .order('id')
            .range(offset, offset + batchSize - 1);

        if (error) {
            console.error('Error fetching recipes:', error);
            break;
        }

        if (!recipes || recipes.length === 0) {
            break;
        }

        const updates: { id: string; name: string }[] = [];

        for (const recipe of recipes) {
            const cleaned = cleanTitle(recipe.name);
            if (cleaned) {
                updates.push({ id: recipe.id, name: cleaned });
            }
        }

        if (updates.length > 0) {
            console.log(`   Found ${updates.length} titles to clean in batch (offset ${offset})...`);

            // Perform updates one by one or in smaller chunks?
            // Supabase doesn't support bulk update with different values easily in one query without RPC.
            // We'll use Promise.all with concurrency limit or sequential for safety.

            // Perform updates in parallel chunks (concurrency limit)
            const CONCURRENCY = 10;
            for (let i = 0; i < updates.length; i += CONCURRENCY) {
                const chunk = updates.slice(i, i + CONCURRENCY);
                await Promise.all(chunk.map(async (u) => {
                    const { error: updateError } = await supabase
                        .from('ai_specials')
                        .update({ name: u.name, updated_at: new Date().toISOString() })
                        .eq('id', u.id);

                    if (updateError) {
                         console.error(`   ❌ Failed to update ${u.id}:`, updateError.message);
                    }
                }));
            }
            totalUpdated += updates.length;
            console.log(`   ✅ Updated ${updates.length} titles.`);
        }

        offset += recipes.length;
        if (recipes.length < batchSize) break;
    }

    console.log(`\n🎉 Cleanup Complete! Total titles updated: ${totalUpdated}`);
}

main();
