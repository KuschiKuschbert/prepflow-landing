import { loadEnvConfig } from '@next/env';
import { createClient } from '@supabase/supabase-js';
import { generateTextWithHuggingFace } from '../lib/ai/huggingface-client';

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
  const recipeId = '21ed8732-02d5-4630-9b98-aa03924a8b94'; // Skillet Sausages
  const { data: recipe, error } = await supabase
    .from('ai_specials')
    .select('*')
    .eq('id', recipeId)
    .single();

  if (error || !recipe) {
    console.error('Recipe not found', error);
    return;
  }

  console.log(`Repairing: ${recipe.name}`);

  // Construct prompt
  const instructions = Array.isArray(recipe.instructions)
    ? recipe.instructions.join('\n')
    : recipe.instructions;
  const ingredientNames = Array.isArray(recipe.ingredients)
    ? recipe.ingredients
        .map((i: string | { name: string }) => (typeof i === 'string' ? i : i.name))
        .join(', ')
    : 'Unknown';

  const prompt = `
    You are a culinary expert. I have a recipe where the ingredient quantities are missing.
    Please deduce the most likely quantities for the ingredients based on the instructions and standard cooking ratios.

    Recipe: ${recipe.name}
    Yield: ${recipe.meta?.yield || 4} ${recipe.meta?.yield_unit || 'servings'}

    Instructions:
    ${instructions}

    Ingredients to fix (names only provided):
    ${ingredientNames}

    Return ONLY a JSON array of objects with keys: "name", "quantity" (number), "unit" (string).
    Do not explain. The JSON should be valid.
    Example: [{"name": "onion", "quantity": 1, "unit": "whole"}]
    `;

  console.log('Sending prompt to AI...');

  const messages = [
    {
      role: 'system' as const,
      content: 'You are a helpful culinary AI assistant that outputs only JSON.',
    },
    { role: 'user' as const, content: prompt },
  ];

  try {
    const response = await generateTextWithHuggingFace(messages, {
      model: 'meta-llama/Llama-3.2-3B-Instruct',
      temperature: 0.1,
      maxTokens: 1000,
    });

    if (response && response.content) {
      console.log('AI Response:', response.content);

      // Try to parse JSON
      const jsonMatch = response.content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log('Parsed Ingredients:', JSON.stringify(parsed, null, 2));
      } else {
        console.log('Could not find JSON in response');
      }
    } else {
      console.error('No response from AI');
    }
  } catch (e) {
    console.error('AI Error:', e);
  }
}

main().catch(console.error);
