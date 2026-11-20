# Phase 6 & Phase 7 Codebase Guide: End-to-End Walkthrough

Welcome! This guide explains **everything we built and changed during Phase 6 and Phase 7** in plain, simple English.

If you are new to full-stack engineering, don't worry. We will avoid confusing jargon wherever possible, explain every concept before showing code, and focus with **extra detail on the Next.js frontend**.

---

## Table of Contents

1. [The Big Picture: What Did We Achieve?](#1-the-big-picture-what-did-we-achieve)
2. [Frontend Deep-Dive (Next.js 16, React 19, Clerk)](#2-frontend-deep-dive)
   - [File 1: `.env.local` (Configuration)](#file-1-envlocal)
   - [File 2: `src/lib/api/client.ts` (Universal API Fetcher &amp; Token Injector)](#file-2-srclibapiclientts)
   - [File 3: `src/services/projects/project.service.ts` (Replacing Fake Data with Real API Calls)](#file-3-srcservicesprojectsprojectservicets)
   - [File 4: `src/features/projects/components/create-project-form.tsx` (The UI Form &amp; Real Submission)](#file-4-srcfeaturesprojectscomponentscreate-project-formtsx)
   - [File 5: `src/middleware.ts` (Edge-Level Security &amp; Routing)](#file-5-srcmiddlewarets)
   - [File 6: `src/app/sign-in` &amp; `sign-up` Pages (Prerender-Safe Auth Pages)](#file-6-sign-in-and-sign-up-pages)
   - [File 7: `src/app/(dashboard)/layout.tsx` (Dashboard Shell)](#file-7-srcappdashboardlayouttsx)
   - [File 8: `eslint.config.mjs` (Linter Isolation)](#file-8-eslintconfigmjs)
3. [Backend Deep-Dive (Express, PostgreSQL, Clerk Auth)](#3-backend-deep-dive)
   - [File 9: `002_update_projects_add_fields.sql` (Database Migration)](#file-9-002_update_projects_add_fieldssql)
   - [File 10: `src/config/env.ts` &amp; `.env` (Clerk Configuration)](#file-10-srcconfigenvts--env)
   - [File 11: `src/utils/project.paths.ts` (Centralized Paths)](#file-11-srcutilsprojectpathsts)
   - [File 12: `src/modules/projects/project.repository.ts` (Database Queries)](#file-12-srcmodulesprojectsprojectrepositoryts)
   - [File 13: `src/middleware/auth.ts` (AuthN vs AuthZ, 401 vs 403)](#file-13-srcmiddlewareauthts)
   - [File 14: `src/routes/project.routes.ts` (Project Endpoints &amp; Ownership Guards)](#file-14-srcroutesprojectroutests)
   - [File 15: `src/app.ts` (Mounting Global Middleware)](#file-15-srcappts)
   - [File 16: `tests/project.routes.test.ts` &amp; `tests/auth.test.ts` (Test Suites)](#file-16-tests)
4. [Step-by-Step Life of a Request](#4-step-by-step-life-of-a-request)
5. [Summary of Important Status Codes](#5-summary-of-important-status-codes)

---

## 1. The Big Picture: What Did We Achieve?

Before Phase 6:

- The **Frontend** was displaying **fake dummy projects** from a hardcoded JSON file (`mocks/fixtures/projects.json`).
- If you clicked "Create Project", it simply pushed a fake object into an in-memory array that disappeared when the browser refreshed.
- The **Express backend** had a database table (`app.projects`), but there was no way for the frontend to talk to it or create projects in it.
- There was **no authentication** on the backend: anyone could claim to be any user by sending a fake header.

After Phase 6 and 7:

1. **Real Persistence (Phase 6):** When you fill out the "Create Project" form on the frontend, it sends a real HTTP `POST` request to Express, which saves the project permanently into your **Neon PostgreSQL database**!
2. **Real Security & Identity (Phase 7):** Express now **verifies your Clerk login token**.
   - If an unauthenticated person tries to create a project ➔ Express rejects them with **`401 Unauthorized`**.
   - If User A creates a project and User B tries to delete it ➔ Express rejects User B with **`403 Forbidden`** ("You do not own this project").
   - If User A deletes their own project ➔ Express allows it with **`200 OK`**.

---

## 2. Frontend Deep-Dive

Let's examine every frontend file that was changed, what it does, and why each line matters.

---

### File 1: `.env.local`

**Location:** `c:\Users\misal\OneDrive\Documents\MockPrep\.env.local`

#### What changed?

We added one line at the bottom:

```env
# Express API base URL (used by project service to call backend)
NEXT_PUBLIC_EXPRESS_API_URL=http://localhost:4000
```

#### Why is this needed?

1. In Next.js, any environment variable starting with `NEXT_PUBLIC_` is **exposed to the browser bundle**. Variables without this prefix stay private to the server.
2. The frontend runs in your browser at `http://localhost:3000`. It needs to know where the Express backend lives (`http://localhost:4000`) so it knows where to send network requests.

---

### File 2: `src/lib/api/client.ts`

**Location:** `c:\Users\misal\OneDrive\Documents\MockPrep\src\lib\api\client.ts`

This is the **heart of all network communication** from the frontend. It is a reusable wrapper around the browser's native `fetch()` function.

#### Complete Code Explained Line-by-Line:

```typescript
import { HttpError, AppError } from "./errors"

// 1. Read the backend address from the environment variable we added in File 1.
// If it's missing for some reason, fallback safely to port 4000.
const API_BASE_URL =
  process.env.NEXT_PUBLIC_EXPRESS_API_URL || "http://localhost:4000"

// 2. Extend standard RequestInit options to allow URL query params and an optional auth token.
interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>
  token?: string
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, headers, token, ...rest } = options

  // 3. Resolve the full URL:
  // If the caller passes "/api/v1/projects", prepend "http://localhost:4000".
  // If the caller passes a full URL like "https://example.com/api", leave it as-is.
  let url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`

  // 4. If query parameters were provided (e.g. ?limit=10&page=1), append them cleanly.
  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value))
      }
    })
    const queryString = searchParams.toString()
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString
    }
  }

  // 5. AUTOMATIC CLERK TOKEN INJECTION (Phase 7):
  // When running inside the browser, Clerk mounts its SDK globally on `window.Clerk`.
  // If the user is currently signed in, Clerk has an active session.
  // We ask Clerk: "Please give me the fresh cryptographic JWT session token for this user."
  let authToken = token
  if (!authToken && typeof window !== "undefined") {
    try {
      const clerk = (
        window as unknown as {
          Clerk?: { session?: { getToken: () => Promise<string | null> } }
        }
      ).Clerk
      if (clerk?.session) {
        const sessionToken = await clerk.session.getToken()
        if (sessionToken) {
          authToken = sessionToken
        }
      }
    } catch {
      // If Clerk is still loading, don't crash — let the request continue.
    }
  }

  // 6. If we have a token, build the standard HTTP Authorization header:
  // "Authorization: Bearer eyJhbGciOiJSUzI1NiIs..."
  const authHeader: Record<string, string> = {}
  if (authToken) {
    authHeader["Authorization"] = `Bearer ${authToken}`
  }

  // 7. Execute the real HTTP request using native fetch:
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...authHeader, // Injects our Clerk Bearer token!
        ...headers,
      },
      ...rest,
    })

    // 8. If the server returned an error (4xx or 5xx), parse it and throw a typed HttpError:
    if (!response.ok) {
      let errorData: unknown
      try {
        errorData = await response.json()
      } catch {
        errorData = null
      }
      throw new HttpError(
        response.status,
        `Request failed with status ${response.status}`,
        errorData
      )
    }

    // 9. If server returned HTTP 204 No Content (e.g., successful delete with no body):
    if (response.status === 204) {
      return undefined as T
    }

    // 10. Parse and return the JSON response:
    return (await response.json()) as T
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }
    throw new AppError(
      error instanceof Error ? error.message : "Network error occurred",
      "NETWORK_ERROR"
    )
  }
}
```

#### Why is this so powerful?

Now, **every single frontend API request** automatically attaches the user's Clerk token. You don't have to write token logic inside your forms, buttons, or pages!

---

### File 3: `src/services/projects/project.service.ts`

**Location:** `c:\Users\misal\OneDrive\Documents\MockPrep\src\services\projects\project.service.ts`

#### What was it before?

It imported an array from `mocks/fixtures/projects.json` and used a fake `delay(180ms)` to pretend it was talking to a server. When creating a project, it just pushed it into that temporary JavaScript array.

#### What is it now?

It makes **real network calls** using our `apiClient`:

```typescript
import { apiClient } from "@/lib/api/client"
import type {
  Project,
  ProjectFilters,
  CreateProjectDto,
} from "./project.types"

export const projectService = {
  /**
   * 1. GET ALL PROJECTS:
   * Calls Express: GET http://localhost:4000/api/v1/projects
   * Then applies client-side search, filtering by status/complexity, and sorting.
   */
  async listProjects(filters: ProjectFilters = {}): Promise<Project[]> {
    let results = await apiClient<Project[]>("/api/v1/projects")

    // Search filter (name, description, tags)
    if (filters.search) {
      const q = filters.search.toLowerCase()
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      )
    }

    // Status filter (e.g., 'ready', 'draft')
    if (filters.status && filters.status !== "all") {
      results = results.filter((p) => p.status === filters.status)
    }

    // Complexity filter ('beginner', 'intermediate', 'advanced')
    if (filters.complexity && filters.complexity !== "all") {
      results = results.filter((p) => p.complexity === filters.complexity)
    }

    // Sort order (by updatedAt, createdAt, or name)
    const sortBy = filters.sortBy ?? "updatedAt"
    const order = filters.sortOrder ?? "desc"

    results.sort((a, b) => {
      let comparison = 0
      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name)
      } else if (sortBy === "createdAt") {
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else {
        comparison =
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      }
      return order === "desc" ? -comparison : comparison
    })

    return results
  },

  /**
   * 2. GET A SINGLE PROJECT BY ID:
   * Calls Express: GET http://localhost:4000/api/v1/projects/:id
   */
  async getProjectById(id: string): Promise<Project | null> {
    try {
      return await apiClient<Project>(`/api/v1/projects/${encodeURIComponent(id)}`)
    } catch {
      // If Express returns 404 Not Found, return null so UI displays "Not Found"
      return null
    }
  },

  /**
   * 3. CREATE A NEW PROJECT:
   * Calls Express: POST http://localhost:4000/api/v1/projects
   * Express inserts it into PostgreSQL and returns the freshly created project!
   */
  async createProject(dto: CreateProjectDto): Promise<Project> {
    return apiClient<Project>("/api/v1/projects", {
      method: "POST",
      body: JSON.stringify(dto),
    })
  },

  /**
   * 4. DELETE A PROJECT:
   * Calls Express: DELETE http://localhost:4000/api/v1/projects/:id
   */
  async deleteProject(id: string): Promise<boolean> {
    try {
      await apiClient<{ message: string }>(
        `/api/v1/projects/${encodeURIComponent(id)}`,
        { method: "DELETE" }
      )
      return true
    } catch {
      return false
    }
  },
}
```

---

### File 4: `src/features/projects/components/create-project-form.tsx`

**Location:** `c:\Users\misal\OneDrive\Documents\MockPrep\src\features\projects\components\create-project-form.tsx`

This component renders the UI form where the user types the project name, description, category, and technologies.

#### What was simplified?

Previously, the form had a long fake animation:
`submitting` ➔ wait 600ms ➔ `queued` ➔ wait 800ms ➔ `generating` ➔ wait 600ms ➔ `validating` ➔ wait 500ms ➔ `ready`.

Because we now have a **real database**, fake timers are removed. Now:

1. User clicks **"Create Project"**.
2. React Hook Form validates the inputs (using Zod schema: min 3 chars name, min 10 chars description).
3. TanStack Query's `mutateAsync` sends the real data to Express.
4. As soon as PostgreSQL confirms the insert, we immediately navigate the user to their new project page: `router.push(/projects/${project.id})`.
5. If anything goes wrong (e.g. server error or network issue), we display an inline red error banner.

```typescript
const onSubmit = async (data: CreateProjectInput) => {
  try {
    setErrorMessage(null)

    // Convert comma-separated string "React, TypeScript" into an array ["React", "TypeScript"]
    const tagList = data.tags
      ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [data.category]

    // Send to Express backend:
    const project = await createMutation.mutateAsync({
      name: data.name,
      description: data.description,
      category: data.category,
      frontendTech: data.frontendTech,
      backendTech: data.backendTech,
      database: data.database,
      complexity: data.complexity,
      generationNotes: data.generationNotes,
      tags: tagList,
    })

    // Instant redirect to the new project detail view!
    router.push(`/projects/${project.id}`)
  } catch (error) {
    setErrorMessage(
      error instanceof Error ? error.message : "Failed to create project. Please try again."
    )
  }
}
```

---

### File 5: `src/middleware.ts`

**Location:** `c:\Users\misal\OneDrive\Documents\MockPrep\src\middleware.ts`

Next.js has an "Edge Middleware" layer that executes **before a request even reaches any page or component**.

#### Why did we touch this?

During `next build`, Next.js 16 uses **Partial Prerendering (PPR)** to pre-compile your static pages into HTML.
If a page component calls `await auth()` directly during build time, Next.js crashes with:

> `Route /sign-in: Next.js encountered uncached or runtime data during prerendering.`

The standard Clerk architecture is to put your authentication guards **in the middleware**:

```typescript
import { NextResponse } from "next/server"
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

// 1. Define public routes that anyone can visit without logging in:
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/join(.*)",
  "/api/webhooks(.*)",
])

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth()

  // 2. If the user is ALREADY logged in and visits "/sign-in" or "/sign-up",
  // don't show them the sign-in box! Redirect them straight to "/dashboard".
  if (
    userId &&
    (request.nextUrl.pathname.startsWith("/sign-in") ||
      request.nextUrl.pathname.startsWith("/sign-up"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // 3. If the route is private (like /dashboard, /projects), protect it.
  // If not logged in, Clerk automatically redirects to /sign-in.
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Run middleware on all application pages, but skip static assets (images, fonts, css)
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
```

---

### File 6: Sign-In and Sign-Up Pages

**Locations:**

- `src/app/sign-in/[[...sign-in]]/page.tsx`
- `src/app/sign-up/[[...sign-up]]/page.tsx`

Because `src/middleware.ts` already handles redirecting signed-in users to `/dashboard`, the sign-in and sign-up pages become **pure, static UI components**:

- Removed the conflicting `await auth()` call from inside the page.
- Wrapped `<SignIn />` and `<SignUp />` in `<Suspense fallback={<Skeleton />}>` so Next.js Partial Prerendering builds them smoothly in 3 seconds!

---

### File 7: `src/app/(dashboard)/layout.tsx`

**Location:** `c:\Users\misal\OneDrive\Documents\MockPrep\src\app\(dashboard)\layout.tsx`

The layout that wraps all dashboard pages (Sidebar + Header + Content Area):

- Cleaned up duplicate `await auth.protect()` calls.
- Middleware already blocks unauthenticated users before they even reach this layout, so the layout renders instantly without extra overhead.

---

### File 8: `eslint.config.mjs`

**Location:** `c:\Users\misal\OneDrive\Documents\MockPrep\eslint.config.mjs`

Added `MockPrep_Express/**` and `MockPrep_FastAPI/**` to ESLint's `globalIgnores`:

```javascript
globalIgnores([
  ".next/**",
  "out/**",
  "build/**",
  "next-env.d.ts",
  "MockPrep_Express/**", // <-- Added
  "MockPrep_FastAPI/**", // <-- Added
])
```

Why? In a monorepo, the root `npm run lint` command is for the Next.js React frontend. Express and FastAPI have their own separate linters and test suites. We don't want Next.js complaining about Express's backend files!

---

## 3. Backend Deep-Dive

Now let's review the backend files in `MockPrep_Express/`.

---

### File 9: `002_update_projects_add_fields.sql`

**Location:** `MockPrep_Express/src/database/migrations/002_update_projects_add_fields.sql`

In Phase 5, the `app.projects` table only had: `id`, `name`, `description`, `difficulty`, `tech_stack`, `created_by`, `created_at`, `updated_at`.
The frontend, however, collects richer data (like `category`, `frontend_tech`, `backend_tech`, `database_tech`, `tags`, and `status`).

We wrote this migration:

```sql
ALTER TABLE app.projects ADD COLUMN IF NOT EXISTS category VARCHAR(128);
ALTER TABLE app.projects ADD COLUMN IF NOT EXISTS frontend_tech VARCHAR(255);
ALTER TABLE app.projects ADD COLUMN IF NOT EXISTS backend_tech VARCHAR(255);
ALTER TABLE app.projects ADD COLUMN IF NOT EXISTS database_tech VARCHAR(255);
ALTER TABLE app.projects ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE app.projects ADD COLUMN IF NOT EXISTS status VARCHAR(32) NOT NULL DEFAULT 'draft';

-- Align difficulty terminology to match frontend ("beginner", "intermediate", "advanced")
ALTER TABLE app.projects ALTER COLUMN difficulty SET DEFAULT 'intermediate';
UPDATE app.projects SET difficulty = 'beginner'     WHERE difficulty = 'easy';
UPDATE app.projects SET difficulty = 'intermediate'  WHERE difficulty = 'medium';
UPDATE app.projects SET difficulty = 'advanced'      WHERE difficulty = 'hard';
```

When executed via `npm run migrate:app`, PostgreSQL adds these columns safely without deleting any existing data.

---

### File 10: `src/config/env.ts` & `.env`

**Locations:**

- `MockPrep_Express/src/config/env.ts`
- `MockPrep_Express/.env`

We added Clerk credentials so Express can communicate with Clerk:

```typescript
CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY || "",
CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY || "",
```

---

### File 11: `src/utils/project.paths.ts`

**Location:** `MockPrep_Express/src/utils/project.paths.ts`

Rule from our architecture guidelines: **Never hardcode endpoint URLs as raw strings** in routes, apps, or tests.

```typescript
export const PROJECT_PATHS = {
  BASE: "/api/v1/projects",
  BY_ID: "/:projectId",
  full: {
    list: "/api/v1/projects",
    create: "/api/v1/projects",
    byId: (projectId: string) => `/api/v1/projects/${encodeURIComponent(projectId)}`,
  },
} as const
```

---

### File 12: `src/modules/projects/project.repository.ts`

**Location:** `MockPrep_Express/src/modules/projects/project.repository.ts`

This file handles **pure SQL execution** using parameterized queries (`$1, $2, ...`) to prevent SQL Injection attacks.

```typescript
export async function createProject(input: CreateProjectInput): Promise<ProjectRow> {
  const sql = `
    INSERT INTO app.projects (
      id, name, description, difficulty, category,
      frontend_tech, backend_tech, database_tech,
      tech_stack, tags, status, repository_url, created_by
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING *;
  `
  // ... parameter bindings ...
  const result = await query<ProjectRow>(sql, params)
  return result.rows[0]
}
```

---

### File 13: `src/middleware/auth.ts`

**Location:** `MockPrep_Express/src/middleware/auth.ts`

This is the **security powerhouse** of Phase 7. It implements two distinct concepts:

#### 1. Authentication (`requireAuth` ➔ 401 Unauthorized)

> *"Who are you? Do you have a valid ticket?"*

```typescript
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const userId = getAuthenticatedUser(req)

  // If no user ID was resolved from Clerk's JWT, reject immediately!
  if (!userId) {
    next(
      createAppError(
        "Authentication required: missing, expired, or invalid session token",
        401
      )
    )
    return
  }

  // Save the verified user ID so our route handlers can use it
  res.locals.userId = userId
  next()
}
```

#### 2. Resource Authorization (`assertProjectOwner` ➔ 403 Forbidden)

> *"We know who you are, but do you have permission to touch THIS specific project?"*

```typescript
export function assertProjectOwner(projectOwnerId: string, currentUserId: string): void {
  if (projectOwnerId !== currentUserId) {
    throw createAppError(
      "Forbidden: You do not have permission to modify or delete this project",
      403
    )
  }
}
```

#### 3. Test Mode Safe Bypass

When Vitest runs automated integration tests (`NODE_ENV === "test"`), it cannot make live network calls to Clerk servers. We allow tests to pass `x-test-user-id` to simulate any user identity in milliseconds without network calls.

---

### File 14: `src/routes/project.routes.ts`

**Location:** `MockPrep_Express/src/routes/project.routes.ts`

Defines the 4 HTTP endpoints:

1. **`POST /api/v1/projects` (Create)**:

   - Uses `requireAuth` middleware.
   - Validates request body (name >= 3 chars, description >= 10 chars, valid complexity).
   - Generates a UUID for the new project.
   - Sets `created_by = res.locals.userId` (the verified Clerk user ID).
   - Calls `toProjectResponse()` to convert PostgreSQL snake_case columns (`frontend_tech`) into camelCase JSON (`frontendTech`).
   - Returns **`201 Created`**.
2. **`GET /api/v1/projects` (List)**:

   - Supports pagination: `?limit=50&offset=0`.
   - Returns array of projects sorted newest-first.
3. **`GET /api/v1/projects/:projectId` (Get One)**:

   - Finds project by ID in database. If not found, returns **`404 Not Found`**.
4. **`DELETE /api/v1/projects/:projectId` (Delete)**:

   - Uses `requireAuth` middleware.
   - Finds the project.
   - Calls `assertProjectOwner(project.created_by, res.locals.userId)`:
     - If the logged-in user is NOT the creator ➔ returns **`403 Forbidden`**!
     - If the logged-in user IS the creator ➔ deletes the row and returns **`200 OK`**.

---

### File 15: `src/app.ts`

**Location:** `MockPrep_Express/src/app.ts`

Mounts the `@clerk/express` global middleware:

```typescript
app.use(
  clerkMiddleware({
    publishableKey: env.CLERK_PUBLISHABLE_KEY,
    secretKey: env.CLERK_SECRET_KEY,
  })
)
```

Every incoming HTTP request passes through `clerkMiddleware()`, which inspects the `Authorization: Bearer <token>` header, verifies the cryptographic signature, and extracts the user claims.

---

### File 16: Tests

**Locations:**

- `MockPrep_Express/tests/project.routes.test.ts` (10 tests)
- `MockPrep_Express/tests/auth.test.ts` (3 tests)

Total Express tests: **24/24 passing!**

- Confirms 401 when creating without a token.
- Confirms 401 when deleting without a token.
- Confirms 403 when User B tries to delete User A's project.
- Confirms 200 when User A deletes their own project.
- Confirms 400 when name/description are invalid.
- Confirms 404 when querying or deleting non-existent IDs.

---

## 4. Step-by-Step Life of a Request

Here is what happens behind the scenes from the moment you click **"Create Project"**:

```text
[ Browser / Next.js ]
  1. User fills out form and clicks "Create Project".
  2. Zod validates the form inputs locally in the browser.
  3. React Hook Form triggers the onSubmit handler.
  4. apiClient() asks Clerk for the active user's session token:
     token = await window.Clerk.session.getToken()
  5. apiClient() sends HTTP POST request:
     Headers:
       Authorization: Bearer eyJhbGci...
       Content-Type: application/json
     Body: { "name": "Payment Gateway", "description": "...", ... }

[ Express Backend (:4000) ]
  6. Request hits Express app.ts.
  7. clerkMiddleware() checks the token signature using Clerk's public keys.
     -> Verified! User is "user_2t1abc...".
  8. Request reaches projectRouter.post("/", requireAuth, ...).
  9. requireAuth confirms user is logged in and sets res.locals.userId = "user_2t1abc...".
  10. Handler validates data lengths and complexity enum.
  11. Handler generates UUID: "c794303d-82d2-...".
  12. project.repository.ts executes parameterized SQL:
      INSERT INTO app.projects (id, name, created_by, ...)
      VALUES ('c794303d...', 'Payment Gateway', 'user_2t1abc...', ...)
      RETURNING *;

[ Neon PostgreSQL Cloud DB ]
  13. Database writes the row to app.projects and returns the full row with timestamps.

[ Express Backend (:4000) ]
  14. toProjectResponse() converts database snake_case to frontend camelCase.
  15. Express returns HTTP 201 Created with the full project JSON.

[ Browser / Next.js ]
  16. TanStack Query receives the created project object and invalidates the "projects" cache.
  17. Next.js router executes: router.push("/projects/c794303d-82d2-...")
  18. The browser smoothly opens the Project Detail view for your brand new project!
```

---

## 5. Summary of Important Status Codes

| Code          | Name                  | Meaning in Plain English                                                   |
| ------------- | --------------------- | -------------------------------------------------------------------------- |
| **200** | OK                    | The request succeeded (e.g. project retrieved or deleted).                 |
| **201** | Created               | A new resource was successfully created in the database.                   |
| **400** | Bad Request           | The data sent by the client was invalid (e.g. project name too short).     |
| **401** | Unauthorized          | Authentication failed: you are not logged in or your session expired.      |
| **403** | Forbidden             | Authorization failed: we know who you are, but you don't own this project. |
| **404** | Not Found             | The project with this ID does not exist in the database.                   |
| **500** | Internal Server Error | Something crashed on the server (e.g. database connection down).           |
