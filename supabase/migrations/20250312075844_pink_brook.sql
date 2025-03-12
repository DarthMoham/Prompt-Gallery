/*
  # Create prompts table

  1. New Tables
    - `prompts`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `content` (text, not null)
      - `category` (text, not null)
      - `created_at` (timestamp with time zone, default: now())

  2. Security
    - Enable RLS on `prompts` table
    - Add policies for CRUD operations
*/

CREATE TABLE IF NOT EXISTS prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated users
CREATE POLICY "Allow read access for all users" ON prompts
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow insert for authenticated users
CREATE POLICY "Allow insert for authenticated users" ON prompts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow update for authenticated users
CREATE POLICY "Allow update for authenticated users" ON prompts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow delete for authenticated users
CREATE POLICY "Allow delete for authenticated users" ON prompts
  FOR DELETE
  TO authenticated
  USING (true);