#!/usr/bin/env tsx
import { HfInference } from '@huggingface/inference';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { smartScaleUnit } from '../lib/unit-conversion/smartScaling';

// Load env
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=').replace(/^["']|["']$/g, '');
      if (key && !process.env[key]) {
        process.env[key] = value;
      }
    }
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY!);
// Switch to Llama-3-8B-Instruct which is reasonably smart and fast
const MODEL = 'meta-llama/Meta-Llama-3-8B-Instruct';

// Concurrency limit
const CONCURRENCY = 5;

// Simplified ingredient interface
interface Ingredient {
  name: string;
  unit: string;
  quantity: number;
  source?: string;
}

async function processRecipe(id: string, index: number, total: number) {
  try {
    const { data: recipe } = await supabase
      .from('ai_specials')
      .select('name, ingredients')
      .eq('id', id)
      .single();

    if (!recipe) return;

    // Identify ingredients that need inferring
    const needsInference = recipe.ingredients.filter(
      (i: Ingredient) => i.unit === 'pc' && i.quantity === 1,
    );

    if (needsInference.length === 0) {
      console.log(`[${index}/${total}] "${recipe.name}": OK (No inference needed)`);
      return;
    }

    console.log(
      `[${index}/${total}] "${recipe.name}": Inferring ${needsInference.length} items...`,
    );

    const ingredientNames = needsInference.map((i: Ingredient) => i.name).join(', ');

    // Prompt
    const prompt = `You are a professional chef. Infer standard metric quantities for these ingredients in a recipe called "${recipe.name}":
      [${ingredientNames}]

      Return ONLY a valid JSON array. Do not use markdown code blocks. Do not add explanations.
      Each item must have: "name", "quantity" (number), "unit" (ml, g, pc, tbsp, tsp).
      Example: [{"name": "soy sauce", "quantity": 60, "unit": "ml"}]`;

    // Retry logic
    let prediction = null;
    let lastRawOutput = '';

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await hf.chatCompletion({
          model: MODEL,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1000,
          temperature: 0.1,
        });

        const jsonStr = response.choices[0].message.content?.trim() || '';
        lastRawOutput = jsonStr;

        // Try to find array brackets
        const firstBracket = jsonStr.indexOf('[');
        const lastBracket = jsonStr.lastIndexOf(']');

        if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
          const cleanJson = jsonStr.substring(firstBracket, lastBracket + 1);
          prediction = JSON.parse(cleanJson);
          break; // Success
        }
      } catch (_retryErr) {
        // silent retry
      }
      await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
    }

    if (!prediction) {
      console.log(`  ❌ "${recipe.name}": Failed to generate valid JSON`);
      console.log(
        `     Raw output sample: ${lastRawOutput.substring(0, 100).replace(/\n/g, ' ')}...`,
      );
      return;
    }

    let changesMade = false;
    const newIngredients = recipe.ingredients.map((ing: Ingredient) => {
      const nName = ing.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const predictionItem = (prediction as Ingredient[]).find((p: Ingredient) => {
        const pName = p.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        return nName.includes(pName) || pName.includes(nName);
      });

      if (predictionItem && ing.unit === 'pc' && ing.quantity === 1) {
        const { quantity, unit } = smartScaleUnit(predictionItem.quantity, predictionItem.unit);
        changesMade = true;
        return {
          ...ing,
          quantity,
          unit,
          source: 'AI_INFERRED',
        };
      }
      return ing;
    });

    if (changesMade) {
      const { error: upErr } = await supabase
        .from('ai_specials')
        .update({ ingredients: newIngredients })
        .eq('id', id);

      if (upErr) console.error(`  ⚠️ DB Error "${recipe.name}":`, upErr.message);
      else console.log(`  ✅ "${recipe.name}": Updated`);
    } else {
      console.log(`  ℹ️ "${recipe.name}": No matching ingredients found in AI response`);
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  🔥 Error "${id}":`, msg);
  }
}

async function main() {
  console.log(`🤖 AI Recipe Completion Started (Model: ${MODEL})...`);

  if (!fs.existsSync('incomplete-recipes.json')) {
    console.error('Missing incomplete-recipes.json');
    return;
  }
  const ids = JSON.parse(fs.readFileSync('incomplete-recipes.json', 'utf-8'));
  console.log(`Loaded ${ids.length} recipes.`);

  const total = ids.length;
  const queue = [...ids];
  let nextIndex = 0;

  const workers = Array(CONCURRENCY)
    .fill(null)
    .map(async (_, _workerId) => {
      while (queue.length > 0) {
        const id = queue.shift();
        const index = ++nextIndex;
        await processRecipe(id, index, total);
        await new Promise(r => setTimeout(r, 500));
      }
    });

  await Promise.all(workers);
  console.log('Done!');
}

main();
