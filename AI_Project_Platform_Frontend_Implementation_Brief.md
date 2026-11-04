# AI Project Platform — Frontend Implementation Brief

**Purpose:** A reusable implementation specification for AI coding agents building the frontend of an AI-powered real-world project and interview simulation platform.

**Product principle:** Performance, maintainability and functional clarity come before visual decoration. Keep the UI simple. Do not add animations, motion effects, gradients, glassmorphism or decorative effects.

## 1. Instructions for every AI coding agent

Before changing code:

1. Read this document.
2. Inspect the repository's package manager, framework versions, scripts and existing conventions.
3. Read `PROJECT_CONTEXT.md` and the latest `IMPLEMENTATION_LOG.md` entry if present.
4. Use Graphify to understand the relevant code area.
5. Query only the components, routes and dependencies related to the current task.
6. Open the exact source files before editing. Graphify is an aid, not a replacement for source inspection.
7. Implement one milestone at a time.
8. Run relevant lint, type-check, tests and build commands.
9. Update the project context and implementation log.
10. Report changed files, validation results, limitations and next task.

Do not rewrite working code just to impose a preferred structure. Do not add dependencies without a demonstrated need. Do not invent backend APIs or claim mock behavior is real.

## 2. Graphify workflow — required

Graphify is a local code knowledge-graph tool that helps AI coding agents understand code relationships without repeatedly loading the entire repository into context.

Official documentation:
- https://www.graphiffy.com/docs
- https://www.graphiffy.com/docs/cli
- https://github.com/Graphify-Labs/graphify

First check whether Graphify is already installed and whether a graph exists. If it is missing, follow the current official setup instructions. The documented Python package is `graphifyy`; the executable is `graphify`.

Typical installation:
```bash
uv tool install graphifyy
graphify install
```

Build the graph using the assistant skill:
```text
/graphify .
```

Use scoped queries:
```bash
graphify query "How are the dashboard routes and layouts connected?" --budget 1200
graphify query "Where is Clerk authentication checked?" --budget 1200
graphify query "How does the project list fetch and cache data?" --budget 1200
graphify explain "ProjectCard"
graphify path "DashboardPage" "ProjectService"
```

After meaningful code changes, refresh incrementally:
```text
/graphify . --update
```

Rules:
- Prefer `query`, `explain` and `path` over reading the whole repository.
- Use returned file and line references to inspect only relevant source.
- Verify important behavior in source code; inferred graph edges are not proof.
- Do not paste the full graph report or graph JSON into model context for routine tasks.
- Do not rebuild the graph from scratch for every small change.
- If Graphify is unavailable, say so and use targeted file inspection. Do not pretend it ran.
- Check `.gitignore` and team policy before deciding whether generated `graphify-out/` artifacts belong in source control.

### Persistent project context

Maintain these root files:

**`PROJECT_CONTEXT.md`** — concise current architecture, conventions, implemented modules and entry points, data contracts, auth approach, known limitations, current milestone and next tasks. Do not duplicate this whole brief.

**`IMPLEMENTATION_LOG.md`** — append a short entry after each meaningful task:
```md
## YYYY-MM-DD — Task name
- Implemented:
- Files changed:
- Validation:
- Limitations:
- Next task:
```

**`DECISIONS.md`** — record important architecture decisions with context, alternatives, consequences, date and status (`proposed`, `accepted`, `superseded`).

At the start of each new AI session: read this brief, `PROJECT_CONTEXT.md`, the latest implementation log entry, query Graphify for the task area, then inspect only the relevant files.

## 3. Product understanding

The platform lets creators generate or import realistic software projects, introduce intentional engineering challenges, configure AI permissions and invite participants into temporary development sessions.

Creator workflow:
1. Describe a project or choose a template.
2. Generate/import a project.
3. Generate bugs, missing features, performance or security challenges.
4. Review and approve tasks and acceptance criteria.
5. Configure timer, AI permissions, collaboration and participants.
6. Publish and invite participants.
7. Start, pause, resume or end the session.
8. Review submissions and evaluation reports.

