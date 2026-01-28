
import { loadEnvConfig } from '@next/env';
import { createClient } from '@supabase/supabase-js';

loadEnvConfig(process.cwd());

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BATCH_SIZE = 10;
const CUISINES = [
    'Italian', 'Mexican', 'Asian', 'Indian', 'Mediterranean',
    'American', 'French', 'Middle Eastern', 'Latin American',
    'Vegetarian', 'Healthy', 'Other'
];

interface Recipe {
    id: string;
    name: string;
    ingredients: unknown;
}

interface ClassifiedItem {
    id: string;
    cuisine: string;
}

async function classifyBatch(recipes: Recipe[]) {
    try {
        const prompt = `
        You are a culinary expert. Classify these recipes into ONE of these cuisines:
        ${CUISINES.join(', ')}.

        Recipes:
        ${recipes.map(r => `ID: ${r.id}\nName: ${r.name}\nIngredients: ${JSON.stringify(r.ingredients).substring(0, 200)}...`).join('\n\n')}

        Return ONLY a JSON array of objects: [{"id": "recipe_id", "cuisine": "ClassName"}].
        Do not explain.
        `;

        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama3.2:3b',
                prompt: `System: Output ONLY JSON.\nUser: ${prompt}`,
                stream: false,
                options: { temperature: 0.1 }
            })
        });

        const result = await response.json();
        const jsonMatch = result.response.match(/\[[\s\S]*\]/);

        if (!jsonMatch) return null;
        return JSON.parse(jsonMatch[0]);

    } catch (e) {
        console.error('AI Error:', e);
        return null;
    }
}

async function main() {
    console.log('Starting Cuisine Classification...');

    // const offset = 0; // Removed as unused
    const DB_BATCH = 1000;

    while (true) {
        const { data: recipes, error } = await supabase
            .from('ai_specials')
            .select('id, name, ingredients')
            .is('cuisine', null) // Only unclassified
            .range(0, DB_BATCH - 1); // Always take top 1000 unclassified

        if (error || !recipes || recipes.length === 0) break;

        console.log(`Fetched ${recipes.length} unclassified recipes...`);

        for (let i = 0; i < recipes.length; i += BATCH_SIZE) {
            const chunk = recipes.slice(i, i + BATCH_SIZE);
            console.log(`Processing batch ${i / BATCH_SIZE + 1}...`);

            const classified = await classifyBatch(chunk);

            if (classified) {
                // Bulk update? No, Supabase helper usually simpler one by one or upsert.
                // Upsert requires all fields. Let's update one by one for safety or use upsert if schema allows partial.
                // We'll update one by one for now to be safe.

                await Promise.all(classified.map(async (item: ClassifiedItem) => {
                    if (CUISINES.includes(item.cuisine)) {
                        await supabase
                            .from('ai_specials')
                            .update({ cuisine: item.cuisine })
                            .eq('id', item.id);
                    }
                }));
            }
        }
    }
    console.log('Done!');
}

main();
