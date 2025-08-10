/*
  # Create quiz_questions table

  1. New Tables
    - `quiz_questions`
      - `id` (bigint, primary key)
      - `quiz_id` (bigint, foreign key to quizzes)
      - `order_index` (integer)
      - `question` (text)
      - `choices` (jsonb, array of choices)
      - `answer_index` (integer, correct answer index)
      - `explanation` (text, optional)

  2. Security
    - Enable RLS on `quiz_questions` table
    - Add policies for authenticated users to read quiz questions
    - Add policies for admins to manage quiz questions
*/

CREATE TABLE IF NOT EXISTS quiz_questions (
  id bigint PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id bigint NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  order_index integer NOT NULL,
  question text NOT NULL,
  choices jsonb NOT NULL,
  answer_index integer NOT NULL,
  explanation text
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS quiz_questions_quiz_id_idx ON quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS quiz_questions_order_idx ON quiz_questions(quiz_id, order_index);

-- Enable RLS
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

-- Policies for quiz_questions
CREATE POLICY "Users can view quiz questions"
  ON quiz_questions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage quiz questions"
  ON quiz_questions
  FOR ALL
  TO authenticated
  USING ((jwt() ->> 'user_role'::text) = 'admin'::text)
  WITH CHECK ((jwt() ->> 'user_role'::text) = 'admin'::text);

-- Public policies
CREATE POLICY "quiz_questions_read_all"
  ON quiz_questions
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "quiz_questions_admin_write"
  ON quiz_questions
  FOR ALL
  TO public
  USING (is_admin(uid()))
  WITH CHECK (is_admin(uid()));