Participant workflow:
1. Join through a secure invitation.
2. Read the task and acceptance criteria.
3. Work in an isolated browser IDE.
4. Use AI only when allowed.
5. Run tests and view preview.
6. Submit work.
7. View permitted feedback/results.

The long-term platform uses ephemeral execution environments. Provision compute only when a creator starts a session. Save required artifacts and destroy execution resources when the session ends.

## 4. Scope of this frontend milestone

Build the frontend foundation and UI flows with typed mock services where backend APIs do not exist.

In scope:
- App shell, navigation and themes.
- Clerk authentication integration.
- Dashboard.
- Projects list, create and details.
- Challenge configuration and review.
- Session list, details and creator controls.
- Participant session workspace shell.
- Reports UI shell.
- Loading, empty, error and success states.
- Responsive behavior and accessibility.
- Typed service boundaries ready for real APIs.

Out of scope until explicitly planned:
- Actual AI project generation.
- Real bug injection.
- Running untrusted code.
- Cloud sandbox provisioning.
- Real terminal execution.
- Real-time collaborative editing.
- Hidden test execution and authoritative scoring.
- Billing and marketplace.

Mock behavior must be clearly separated from production services and must never be presented as a real cloud operation.

## 5. Preferred frontend technology

Confirm installed versions and current official compatibility before changing dependencies.

| Area | Preferred choice |
|---|---|
| Framework | Next.js App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI primitives | shadcn/ui |
| Icons | Lucide |
| Authentication | Clerk for Next.js |
| Server state | TanStack Query |
| Local UI state | React state |
| Complex global client state | Redux Toolkit only if justified |
| Theme | next-themes or supported equivalent |
| Forms | React Hook Form + Zod where useful |
| Testing | Vitest/Jest, Testing Library, Playwright |

### State management rules

- TanStack Query owns remote/server state.
- React component state owns local UI state such as dialogs, tabs and temporary form values.
- URL search parameters own shareable filters, search, sort and pagination.
- Do not add Redux by default.
- Use Redux Toolkit only for a demonstrated complex cross-feature client-state requirement.
- Never duplicate the same API response in Redux and TanStack Query.

### Next.js rules

- Prefer Server Components.
- Add `"use client"` only at the smallest interactive component boundary.
- Do not mark whole route trees as client components unnecessarily.
- Keep server-only code out of client bundles.
- Use route groups where useful.
- Use dynamic imports for heavy client-only features such as Monaco Editor.
- Do not load the code editor on dashboard routes.
- Use loading/error boundaries where appropriate.
- Avoid duplicate fetching between Server Components and TanStack Query.
- Use `next/image` for appropriate image assets.

## 6. Suggested project structure

Adapt to the repository rather than forcing a rewrite.

```text
src/
  app/
    (public)/
      page.tsx
      sign-in/
      sign-up/
    (dashboard)/
      layout.tsx
      dashboard/
      projects/
        page.tsx
        new/
        [projectId]/
      sessions/
        page.tsx
        [sessionId]/
      settings/
    join/
      [inviteCode]/
  components/
    ui/
    layout/
    shared/
    projects/
    challenges/
    sessions/
  features/
    auth/
    dashboard/
    projects/
    challenges/
    sessions/
    participants/
    settings/
  hooks/
  lib/
    api/
    auth/
    query/
    validation/
    utils/
  services/
    projects/
    challenges/
    sessions/
  types/
  mocks/
    fixtures/
  styles/
    globals.css
```

Keep business logic out of large page components. Feature folders should own their own components, hooks, schemas and service adapters.

## 7. UI and design system

### Visual rules

- Clean, neutral dashboard.
- Simple page titles and concise descriptions.
- Consistent spacing, typography and border treatment.
- Standard shadcn/ui components.
- Avoid nested cards when a heading and divider are enough.
- No animations, animated counters, parallax, animated page transitions or motion libraries.
- No gradients, glass effects, glow effects or decorative backgrounds.
- No oversized marketing visuals in authenticated screens.
- Use clear focus and hover states without motion.
- Do not create fake charts or fabricated analytics.

