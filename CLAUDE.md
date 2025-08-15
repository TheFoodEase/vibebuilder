# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VibeBuilder Academy is an educational web application focused on teaching no-code development. It's a React-based single-page application with TypeScript, featuring course content, user authentication, and progress tracking.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Preview production build locally
npm run preview
```

## Architecture

The application follows a single-page architecture with all main functionality contained in `src/App.tsx` (1,714 lines). Page navigation is handled through React state management rather than a routing library.

### Core Structure
- **App.tsx**: Main component containing all page renders (dashboard, courses, lessons)
- **LoginModal.tsx**: Authentication modal component
- **State Management**: Uses React hooks (useState, useEffect) for all state
- **Styling**: Tailwind CSS with custom glass morphism effects and animations

### Page System
Pages are managed through a state-based routing system:
```typescript
type Page = 'signup' | 'login' | 'dashboard' | 'courses' | 'course-detail' | 'lesson' | 'quiz' | 'profile';
const [currentPage, setCurrentPage] = useState<Page>('signup');
```

### Key Patterns
- All page content is rendered through dedicated render functions (renderDashboard, renderCourses, etc.)
- Authentication state controls access to protected pages
- Mock data is hard-coded for courses and user information
- Heavy use of glass morphism UI with backdrop-blur effects
- Floating animated background elements using custom CSS animations

## Tech Stack

- **React 18.3.1** with functional components and hooks
- **TypeScript** with strict configuration
- **Vite 5.4.2** for build tooling
- **Tailwind CSS 3.4.1** for styling
- **Lucide React** for icons
- No external state management library
- No routing library (internal state-based routing)

## Important Considerations

When modifying this codebase:
1. The App.tsx file is intentionally monolithic - all page logic is contained within it
2. Use existing Tailwind classes and maintain the glass morphism design system
3. Follow the existing pattern of render functions for new pages
4. Maintain TypeScript strict mode compliance
5. Ensure responsive design works across all breakpoints (mobile-first approach)
6. Keep accessibility features (focus styles, reduced motion support)