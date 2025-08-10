import { useState, useEffect } from 'react';
import { supabase, Course, Module, Lesson, Progress, Enrollment, Profile } from '../lib/supabase';

// Hook for fetching courses
export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .order('id');

        if (error) throw error;
        setCourses(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return { courses, loading, error };
};

// Hook for fetching course with modules and lessons
export const useCourseDetails = (slug: string) => {
  const [course, setCourse] = useState<Course & { modules: (Module & { lessons: Lesson[] })[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select(`
            *,
            modules (
              *,
              lessons (*)
            )
          `)
          .eq('slug', slug)
          .single();

        if (error) throw error;
        setCourse(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCourseDetails();
    }
  }, [slug]);

  return { course, loading, error };
};

// Hook for fetching user progress
export const useUserProgress = (userId: string) => {
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const { data, error } = await supabase
          .from('progress')
          .select('*')
          .eq('user_id', userId);

        if (error) throw error;
        setProgress(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProgress();
    }
  }, [userId]);

  return { progress, loading, error };
};

// Hook for fetching user enrollments
export const useUserEnrollments = (userId: string) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const { data, error } = await supabase
          .from('enrollments')
          .select('*')
          .eq('user_id', userId);

        if (error) throw error;
        setEnrollments(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchEnrollments();
    }
  }, [userId]);

  return { enrollments, loading, error };
};

// Hook for fetching user profile
export const useUserProfile = (userId: string) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  return { profile, loading, error };
};

// Function to update progress
export const updateProgress = async (
  userId: string,
  courseId: number,
  moduleId: number,
  lessonId: number,
  status: 'not_started' | 'in_progress' | 'completed',
  score?: number
) => {
  const { data, error } = await supabase
    .from('progress')
    .upsert({
      user_id: userId,
      course_id: courseId,
      module_id: moduleId,
      lesson_id: lessonId,
      status,
      score,
      last_viewed_at: new Date().toISOString(),
      ...(status === 'completed' && { completed_at: new Date().toISOString() })
    });

  if (error) throw error;
  return data;
};

// Function to record events
export const recordEvent = async (
  userId: string,
  eventType: string,
  courseId?: number,
  moduleId?: number,
  lessonId?: number,
  payload?: any
) => {
  const { data, error } = await supabase
    .from('events')
    .insert({
      user_id: userId,
      course_id: courseId,
      module_id: moduleId,
      lesson_id: lessonId,
      event_type: eventType,
      payload,
    });

  if (error) throw error;
  return data;
};

// Function to enroll user in course
export const enrollInCourse = async (userId: string, courseId: number) => {
  const { data, error } = await supabase
    .from('enrollments')
    .upsert({
      user_id: userId,
      course_id: courseId,
      status: 'active',
    });

  if (error) throw error;
  return data;
};

// Function to save sandbox state
export const saveSandboxState = async (
  userId: string,
  courseId: number,
  moduleId: number,
  lessonId: number,
  state: any,
  version: number = 1
) => {
  const { data, error } = await supabase
    .from('sandbox_states')
    .upsert({
      user_id: userId,
      course_id: courseId,
      module_id: moduleId,
      lesson_id: lessonId,
      state,
      version,
    });

  if (error) throw error;
  return data;
};

// Function to save worksheet notes
export const saveWorksheetNotes = async (
  userId: string,
  lessonId: number,
  notes: any
) => {
  const { data, error } = await supabase
    .from('worksheet_notes')
    .upsert({
      user_id: userId,
      lesson_id: lessonId,
      notes,
    });

  if (error) throw error;
  return data;
};

// Function to create chat thread
export const createChatThread = async (
  userId: string,
  courseId?: number,
  moduleId?: number,
  lessonId?: number,
  title?: string
) => {
  const { data, error } = await supabase
    .from('chat_threads')
    .insert({
      user_id: userId,
      course_id: courseId,
      module_id: moduleId,
      lesson_id: lessonId,
      title,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Function to add chat message
export const addChatMessage = async (
  threadId: string,
  userId: string,
  role: 'user' | 'assistant',
  content: string,
  metadata?: any
) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      thread_id: threadId,
      user_id: userId,
      role,
      content,
      metadata,
    });

  if (error) throw error;
  return data;
};