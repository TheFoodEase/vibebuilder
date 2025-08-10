/*
  # Create profiles table

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text, optional)
      - `avatar_url` (text, optional)
      - `role` (text, default 'student')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `profiles` table
    - Add policies for users to manage their own profiles
    - Add policies for admins to manage all profiles

  3. Functions
    - Create trigger function to handle new user creation
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  role text DEFAULT 'student',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (uid() = id)
  WITH CHECK (uid() = id);

CREATE POLICY "Admins can manage all profiles"
  ON profiles
  FOR ALL
  TO authenticated
  USING ((jwt() ->> 'user_role'::text) = 'admin'::text)
  WITH CHECK ((jwt() ->> 'user_role'::text) = 'admin'::text);

-- Public policies
CREATE POLICY "profiles_self_read"
  ON profiles
  FOR SELECT
  TO public
  USING (uid() = id);

CREATE POLICY "profiles_self_update"
  ON profiles
  FOR UPDATE
  TO public
  USING (uid() = id)
  WITH CHECK (uid() = id);

CREATE POLICY "profiles_admin_all"
  ON profiles
  FOR ALL
  TO public
  USING (is_admin(uid()))
  WITH CHECK (is_admin(uid()));

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON users
      FOR EACH ROW EXECUTE FUNCTION handle_new_user();
  END IF;
END $$;