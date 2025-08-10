/*
  # Create chat_threads table

  1. New Tables
    - `chat_threads`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `course_id` (bigint, foreign key to courses, optional)
      - `module_id` (bigint, foreign key to modules, optional)
      - `lesson_id` (bigint, foreign key to lessons, optional)
      - `title` (text, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `chat_threads` table
    - Add policies for users to manage their own chat threads
    - Add policies for admins to manage all chat threads
*/

CREATE TABLE IF NOT EXISTS chat_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id bigint REFERENCES courses(id) ON DELETE SET NULL,
  module_id bigint REFERENCES modules(id) ON DELETE SET NULL,
  lesson_id bigint REFERENCES lessons(id) ON DELETE SET NULL,
  title text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS chat_threads_user_id_idx ON chat_threads(user_id);
CREATE INDEX IF NOT EXISTS chat_threads_lesson_id_idx ON chat_threads(lesson_id);
CREATE INDEX IF NOT EXISTS chat_threads_created_at_idx ON chat_threads(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_threads_user ON chat_threads(user_id, created_at DESC);

-- Enable RLS
ALTER TABLE chat_threads ENABLE ROW LEVEL SECURITY;

-- Policies for chat_threads
CREATE POLICY "Users can manage own chat threads"
  ON chat_threads
  FOR ALL
  TO authenticated
  USING (uid() = user_id)
  WITH CHECK (uid() = user_id);

-- Public policies
CREATE POLICY "chat_threads_owner_rw"
  ON chat_threads
  FOR ALL
  TO public
  USING (user_id = uid())
  WITH CHECK (user_id = uid());

CREATE POLICY "chat_threads_admin_all"
  ON chat_threads
  FOR ALL
  TO public
  USING (is_admin(uid()))
  WITH CHECK (is_admin(uid()));