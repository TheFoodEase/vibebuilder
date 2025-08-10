import { useState, useEffect } from 'react';
import { supabase, Course, Module, Lesson, Progress, Enrollment } from '../lib/supabase';

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

// Function to update progress
export const updateProgress = async (
  userId: string,
  courseId: number,
  moduleId: number,
  lessonId: number,
  status: string,
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
      status: 'enrolled',
    });

  if (error) throw error;
  return data;
};