### Themes

Support:
1. **Light:** white/near-white backgrounds, dark text, neutral borders.
2. **Dark:** dark neutral backgrounds, readable light text.
3. **Purple:** restrained purple accent tokens, not a fully saturated purple interface.

Use semantic CSS variables for background, foreground, card, popover, primary, secondary, muted, accent, destructive, border, input and ring. Purple should primarily change accent tokens. Maintain contrast in all themes. Persist theme through a supported provider and avoid hydration flashes.

### shadcn/ui components

Use as needed:
- Button, Input, Textarea, Label, Select.
- Checkbox, Radio Group, Switch.
- Tabs, Card, Badge, Table.
- Dialog, Alert Dialog, Dropdown Menu, Sheet.
- Popover, Tooltip, Separator, Skeleton.
- Form components and Sonner/toast where useful.

Install only components used by the application. Prefer component variants and className extensions over rebuilding primitives.

Official docs:
- https://ui.shadcn.com/docs/installation
- https://ui.shadcn.com/docs/installation/next
- https://ui.shadcn.com/docs/theming
- https://ui.shadcn.com/docs/dark-mode/next

## 8. Roles and authorization

Roles:
- Guest.
- Student/participant.
- Creator/instructor/interviewer.
- Organization administrator (future).
- Platform administrator (future).

A user may hold multiple roles. Do not assume one global role per user.

Authentication identifies the user. Authorization determines access to a specific project, organization, session or action. Hiding a button is not authorization. Every protected backend operation must independently validate identity, membership, role, resource access and current session state.

## 9. Clerk integration

Use the current official Clerk Next.js App Router quickstart:
https://clerk.com/docs/nextjs/getting-started/quickstart

Requirements:
- Follow the current setup for the installed Next.js version.
- Use Clerk's supported provider and middleware/proxy mechanism.
- Protect authenticated routes.
- Use server-side identity checks for protected operations.
- Keep secret keys server-only.
- Never trust a user ID or role supplied only by the browser.
- Clerk authentication does not automatically grant access to every project/session.
- Add application-level authorization checks for ownership, organization membership, invitations and session permissions.
- Do not hand-roll password handling.

## 10. Application pages and flows

### Public pages

`/`
- Minimal product explanation.
- Sign in and sign up actions.
- Short feature summary.
- No heavy animation or marketing effects.

`/sign-in`, `/sign-up`
- Clerk-supported components and flows.

`/join/[inviteCode]`
- Validate invitation server-side.
- Handle invalid, expired, revoked and already-used links.
- Require sign-in if necessary.
- Do not expose private project data before authorization.

### Authenticated application shell

Sidebar:
- Overview.
- Projects.
- Sessions.
- Practice (future).
- Reports (future).
- Settings.

Header:
- Page context/breadcrumbs.
- Theme selector.
- User account menu.
- Organization selector only when implemented.

Mobile sidebar may use shadcn Sheet. Keep navigation keyboard accessible.

### `/dashboard`

- Recent projects.
- Active/upcoming sessions.
- Recently completed sessions.
- Create project action.
- Join session action.
- Clearly label sample/mock metrics.

### `/projects`

- Search projects.
- Filter by status and technology.
- Sort by name or updated date.
- Show name, description, stack, owner, status and updated date.
- Empty state and create action.
- Use pagination/bounded lists.

### `/projects/new`

Fields:
- Name.
- Description/project idea.
- Category.
- Frontend technology.
- Backend technology.
- Database choice.
- Optional features.
- Complexity.
- Generation notes.

Show states: draft, submitting, queued, generating, validating, ready, failed. A project is only ready when the backend confirms it.

### `/projects/[projectId]`

Sections/tabs:
- Overview.
- Configuration.
- Challenges.
- Sessions.
- Activity (future).

