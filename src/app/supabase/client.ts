import { Database } from './../types/supabase-types';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kgmjeynliwbxluitaeys.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnbWpleW5saXdieGx1aXRhZXlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzU0Nzc1MTIsImV4cCI6MTk5MTA1MzUxMn0.WB0aiVcEiJ9hXQBuibN4CQAnoB2AjRjiCPAV5Ywrh8k';

if (!supabaseKey) {
  throw new Error('Missing Supabase key');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
