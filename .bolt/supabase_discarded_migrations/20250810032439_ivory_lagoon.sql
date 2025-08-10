/*
  # Create chat_messages table

  1. New Tables
    - `chat_messages`
      - `id` (bigint, primary key)
      - `thread_id` (uuid, foreign key to chat_threads)
      - `user_id` (uuid, foreign key to profiles, optional)
      - `role` (text, 'user' or 'assistant')
      - `content` (text)
      - `metadata` (jsonb, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `chat_messages` table
    - Add policies for users to manage messages in their own threads
    - Add policies for admins to manage all chat messages
*/

CREATE TABLE IF NOT EXISTS chat_messages (
  id bigint PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES chat_threads(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  role text NOT NULL,
  content text NOT NULL,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS chat_messages_thread_id_idx ON chat_messages(thread_id);
CREATE INDEX IF NOT EXISTS chat_messages_user_id_idx ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS chat_messages_created_at_idx ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_thread ON chat_messages(thread_id, created_at);

-- Enable RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Policies for chat_messages
CREATE POLICY "Users can manage messages in own threads"
  ON chat_messages
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_threads 
      WHERE chat_threads.id = chat_messages.thread_id 
      AND chat_threads.user_id = uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_threads 
      WHERE chat_threads.id = chat_messages.thread_id 
      AND chat_threads.user_id = uid()
    )
  );

-- Public policies
CREATE POLICY "chat_msgs_owner_select"
  ON chat_messages
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM chat_threads t
      WHERE t.id = chat_messages.thread_id 
      AND t.user_id = uid()
    )
  );

CREATE POLICY "chat_msgs_owner_cud"
  ON chat_messages
  FOR ALL
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM chat_threads t
      WHERE t.id = chat_messages.thread_id 
      AND t.user_id = uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_threads t
      WHERE t.id = chat_messages.thread_id 
      AND t.user_id = uid()
    )
  );

CREATE POLICY "chat_msgs_admin_all"
  ON chat_messages
  FOR ALL
  TO public
  USING (is_admin(uid()))
  WITH CHECK (is_admin(uid()));