### Challenge configuration

Fields:
- Title and task description.
- Type: bug fixing, feature implementation, refactoring, performance, security, code comprehension.
- Difficulty: easy, medium, hard, professional.
- Severity/impact as a separate field.
- Acceptance criteria.
- Time limit.
- AI permissions.
- Allowed tools.
- Hidden test configuration, stored and shown server-side only.

Difficulty means effort to solve. Severity means impact of the problem.

### `/sessions`

Show session name, project, creator, participant count, status, date and role-appropriate actions.

Use explicit states, not only `isActive`:
- draft
- ready
- waiting
- provisioning
- active
- paused
- submitting
- completed
- expired
- failed
- cleaning_up
- destroyed

### Session details / creator controls

- Session information.
- Participants and invitation state.
- AI permissions.
- Timer controls.
- Start, pause, resume and end.
- Submission/evaluation status.

Timer state and timestamps must come from the server. The browser only displays the remaining time. Do not trust client clock values for assessment.

### Participant workspace shell

Future workspace panels:
- Task description and acceptance criteria.
- File explorer.
- Code editor.
- Terminal.
- Browser preview.
- AI assistant, only when permitted.
- Session/participant information.

For this frontend milestone, create a layout shell and clearly labeled mock panels. Do not claim terminal execution or preview is real until connected to the isolated environment service.

Desktop is the primary IDE target. On mobile, prioritize task, status, chat and reports. Full phone-based code editing is not a first-release requirement.

## 11. TanStack Query and API boundaries

Use TanStack Query for:
- Project lists/details.
- Session lists/details.
- Participants.
- Challenges.
- Reports.
- Mutations such as create project/start session.

Rules:
- Stable query keys, centralized by feature.
- Appropriate stale times.
- Invalidate only affected queries after mutations.
- Handle loading, empty, error and success states.
- Avoid rapid polling.
- Stop polling when a session is completed or inactive where appropriate.
- If using server prefetch/dehydration, follow current TanStack Query App Router guidance.
- Never dehydrate secrets or privileged data.

Docs: https://tanstack.com/query/latest/docs/framework/react/overview

Suggested service boundaries:
```text
services/
  projects/
    project.types.ts
    project.service.ts
    project.queries.ts
    project.mutations.ts
  challenges/
    challenge.types.ts
    challenge.service.ts
  sessions/
    session.types.ts
    session.service.ts
    session.queries.ts
    session.mutations.ts
```

Proposed API contracts only; do not assume these endpoints exist:
- `GET /projects`
- `POST /projects`
- `GET /projects/{projectId}`
- `PATCH /projects/{projectId}`
- `GET /projects/{projectId}/challenges`
- `POST /projects/{projectId}/challenges`
- `GET /sessions`
- `POST /sessions`
- `GET /sessions/{sessionId}`
- `POST /sessions/{sessionId}/start`
- `POST /sessions/{sessionId}/pause`
- `POST /sessions/{sessionId}/resume`
- `POST /sessions/{sessionId}/end`
- `POST /sessions/{sessionId}/join`

Confirm actual schemas, error contracts, auth and service ownership before integration. Components should call typed feature hooks/services, not construct arbitrary URLs inline. Keep mock fixtures outside components.

## 12. Ephemeral session lifecycle

Expected lifecycle:
1. Creator configures project and challenge.
2. Validated project snapshot is stored.
3. Session is created without a running IDE.
4. Participant joins and is authorized.
5. Creator starts interview.
6. Backend provisions an isolated environment from the snapshot.
7. Participant works.
8. Creator pauses/resumes/ends.
9. Backend saves required artifacts and results.
10. Backend revokes temporary credentials and destroys execution resources.
11. Reports and submissions remain available.

Persistent data:
- Project snapshot.
- Session metadata.
- Submission.
- Evaluation result.
- Required audit events.
- Approved logs and AI usage records subject to retention policy.

