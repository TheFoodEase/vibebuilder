/*
  # Create events table

  1. New Tables
    - `events`
      - `id` (bigint, primary key)
      - `user_id` (uuid, foreign key to profiles, optional)
      - `course_id` (bigint, foreign key to courses, optional)
      - `module_id` (bigint, foreign key to modules, optional)
      - `lesson_id` (bigint, foreign key to lessons, optional)
      - `event_type` (text)
      - `payload` (jsonb, optional)
      - `user_agent` (text, optional)
      - `ip` (inet, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `events` table
    - Add policies for users to create and view their own events
    - Add policies for admins to view all events
*/

CREATE TABLE IF NOT EXISTS events (
  id bigint PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  course_id bigint REFERENCES courses(id) ON DELETE SET NULL,
  module_id bigint REFERENCES modules(id) ON DELETE SET NULL,
  lesson_id bigint REFERENCES lessons(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  payload jsonb,
  user_agent text,
  ip inet,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS events_user_id_idx ON events(user_id);
CREATE INDEX IF NOT EXISTS events_course_id_idx ON events(course_id);
CREATE INDEX IF NOT EXISTS events_event_type_idx ON events(event_type);
CREATE INDEX IF NOT EXISTS events_created_at_idx ON events(created_at);
CREATE INDEX IF NOT EXISTS idx_events_user_time ON events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policies for events
CREATE POLICY "Users can view own events"
  ON events
  FOR SELECT
  TO authenticated
  USING (uid() = user_id);

CREATE POLICY "Users can create own events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (uid() = user_id);

CREATE POLICY "Admins can view all events"
  ON events
  FOR SELECT
  TO authenticated
  USING ((jwt() ->> 'user_role'::text) = 'admin'::text);

-- Public policies
CREATE POLICY "events_owner_select"
  ON events
  FOR SELECT
  TO public
  USING (user_id = uid());

CREATE POLICY "events_owner_insert"
  ON events
  FOR INSERT
  TO public
  WITH CHECK (user_id = uid());

CREATE POLICY "events_admin_all"
  ON events
  FOR ALL
  TO public
  USING (is_admin(uid()))
  WITH CHECK (is_admin(uid()));