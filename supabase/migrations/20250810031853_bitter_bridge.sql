/*
  # Create chat_threads table

  1. New Tables
    - `chat_threads`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `course_id` (bigint, foreign key to courses)
      - `module_id` (bigint, foreign key to modules)
      - `lesson_id` (bigint, foreign key to lessons)
      - `title` (text - thread title/summary)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `chat_threads` table
    - Add policy for users to manage their own chat threads
*/

CREATE TABLE IF NOT EXISTS chat_threads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id bigint REFERENCES courses(id) ON DELETE CASCADE,
  module_id bigint REFERENCES modules(id) ON DELETE CASCADE,
  lesson_id bigint REFERENCES lessons(id) ON DELETE CASCADE,
  title text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE chat_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own chat threads"
  ON chat_threads
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS chat_threads_user_id_idx ON chat_threads(user_id);
CREATE INDEX IF NOT EXISTS chat_threads_lesson_id_idx ON chat_threads(lesson_id);
CREATE INDEX IF NOT EXISTS chat_threads_created_at_idx ON chat_threads(created_at);