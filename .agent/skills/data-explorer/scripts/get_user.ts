import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load env vars from .env.local manually to avoid 'dotenv' dependency
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8');
  envConfig.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["'](.*)["']$/, '$1');
      process.env[key] = value;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    '❌ Missing Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY).',
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function getUser(emailOrId: string) {
  console.log(`🔍 Searching for user: ${emailOrId}...`);

  // Try via Auth Admin first (if exact email)
  const {
    data: { users },
    error,
  } = await supabase.auth.admin.listUsers();

  if (error) {
    console.error('❌ Auth Error:', error.message);
    return;
  }

  const foundUser = users.find(u => u.email === emailOrId || u.id === emailOrId);

  if (foundUser) {
    console.log('✅ User Found:');
    console.log(JSON.stringify(foundUser, null, 2));
  } else {
    console.log('❌ User not found.');
  }
}

const target = process.argv[2];
if (!target) {
  console.error('Usage: npx tsx scripts/get_user.ts <email_or_id>');
  process.exit(1);
}

getUser(target);
