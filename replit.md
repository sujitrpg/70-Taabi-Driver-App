# Taabi Drive+ - Driver Companion App

## Overview

Taabi Drive+ is a mobile-first driver companion application for the trucking and logistics industry. The app combines driver performance analytics, gamification mechanics, route optimization, and community features to empower truck drivers with tools for safer, smarter, and more rewarding driving experiences.

The application uses a modern web stack designed to deliver a native mobile-like experience through responsive design principles, focusing on driver-centric interactions with features like performance scorecards, reward systems, nearby essentials discovery, and social community engagement.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling**
- React with TypeScript for type-safe component development
- Vite as the build tool and development server with HMR support
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and API caching

**UI Component System**
- Shadcn/ui component library with Radix UI primitives for accessible, composable components
- Tailwind CSS for utility-first styling with custom design tokens
- Custom color system centered around Taabi Blue (#0072CE) primary brand color and lime green (#84CC16) for gamification elements
- Mobile-first responsive design with bottom navigation pattern

**Design Philosophy**
- Driver-first mobile experience with large touch targets (minimum 48px)
- High contrast for sunlight readability
- Bottom navigation for thumb-friendly access
- Gamification-inspired UI drawing from Duolingo's reward system and Strava's performance tracking
- Card-based layout with consistent spacing using Tailwind's spacing scale

### Backend Architecture

**Server Framework**
- Express.js REST API server
- Custom middleware for request/response logging and JSON body parsing
- Session-based approach with raw body capture for webhook verification

**API Structure**
- RESTful endpoints organized by domain:
  - `/api/auth/*` - Authentication (login, OTP verification)
  - `/api/drivers/*` - Driver profiles and management
  - `/api/trips/*` - Trip tracking and completion
  - `/api/scorecards/*` - Performance analytics
  - `/api/badges/*` - Achievement system
  - `/api/vouchers/*` - Rewards and redemptions
  - `/api/nearby/*` - Location-based services
  - `/api/community/*` - Social features and posts
  - `/api/routes/*` - Route planning and optimization

**Storage Layer**
- Abstract storage interface (`IStorage`) for flexible data persistence
- In-memory storage implementation for development/demo
- Designed for easy migration to database-backed storage
- Schema defined using Drizzle ORM with PostgreSQL dialect

### Data Models & Schema

**Core Entities**
- **Drivers**: User profiles with gamification stats (points, streaks, level progression)
- **Trips**: Journey records with performance metrics (fuel efficiency, harsh braking, route adherence, idle time)
- **Scorecards**: Daily/weekly performance analytics with A/B/C grading
- **Badges**: Achievement system with unlock conditions
- **Vouchers**: Reward redemption system (fuel, food, recharge categories)
- **Nearby Places**: Location-based services (dhabas, fuel stations, mechanics, parking)
- **Community Posts**: Social features with likes and engagement tracking
- **Routes**: Multi-waypoint route planning with optimization support

**Performance Metrics**
- Fuel efficiency percentage
- Harsh braking event count
- Route adherence percentage
- Idle time tracking
- Trip grade calculation (A/B/C based on composite scores)

### Authentication & Authorization

**Authentication Strategy**
- Phone number-based authentication flow
- OTP verification system (placeholder implementation for demo)
- JWT token approach with session management planned
- Firebase integration planned for OTP delivery and face ID storage

**Current Implementation**
- Simplified auth for demo purposes with auto-driver creation
- Hardcoded driver ID (`default-driver-1`) for development
- Designed for future enhancement with proper JWT/session security

### External Dependencies

**Planned Third-Party Integrations**
- Google Maps API for route optimization, ETA calculation, and nearby place discovery
- OpenWeather API for weather-based driving recommendations
- Firebase for authentication (OTP delivery, face ID biometric storage)
- Socket.IO for real-time driver tracking and community chat features

**Current External Services**
- Neon Database (PostgreSQL) configured via Drizzle ORM
- No active external API integrations in current implementation (placeholder for future development)

**UI Libraries & Frameworks**
- Radix UI primitives (accordion, dialog, dropdown, popover, toast, etc.)
- Embla Carousel for horizontal scrolling components
- Lucide React for consistent iconography
- date-fns for date formatting and manipulation
- React Hook Form with Zod for form validation

### Build & Deployment

**Development**
- TypeScript strict mode enabled
- Path aliases for clean imports (`@/`, `@shared/`, `@assets/`)
- Hot module replacement via Vite
- Replit-specific plugins for error overlay and dev tooling

**Production Build**
- Client: Vite builds React app to `dist/public`
- Server: esbuild bundles Express server to `dist/index.js`
- ESM module format throughout the codebase
- Environment variables for database connection

**Database Management**
- Drizzle Kit for schema migrations
- PostgreSQL via Neon serverless driver
- Connection pooling with `@neondatabase/serverless`