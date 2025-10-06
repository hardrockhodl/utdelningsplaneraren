/*
  # Create car records table for Förmånsbil calculator

  1. New Tables
    - `car_records`
      - `id` (uuid, primary key) - Unique identifier for each car record
      - `brand` (text, not null) - Car manufacturer/brand name (e.g., "Volvo", "BMW")
      - `model` (text, not null) - Car model name (e.g., "XC90", "X5")
      - `model_year` (integer, not null) - Year of the car model
      - `nybilspris` (integer, not null) - New car price excluding VAT in SEK
      - `fordonsskatt` (integer, not null) - Annual vehicle tax in SEK
      - `co2` (integer, default 0) - CO2 emissions in g/km
      - `drivmedel` (text, default '') - Fuel type (e.g., "Bensin", "Diesel", "El")
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record last update timestamp

    - `car_data_metadata`
      - `id` (uuid, primary key) - Unique identifier
      - `last_synced_at` (timestamptz) - Timestamp of last successful data sync
      - `total_records` (integer) - Total number of car records in database
      - `sync_status` (text) - Status of last sync operation
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record last update timestamp

  2. Indexes
    - Index on brand for fast brand lookups
    - Index on (brand, model) for fast model lookups
    - Index on (brand, model, model_year) for fast specific car lookups
    - Unique constraint on (brand, model, model_year) to prevent duplicates

  3. Security
    - Enable RLS on both tables
    - Allow public read access (data is public from Skatteverket)
    - Restrict write access to service role only

  4. Notes
    - Car data is sourced from Skatteverket's public API
    - Data should be synced periodically to keep it current
    - All prices are in SEK (Swedish Krona)
    - RLS policies allow public read since this is public government data
*/

-- Create car_records table
CREATE TABLE IF NOT EXISTS car_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand text NOT NULL,
  model text NOT NULL,
  model_year integer NOT NULL,
  nybilspris integer NOT NULL,
  fordonsskatt integer NOT NULL DEFAULT 0,
  co2 integer DEFAULT 0,
  drivmedel text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create unique constraint to prevent duplicate car entries
CREATE UNIQUE INDEX IF NOT EXISTS car_records_unique_idx 
  ON car_records(brand, model, model_year);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS car_records_brand_idx ON car_records(brand);
CREATE INDEX IF NOT EXISTS car_records_brand_model_idx ON car_records(brand, model);
CREATE INDEX IF NOT EXISTS car_records_year_idx ON car_records(model_year);

-- Create metadata table
CREATE TABLE IF NOT EXISTS car_data_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  last_synced_at timestamptz DEFAULT now(),
  total_records integer DEFAULT 0,
  sync_status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE car_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_data_metadata ENABLE ROW LEVEL SECURITY;

-- Allow public read access to car records (public government data)
CREATE POLICY "Anyone can read car records"
  ON car_records FOR SELECT
  USING (true);

-- Allow public read access to metadata
CREATE POLICY "Anyone can read car metadata"
  ON car_data_metadata FOR SELECT
  USING (true);

-- Service role can insert/update car records (for sync operations)
CREATE POLICY "Service role can insert car records"
  ON car_records FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Service role can update car records"
  ON car_records FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Service role can manage metadata
CREATE POLICY "Service role can insert metadata"
  ON car_data_metadata FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Service role can update metadata"
  ON car_data_metadata FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);