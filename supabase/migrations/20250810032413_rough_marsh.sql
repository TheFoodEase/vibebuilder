/*
  # Create progress table

  1. New Tables
    - `progress`
      - `user_id` (uuid, part of composite primary key)
      - `course_id` (bigint, part of composite primary key)
      - `module_id` (bigint, part of composite primary key)
      - `lesson_id` (bigint, part of composite primary key)
      - `status` (text, default 'in_progress')
      - `score` (numeric, optional for quizzes)
      - `last_viewed_at` (timestamp)
      - `completed_at` (timestamp, optional)

  2. Security
    - Enable RLS on `progress` table
    - Add policies for users to manage their own progress
    - Add policies for admins to view all progress
*/

CREATE TABLE IF NOT EXISTS progress (
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id bigint NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  module_id bigint NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  lesson_id bigint NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  status text DEFAULT 'in_progress' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  score numeric(5,2),
  last_viewed_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  PRIMARY KEY (user_id, course_id, module_id, lesson_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS progress_user_id_idx ON progress(user_id);
CREATE INDEX IF NOT EXISTS progress_course_id_idx ON progress(course_id);
CREATE INDEX IF NOT EXISTS progress_status_idx ON progress(status);
CREATE INDEX IF NOT EXISTS idx_progress_user_course ON progress(user_id, course_id);

-- Enable RLS
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

-- Policies for progress
CREATE POLICY "Users can view own progress"
  ON progress
  FOR SELECT
  TO authenticated
  USING (uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON progress
  FOR ALL
  TO authenticated
  USING (uid() = user_id)
  WITH CHECK (uid() = user_id);

CREATE POLICY "Admins can view all progress"
  ON progress
  FOR SELECT
  TO authenticated
  USING ((jwt() ->> 'user_role'::text) = 'admin'::text);

-- Public policies
CREATE POLICY "progress_owner_rw"
  ON progress
  FOR ALL
  TO public
  USING (user_id = uid())
  WITH CHECK (user_id = uid());

CREATE POLICY "progress_admin_all"
  ON progress
  FOR ALL
  TO public
  USING (is_admin(uid()))
  WITH CHECK (is_admin(uid()));