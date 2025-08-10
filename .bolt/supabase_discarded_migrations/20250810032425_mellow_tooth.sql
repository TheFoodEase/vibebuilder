/*
  # Create sandbox_states table

  1. New Tables
    - `sandbox_states`
      - `id` (bigint, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `course_id` (bigint, foreign key to courses)
      - `module_id` (bigint, foreign key to modules)
      - `lesson_id` (bigint, foreign key to lessons)
      - `state` (jsonb, sandbox state data)
      - `version` (integer, default 1)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `sandbox_states` table
    - Add policies for users to manage their own sandbox states
    - Add policies for admins to manage all sandbox states
*/

CREATE TABLE IF NOT EXISTS sandbox_states (
  id bigint PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id bigint NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  module_id bigint NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  lesson_id bigint NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  state jsonb NOT NULL,
  version integer DEFAULT 1,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS sandbox_states_user_id_idx ON sandbox_states(user_id);
CREATE INDEX IF NOT EXISTS sandbox_states_lesson_id_idx ON sandbox_states(lesson_id);

-- Enable RLS
ALTER TABLE sandbox_states ENABLE ROW LEVEL SECURITY;

-- Policies for sandbox_states
CREATE POLICY "Users can manage own sandbox states"
  ON sandbox_states
  FOR ALL
  TO authenticated
  USING (uid() = user_id)
  WITH CHECK (uid() = user_id);

-- Public policies
CREATE POLICY "sandbox_owner_rw"
  ON sandbox_states
  FOR ALL
  TO public
  USING (user_id = uid())
  WITH CHECK (user_id = uid());

CREATE POLICY "sandbox_admin_all"
  ON sandbox_states
  FOR ALL
  TO public
  USING (is_admin(uid()))
  WITH CHECK (is_admin(uid()));