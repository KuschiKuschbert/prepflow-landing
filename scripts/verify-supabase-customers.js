const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables manually
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      let value = match[2].trim();
      // Remove quotes if present
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      process.env[match[1].trim()] = value;
    }
  });
} else {
  console.error('Error: .env.local not found at ' + envPath);
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    'Error: Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local',
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCustomers() {
  console.log('Checking Supabase Connection...');
  console.log('URL:', supabaseUrl);

  const { data, error, count } = await supabase
    .from('customers')
    .select('*', { count: 'exact', head: false });

  if (error) {
    console.error('Error fetching customers:', error);
    if (error.code === '42P01') {
      console.error("Table 'customers' does not exist!");
    }
  } else {
    console.log(`Success! Found ${data.length} customers.`);
    if (data.length > 0) {
      console.log('Sample:', data[0].full_name, data[0].phone_number);
    } else {
      console.log('Table exists but is EMPTY.');
    }
  }
}

checkCustomers();
