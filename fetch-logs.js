const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dulkrqgjfohsuxhsmofo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bGtycWdqZm9oc3V4aHNtb2ZvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njk3NjAwMywiZXhwIjoyMDcyNTUyMDAzfQ.9p7ONCpj7c_94A33pYR9_-1rGxbdJld5GL7V1udrtiM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function getLogs() {
  try {
    const { data, error } = await supabase
      .from('admin_error_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching logs:', error);
      process.exit(1);
    }

    console.log(JSON.stringify(data, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

getLogs();
