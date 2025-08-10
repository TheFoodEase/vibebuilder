/*
  # Insert sample data for VibeBuilder Academy

  1. Sample Data
    - Add modules for existing courses
    - Add lessons for each module
    - Add sample quizzes and questions
    - Add sample enrollments and progress

  2. Notes
    - This assumes the courses table already has data
    - Adjust course IDs based on your existing data
*/

-- Insert modules for Vibe Coding Fundamentals (assuming course_id = 1)
INSERT INTO modules (course_id, title, order_index) VALUES
(1, 'Getting Started with Vibe Coding', 1),
(1, 'Core Concepts', 2),
(1, 'Building Your First App', 3),
(1, 'Advanced Techniques', 4),
(1, 'Project Showcase', 5)
ON CONFLICT DO NOTHING;

-- Insert modules for No-Code Development Platforms (assuming course_id = 2)
INSERT INTO modules (course_id, title, order_index) VALUES
(2, 'Platform Overview', 1),
(2, 'Bubble Fundamentals', 2),
(2, 'Webflow Mastery', 3),
(2, 'Zapier Automation', 4),
(2, 'Integration Strategies', 5)
ON CONFLICT DO NOTHING;

-- Insert modules for Building AI Agents & Workflows (assuming course_id = 3)
INSERT INTO modules (course_id, title, order_index) VALUES
(3, 'AI Fundamentals', 1),
(3, 'Agent Architecture', 2),
(3, 'Workflow Design', 3),
(3, 'Advanced AI Features', 4),
(3, 'Deployment & Scaling', 5)
ON CONFLICT DO NOTHING;

-- Insert lessons for Vibe Coding Fundamentals modules
INSERT INTO lessons (module_id, title, type, content, order_index) VALUES
-- Module 1: Getting Started
(1, 'Welcome to Vibe Coding', 'text', 'Introduction to the revolutionary no-code development approach that makes programming accessible to everyone.', 1),
(1, 'Setting Up Your Environment', 'video', 'Step-by-step guide to setting up your development environment for Vibe Coding.', 2),
(1, 'Your First Vibe Code', 'sandbox', 'Interactive coding exercise to create your first application using Vibe Coding principles.', 3),
(1, 'Knowledge Check', 'quiz', 'Test your understanding of basic Vibe Coding concepts.', 4),

-- Module 2: Core Concepts
(2, 'Understanding Visual Logic', 'text', 'Learn how visual programming works and why it''s more intuitive than traditional coding.', 1),
(2, 'Data Flow Principles', 'video', 'Master the fundamentals of how data moves through your applications.', 2),
(2, 'Building Interactive Components', 'sandbox', 'Create your first interactive UI components using drag-and-drop tools.', 3),
(2, 'Component Quiz', 'quiz', 'Test your knowledge of component creation and data flow.', 4),

-- Module 3: Building Your First App
(3, 'Planning Your Application', 'worksheet', 'Use our planning template to design your first complete application.', 1),
(3, 'Creating the User Interface', 'sandbox', 'Build a beautiful, responsive user interface for your application.', 2),
(3, 'Adding Functionality', 'sandbox', 'Implement core features and user interactions.', 3),
(3, 'Testing and Debugging', 'video', 'Learn essential testing and debugging techniques for no-code applications.', 4),
(3, 'App Building Assessment', 'quiz', 'Comprehensive quiz covering all aspects of application development.', 5)
ON CONFLICT DO NOTHING;

-- Insert sample quizzes
INSERT INTO quizzes (lesson_id, title) VALUES
(4, 'Vibe Coding Basics Quiz'),
(8, 'Core Concepts Assessment'),
(13, 'App Development Mastery Quiz')
ON CONFLICT DO NOTHING;

-- Insert sample quiz questions
INSERT INTO quiz_questions (quiz_id, order_index, question, choices, answer_index) VALUES
-- Quiz 1: Vibe Coding Basics
(1, 1, 'What is the main advantage of Vibe Coding?', ARRAY['Faster execution', 'Visual programming approach', 'Better performance', 'Smaller file sizes'], 1),
(1, 2, 'Which tool is primarily used in Vibe Coding?', ARRAY['Text editor', 'Command line', 'Visual interface', 'Database'], 2),
(1, 3, 'What makes Vibe Coding accessible to beginners?', ARRAY['No syntax to memorize', 'Drag-and-drop interface', 'Visual feedback', 'All of the above'], 3),

-- Quiz 2: Core Concepts
(2, 1, 'How does data flow in a Vibe Coding application?', ARRAY['Top to bottom', 'Left to right', 'Through connections', 'Randomly'], 2),
(2, 2, 'What is a component in Vibe Coding?', ARRAY['A reusable UI element', 'A database table', 'A file type', 'A programming language'], 0),

-- Quiz 3: App Development
(3, 1, 'What should you do first when building an app?', ARRAY['Start coding', 'Plan the features', 'Design the UI', 'Test the app'], 1),
(3, 2, 'Which is most important for user experience?', ARRAY['Fast loading', 'Beautiful design', 'Intuitive interface', 'All of the above'], 3)
ON CONFLICT DO NOTHING;