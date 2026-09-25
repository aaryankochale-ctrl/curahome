import { createClient } from '@supabase/supabase-js';

// Read Supabase environment variables from Vite env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kaxdrptradasxlfvrpmm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtheGRycHRyYWRhc3hsZnZycG1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNDY1MzcsImV4cCI6MjA5NjgyMjUzN30.4caKismXhwfBJR2Tb6mi1NzDV9C0JQeOppFUn5D5NB8';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseUrl !== 'https://your-supabase-project.supabase.co'
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
