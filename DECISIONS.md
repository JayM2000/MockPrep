# Architecture Decisions

## ADR-001: Next.js 16 App Router with React 19 and Tailwind CSS v4
- **Date:** 2026-11-04
- **Status:** Accepted
- **Context:** Project requires high performance, minimal client bundle footprint, standard Server Components, and clean token-based theming.
- **Decision:** Scaffolded Next.js 16 App Router with React 19, Turbopack, and Tailwind CSS v4. Used shadcn/ui with `@base-ui/react` primitives (`base-nova` preset), providing native React 19 compatibility without deprecated peer dependency overrides.
- **Alternatives Considered:**
  - Next.js Pages router (rejected: lacks Server Components and modern nested layout features).
  - Radix UI classic (has React 19 peer-dependency friction in newest scaffolds; `@base-ui/react` is the modern shadcn recommendation).
- **Consequences:** Clean compilation, fast Turbopack builds, robust styling through CSS theme tokens.

## ADR-002: Semantic Theming with Restrained Purple Accent
- **Date:** 2026-11-04
- **Status:** Accepted
- **Context:** Brief mandates Light, Dark, and Purple themes. The UI principle states no animations, no gradients, no glassmorphism, and that purple should primarily alter accent tokens rather than saturate the entire surface.
- **Decision:** Implemented `light`, `dark`, and `purple` via CSS custom properties in `globals.css` with `next-themes`. Purple theme maintains high-contrast neutral cards and backgrounds while applying disciplined oklch purple tokens to `primary`, `accent`, and `ring`.
- **Alternatives Considered:**
  - Fully purple tinted backgrounds (rejected: hurts readability and violates the brief).
- **Consequences:** Consistent contrast, fast switching, zero flash on hydration (`disableTransitionOnChange`).

## ADR-003: State Management Partitioning
- **Date:** 2026-11-04
- **Status:** Accepted
- **Context:** Need predictable remote data fetching, caching, and clear state boundaries without duplicating server data in client stores.
- **Decision:** Use `@tanstack/react-query` for all server/remote state. Local interactive state (modals, dropdowns) stays in React component state. URL search parameters handle pagination, filters, and sorting. Redux is intentionally omitted until a justified requirement emerges.
- **Alternatives Considered:**
  - Redux Toolkit by default (rejected per brief Section 5: Redux should only be added if a complex cross-feature client-state requirement is demonstrated).
- **Consequences:** Lightweight client bundle, no duplicate state synchronization bugs.

## ADR-004: Next.js 16 Partial Prerendering Boundaries & Dynamic Route Params
- **Date:** 2026-11-04
- **Status:** Accepted
- **Context:** Next.js 16 enforces strict Partial Prerendering (PPR). Accessing runtime values such as `usePathname()`, `searchParams`, or un-awaited route `params` outside of a `<Suspense>` boundary triggers prerender errors.
- **Decision:**
  1. Wrap all navigation items that access `usePathname()` (`SidebarNav`, `Breadcrumbs`) inside `<Suspense>` boundaries with lightweight neutral fallbacks.
  2. Implement dynamic page routes (`/projects/[projectId]`, `/join/[inviteCode]`) as Server Components that render a `<Suspense>` boundary wrapping an inner async component that awaits `params`.
  3. Drive listing filters from URL search params via `useSearchParams()` with key-driven form state reset instead of `useEffect` setState cascading loops.
- **Alternatives Considered:**
  - `export const dynamic = "force-dynamic"` (rejected: disables static HTML caching for shared layout chrome).
  - Synchronizing filter state in `useEffect` (rejected: triggers React 19 / ESLint `react-hooks/set-state-in-effect` errors).
- **Consequences:** Deterministic static prerendering, instant shell navigation, zero render cascading warnings.
