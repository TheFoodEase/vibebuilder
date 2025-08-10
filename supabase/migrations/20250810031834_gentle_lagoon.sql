/*
  # Create progress table

  1. New Tables
    - `progress`
      - `user_id` (uuid, part of composite primary key)
      - `course_id` (bigint, part of composite primary key)
      - `module_id` (bigint, part of composite primary key)
      - `lesson_id` (bigint, part of composite primary key)
      - `status` (text - progress status)
      - `score` (integer, nullable for quiz scores)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `progress` table
    - Add policy for users to view their own progress
    - Add policy for users to update their own progress
    - Add policy for admins to view all progress

  3. Constraints
    - Composite primary key on user_id, course_id, module_id, lesson_id
*/

CREATE TABLE IF NOT EXISTS progress (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id bigint REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  module_id bigint REFERENCES modules(id) ON DELETE CASCADE NOT NULL,
  lesson_id bigint REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL DEFAULT 'started',
  score integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, course_id, module_id, lesson_id)
);

ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON progress
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all progress"
  ON progress
  FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'user_role'::text) = 'admin'::text);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS progress_user_id_idx ON progress(user_id);
CREATE INDEX IF NOT EXISTS progress_course_id_idx ON progress(course_id);
CREATE INDEX IF NOT EXISTS progress_status_idx ON progress(status);