Temporary resources:
- Container or microVM.
- Runtime processes.
- Temporary database.
- Terminal process.
- Preview process.
- Temporary credentials.
- Unsaved ephemeral filesystem state.

Frontend must display server-returned lifecycle states, handle reconnects, confirm destructive actions and show provisioning/cleanup progress. Navigating away must not be treated as ending a session.

## 13. Performance requirements

Performance is a first-class requirement.

Rendering:
- Prefer Server Components.
- Keep client boundaries small.
- Avoid unnecessary hydration.
- Lazy-load Monaco and other heavy editor features.
- Do not load editor bundles on dashboard routes.
- Load charts/diff viewers only on relevant pages.
- Avoid expensive render-time computations.
- Memoize only when profiling or stable references justify it.

Data:
- Fetch only current-page data.
- Paginate large lists.
- Avoid N+1 requests.
- Prefer server filtering/sorting for large datasets.
- Avoid aggressive polling.
- Use realtime updates or carefully chosen intervals for active sessions.
- Avoid downloading the entire project repeatedly.

Assets:
- Keep fonts and font weights limited.
- Avoid decorative images and video backgrounds.
- Avoid animation libraries.
- Use icons consistently.
- Avoid unnecessary CSS dependencies.

Validation:
- Use Lighthouse and browser performance tools.
- Record actual baseline measurements.
- Work toward good Core Web Vitals.
- Avoid layout shifts and unnecessary requests.
- Use bundle analysis as the application grows.
- Do not claim arbitrary performance scores without measurement.

## 14. Accessibility and responsive behavior

- Semantic HTML.
- Keyboard accessible controls.
- Visible focus states.
- Labels and useful validation messages.
- Accessible dialog titles/descriptions.
- Adequate contrast in all themes.
- Never communicate status only through color.
- Tables must remain usable on small screens.
- Mobile navigation uses an accessible sheet or equivalent.
- Forms must work on mobile.
- IDE is desktop-first; mobile gets a simplified status/task/report experience.

## 15. Security requirements

- Never expose Clerk secret keys, AI keys, database credentials or sandbox credentials in client bundles.
- Do not store sensitive tokens in localStorage.
- Do not trust client-side role checks.
- Never expose hidden tests or expected answers to participants.
- Do not expose private environment variables through public runtime config.
- Do not render untrusted AI HTML.
- Safely render user-generated Markdown.
- Treat AI output, filenames, logs and project descriptions as untrusted.
- Validate invitation tokens server-side.
- Avoid logging private invitation tokens.
- Backend and sandbox infrastructure—not the frontend—must enforce isolation and access control.

## 16. Testing

Unit:
- Utilities.
- Zod schemas.
- Query key factories.
- Permission and lifecycle helpers.

Component:
- Forms and validation.
- Dialog confirmation.
- Theme selector.
- Project cards/filters.
- Session actions by role/state.

Integration:
- Form to service layer.
- Start/pause/resume/end flows.
- Protected route behavior.
- Query loading/error/mutation states.

E2E:
- Guest visits public page.
- User signs in.
- Creator views dashboard.
- Creator creates project using mocked backend.
- Creator configures challenge.
- Creator creates session.
- Participant joins test invitation.
- Creator starts and ends session.
- Completed session displays retained report data.

Test expired invitations, unauthorized access, API failures, empty lists, slow provisioning and lifecycle conflicts—not only happy paths.

## 17. Milestones and acceptance criteria

### Milestone 0 — Repository audit and foundation
- Inspect existing code and scripts.
- Confirm package manager and versions.
- Set up Graphify.
- Create/update context, log and decision files.
- Configure Tailwind and shadcn/ui using current official guide.
- Establish semantic theme tokens.
- Add light, dark and purple themes.
- Build root layout and provider boundaries.

Acceptance: app starts/builds, themes work, no unnecessary animation dependencies, lint/type-check pass, structure documented.

