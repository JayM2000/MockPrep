# Project Context — AI Project Platform

## 1. Overview & Current Architecture
- **Purpose:** AI-powered real-world engineering project and interview simulation platform.
- **Current Milestone:** Milestone 0 (Repository Audit & Foundation) completed and hardened with modular architecture. Next up: Milestone 1 (Authentication & Shell).
- **Core Principles:** Functional clarity, performance, maintainability. No visual clutter, no motion/animation effects, no gradients or glassmorphism.

## 2. Technology Stack & Versions
- **Framework:** Next.js 16.4.5 (App Router, Turbopack)
- **Language:** TypeScript 5
- **Runtime:** React 19.3.0
- **Styling:** Tailwind CSS v4 with semantic tokens
- **UI Primitives:** shadcn/ui (`base-nova` preset powered by `@base-ui/react` and Lucide icons)
- **Theming:** `next-themes` (Light, Dark, and Purple theme tokens)
- **State Management:**
  - Remote/Server state: `@tanstack/react-query`
  - Local state: React component state
  - URL params: Filter, search, pagination
- **Code Graph / Knowledge Base:** Graphify (`graphify update .`)

## 3. Directory Layout & Architecture Boundaries
```text
src/
  app/
    layout.tsx               # Root layout with font definitions and AppProviders
    globals.css              # Tailwind v4 semantic theme variables (light, dark, purple)
    page.tsx                 # Clean orchestrator for landing page (under 25 lines)
  components/
    ui/                      # Standard shadcn primitives (button, dropdown-menu, card, badge, separator)
    providers/               # ThemeProvider, QueryProvider, and AppProviders
    shared/                  # Shared components (ThemeToggle, BrandLogo)
    layout/                  # Reusable layouts (PublicHeader, PublicFooter, AppSidebar, Header)
    projects/                # Project UI components
    challenges/              # Challenge UI components
    sessions/                # Session & workspace UI components
  features/                  # Domain feature logic, feature-specific components, schemas
    landing/                 # Landing page components (HeroSection, FeaturesGrid, FeatureCard)
    auth/                    # Auth feature components & guards
    dashboard/               # Dashboard views & metric cards
    projects/                # Project list, card, creation form
    challenges/              # Challenge forms & review view
    sessions/                # Session lifecycle & creator controls
  hooks/                     # Custom React hooks (useIsMounted, etc.)
  lib/
    constants/               # Immutable configurations (theme.ts, site.ts)
    utils.ts                 # Utility helpers (cn)
    api/                     # Centralized API client & custom error classes (client.ts, errors.ts)
    auth/                    # Auth helpers & Clerk wrappers
    query/                   # Query client singleton & type-safe query key factories
    validation/              # Zod validation schemas
  services/                  # Typed service contracts & boundaries
    projects/                # Project types and services
    challenges/              # Challenge types and services
    sessions/                # Session types and lifecycle services
  types/                     # Shared TypeScript domain contracts (common.types.ts, api.types.ts)
  mocks/
    fixtures/                # Seed mock data for local prototyping
```

## 4. Design & Theme System
- **Supported Themes:** `light`, `dark`, `purple`.
- **Purple Theme:** Restrained purple accent tokens (`oklch(0.48 0.16 285)`), preserving contrast and neutral background/foreground clarity.
- **Provider Boundary:** `src/components/providers/index.tsx` mounts `ThemeProvider` (with `attribute="class"` and `disableTransitionOnChange`) and `QueryProvider`.

## 5. Known Limitations & Next Steps
- Authentication (Clerk) is not yet wired up; landing page actions link to placeholder routes (`/sign-in`, `/sign-up`, `/dashboard`).
- Backend endpoints are not connected; typed services and mocks will be established in subsequent milestones.
- Next Task: Milestone 1 — Clerk authentication integration, protected route proxy/middleware, and authenticated application shell (sidebar, navigation, header, user menu).
