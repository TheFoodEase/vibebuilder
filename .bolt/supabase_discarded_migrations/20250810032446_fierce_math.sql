/*
  # Insert sample data for VibeBuilder Academy

  1. Sample Data
    - Sample modules for existing courses
    - Sample lessons for each module
    - Sample quizzes and quiz questions
    - Sample progress data

  2. Notes
    - This assumes courses already exist in the database
    - Data is structured to match the VibeBuilder Academy curriculum
*/

-- Insert sample modules for Vibe Coding Fundamentals (assuming course_id = 1)
INSERT INTO modules (course_id, title, summary, order_index) VALUES
(1, 'Getting Started with Vibe Coding', 'Introduction to the Vibe Coding platform and basic concepts', 1),
(1, 'Building Your First App', 'Create your first application using drag-and-drop components', 2),
(1, 'Data Management Basics', 'Learn how to store and retrieve data in your applications', 3),
(1, 'User Interface Design', 'Design beautiful and functional user interfaces', 4),
(1, 'Publishing Your App', 'Deploy and share your completed applications', 5);

-- Insert sample modules for Advanced No-Code Development (assuming course_id = 2)
INSERT INTO modules (course_id, title, summary, order_index) VALUES
(2, 'Advanced Component Architecture', 'Master complex component relationships and state management', 1),
(2, 'API Integration Mastery', 'Connect your apps to external services and databases', 2),
(2, 'Workflow Automation', 'Build sophisticated business logic and automated processes', 3),
(2, 'Performance Optimization', 'Optimize your applications for speed and scalability', 4);

-- Insert sample modules for Database Design Mastery (assuming course_id = 3)
INSERT INTO modules (course_id, title, summary, order_index) VALUES
(3, 'Database Fundamentals', 'Understanding relational databases and data modeling', 1),
(3, 'Advanced Queries', 'Master complex SQL queries and data manipulation', 2),
(3, 'Database Security', 'Implement proper security measures and access controls', 3),
(3, 'Scaling and Performance', 'Optimize database performance for large applications', 4);

-- Insert sample lessons for Module 1 (Getting Started with Vibe Coding)
INSERT INTO lessons (module_id, title, type, content, order_index, duration_min) VALUES
((SELECT id FROM modules WHERE title = 'Getting Started with Vibe Coding' LIMIT 1), 'Welcome to Vibe Coding', 'video', '{"video_url": "https://example.com/welcome", "description": "Introduction to the platform"}', 1, 15),
((SELECT id FROM modules WHERE title = 'Getting Started with Vibe Coding' LIMIT 1), 'Platform Overview', 'text', '{"content": "Learn about the main features and interface of Vibe Coding"}', 2, 10),
((SELECT id FROM modules WHERE title = 'Getting Started with Vibe Coding' LIMIT 1), 'Your First Component', 'lab', '{"instructions": "Create your first drag-and-drop component", "starter_code": "{}"}', 3, 30),
((SELECT id FROM modules WHERE title = 'Getting Started with Vibe Coding' LIMIT 1), 'Knowledge Check', 'quiz', '{"quiz_id": null}', 4, 5);

-- Insert sample lessons for Module 2 (Building Your First App)
INSERT INTO lessons (module_id, title, type, content, order_index, duration_min) VALUES
((SELECT id FROM modules WHERE title = 'Building Your First App' LIMIT 1), 'Planning Your App', 'worksheet', '{"worksheet_template": "App planning template"}', 1, 20),
((SELECT id FROM modules WHERE title = 'Building Your First App' LIMIT 1), 'Creating the Layout', 'lab', '{"instructions": "Build the main layout of your application"}', 2, 45),
((SELECT id FROM modules WHERE title = 'Building Your First App' LIMIT 1), 'Adding Functionality', 'video', '{"video_url": "https://example.com/functionality"}', 3, 25),
((SELECT id FROM modules WHERE title = 'Building Your First App' LIMIT 1), 'Testing Your App', 'checklist', '{"checklist_items": ["Test all buttons", "Verify data flow", "Check responsive design"]}', 4, 15);

-- Insert sample quizzes
INSERT INTO quizzes (lesson_id, title) VALUES
((SELECT id FROM lessons WHERE title = 'Knowledge Check' LIMIT 1), 'Vibe Coding Basics Quiz');

-- Insert sample quiz questions
INSERT INTO quiz_questions (quiz_id, order_index, question, choices, answer_index, explanation) VALUES
((SELECT id FROM quizzes WHERE title = 'Vibe Coding Basics Quiz' LIMIT 1), 1, 'What is the main advantage of no-code development?', 
 '["Faster development", "No programming knowledge required", "Visual interface", "All of the above"]', 3, 
 'No-code development combines all these advantages: faster development, accessibility to non-programmers, and intuitive visual interfaces.'),
((SELECT id FROM quizzes WHERE title = 'Vibe Coding Basics Quiz' LIMIT 1), 2, 'Which component type is best for displaying data?', 
 '["Button", "Text Display", "Input Field", "Container"]', 1, 
 'Text Display components are specifically designed to show data to users in a readable format.');

-- Note: Sample progress data would typically be inserted as users interact with the platform
-- For demonstration purposes, we can add some sample progress for testing

-- The following would be inserted when users actually progress through lessons:
-- INSERT INTO progress (user_id, course_id, module_id, lesson_id, status, completed_at) VALUES
-- (auth.uid(), 1, module_id, lesson_id, 'completed', now());

-- Sample events for analytics (these would be generated by user interactions)
-- INSERT INTO events (user_id, course_id, module_id, lesson_id, event_type, payload) VALUES
-- (auth.uid(), 1, module_id, lesson_id, 'lesson_started', '{"timestamp": "2024-01-01T10:00:00Z"}');