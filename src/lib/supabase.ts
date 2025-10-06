import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface CarRecord {
  id: string;
  brand: string;
  model: string;
  model_year: number;
  nybilspris: number;
  fordonsskatt: number;
  co2: number;
  drivmedel: string;
  created_at: string;
  updated_at: string;
}

export interface CarDataMetadata {
  id: string;
  last_synced_at: string;
  total_records: number;
  sync_status: string;
  created_at: string;
  updated_at: string;
}
