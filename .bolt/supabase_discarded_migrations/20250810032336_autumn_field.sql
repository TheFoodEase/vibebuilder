/*
  # Create modules table

  1. New Tables
    - `modules`
      - `id` (bigint, primary key)
      - `course_id` (bigint, foreign key to courses)
      - `title` (text)
      - `summary` (text, optional)
      - `order_index` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `modules` table
    - Add policies for authenticated users to read modules
    - Add policies for admins to manage modules
*/

CREATE TABLE IF NOT EXISTS modules (
  id bigint PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id bigint NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  summary text,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS modules_course_id_idx ON modules(course_id);
CREATE INDEX IF NOT EXISTS modules_order_idx ON modules(course_id, order_index);

-- Enable RLS
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;

-- Policies for modules
CREATE POLICY "Users can view modules"
  ON modules
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage modules"
  ON modules
  FOR ALL
  TO authenticated
  USING ((jwt() ->> 'user_role'::text) = 'admin'::text)
  WITH CHECK ((jwt() ->> 'user_role'::text) = 'admin'::text);

-- Public policies (for unauthenticated access if needed)
CREATE POLICY "modules_read_all"
  ON modules
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "modules_admin_write"
  ON modules
  FOR ALL
  TO public
  USING (is_admin(uid()))
  WITH CHECK (is_admin(uid()));

-- Create admin check function if it doesn't exist
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;