/*
  # Create enrollments table

  1. New Tables
    - `enrollments`
      - `id` (bigint, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `course_id` (bigint, foreign key to courses)
      - `status` (text, default 'active')
      - `started_at` (timestamp)
      - `completed_at` (timestamp, optional)

  2. Security
    - Enable RLS on `enrollments` table
    - Add policies for users to manage their own enrollments
    - Add policies for admins to manage all enrollments
*/

CREATE TABLE IF NOT EXISTS enrollments (
  id bigint PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id bigint NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  status text DEFAULT 'active',
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  UNIQUE(user_id, course_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS enrollments_user_id_idx ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS enrollments_course_id_idx ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS enrollments_status_idx ON enrollments(status);

-- Enable RLS
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Policies for enrollments
CREATE POLICY "Users can view own enrollments"
  ON enrollments
  FOR SELECT
  TO authenticated
  USING (uid() = user_id);

CREATE POLICY "Users can manage own enrollments"
  ON enrollments
  FOR ALL
  TO authenticated
  USING (uid() = user_id)
  WITH CHECK (uid() = user_id);

CREATE POLICY "Admins can manage all enrollments"
  ON enrollments
  FOR ALL
  TO authenticated
  USING ((jwt() ->> 'user_role'::text) = 'admin'::text)
  WITH CHECK ((jwt() ->> 'user_role'::text) = 'admin'::text);

-- Public policies
CREATE POLICY "enrollments_owner_rw"
  ON enrollments
  FOR ALL
  TO public
  USING (user_id = uid())
  WITH CHECK (user_id = uid());

CREATE POLICY "enrollments_admin_all"
  ON enrollments
  FOR ALL
  TO public
  USING (is_admin(uid()))
  WITH CHECK (is_admin(uid()));