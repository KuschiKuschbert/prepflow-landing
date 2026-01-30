import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load env
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const parts = trimmed.split('=');
      const key = parts[0].trim();
      const val = parts
        .slice(1)
        .join('=')
        .trim()
        .replace(/^["']|["']$/g, '');
      process.env[key] = val;
    }
  });
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function inspectTitles() {
  console.log('🔍 Sampling Recipe Titles...');

  // Fetch a sample of titles, especially those containing potential noise keywords
  const { data: recipes, error } = await supabase
    .from('ai_specials')
    .select('name, source')
    .ilike('name', '% Recipe')
    .limit(50);

  if (error) {
    console.error(error);
    return;
  }

  console.log(`Found ${recipes.length} candidates for inspection:\n`);
  recipes.forEach(r => {
    console.log(`[${r.source || 'unknown'}] "${r.name}"`);
  });
}

inspectTitles();