### Milestone 1 — Authentication and shell
- Configure Clerk.
- Add sign-in/sign-up.
- Protect routes.
- Build sidebar/header.
- Add user menu/theme selector.
- Add responsive navigation.

Acceptance: guests cannot access protected pages; signed-in user sees dashboard; auth loading/errors handled.

### Milestone 2 — Dashboard and projects
- Dashboard.
- Project list/search/filter.
- Create-project form.
- Project details.
- Typed mock service and fixtures.

Acceptance: validation and empty/loading/error/success states work; mock data is outside components.

### Milestone 3 — Challenges
- Challenge list and forms.
- Type, difficulty and severity.
- Acceptance criteria.
- Creator review screen.
- Mock generation states.

Acceptance: difficulty and severity are separate; hidden evaluation details never appear in participant UI.

### Milestone 4 — Sessions
- Session list/details.
- Invitations and participant list.
- Timer controls.
- Lifecycle states.
- Confirmation dialogs.
- Mock lifecycle services.

Acceptance: controls are role/state-aware; no false claim of real provisioning.

### Milestone 5 — Participant workspace shell
- Desktop workspace layout.
- Task panel and file explorer mock.
- Lazy-loaded editor.
- Terminal and preview placeholders.
- Permission-aware AI panel.
- Simplified mobile layout.

Acceptance: editor is not loaded on unrelated routes; mock panels are clearly identified.

### Milestone 6 — Reports and hardening
- Submission summary.
- Evaluation report UI.
- Activity timeline.
- Accessibility and responsive checks.
- E2E tests.
- Bundle/performance analysis.
- Documentation updates.

Acceptance: core flows work with typed mocks; no known critical lint/type/build failures; states are covered.

## 18. Decisions still open — do not silently decide

1. Exact Next.js, React and Tailwind versions based on repository and current stable compatibility.
2. Backend choice: FastAPI, NestJS or combination.
3. Separate backend service versus selected Next.js route handlers.
4. PostgreSQL schema and whether MongoDB is needed.
5. Cloud execution provider and sandbox technology.
6. Realtime collaboration: WebSockets, Yjs or alternative.
7. Monaco Editor versus another editor.
8. Shared versus independent participant workspaces.
9. Organization and billing scope.
10. AI gateway and free-model policy.
11. Artifact retention and privacy policy.
12. Git repository import in first release or later.

Record accepted decisions in `DECISIONS.md`.

## 19. Official documentation

- Next.js App Router: https://nextjs.org/docs/app
- Next.js optimization: https://nextjs.org/docs/app/building-your-application/optimizing
- shadcn/ui: https://ui.shadcn.com/docs/installation
- shadcn/ui Next.js: https://ui.shadcn.com/docs/installation/next
- shadcn/ui theming: https://ui.shadcn.com/docs/theming
- shadcn/ui dark mode: https://ui.shadcn.com/docs/dark-mode/next
- Clerk Next.js: https://clerk.com/docs/nextjs/getting-started/quickstart
- TanStack Query: https://tanstack.com/query/latest/docs/framework/react/overview
- Redux Toolkit: https://redux-toolkit.js.org/
- Graphify: https://www.graphiffy.com/docs

## 20. First task for the implementation agent

Start with **Milestone 0 only**.

1. Audit the repository.
2. Confirm package manager, versions and scripts.
3. Check Graphify installation and graph status.
4. Use Graphify to understand the current architecture; do not read every source file.
5. Identify differences between the repository and this brief.
6. Create/update `PROJECT_CONTEXT.md`, `IMPLEMENTATION_LOG.md` and `DECISIONS.md`.
7. Propose the smallest safe foundation changes.
8. Implement only the foundation.
9. Run lint, type-check and build.
10. Report actual results and propose Milestone 1.

Do not implement all pages in one large change. Do not add animations. Do not over-design. Do not install Redux without a demonstrated need. Do not present mocked backend behavior as production functionality.

**Goal:** A maintainable, fast and straightforward frontend that can evolve into the complete AI-powered project and interview simulation platform.
