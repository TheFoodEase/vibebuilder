/*
  # Create lessons table

  1. New Tables
    - `lessons`
      - `id` (bigint, primary key)
      - `module_id` (bigint, foreign key to modules)
      - `title` (text)
      - `type` (text, constrained to specific lesson types)
      - `content` (jsonb, for flexible content storage)
      - `order_index` (integer)
      - `duration_min` (integer, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `lessons` table
    - Add policies for authenticated users to read lessons
    - Add policies for admins to manage lessons
*/

CREATE TABLE IF NOT EXISTS lessons (
  id bigint PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id bigint NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title text NOT NULL,
  type text NOT NULL CHECK (type IN ('text', 'video', 'lab', 'worksheet', 'quiz', 'checklist')),
  content jsonb,
  order_index integer NOT NULL,
  duration_min integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS lessons_module_id_idx ON lessons(module_id);
CREATE INDEX IF NOT EXISTS lessons_order_idx ON lessons(module_id, order_index);
CREATE INDEX IF NOT EXISTS lessons_type_idx ON lessons(type);

-- Enable RLS
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Policies for lessons
CREATE POLICY "Users can view lessons"
  ON lessons
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage lessons"
  ON lessons
  FOR ALL
  TO authenticated
  USING ((jwt() ->> 'user_role'::text) = 'admin'::text)
  WITH CHECK ((jwt() ->> 'user_role'::text) = 'admin'::text);

-- Public policies (for unauthenticated access if needed)
CREATE POLICY "lessons_read_all"
  ON lessons
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "lessons_admin_write"
  ON lessons
  FOR ALL
  TO public
  USING (is_admin(uid()))
  WITH CHECK (is_admin(uid()));