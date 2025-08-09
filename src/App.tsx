import React, { useState, useEffect } from 'react';
import { Menu, X, User, MessageCircle, Send, Play, BookOpen, Bot, Code, Palette, Home, Settings, GraduationCap, ArrowLeft, LogOut, Lock, Search, ChevronDown, ChevronRight, ChevronLeft, Check, Terminal, HelpCircle, Clock, BarChart3, ArrowRight, TrendingUp, Users, Zap, Layers } from 'lucide-react';

type Page = 'dashboard' | 'lesson' | 'signup' | 'courses' | 'course-detail' | 'vibe-coding-course' | 'nocode-platforms-course' | 'ai-agents-course' | 'vibeCodingCourse';

interface UserData {
  name: string;
  email: string;
  progressData: {
    title: string;
    progress: number;
    color: string;
  }[];
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('signup');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [currentVibeCodingLessonId, setCurrentVibeCodingLessonId] = useState<string>('1.1');
  const [expandedModuleId, setExpandedModuleId] = useState<string>('1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Initial progress data for new users (all courses at 0%)
  const initialProgressData = [
    {
      title: "Introduction to No-Code",
      progress: 0,
      color: "from-green-400 to-emerald-500"
    },
    {
      title: "Building Apps Without Code", 
      progress: 0,
      color: "from-blue-400 to-cyan-500"
    },
    {
      title: "Automating Workflows",
      progress: 0,
      color: "from-purple-400 to-indigo-500"
    }
  ];

  // Sample existing user data with some progress
  const existingUserData = [
    {
      title: "Introduction to No-Code",
      progress: 80,
      color: "from-green-400 to-emerald-500"
    },
    {
      title: "Building Apps Without Code", 
      progress: 50,
      color: "from-blue-400 to-cyan-500"
    },
    {
      title: "Automating Workflows",
      progress: 20,
      color: "from-purple-400 to-indigo-500"
    }
  ];

  // Vibe Coding Course Content
  const vibeCodingCourseContent = {
    title: "Vibe Coding Fundamentals",
    tagline: "Learn the art of natural-language programming",
    overview: "Use simple prompts to guide AI coding assistants through a four-step workflow: prompt → generate → refine → review.",
    modules: [
      {
        id: '1',
        title: 'Introduction to Vibe Coding',
        lessons: [
          {
            id: '1.1',
            title: 'What is vibe coding?',
            type: 'Video + Quiz',
            duration: '15 min',
            content: {
              description: 'Discover the revolutionary approach to programming using natural language and AI assistants.',
              videoUrl: 'https://example.com/video1',
              keyPoints: [
                'Understanding natural-language programming',
                'Benefits of AI-assisted development',
                'The four-step workflow: prompt → generate → refine → review'
              ]
            }
          },
          {
            id: '1.2',
            title: 'Key tools & risks',
            type: 'Video + Quiz',
            duration: '20 min',
            content: {
              description: 'Learn about essential AI coding tools and potential pitfalls to avoid.',
              videoUrl: 'https://example.com/video2',
              keyPoints: [
                'Popular AI coding assistants',
                'Common risks and limitations',
                'Best practices for safe AI coding'
              ]
            }
          }
        ]
      },
      {
        id: '2',
        title: 'Crafting Effective Prompts',
        lessons: [
          {
            id: '2.1',
            title: 'Anatomy of a prompt',
            type: 'Prompt lab (write & test)',
            duration: '25 min',
            content: {
              description: 'Master the structure and components of effective AI prompts.',
              keyPoints: [
                'Context setting and role definition',
                'Clear instruction formatting',
                'Example patterns and templates'
              ]
            }
          },
          {
            id: '2.2',
            title: 'Prompt refinement cycle',
            type: 'Prompt lab (write & test)',
            duration: '30 min',
            content: {
              description: 'Learn iterative techniques to improve prompt effectiveness.',
              keyPoints: [
                'Testing and validation methods',
                'Common refinement patterns',
                'Measuring prompt success'
              ]
            }
          }
        ]
      },
      {
        id: '3',
        title: 'Choosing an AI Coding Assistant',
        lessons: [
          {
            id: '3.1',
            title: 'Copilot vs. CodeWhisperer vs. Replit',
            type: 'Comparative matrix + poll',
            duration: '20 min',
            content: {
              description: 'Compare popular AI coding assistants and their strengths.',
              keyPoints: [
                'Feature comparison matrix',
                'Use case recommendations',
                'Integration capabilities'
              ]
            }
          },
          {
            id: '3.2',
            title: 'Budget & performance trade-offs',
            type: 'Comparative matrix + poll',
            duration: '15 min',
            content: {
              description: 'Understand cost vs. performance considerations.',
              keyPoints: [
                'Pricing models comparison',
                'Performance benchmarks',
                'ROI calculations'
              ]
            }
          }
        ]
      },
      {
        id: '4',
        title: 'Code Refinement Techniques',
        lessons: [
          {
            id: '4.1',
            title: 'Iterative testing',
            type: 'Debugging challenge',
            duration: '35 min',
            content: {
              description: 'Practice systematic approaches to code testing and improvement.',
              keyPoints: [
                'Test-driven refinement',
                'Automated testing integration',
                'Performance optimization'
              ]
            }
          },
          {
            id: '4.2',
            title: 'Identifying bugs in AI-generated code',
            type: 'Debugging challenge',
            duration: '40 min',
            content: {
              description: 'Develop skills to spot and fix common AI coding errors.',
              keyPoints: [
                'Common AI coding mistakes',
                'Debugging strategies',
                'Code review techniques'
              ]
            }
          }
        ]
      },
      {
        id: '5',
        title: 'Final Project: Build a Mini-App',
        lessons: [
          {
            id: '5.1',
            title: 'Define requirements',
            type: 'Guided wizard + code sandbox',
            duration: '30 min',
            content: {
              description: 'Learn to create clear project specifications for AI assistants.',
              keyPoints: [
                'Requirements gathering',
                'User story creation',
                'Technical specification writing'
              ]
            }
          },
          {
            id: '5.2',
            title: 'Prompt, generate, refine, deploy',
            type: 'Guided wizard + code sandbox',
            duration: '45 min',
            content: {
              description: 'Apply the complete vibe coding workflow to build a real application.',
              keyPoints: [
                'End-to-end development process',
                'Deployment strategies',
                'Project documentation'
              ]
            }
          }
        ]
      }
    ]
  };

  useEffect(() => {
    const handleScroll = () => {};
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
    setCurrentUser({
      name: "New User",
      email: "user@example.com",
      progressData: initialProgressData
    });
    setCurrentPage('dashboard');
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentUser({
      name: "Welcome Back",
      email: "returning@example.com",
      progressData: existingUserData
    });
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentPage('signup');
  };

  const getCurrentLesson = () => {
    for (const module of vibeCodingCourseContent.modules) {
      const lesson = module.lessons.find(l => l.id === currentVibeCodingLessonId);
      if (lesson) return lesson;
    }
    return vibeCodingCourseContent.modules[0].lessons[0];
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModuleId(expandedModuleId === moduleId ? '' : moduleId);
  };

  const selectLesson = (lessonId: string) => {
    setCurrentVibeCodingLessonId(lessonId);
  };

  const courses = [
    {
      id: 'vibe-coding',
      title: "Vibe Coding Fundamentals",
      description: "Learn the basics of instructing AI models to write code for you",
      icon: <Code className="w-8 h-8" />,
      color: "from-orange-400 to-red-500",
      bgColor: "bg-gradient-to-br from-orange-400 to-red-500",
      page: 'vibe-coding-course'
    },
    {
      id: 'nocode-platforms',
      title: "No-Code Development Platforms", 
      description: "Explore platforms that let you build applications visually",
      icon: <Palette className="w-8 h-8" />,
      color: "from-pink-400 to-purple-500",
      bgColor: "bg-gradient-to-br from-pink-400 to-purple-500",
      page: 'nocode-platforms-course'
    },
    {
      id: 'ai-agents',
      title: "Building AI Agents & Workflows",
      description: "Discover how to create automated agents and integrated workflows",
      icon: <Bot className="w-8 h-8" />,
      color: "from-blue-400 to-cyan-500",
      bgColor: "bg-gradient-to-br from-blue-400 to-cyan-500",
      page: 'ai-agents-course'
    }
  ];

  const chatMessages = [
    { type: 'user', text: 'Hi there!' },
    { type: 'bot', text: 'How can I assist you today?' }
  ];

  const renderDashboard = () => (
    <div className="space-y-12">
      {/* Top Navigation */}
      <nav className="bg-white/25 backdrop-blur-xl rounded-3xl p-4 mb-8 border border-white/30 shadow-2xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-gray-800">VibeBuilder</h1>
            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => setCurrentPage('dashboard')}
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
              >
                Dashboard
              </button>
              <button 
                onClick={() => setCurrentPage('courses')}
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
              >
                Courses
              </button>
              <button className="text-gray-700 hover:text-gray-900 transition-colors font-medium">
                Settings
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <>
                <button
                  onClick={handleLogout}
                  className="hidden md:flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
                <div className="hidden md:block">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                </div>
              </>
            )}
            
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/20"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/20">
            <div className="space-y-4">
              <button 
                onClick={() => setCurrentPage('dashboard')}
                className="block text-gray-700 hover:text-gray-900 transition-colors font-medium"
              >
                Dashboard
              </button>
              <button 
                onClick={() => setCurrentPage('courses')}
                className="block text-gray-700 hover:text-gray-900 transition-colors font-medium"
              >
                Courses
              </button>
              <button className="block text-gray-700 hover:text-gray-900 transition-colors font-medium">
                Settings
              </button>
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Welcome Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 animate-pulse-glow">
          <BookOpen className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">
          Hello, {currentUser?.name || 'Welcome Back'}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Continue your learning journey and master the art of no-code development
        </p>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Progress Section */}
        <div className="bg-white/25 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Progress</h3>
          <div className="space-y-4">
            {(currentUser?.progressData || initialProgressData).map((item, index) => (
              <div key={index} className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-gray-800">{item.title}</h4>
                  <span className="text-2xl font-bold text-gray-800">{item.progress}%</span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-3">
                  <div 
                    className={`h-3 bg-gradient-to-r ${item.color} rounded-full transition-all duration-500 ${item.progress === 0 ? 'opacity-30' : ''}`}
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
                {item.progress === 0 && (
                  <p className="text-sm text-gray-600 mt-2 italic">Not started yet</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Start Journey Section */}
        <div className="bg-gradient-to-br from-cyan-400/30 to-blue-500/30 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl">
          <h3 className="text-3xl font-bold text-white mb-4">
            Start your no-code journey
          </h3>
          <button 
            onClick={() => setCurrentPage('courses')}
            className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 mb-6"
          >
            View Course
          </button>
          
          {/* Placeholder for additional content */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl h-32 border border-white/20"></div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card rounded-3xl p-10 shadow-4xl">
        <div className="flex items-center mb-8">
          <Zap className="w-8 h-8 text-yellow-600 mr-4 hover:scale-110 transition-transform" />
          <h2 className="text-3xl font-bold text-gray-800">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="group flex flex-col items-center justify-center p-8 bg-white/40 rounded-2xl hover:bg-white/60 transition-all duration-300 border border-white/30 hover:scale-105 hover:shadow-xl">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">Resume Course</span>
          </div>
          
          <div className="group flex flex-col items-center justify-center p-8 bg-white/40 rounded-2xl hover:bg-white/60 transition-all duration-300 border border-white/30 hover:scale-105 hover:shadow-xl">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <User className="w-6 h-6 text-white" />
            </div>
            <span className="font-semibold text-gray-800 group-hover:text-purple-700 transition-colors">View Profile</span>
          </div>
          
          <div className="group flex flex-col items-center justify-center p-8 bg-white/40 rounded-2xl hover:bg-white/60 transition-all duration-300 border border-white/30 hover:scale-105 hover:shadow-xl">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <span className="font-semibold text-gray-800 group-hover:text-green-700 transition-colors">Settings</span>
          </div>
          
          <div className="group flex flex-col items-center justify-center p-8 bg-white/40 rounded-2xl hover:bg-white/60 transition-all duration-300 border border-white/30 hover:scale-105 hover:shadow-xl">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <span className="font-semibold text-gray-800 group-hover:text-orange-700 transition-colors">Get Help</span>
          </div>
        </div>
      </div>

      {/* Your Progress */}
      <div className="glass-card rounded-3xl p-10 shadow-4xl">
        <div className="flex items-center mb-8">
          <TrendingUp className="w-8 h-8 text-blue-600 mr-4 hover:scale-110 transition-transform" />
          <h2 className="text-3xl font-bold text-gray-800">Your Progress</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(currentUser?.progressData || initialProgressData).map((course, index) => (
            <div key={index} className="group bg-white/40 rounded-2xl p-8 backdrop-blur-sm border border-white/30 hover:bg-white/50 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-3 group-hover:scale-125 transition-transform"></div>
                <h3 className="font-bold text-gray-800 text-lg group-hover:text-blue-700 transition-colors">{course.title}</h3>
              </div>
              <div className="w-full bg-gray-200/60 rounded-full h-4 mb-4 overflow-hidden">
                <div 
                  style={{ width: `${course.progress}%` }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-1000 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-700">{course.progress}% Complete</p>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  {course.progress < 100 ? 'In Progress' : 'Completed'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Course Overview */}
      <div className="glass-card rounded-3xl p-10 shadow-4xl">
        <div className="flex items-center mb-10">
          <Layers className="w-8 h-8 text-purple-600 mr-4 hover:scale-110 transition-transform" />
          <h2 className="text-3xl font-bold text-gray-800">Course Overview</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group bg-white/40 rounded-2xl p-8 backdrop-blur-sm border border-white/30 hover:bg-white/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Code className="w-7 h-7 text-white" />
              </div>
            </div>
            <h3 className="font-bold text-xl text-gray-800 mb-4 group-hover:text-blue-700 transition-colors">Vibe Coding Fundamentals</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">Master the basics of visual programming and build your first applications with confidence.</p>
            <div className="flex items-center mb-6 text-sm text-gray-500">
              <Users className="w-4 h-4 mr-2" />
              <span>5 Modules • 25 Lessons</span>
            </div>
            <button
              onClick={() => setCurrentPage('lesson')}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center group"
            >
              <span>Continue Learning</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="group bg-white/40 rounded-2xl p-8 backdrop-blur-sm border border-white/30 hover:bg-white/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Layers className="w-7 h-7 text-white" />
              </div>
            </div>
            <h3 className="font-bold text-xl text-gray-800 mb-4 group-hover:text-purple-700 transition-colors">No-Code Development Platforms</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">Explore popular no-code tools and learn to build powerful applications without writing code.</p>
            <div className="flex items-center mb-6 text-sm text-gray-500">
              <Users className="w-4 h-4 mr-2" />
              <span>4 Modules • 20 Lessons</span>
            </div>
            <button
              onClick={() => setCurrentPage('courses')}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-purple-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center group"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="group bg-white/40 rounded-2xl p-8 backdrop-blur-sm border border-white/30 hover:bg-white/50 transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Zap className="w-7 h-7 text-white" />
              </div>
            </div>
            <h3 className="font-bold text-xl text-gray-800 mb-4 group-hover:text-green-700 transition-colors">Building AI Agents & Workflows</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">Create intelligent automation systems and AI-powered workflows for modern applications.</p>
            <div className="flex items-center mb-6 text-sm text-gray-500">
              <Users className="w-4 h-4 mr-2" />
              <span>5 Modules • 30 Lessons</span>
            </div>
            <button
              onClick={() => setCurrentPage('courses')}
              className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center group"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white/25 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h3>
        <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800 text-lg mb-1">
                How can I create a form in a no-code platform?
              </h4>
              <p className="text-gray-600">Just now</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLesson = () => (
    <div className="max-w-7xl mx-auto">
      {/* Back Button */}
      <button 
        onClick={() => setCurrentPage('course-detail')}
        className="mb-6 flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Course</span>
      </button>

      {/* Lesson Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Lesson Content */}
        <div className="lg:col-span-2 bg-white/25 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl">
          <h3 className="text-2xl font-bold text-white mb-6">
            Lesson 1: Introduction to No-Code
          </h3>
          <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 border border-white/20 h-96">
            {/* Simulated lesson content */}
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`h-4 bg-gray-300/50 rounded ${i === 2 ? 'w-3/4' : i === 5 ? 'w-1/2' : 'w-full'}`}></div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Section */}
        <div className="bg-white/25 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-2xl">
          <h4 className="text-xl font-bold text-white mb-4">Chat</h4>
          
          <div className="space-y-3 mb-4 h-64 overflow-y-auto">
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-3 rounded-2xl rounded-br-md max-w-xs ml-auto">
              <p className="text-sm">Hi there!</p>
            </div>
            <div className="bg-white/30 backdrop-blur-sm text-gray-800 border border-white/20 px-4 py-3 rounded-2xl rounded-bl-md max-w-xs">
              <div className="flex items-center mb-1">
                <div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mr-2">
                  <Bot className="w-3 h-3 text-white" />
                </div>
              </div>
              <p className="text-sm">How can I assist you today?</p>
            </div>
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-3 rounded-2xl rounded-br-md max-w-xs ml-auto">
              <p className="text-sm">Can you explain no-code platforms?</p>
            </div>
            <div className="bg-white/30 backdrop-blur-sm text-gray-800 border border-white/20 px-4 py-3 rounded-2xl rounded-bl-md max-w-xs">
              <div className="flex items-center mb-1">
                <div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mr-2">
                  <Bot className="w-3 h-3 text-white" />
                </div>
              </div>
              <p className="text-sm">No-code platforms allow you to build applications using visual interfaces instead of writing code...</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-white/30 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-2 text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button className="bg-gradient-to-r from-green-400 to-emerald-500 text-white p-2 rounded-2xl hover:shadow-lg transition-all duration-200">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSignup = () => (
    <div className="max-w-md mx-auto">
      <div className="bg-white/25 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Join VibeBuilder</h2>
          <p className="text-gray-600">Start your no-code journey today</p>
        </div>
        
        <form onSubmit={handleSignUp} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Full Name"
              required
              className="w-full bg-white/40 backdrop-blur-sm border border-white/30 rounded-2xl px-6 py-4 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
            />
          </div>
          
          <div>
            <input
              type="email"
              placeholder="Email Address"
              required
              className="w-full bg-white/40 backdrop-blur-sm border border-white/30 rounded-2xl px-6 py-4 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full bg-white/40 backdrop-blur-sm border border-white/30 rounded-2xl px-6 py-4 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-400 to-green-500 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
          >
            Create Account
          </button>
        </form>
        
        <div className="text-center mt-8">
          <p className="text-blue-600 mb-2">Already have an account?</p>
          <button 
            onClick={handleLogin}
            className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );

  const renderCourses = () => {
    if (!isAuthenticated) {
      return (
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-12 h-12 text-white/60" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Courses Locked
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
              Please sign up or log in to access our courses and start your no-code journey.
            </p>
            <button 
              onClick={() => setCurrentPage('signup')}
              className="bg-gradient-to-r from-cyan-400 to-green-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              Sign Up Now
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-lg text-white/90 mb-2">VibeBuilder Academy</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Learn to Build Apps Without Code
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Unlock the power to create applications, AI agents, and workflows without any coding knowledge.
          </p>
        </div>
        
        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <div 
              key={index}
              onClick={() => setCurrentPage(course.page as Page)}
              className="bg-white/25 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer"
            >
              <div className={`w-16 h-16 ${course.bgColor} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                <div className="text-white">
                  {course.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">{course.title}</h3>
              <p className="text-gray-700 leading-relaxed">{course.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCourseDetail = () => (
    <div className="max-w-6xl mx-auto">
      {/* Back Button */}
      <button 
        onClick={() => setCurrentPage('courses')}
        className="mb-6 flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Courses</span>
      </button>

      {/* Course Header */}
      <h1 className="text-4xl sm:text-5xl font-bold text-white mb-12 text-center">
        Vibe Coding Fundamentals
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Overview */}
        <div className="lg:col-span-2 bg-white/25 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl">
          <h4 className="text-2xl font-bold text-gray-800 mb-6">Overview</h4>
          <p className="text-gray-700 leading-relaxed text-lg mb-8">
            Learn the basics of vibe coding, which involves using natural language prompts to guide AI coding assistants.
          </p>
          
          {/* Modules */}
          <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h4 className="text-xl font-bold text-gray-800 mb-6">Modules</h4>
            <div className="space-y-4">
              <div 
                onClick={() => setCurrentPage('lesson')}
                className="flex items-center space-x-4 p-4 bg-white/20 rounded-xl hover:bg-white/30 transition-colors cursor-pointer"
              >
                <span className="text-lg font-semibold text-gray-800 bg-white/40 w-8 h-8 rounded-full flex items-center justify-center">1</span>
                <span className="text-gray-700 font-medium">Introduction to Vibe Coding</span>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-white/20 rounded-xl hover:bg-white/30 transition-colors cursor-pointer">
                <span className="text-lg font-semibold text-gray-800 bg-white/40 w-8 h-8 rounded-full flex items-center justify-center">2</span>
                <span className="text-gray-700 font-medium">Choosing an AI Coding Assistant</span>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-white/20 rounded-xl hover:bg-white/30 transition-colors cursor-pointer">
                <span className="text-lg font-semibold text-gray-800 bg-white/40 w-8 h-8 rounded-full flex items-center justify-center">3</span>
                <span className="text-gray-700 font-medium">Best Practices for Prompting</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress Circle */}
          <div className="bg-white/25 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl flex flex-col items-center justify-center">
            <div className="relative w-32 h-32 mb-6">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-300/50"/>
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset="125.6" className="text-green-400" strokeLinecap="round"/>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-800">50%</span>
              </div>
            </div>
            <p className="text-gray-700 font-medium text-lg">Complete</p>
          </div>

          {/* Chat */}
          <div className="bg-white/25 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-2xl">
            <h4 className="text-xl font-bold text-gray-800 mb-4">Chat</h4>
            <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-gray-800">Hi there!</span>
              </div>
              <p className="text-gray-700 text-sm">How can I assist you today?</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVibeCodingCourse = () => {
    const currentLesson = getCurrentLesson();
    const userProgress = currentUser?.progressData.find(p => p.title.includes('Vibe Coding'))?.progress || 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
        {/* Header */}
        <div className="glass-nav sticky top-0 z-50 px-6 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <button
              onClick={() => setCurrentPage('courses')}
              className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Courses</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="relative w-8 h-8">
                <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-300/50"/>
                  <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                    strokeDasharray="251.2" 
                    strokeDashoffset={251.2 - (251.2 * (userProgress / 100))} 
                    className="text-orange-400" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">{userProgress}% Complete</span>
            </div>
          </div>
        </div>

        <div className="flex max-w-7xl mx-auto">
          {/* Left Sidebar - Module Navigator */}
          <div className="w-80 min-h-screen bg-white/30 backdrop-blur-lg border-r border-white/20 p-6">
            {/* Hero Section */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">{vibeCodingCourseContent.title}</h1>
                  <p className="text-sm text-gray-600">{vibeCodingCourseContent.tagline}</p>
                </div>
              </div>
              
              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search lessons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/50 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-sm"
                />
              </div>
              
              {/* Overview Panel */}
              <div className="bg-white/40 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">Course Overview</h3>
                <p className="text-sm text-gray-700">{vibeCodingCourseContent.overview}</p>
              </div>
            </div>

            {/* Module Navigator */}
            <div className="space-y-2">
              {vibeCodingCourseContent.modules.map((module) => (
                <div key={module.id} className="bg-white/20 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                        {module.id}
                      </div>
                      <span className="font-medium text-gray-800">{module.title}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${expandedModuleId === module.id ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {expandedModuleId === module.id && (
                    <div className="px-4 pb-4 space-y-2">
                      {module.lessons.map((lesson) => (
                        <button
                          key={lesson.id}
                          onClick={() => selectLesson(lesson.id)}
                          className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                            currentVibeCodingLessonId === lesson.id
                              ? 'bg-orange-100 border border-orange-200'
                              : 'hover:bg-white/20'
                          }`}
                        >
                          <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                            <Check className="w-3 h-3 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800 text-sm">{lesson.title}</p>
                            <p className="text-xs text-gray-600">{lesson.type} • {lesson.duration}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              {/* Lesson Header */}
              <div className="mb-8">
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  <span>Module {currentLesson.id.split('.')[0]}</span>
                  <ChevronRight className="w-4 h-4" />
                  <span>Lesson {currentLesson.id.split('.')[1]}</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{currentLesson.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{currentLesson.duration}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{currentLesson.type}</span>
                  </span>
                </div>
              </div>

              {/* Lesson Content */}
              <div className="glass-card rounded-xl p-8 mb-8">
                <p className="text-gray-700 text-lg mb-6">{currentLesson.content.description}</p>
                
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Learning Points</h3>
                  <ul className="space-y-3">
                    {currentLesson.content.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center mt-0.5">
                          <span className="text-white text-xs font-bold">{index + 1}</span>
                        </div>
                        <span className="text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Interactive Elements Based on Lesson Type */}
                {(currentLesson.type.includes('Prompt lab') || currentLesson.type.includes('Debugging challenge') || currentLesson.type.includes('Guided wizard')) && (
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 mb-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Terminal className="w-6 h-6 text-gray-600" />
                      <h3 className="text-lg font-semibold text-gray-800">Interactive Code Playground</h3>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-4 mb-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-gray-400 text-sm ml-2">Code Editor</span>
                      </div>
                      <div className="text-green-400 font-mono text-sm">
                        <p># Interactive coding environment will be loaded here</p>
                        <p># Students can write, test, and refine prompts</p>
                        <p className="text-gray-500"># Monaco Editor integration coming soon...</p>
                      </div>
                    </div>
                    <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors flex items-center space-x-2">
                      <Play className="w-4 h-4" />
                      <span>Run Code</span>
                    </button>
                  </div>
                )}

                {currentLesson.type.includes('Video') && (
                  <div className="bg-gray-900 rounded-lg aspect-video mb-6 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Play className="w-16 h-16 mx-auto mb-4 opacity-70" />
                      <p className="text-lg">Video content will be embedded here</p>
                      <p className="text-sm opacity-70">Interactive video player with progress tracking</p>
                    </div>
                  </div>
                )}

                {currentLesson.type.includes('Quiz') && (
                  <div className="bg-blue-50 rounded-lg p-6 mb-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <HelpCircle className="w-6 h-6 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-800">Knowledge Check</h3>
                    </div>
                    <p className="text-gray-700 mb-4">Interactive quiz questions will appear here to test your understanding.</p>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Start Quiz
                    </button>
                  </div>
                )}

                {currentLesson.type.includes('matrix') && (
                  <div className="bg-purple-50 rounded-lg p-6 mb-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <BarChart3 className="w-6 h-6 text-purple-600" />
                      <h3 className="text-lg font-semibold text-gray-800">Comparison Matrix</h3>
                    </div>
                    <p className="text-gray-700 mb-4">Interactive comparison tools and polling features will be available here.</p>
                    <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                      View Comparison
                    </button>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Lesson</span>
                </button>
                <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors flex items-center space-x-2">
                  <span>Next Lesson</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Chat Tutor */}
        <button className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center animate-pulse-glow">
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>
    );
  };

  const renderVibeCodingCourseOld = () => (
    <div className="max-w-6xl mx-auto">
      {/* Back Button */}
      <button 
        onClick={() => setCurrentPage('courses')}
        className="mb-6 flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Courses</span>
      </button>

      {/* Course Header */}
      <div className="text-center mb-12">
        <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <Code className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          Vibe Coding Fundamentals
        </h1>
        <p className="text-xl text-white/80 max-w-3xl mx-auto">
          Master the art of communicating with AI coding assistants through natural language prompts
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Course Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview */}
          <div className="bg-white/25 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Course Overview</h3>
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              Learn the revolutionary approach to software development through "vibe coding" - the practice of using natural language to guide AI coding assistants in creating applications, websites, and tools.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h4 className="font-bold text-gray-800 mb-3">🎯 What You'll Learn</h4>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• Effective prompt engineering techniques</li>
                  <li>• AI assistant selection and setup</li>
                  <li>• Code review and iteration strategies</li>
                  <li>• Project planning with AI tools</li>
                </ul>
              </div>
              <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h4 className="font-bold text-gray-800 mb-3">⚡ Key Benefits</h4>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• 10x faster development speed</li>
                  <li>• No prior coding experience needed</li>
                  <li>• Build complex applications quickly</li>
                  <li>• Learn programming concepts naturally</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Modules */}
          <div className="bg-white/25 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl">
            <h4 className="text-2xl font-bold text-gray-800 mb-6">Course Modules</h4>
            <div className="space-y-4">
              {[
                { title: "Introduction to Vibe Coding", duration: "45 min", description: "Understanding the fundamentals of AI-assisted development" },
                { title: "Choosing Your AI Coding Assistant", duration: "30 min", description: "Comparing tools like GitHub Copilot, ChatGPT, and Claude" },
                { title: "Prompt Engineering Mastery", duration: "60 min", description: "Crafting effective prompts for complex coding tasks" },
                { title: "Project Planning & Architecture", duration: "50 min", description: "Structuring projects for AI collaboration" },
                { title: "Code Review & Iteration", duration: "40 min", description: "Refining and improving AI-generated code" },
                { title: "Real-World Project Build", duration: "90 min", description: "Building a complete application from scratch" }
              ].map((module, index) => (
                <div 
                  key={index}
                  onClick={() => setCurrentPage('vibeCodingCourse')}
                  className="flex items-center space-x-4 p-6 bg-white/20 rounded-2xl hover:bg-white/30 transition-colors cursor-pointer group"
                >
                  <span className="text-lg font-bold text-gray-800 bg-gradient-to-br from-orange-400 to-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">{module.title}</h5>
                    <p className="text-gray-600 text-sm mt-1">{module.description}</p>
                  </div>
                  <span className="text-sm text-gray-500 bg-white/30 px-3 py-1 rounded-full">{module.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress Circle */}
          <div className="bg-white/25 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl flex flex-col items-center justify-center">
            <div className="relative w-32 h-32 mb-6">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-300/50"/>
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                  strokeDasharray="251.2" 
                  strokeDashoffset={251.2 - (251.2 * ((currentUser?.progressData.find(p => p.title === "Introduction to No-Code")?.progress || 0) / 100))} 
                  className="text-orange-400" strokeLinecap="round"/>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-800">
                  {currentUser?.progressData.find(p => p.title === "Introduction to No-Code")?.progress || 0}%
                </span>
              </div>
            </div>
            <p className="text-gray-700 font-medium text-lg">Complete</p>
            <button 
              onClick={() => setCurrentPage('vibeCodingCourse')}
              className="mt-4 bg-gradient-to-r from-orange-400 to-red-500 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              Start Learning
            </button>
          </div>

          {/* Course Stats */}
          <div className="bg-white/25 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-2xl">
            <h4 className="text-xl font-bold text-gray-800 mb-4">Course Details</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Duration</span>
                <span className="font-semibold text-gray-800">5.5 hours</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Modules</span>
                <span className="font-semibold text-gray-800">6 lessons</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Level</span>
                <span className="font-semibold text-gray-800">Beginner</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Certificate</span>
                <span className="font-semibold text-gray-800">Yes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNoCodePlatformsCourse = () => (
    <div className="max-w-6xl mx-auto">
      {/* Back Button */}
      <button 
        onClick={() => setCurrentPage('courses')}
        className="mb-6 flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Courses</span>
      </button>

      {/* Course Header */}
      <div className="text-center mb-12">
        <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <Palette className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          No-Code Development Platforms
        </h1>
        <p className="text-xl text-white/80 max-w-3xl mx-auto">
          Build powerful applications using visual interfaces and drag-and-drop tools
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Course Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview */}
          <div className="bg-white/25 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Course Overview</h3>
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              Discover the power of no-code platforms that enable you to create sophisticated web applications, mobile apps, and business tools without writing a single line of code.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h4 className="font-bold text-gray-800 mb-3">🛠️ Platforms Covered</h4>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• Webflow for responsive websites</li>
                  <li>• Bubble for web applications</li>
                  <li>• Airtable for database management</li>
                  <li>• Zapier for workflow automation</li>
                </ul>
              </div>
              <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h4 className="font-bold text-gray-800 mb-3">🎨 Skills You'll Gain</h4>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• Visual application design</li>
                  <li>• Database structure planning</li>
                  <li>• User experience optimization</li>
                  <li>• Integration and deployment</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Modules */}
          <div className="bg-white/25 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl">
            <h4 className="text-2xl font-bold text-gray-800 mb-6">Course Modules</h4>
            <div className="space-y-4">
              {[
                { title: "Introduction to No-Code Movement", duration: "35 min", description: "Understanding the no-code revolution and its impact" },
                { title: "Webflow Mastery", duration: "75 min", description: "Creating responsive websites with visual design tools" },
                { title: "Bubble App Development", duration: "90 min", description: "Building complex web applications with logic and databases" },
                { title: "Airtable Database Design", duration: "45 min", description: "Structuring and managing data for your applications" },
                { title: "Zapier Automation Workflows", duration: "60 min", description: "Connecting apps and automating business processes" },
                { title: "Platform Integration Project", duration: "120 min", description: "Building a complete solution using multiple platforms" }
              ].map((module, index) => (
                <div 
                  key={index}
                  onClick={() => setCurrentPage('lesson')}
                  className="flex items-center space-x-4 p-6 bg-white/20 rounded-2xl hover:bg-white/30 transition-colors cursor-pointer group"
                >
                  <span className="text-lg font-bold text-white bg-gradient-to-br from-pink-400 to-purple-500 w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">{module.title}</h5>
                    <p className="text-gray-600 text-sm mt-1">{module.description}</p>
                  </div>
                  <span className="text-sm text-gray-500 bg-white/30 px-3 py-1 rounded-full">{module.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress Circle */}
          <div className="bg-white/25 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl flex flex-col items-center justify-center">
            <div className="relative w-32 h-32 mb-6">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-300/50"/>
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                  strokeDasharray="251.2" 
                  strokeDashoffset={251.2 - (251.2 * ((currentUser?.progressData.find(p => p.title === "Building Apps Without Code")?.progress || 0) / 100))} 
                  className="text-pink-400" strokeLinecap="round"/>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-800">
                  {currentUser?.progressData.find(p => p.title === "Building Apps Without Code")?.progress || 0}%
                </span>
              </div>
            </div>
            <p className="text-gray-700 font-medium text-lg">Complete</p>
            <button 
              onClick={() => setCurrentPage('lesson')}
              className="mt-4 bg-gradient-to-r from-pink-400 to-purple-500 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              Start Learning
            </button>
          </div>

          {/* Course Stats */}
          <div className="bg-white/25 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-2xl">
            <h4 className="text-xl font-bold text-gray-800 mb-4">Course Details</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Duration</span>
                <span className="font-semibold text-gray-800">7 hours</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Modules</span>
                <span className="font-semibold text-gray-800">6 lessons</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Level</span>
                <span className="font-semibold text-gray-800">Intermediate</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Certificate</span>
                <span className="font-semibold text-gray-800">Yes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAIAgentsCourse = () => (
    <div className="max-w-6xl mx-auto">
      {/* Back Button */}
      <button 
        onClick={() => setCurrentPage('courses')}
        className="mb-6 flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Courses</span>
      </button>

      {/* Course Header */}
      <div className="text-center mb-12">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <Bot className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          Building AI Agents & Workflows
        </h1>
        <p className="text-xl text-white/80 max-w-3xl mx-auto">
          Create intelligent automation systems that work 24/7 to streamline your business
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Course Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview */}
          <div className="bg-white/25 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Course Overview</h3>
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              Learn to build intelligent AI agents and automated workflows that can handle complex tasks, make decisions, and integrate with multiple systems to create powerful business automation.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h4 className="font-bold text-gray-800 mb-3">🤖 AI Tools Covered</h4>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• OpenAI GPT integration</li>
                  <li>• Make.com workflow automation</li>
                  <li>• n8n for complex integrations</li>
                  <li>• Custom API connections</li>
                </ul>
              </div>
              <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h4 className="font-bold text-gray-800 mb-3">⚡ Automation Types</h4>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• Customer service chatbots</li>
                  <li>• Data processing pipelines</li>
                  <li>• Content generation systems</li>
                  <li>• Business process automation</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Modules */}
          <div className="bg-white/25 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl">
            <h4 className="text-2xl font-bold text-gray-800 mb-6">Course Modules</h4>
            <div className="space-y-4">
              {[
                { title: "AI Agent Fundamentals", duration: "50 min", description: "Understanding AI capabilities and limitations" },
                { title: "OpenAI API Integration", duration: "65 min", description: "Connecting and configuring AI models for your needs" },
                { title: "Make.com Workflow Builder", duration: "80 min", description: "Creating visual automation workflows" },
                { title: "Advanced n8n Integrations", duration: "70 min", description: "Building complex multi-step automations" },
                { title: "Custom Chatbot Development", duration: "90 min", description: "Creating intelligent conversational agents" },
                { title: "Enterprise Automation Project", duration: "100 min", description: "Building a complete business automation system" }
              ].map((module, index) => (
                <div 
                  key={index}
                  onClick={() => setCurrentPage('lesson')}
                  className="flex items-center space-x-4 p-6 bg-white/20 rounded-2xl hover:bg-white/30 transition-colors cursor-pointer group"
                >
                  <span className="text-lg font-bold text-white bg-gradient-to-br from-blue-400 to-cyan-500 w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">{module.title}</h5>
                    <p className="text-gray-600 text-sm mt-1">{module.description}</p>
                  </div>
                  <span className="text-sm text-gray-500 bg-white/30 px-3 py-1 rounded-full">{module.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress Circle */}
          <div className="bg-white/25 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl flex flex-col items-center justify-center">
            <div className="relative w-32 h-32 mb-6">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-300/50"/>
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                  strokeDasharray="251.2" 
                  strokeDashoffset={251.2 - (251.2 * ((currentUser?.progressData.find(p => p.title === "Automating Workflows")?.progress || 0) / 100))} 
                  className="text-blue-400" strokeLinecap="round"/>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-800">
                  {currentUser?.progressData.find(p => p.title === "Automating Workflows")?.progress || 0}%
                </span>
              </div>
            </div>
            <p className="text-gray-700 font-medium text-lg">Complete</p>
            <button 
              onClick={() => setCurrentPage('lesson')}
              className="mt-4 bg-gradient-to-r from-blue-400 to-cyan-500 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              Start Learning
            </button>
          </div>

          {/* Course Stats */}
          <div className="bg-white/25 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-2xl">
            <h4 className="text-xl font-bold text-gray-800 mb-4">Course Details</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Duration</span>
                <span className="font-semibold text-gray-800">8 hours</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Modules</span>
                <span className="font-semibold text-gray-800">6 lessons</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Level</span>
                <span className="font-semibold text-gray-800">Advanced</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Certificate</span>
                <span className="font-semibold text-gray-800">Yes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const LoginModal = ({ isOpen, onClose, onLoginSuccess }: { isOpen: boolean; onClose: () => void; onLoginSuccess: (user: UserData) => void; }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl max-w-md w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <form className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-white/50 border border-white/30 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-white/50 border border-white/30 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={() => onLoginSuccess({
                name: "Welcome Back",
                email: "returning@example.com",
                progressData: existingUserData
              })}
              className="w-full bg-gradient-to-r from-cyan-400 to-green-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    );
  };

  const renderCurrentPage = () => {
    // Redirect to signup if not authenticated and trying to access protected pages
    if (!isAuthenticated && currentPage !== 'signup') {
      return renderSignup();
    }

    switch (currentPage) {
      case 'dashboard':
        return renderDashboard();
      case 'lesson':
        return renderLesson();
      case 'signup':
        return renderSignup();
      case 'courses':
        return renderCourses();
      case 'course-detail':
        return renderCourseDetail();
      case 'vibe-coding-course':
        return renderVibeCodingCourseOld();
      case 'nocode-platforms-course':
        return renderNoCodePlatformsCourse();
      case 'ai-agents-course':
        return renderAIAgentsCourse();
      case 'vibeCodingCourse':
        return renderVibeCodingCourse();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Enhanced Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-300 via-blue-400 to-purple-500"></div>
      <div className="fixed inset-0 bg-gradient-to-tr from-green-300 via-transparent to-yellow-300 opacity-60"></div>
      <div className="fixed inset-0 bg-gradient-to-bl from-transparent via-emerald-200/30 to-pink-300/40"></div>
      
      {/* Enhanced Floating Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Large organic shapes */}
        <div className="absolute top-10 right-20 w-40 h-40 bg-white/15 rounded-full backdrop-blur-sm animate-float-slow shadow-2xl"></div>
        <div className="absolute bottom-20 left-10 w-32 h-32 bg-cyan-200/25 rounded-full backdrop-blur-sm animate-float-medium"></div>
        <div className="absolute top-1/2 right-1/3 w-28 h-28 bg-emerald-200/30 rounded-full backdrop-blur-sm animate-float-fast"></div>
        
        {/* Leaf-like organic shapes */}
        <div className="absolute top-1/4 left-1/4 w-36 h-20 bg-green-300/20 rounded-full backdrop-blur-sm animate-float-slow transform rotate-45"></div>
        <div className="absolute bottom-1/3 right-1/4 w-32 h-16 bg-blue-300/20 rounded-full backdrop-blur-sm animate-float-medium transform -rotate-12"></div>
        
        {/* Additional decorative elements */}
        <div className="absolute top-40 left-1/3 w-24 h-24 bg-white/10 rounded-full backdrop-blur-sm animate-float-slow"></div>
        <div className="absolute bottom-40 right-20 w-20 h-20 bg-purple-200/25 rounded-full backdrop-blur-sm animate-float-medium"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 min-h-screen p-4 sm:p-6 lg:p-8">
        {renderCurrentPage()}
      </div>
      
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setShowLoginModal(false);
        }}
      />

      {/* Navigation Dots - Only show if authenticated */}
      {isAuthenticated && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex space-x-3 bg-white/20 backdrop-blur-md rounded-full p-3 border border-white/30">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                currentPage === 'dashboard' ? 'bg-white' : 'bg-white/40'
              }`}
            />
            <button
              onClick={() => setCurrentPage('courses')}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                currentPage === 'courses' ? 'bg-white' : 'bg-white/40'
              }`}
            />
            <button
              onClick={() => setCurrentPage('lesson')}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                currentPage === 'lesson' ? 'bg-white' : 'bg-white/40'
              }`}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;