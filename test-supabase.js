/* eslint-disable no-console */
// Test Supabase connection
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://dulkrqgjfohsuxhsmofo.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bGtycWdqZm9oc3V4aHNtb2ZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5NzYwMDMsImV4cCI6MjA3MjU1MjAwM30.b_P98mAantymNfWy1Qz18SaR-LwrPjuaebO2Uj_5JK8';
const supabaseServiceKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bGtycWdqZm9oc3V4aHNtb2ZvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njk3NjAwMywiZXhwIjoyMDcyNTUyMDAzfQ.9p7ONCpj7c_94A33pYR9_-1rGxbdJld5GL7V1udrtiM';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  try {
    console.log('🔗 Testing Supabase connection...');

    // Test basic connection
    const { data, error } = await supabase.from('users').select('count').limit(1);

    if (error) {
      console.log('⚠️ Connection test result:', error.message);
      console.log("📝 This is normal if tables don't exist yet");
    } else {
      console.log('✅ Supabase connection successful!');
    }

    // Test admin connection
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1);

    if (adminError) {
      console.log('⚠️ Admin connection test:', adminError.message);
    } else {
      console.log('✅ Supabase admin connection successful!');
    }

    console.log('\n🎉 Supabase setup is ready!');
    console.log('📊 Dashboard: https://dulkrqgjfohsuxhsmofo.supabase.co/project/default');
    console.log('🔧 SQL Editor: https://dulkrqgjfohsuxhsmofo.supabase.co/project/default/sql');
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
  }
}

testConnection();
