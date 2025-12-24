import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://akcnwnchvowibwjybgvi.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrY253bmNodm93aWJ3anliZ3ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0OTAzMDcsImV4cCI6MjA4MjA2NjMwN30.0PShsumawBDH3iSNhEoz4NFHqwimaJqvS2I_SB_2pKQ';

export const supabase = createClient(supabaseUrl, supabaseKey);
