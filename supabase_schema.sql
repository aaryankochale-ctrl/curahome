-- Supabase Database Schema DDL for CuraHome Healthcare
-- Run this script in your Supabase SQL Editor (SQL Editor -> New Query -> Run)

-- 1. Create Patients Table
CREATE TABLE IF NOT EXISTS patients (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  age INTEGER,
  gender TEXT,
  address TEXT,
  city TEXT,
  district_zone TEXT,
  emergency_contact JSONB,
  medical_info JSONB,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Nurses Table
CREATE TABLE IF NOT EXISTS nurses (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  dob TEXT,
  address TEXT,
  qualification TEXT,
  qualification_details TEXT,
  license_number TEXT,
  issuing_council TEXT,
  years_of_experience INTEGER,
  areas_of_expertise JSONB,
  preferred_working_areas JSONB,
  verification_status TEXT DEFAULT 'pending_verification',
  rating NUMERIC DEFAULT 0,
  completed_visits_count INTEGER DEFAULT 0,
  documents JSONB DEFAULT '[]'::jsonb,
  availability JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Service Requests Table
CREATE TABLE IF NOT EXISTS service_requests (
  id TEXT PRIMARY KEY,
  patient_id TEXT,
  patient_name TEXT,
  patient_phone TEXT,
  patient_age INTEGER,
  patient_gender TEXT,
  service_type TEXT,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'routine',
  preferred_date TEXT,
  preferred_time_slot TEXT,
  specific_time TEXT,
  duration TEXT,
  location_address TEXT,
  location_district_zone TEXT,
  status TEXT DEFAULT 'pending',
  assigned_nurse_id TEXT,
  assigned_nurse_name TEXT,
  documents JSONB DEFAULT '[]'::jsonb,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS) & Add Public Permissive Policies
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE nurses ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read/write access to patients" ON patients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write access to nurses" ON nurses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write access to service_requests" ON service_requests FOR ALL USING (true) WITH CHECK (true);
