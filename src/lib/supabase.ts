import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for better TypeScript support
export interface Course {
  id: number;
  slug: string;
  title: string;
  tagline?: string;
  level?: string;
  icon?: string;
  status?: string;
}

export interface Module {
  id: number;
  course_id: number;
  title: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: number;
  module_id: number;
  title: string;
  type: 'text' | 'video' | 'quiz' | 'sandbox' | 'worksheet';
  content?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Quiz {
  id: number;
  lesson_id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface QuizQuestion {
  id: number;
  quiz_id: number;
  order_index: number;
  question: string;
  choices: string[];
  answer_index: number;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name?: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface Enrollment {
  id: number;
  user_id: string;
  course_id: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Progress {
  user_id: string;
  course_id: number;
  module_id: number;
  lesson_id: number;
  status: string;
  score?: number;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: number;
  user_id: string;
  course_id?: number;
  module_id?: number;
  lesson_id?: number;
  event_type: string;
  payload?: any;
  created_at: string;
}

export interface SandboxState {
  id: number;
  user_id: string;
  course_id: number;
  module_id: number;
  lesson_id: number;
  state: any;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface WorksheetNote {
  id: number;
  user_id: string;
  lesson_id: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface ChatThread {
  id: string;
  user_id: string;
  course_id?: number;
  module_id?: number;
  lesson_id?: number;
  title?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: number;
  thread_id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  metadata?: any;
  created_at: string;
}