import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bmaguvhfgivfjdmapznl.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtYWd1dmhmZ2l2ZmpkbWFwem5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQ1NDg4MzQsImV4cCI6MTk5MDEyNDgzNH0.kkN9T04Iv5uxSE0my_xpxJ_ZWI_v0-Z7QcJmCZSTyHo';

if (!supabaseKey) {
  throw new Error('Missing Supabase key');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
