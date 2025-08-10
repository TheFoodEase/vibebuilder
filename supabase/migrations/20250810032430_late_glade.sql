/*
  # Create worksheet_notes table

  1. New Tables
    - `worksheet_notes`
      - `id` (bigint, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `lesson_id` (bigint, foreign key to lessons)
      - `notes` (jsonb, user notes data)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `worksheet_notes` table
    - Add policies for users to manage their own worksheet notes
    - Add policies for admins to manage all worksheet notes
*/

CREATE TABLE IF NOT EXISTS worksheet_notes (
  id bigint PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id bigint NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  notes jsonb,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS worksheet_notes_user_id_idx ON worksheet_notes(user_id);
CREATE INDEX IF NOT EXISTS worksheet_notes_lesson_id_idx ON worksheet_notes(lesson_id);

-- Enable RLS
ALTER TABLE worksheet_notes ENABLE ROW LEVEL SECURITY;

-- Policies for worksheet_notes
CREATE POLICY "Users can manage own worksheet notes"
  ON worksheet_notes
  FOR ALL
  TO authenticated
  USING (uid() = user_id)
  WITH CHECK (uid() = user_id);

-- Public policies
CREATE POLICY "notes_owner_rw"
  ON worksheet_notes
  FOR ALL
  TO public
  USING (user_id = uid())
  WITH CHECK (user_id = uid());

CREATE POLICY "notes_admin_all"
  ON worksheet_notes
  FOR ALL
  TO public
  USING (is_admin(uid()))
  WITH CHECK (is_admin(uid()));