# Project Context — AI Project Platform

## 1. Overview & Current Architecture
- **Purpose:** AI-powered real-world engineering project and interview simulation platform.
- **Current Milestone:** Milestone 1 (Authentication & Shell) completed. Next up: Milestone 2 (Dashboard & Projects).
- **Core Principles:** Functional clarity, performance, maintainability. No visual clutter, no motion/animation effects, no gradients or glassmorphism.

## 2. Technology Stack & Versions
- **Framework:** Next.js 16.4.5 (App Router, Turbopack)
- **Language:** TypeScript 5
- **Runtime:** React 19.3.0
- **Authentication:** Clerk (`@clerk/nextjs` 7.9.24) with `clerkMiddleware` route protection
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
  middleware.ts              # Clerk route protection (protects all non-public routes)
  app/
    layout.tsx               # Root layout with ClerkProvider, font definitions, and AppProviders
    globals.css              # Tailwind v4 semantic theme variables (light, dark, purple)
    page.tsx                 # Clean orchestrator for landing page (under 25 lines)
    (dashboard)/             # Authenticated shell route group
      layout.tsx             # Dashboard shell layout (Sidebar + Header + Main container)
      dashboard/page.tsx     # Overview dashboard metrics & recent lists
      projects/page.tsx      # Projects overview shell
      sessions/page.tsx      # Sessions overview shell
      settings/page.tsx      # Platform settings shell
    sign-in/[[...sign-in]]/  # Clerk sign-in flow (Suspense-wrapped)
    sign-up/[[...sign-up]]/  # Clerk sign-up flow (Suspense-wrapped)
    join/
      page.tsx               # Manual invitation code redemption shell
      [inviteCode]/page.tsx  # Dynamic invitation validation shell (Suspense-wrapped)
  components/
    ui/                      # Standard shadcn primitives (button, dropdown-menu, card, badge, separator, sheet)
    providers/               # ThemeProvider, QueryProvider, and AppProviders
    shared/                  # Shared components (ThemeToggle, BrandLogo)
    layout/                  # Shell components
      public-header.tsx      # Public landing header
      public-footer.tsx      # Public landing footer
      sidebar/               # AppSidebar, SidebarNav, SidebarItem, MobileSidebar
      header/                # AppHeader, Breadcrumbs, UserMenu
    projects/                # Project UI components
    challenges/              # Challenge UI components
    sessions/                # Session & workspace UI components
  config/
    navigation.ts            # Centralized dashboard navigation definitions & icons
  features/                  # Domain feature logic & presentation
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

## 4. Authentication & Route Protection (Milestone 1)
- **Public Routes:** `/`, `/sign-in(.*)`, `/sign-up(.*)`, `/join(.*)`, `/api/webhooks(.*)`.
- **Protected Routes:** All routes under `/(dashboard)` (`/dashboard`, `/projects`, `/sessions`, `/settings`).
- **Middleware:** `src/middleware.ts` executes `clerkMiddleware` and enforces `auth.protect()` for all protected routes.
- **Header User Menu:** Renders `<UserButton />` when authenticated and a "Sign In" link when unauthenticated.
- **Shell:** Desktop responsive sidebar + mobile accessible sheet drawer with dynamic breadcrumbs.

## 5. Next Steps
- Milestone 2: Dashboard & Projects.
  - Implement typed mock project services in `src/services/projects/`.
  - Wire up TanStack Query hooks for project listings and details.
  - Build project list filters, search, sorting, and project card components.
  - Build create-project modal/form with Zod validation.
