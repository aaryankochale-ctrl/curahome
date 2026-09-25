import { createClient } from '@supabase/supabase-js';

// Read Supabase environment variables from Vite env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wyvxppmmkiibgrgqrczf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5dnhwcG1ta2lpYmdyZ3FyY3pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyNjk1OTgsImV4cCI6MjEwNTg0NTU5OH0.aCYSFXrlodBXybFgnc-od4Fkyb435P4VySVFxE5EelE';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseUrl !== 'https://your-supabase-project.supabase.co'
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
