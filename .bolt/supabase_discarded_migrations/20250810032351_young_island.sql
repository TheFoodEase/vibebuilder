/*
  # Create quizzes table

  1. New Tables
    - `quizzes`
      - `id` (bigint, primary key)
      - `lesson_id` (bigint, foreign key to lessons, unique)
      - `title` (text, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `quizzes` table
    - Add policies for authenticated users to read quizzes
    - Add policies for admins to manage quizzes
*/

CREATE TABLE IF NOT EXISTS quizzes (
  id bigint PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id bigint UNIQUE REFERENCES lessons(id) ON DELETE CASCADE,
  title text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS quizzes_lesson_id_idx ON quizzes(lesson_id);

-- Enable RLS
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

-- Policies for quizzes
CREATE POLICY "Users can view quizzes"
  ON quizzes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage quizzes"
  ON quizzes
  FOR ALL
  TO authenticated
  USING ((jwt() ->> 'user_role'::text) = 'admin'::text)
  WITH CHECK ((jwt() ->> 'user_role'::text) = 'admin'::text);

-- Public policies
CREATE POLICY "quizzes_read_all"
  ON quizzes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "quizzes_admin_write"
  ON quizzes
  FOR ALL
  TO public
  USING (is_admin(uid()))
  WITH CHECK (is_admin(uid()));