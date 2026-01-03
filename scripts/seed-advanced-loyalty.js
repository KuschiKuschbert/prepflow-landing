
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables manually
const envPath = path.resolve(__dirname, '../.env.local');
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        let value = match[2].trim();
        // Remove quotes if present
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
        if (!supabaseUrl && match[1].trim() === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = value;
        if (!supabaseKey && match[1].trim() === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') supabaseKey = value;
    }
  });
}

if (!supabaseUrl || !supabaseKey) {
  console.error("Error: Credentials not found in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const customers = [
  {
    full_name: "Gordon Ramsay",
    phone_number: "+15550100001",
    current_rank: "Restaurateur",
    lifetime_miles: 5000,
    redeemable_miles: 1250,
    streak_count: 52,
    last_visit: Date.now() - 86400000, // Yesterday
    zip_code: "90210"
  },
  {
    full_name: "Jamie Oliver",
    phone_number: "+15550100002",
    current_rank: "Executive Chef",
    lifetime_miles: 3200,
    redeemable_miles: 800,
    streak_count: 12,
    last_visit: Date.now() - 172800000, // 2 days ago
    zip_code: "10001"
  },
  {
    full_name: "Julia Child",
    phone_number: "+15550100003",
    current_rank: "Sous Chef",
    lifetime_miles: 1500,
    redeemable_miles: 450,
    streak_count: 4,
    last_visit: Date.now() - 604800000, // 1 week ago
    zip_code: "02138"
  },
  {
    full_name: "Anthony Bourdain",
    phone_number: "+15550100004",
    current_rank: "Executive Chef",
    lifetime_miles: 4100,
    redeemable_miles: 100,
    streak_count: 0,
    last_visit: Date.now() - 2592000000, // 30 days ago
    zip_code: "10012"
  },
  {
    full_name: "Guy Fieri",
    phone_number: "+15550100005",
    current_rank: "Street Rookie",
    lifetime_miles: 250,
    redeemable_miles: 250,
    streak_count: 1,
    last_visit: Date.now() - 43200000, // 12 hours ago
    zip_code: "95404"
  },
  {
    full_name: "Martha Stewart",
    phone_number: "+15550100006",
    current_rank: "Sous Chef",
    lifetime_miles: 1800,
    redeemable_miles: 1800,
    streak_count: 8,
    last_visit: Date.now(), // Today
    zip_code: "06880"
  },
  {
    full_name: "David Chang",
    phone_number: "+15550100007",
    current_rank: "Executive Chef",
    lifetime_miles: 2900,
    redeemable_miles: 50,
    streak_count: 3,
    last_visit: Date.now() - 345600000, // 4 days ago
    zip_code: "10003"
  },
  {
    full_name: "Nigella Lawson",
    phone_number: "+15550100008",
    current_rank: "Restaurateur",
    lifetime_miles: 6000,
    redeemable_miles: 3000,
    streak_count: 20,
    last_visit: Date.now() - 86400000 * 2,
    zip_code: "SW1W"
  },
  {
    full_name: "Marco Pierre White",
    phone_number: "+15550100009",
    current_rank: "Restaurateur",
    lifetime_miles: 8000,
    redeemable_miles: 0,
    streak_count: 0, // Broke streak
    last_visit: Date.now() - 86400000 * 60, // 2 months ago
    zip_code: "LE1"
  },
  {
    full_name: "Wolfgang Puck",
    phone_number: "+15550100010",
    current_rank: "Sous Chef",
    lifetime_miles: 1200,
    redeemable_miles: 100,
    streak_count: 2,
    last_visit: Date.now() - 86400000 * 5,
    zip_code: "90210"
  }
];

async function seed() {
  console.log("Seeding 10 Customers to:", supabaseUrl);

  // Optional: Clean up by phone number first to avoid unique constraint errors if re-running
  for (const c of customers) {
      await supabase.from('customers').delete().eq('phone_number', c.phone_number);
  }

  const { data, error } = await supabase
    .from('customers')
    .upsert(customers, { onConflict: 'phone_number' })
    .select();

  if (error) {
    console.error("Error seeding:", error);
  } else {
    console.log(`Successfully seeded ${data.length} customers!`);
  }
}

seed();
