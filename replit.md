# Overview

Excuse Generator Pro is a web application that generates creative and believable excuses using AI. The app allows users to input specific situations, select their audience type, adjust creativity levels, and receive scored excuses with credibility ratings. Built as a full-stack TypeScript application, it uses React for the frontend with shadcn/ui components, Express.js for the backend, and integrates with OpenAI's API for excuse generation. The app stores user data locally in the browser and focuses on providing an intuitive, visually appealing experience for users who need creative excuses for various situations.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built with React 18 using TypeScript and follows a component-based architecture. The UI is styled with Tailwind CSS using a dark neon theme with glassmorphism effects. The app uses shadcn/ui components for consistent design patterns and Radix UI primitives for accessibility. State management is handled through React hooks and TanStack Query for server state management. The frontend uses wouter for lightweight client-side routing.

**Key Design Decisions:**
- **Component Library Choice**: shadcn/ui provides pre-built, customizable components that maintain design consistency while allowing theme customization
- **Styling Approach**: Tailwind CSS with custom CSS variables enables a cohesive dark neon theme with glassmorphism effects
- **State Management**: TanStack Query handles API state management and caching, while local React state manages form data
- **Routing**: wouter provides lightweight routing without the overhead of React Router

## Backend Architecture
The server uses Express.js with TypeScript in a simple REST API architecture. The backend is stateless and focuses on API request handling and OpenAI integration. Routes are organized in a single file with clear separation of concerns. The server implements middleware for request logging and error handling.

**Key Design Decisions:**
- **API Design**: RESTful endpoints with clear request/response schemas validated using Zod
- **Stateless Architecture**: Server doesn't maintain user sessions or persistent state, keeping it simple and scalable
- **Error Handling**: Centralized error handling middleware with proper HTTP status codes and error messages
- **Request Validation**: Zod schemas ensure type safety and validate incoming requests

## Data Storage Solutions
The application uses browser localStorage for all user data persistence, avoiding the need for a database. This includes saved excuses, API keys, user preferences, and session statistics. A dedicated storage service class manages all localStorage operations with error handling.

**Key Design Decisions:**
- **Client-Side Storage**: localStorage eliminates database complexity and hosting requirements while providing instant access to user data
- **Storage Service Pattern**: Centralized storage management ensures consistent data operations and error handling
- **Data Structure**: Typed interfaces ensure data consistency between storage and application code

## Authentication and Authorization
The app uses API key-based authentication where users provide their own OpenAI API keys. These keys are stored locally in the browser and sent with each request to the AI service. No user accounts or server-side authentication are required.

**Key Design Decisions:**
- **API Key Model**: Users bring their own API keys, eliminating the need for user accounts and reducing operational costs
- **Client-Side Key Storage**: API keys are stored in localStorage with the understanding that users control their own credentials
- **No Server-Side Auth**: Simplifies architecture by avoiding session management and user databases

# External Dependencies

## AI Integration
- **OpenAI API**: Primary AI service for generating excuses using GPT-4o-mini model
- **Future Support**: Architecture designed to support Claude and Gemini APIs through provider selection

## UI and Styling
- **shadcn/ui**: Comprehensive React component library built on Radix UI primitives
- **Radix UI**: Accessible, unstyled UI primitives for complex components like dialogs, dropdowns, and form controls
- **Tailwind CSS**: Utility-first CSS framework with custom theme configuration
- **Lucide React**: Icon library providing consistent iconography throughout the app

## Development and Build Tools
- **Vite**: Fast build tool and development server with React plugin support
- **TypeScript**: Type safety across the entire application stack
- **Drizzle**: Database toolkit configured for PostgreSQL (currently unused but ready for future database integration)
- **ESBuild**: Fast JavaScript bundler for production builds

## Validation and Forms
- **Zod**: Schema validation library for runtime type checking and API request/response validation
- **React Hook Form**: Form state management with validation integration
- **@hookform/resolvers**: Bridges React Hook Form with Zod for seamless form validation

## HTTP and State Management
- **TanStack React Query**: Server state management with caching, background updates, and error handling
- **Native Fetch API**: HTTP client for API communications without additional dependencies