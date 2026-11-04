# Project Context — AI Project Platform

## 1. Overview & Current Architecture
- **Purpose:** AI-powered real-world engineering project and interview simulation platform.
- **Current Milestone:** Milestone 0 (Repository Audit & Foundation) completed. Next up: Milestone 1 (Authentication & Shell).
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

## 3. Directory Layout
```text
src/
  app/
    layout.tsx               # Root layout with font definitions and AppProviders
    globals.css              # Tailwind v4 semantic theme variables (light, dark, purple)
    page.tsx                 # Public landing page with theme toggle & feature highlights
  components/
    ui/                      # shadcn primitives (button, dropdown-menu, card, badge, separator)
    providers/               # ThemeProvider, QueryProvider, and AppProviders
    shared/                  # Shared components (ThemeToggle)
    layout/                  # App shell, navigation, sidebar, headers
    projects/                # Project domain components
    challenges/              # Challenge domain components
    sessions/                # Session & workspace domain components
  features/                  # Domain feature logic, schemas, and state
  hooks/                     # Custom React hooks
  lib/
    utils.ts                 # Utility helpers (cn)
    api/                     # API client boundaries
    auth/                    # Auth helpers & Clerk wrappers
    query/                   # Centralized TanStack Query keys & client config
    validation/              # Zod validation schemas
  services/                  # Typed services for projects, challenges, and sessions
  types/                     # Domain TypeScript contracts
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
