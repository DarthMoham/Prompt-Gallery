/*
  # Fix Row Level Security policies for prompts table

  1. Security Changes
    - Drop existing policies and create new ones
    - Enable public read access
    - Allow authenticated users to perform all operations
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow read access for all users" ON prompts;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON prompts;
DROP POLICY IF EXISTS "Allow update for authenticated users" ON prompts;
DROP POLICY IF EXISTS "Allow delete for authenticated users" ON prompts;

-- Create new policies
CREATE POLICY "Enable read access for all users" 
ON prompts FOR SELECT 
USING (true);

CREATE POLICY "Enable insert for authenticated users" 
ON prompts FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" 
ON prompts FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Enable delete for authenticated users" 
ON prompts FOR DELETE 
TO authenticated 
USING (true);