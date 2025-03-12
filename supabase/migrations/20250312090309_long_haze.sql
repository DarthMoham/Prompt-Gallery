/*
  # Update RLS policies for public access

  1. Security Changes
    - Drop existing policies
    - Create new policies that allow public access for all operations
    - This is for demo purposes only - in production, you'd want proper authentication
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON prompts;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON prompts;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON prompts;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON prompts;

-- Create new policies for public access
CREATE POLICY "Enable public read access"
ON prompts FOR SELECT
USING (true);

CREATE POLICY "Enable public insert access"
ON prompts FOR INSERT
WITH CHECK (true);

CREATE POLICY "Enable public update access"
ON prompts FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable public delete access"
ON prompts FOR DELETE
USING (true);