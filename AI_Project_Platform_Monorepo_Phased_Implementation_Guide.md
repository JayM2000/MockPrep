# AI Project Platform — Monorepo & Phased Implementation Guide

**Purpose:** Instructions for AI coding agents implementing this platform. The owner wants to learn backend development while building the product and is new to FastAPI. Explain concepts as they are introduced.

> **Mandatory rule: implement one phase at a time.** Do not build the entire frontend, Express backend and FastAPI backend at once. Complete the current phase, explain it, run checks, update learning/context notes, and wait for the owner's approval before proceeding.

## 1. Product summary

This platform helps creators/interviewers prepare realistic software-project exercises. A creator describes or imports a project, asks AI to generate intentional bugs or missing features, reviews the challenges, configures AI access and a timer, and invites participants into a temporary browser IDE session. Participants solve tasks, test their changes and submit work. The platform later evaluates submissions and provides reports.

Long-term capabilities:
- AI project and challenge generation.
- Project/code understanding and RAG.
- Browser IDE, terminal and preview.
- Temporary isolated execution environments.
- Creator-controlled AI access.
- Realtime presence and collaboration.
- Human/AI change provenance.
- Automated and human evaluation.
- Session cleanup while retaining approved artifacts and reports.

Principles: performance and reliability before decoration; simple Next.js UI with Tailwind and shadcn/ui; no unnecessary animations; secure isolation for untrusted code; backend authorization is authoritative; provision execution resources only when a session starts and destroy them after it ends.

## 2. Required repository structure

The user wants three separate applications in one repository. Keep the frontend, Express API and FastAPI AI service in separate folders.

```text
ai-project-platform/
├── frontend/                       # Next.js application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── express-api/                 # Node.js + Express + TypeScript
│   │   ├── src/
│   │   ├── tests/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── ...
│   │
│   └── fastapi-ai/                  # Python + FastAPI
│       ├── app/
│       ├── tests/
│       ├── pyproject.toml
│       └── ...
│
├── docs/
│   ├── architecture/
│   │   ├── system-overview.md
│   │   ├── service-ownership.md
│   │   └── decisions.md
│   └── learning/
│       ├── express-learning-log.md
│       └── fastapi-learning-log.md
├── .gitignore
├── README.md
└── IMPLEMENTATION_PLAN.md
```

Do not create all folders immediately. Phase 0 inspects the current repository and agrees on the final layout. Each application has its own dependency manifest, runtime, scripts, tests and configuration. Do not nest FastAPI inside Express or Express inside FastAPI.

## 3. Architecture overview

Start with two independently runnable backend applications, each a modular monolith. Do not create a fleet of microservices.

```text
Browser
  |
  v
Next.js frontend
  | HTTPS / WebSocket
  v
Node.js + Express API  <------>  Python + FastAPI AI service
  |                                |
  | main application data          | AI computation/data
  v                                v
PostgreSQL (app schema)       PostgreSQL (ai schema)
  |                                |
  +---------- pgvector -------------+
             (if selected)

Express Socket.IO gateway:
session events, timer updates, participant presence,
and relayed AI job progress.
```

### Express — main application backend

Express owns:
- Application user profiles and organizations.
- Projects and project ownership.
- Challenge lifecycle and creator approval.
- Sessions, invitations and participants.
- Timer state and authoritative timestamps.
- Application authorization and AI permission policy.
- Submission lifecycle and final report records.
- Application audit events.
- Socket.IO connections and session rooms.

### FastAPI — AI backend

FastAPI owns:
- LLM provider integrations and model selection.
- Prompt templates and orchestration.
- Embedding generation.
- Project/code chunking and indexing.
- Vector retrieval and RAG.
- Project/code understanding.
- Bug and challenge suggestions.
- Code explanation and analysis.
- AI evaluation signals.
- AI-specific job execution and telemetry.

FastAPI must not become a second general CRUD backend for users, projects and sessions.

### Next.js frontend

Next.js owns presentation and user interaction:
- Clerk authentication UI.
- Dashboard, projects, challenges and sessions.
- Creator and participant experiences.
- IDE layout and AI assistant UI.
- TanStack Query for client-side server state.
- Socket.IO client for realtime events.
- Theme and local UI state.

Frontend role checks improve UX only. Express must enforce authorization on every protected operation.

## 4. Example request flow: generate intentional bugs

1. Creator submits a request in Next.js.
2. Next.js calls Express.
3. Express verifies Clerk identity and creator permissions.
4. Express checks project access.
5. Express creates an AI-generation request/job record.
6. Express calls a protected FastAPI internal endpoint.
7. FastAPI obtains only the approved project context.
8. FastAPI retrieves relevant code/document chunks and calls the selected model.
9. FastAPI validates the generated response.
10. Express validates the service response and stores application-owned challenge records.
11. Creator reviews and approves the challenges.
12. Express can emit a Socket.IO event to update the UI.

For long-running generation, do not hold an HTTP request open for minutes. Introduce a durable job/queue when retry, persistence and concurrency requirements are understood.

## 5. Database ownership — important

Both services can connect to the same PostgreSQL server, but do not let both freely write the same tables.

Recommended initial ownership:

| Schema | Owner | Examples |
|---|---|---|
| `app` | Express | users, organizations, projects, sessions, participants, invitations |
| `ai` | FastAPI | AI runs, embedding metadata, indexing jobs, model usage |
| `audit` | Explicitly selected owner | application audit events |

This is a proposal; design exact tables only when their phase begins.

Rules:
1. Express is the only writer for Express-owned application tables.
2. FastAPI is the only writer for FastAPI-owned AI tables.
3. FastAPI obtains project context through an authorized Express internal API or a deliberately scoped read-only view/role.
4. FastAPI does not directly update Express-owned project/session records.
5. If AI output becomes an application challenge, FastAPI returns the result and Express validates/persists it.
6. Use separate database credentials and least-privilege grants.
7. Each service owns migrations for its schema.
8. Share API contracts, not ORM models across Node and Python.

### MongoDB?

Do not add MongoDB initially. PostgreSQL and JSONB may cover the first version. Introduce MongoDB only when a specific document-oriented workload has a clear benefit and its operational cost is justified.

### Vector database?

Start by evaluating PostgreSQL + pgvector. It supports vector similarity search while keeping embeddings close to relational metadata. Add a dedicated vector database only if measured scale, latency, filtering or operational needs justify it. Retrieval must always be scoped by project/session and authorization.

## 6. Service-to-service communication

Start with protected internal HTTP APIs. Example:

```text
Express -> POST FastAPI /internal/v1/challenges/generate
FastAPI -> 202 Accepted { "jobId": "...", "status": "queued" }
Express -> stores/exposes application job status
```

Requirements:
- FastAPI internal endpoints are not publicly callable without authentication.
- Use service-to-service credentials or workload identity.
- Use HTTPS in deployed environments and restrict network access where possible.
- Do not rely on an unprotected `X-Internal-Secret` header.
- Use request IDs/correlation IDs.
- Apply timeouts.
- Retry only safe/idempotent operations.
- Use idempotency keys for generation requests where duplicate work would be harmful.
- Validate FastAPI responses in Express.
- Never expose model-provider or Clerk secret keys to the browser.

Add a durable queue only when there is a real need for persisted retries, concurrency limits or worker scaling. Do not add Kafka, Redis or another broker merely because there are two services.

## 7. Authentication and authorization

Clerk is the identity provider. Express is the main application API and verifies the user's Clerk token using the current official Clerk backend approach.

Recommended flow:
1. User signs in through Clerk in Next.js.
2. Frontend sends an appropriate Clerk session token to Express.
3. Express verifies signature and required claims.
4. Express checks application role, organization membership and resource access.
5. Express calls FastAPI using a separate trusted service identity and minimum required context.
6. FastAPI verifies the internal service identity.
7. If user attribution is required, Express passes trusted actor context after verification.

Teach authentication vs authorization, JWT signature/claims, issuer, expiration, JWKS, 401 vs 403 and resource-level permissions.

Never:
- Trust a user ID or role from the request body.
- Decode a JWT without verifying it.
- Invent Clerk claim names.
- Assume Clerk login grants access to every project/session.
- Rely on hiding frontend buttons as security.
- Let the browser call privileged FastAPI endpoints directly.

## 8. Realtime

Use Socket.IO in Express initially for:
- Session status events.
- Timer start/pause/resume/end.
- Participant presence.
- Join/leave notifications.
- Creator dashboard updates.
- AI job progress relayed from FastAPI.
- Submission status events.

Flow: FastAPI completes a job → sends authenticated callback/event → Express validates and updates application state → Express emits to authorized Socket.IO room.

Do not broadcast hidden tests, secrets or private project content. Socket.IO presence does not itself provide collaborative editing; evaluate Yjs/CRDT or another collaboration design separately later.

## 9. Suggested service folder structures

Create these gradually; do not generate empty folders for every future feature.

### `frontend/`

```text
src/
  app/
  components/
    ui/
    layout/
    shared/
  features/
    auth/
    dashboard/
    projects/
    challenges/
    sessions/
    workspace/
    reports/
  hooks/
  lib/
    api/
    query/
    utils/
  services/
  types/
```

Use Next.js App Router, TypeScript, Tailwind and shadcn/ui. Prefer Server Components for suitable initial rendering. Add client components only where interaction requires them. Use TanStack Query for client-side server state and React state for local UI state. Add Redux only if a concrete complex shared client-state requirement appears.

### `backend/express-api/`

```text
src/
  app.ts
  server.ts
  config/
  middleware/
    authentication/
    authorization/
    error-handler/
  routes/
  modules/
    users/
    organizations/
    projects/
    challenges/
    sessions/
    invitations/
    submissions/
    reports/
  services/
  repositories/
  database/
    migrations/
    connection.ts
  realtime/
    socket-server.ts
    events/
  integrations/
    fastapi-client/
  schemas/
  types/
  utils/
tests/
package.json
tsconfig.json
```

Use TypeScript. Keep app construction separate from server startup where practical. Keep route handlers thin; place business logic in services and database access in clear data-access modules.

### `backend/fastapi-ai/`

```text
app/
  main.py
  core/
    config.py
    logging.py
  api/
    dependencies.py
    internal/
    v1/
  ai/
    providers/
    prompts/
    orchestration/
  embeddings/
  retrieval/
  vector_store/
  code_intelligence/
  challenge_generation/
  evaluation/
  schemas/
  services/
  repositories/
  database/
tests/
pyproject.toml
```

Use FastAPI routers and dependency injection as the app grows. Do not create all AI modules before their first use.

---

# 10. Learning-first implementation phases

## Global instructions for every phase

For each phase:
1. State the goal.
2. Explain concepts before implementation.
3. Identify exact files to create/change.
4. Implement only the current phase.
5. Explain important code lines and files.
6. Run the application and relevant tests.
7. Explain errors and debugging.
8. Update learning/context/decision notes.
9. Show a completion checklist.
10. Stop and wait for the owner's approval.

Do not silently continue to the next phase.

### Phase 0 — Repository audit and architecture agreement

**Implement nothing substantial.**

- Inspect the existing repository and current frontend location.
- Check Git status and existing scripts.
- Check Node.js, package manager, Python, uv and Graphify availability.
- Agree on `frontend/`, `backend/express-api/`, `backend/fastapi-ai/`.
- Explain monorepo, service boundaries and separate dependency environments.
- Create/update architecture and learning notes.
- Do not install all dependencies or overwrite existing code.

Acceptance: repository understood, folder layout agreed, no existing code overwritten, notes updated.

**Stop and ask permission to begin Phase 1.**

### Phase 1 — Frontend foundation only

Follow the existing frontend implementation brief if available.

- Next.js app shell.
- Tailwind and shadcn/ui.
- Light, dark and purple themes.
- Clerk frontend integration.
- Basic navigation and protected layout.
- No real backend dependency yet; use clearly separated typed mocks only if needed.

Teach Server vs Client Components and why the client bundle should stay small.

Acceptance: frontend runs/builds, themes work, auth flow is configured, no unnecessary animations.

Stop for approval.

### Phase 2 — Initialize Express API only

Do not initialize FastAPI in this phase.

- Check Node version and package manager.
- Initialize `backend/express-api`.
- Add TypeScript and only essential dependencies.
- Create a minimal health endpoint.
- Add basic error handling.
- Run and test the service.

Teach Node runtime, Express app, request/response, HTTP methods, route handlers, middleware, `next()`, TypeScript types and environment variables.

Acceptance: Express starts, health endpoint works, owner can explain request flow, basic tests pass.

Stop for approval.

### Phase 3 — Initialize FastAPI AI service only

Do not implement AI agents or database access yet.

- Check Python and uv.
- Initialize `backend/fastapi-ai`.
- Install FastAPI standard dependencies only.
- Create a minimal FastAPI app and health endpoint.
- Configure its entry point.
- Run development server.
- Verify `/docs`, `/redoc`, `/openapi.json`.

The owner is new to FastAPI. Explain carefully:
- Python modules and packages.
- FastAPI application instance.
- Route decorators.
- `def` vs `async def`.
- Type hints.
- JSON response.
- OpenAPI/Swagger UI.
- Basic dependency injection.

Explain every file and important line. Do not rush.

Acceptance: FastAPI starts independently, health endpoint and Swagger UI work, Python environment is isolated, owner can explain what was created.

Stop for approval.

### Phase 4 — Define API contracts

Before connecting services, define:
- Express public API contracts.
- FastAPI internal API contracts.
- Request/response schemas.
- Error formats.
- Authentication/service identity.
- Timeouts and idempotency.

Start with one small contract: Express accepts a challenge-generation request, calls FastAPI, receives a job ID/status and exposes status to frontend.

Teach DTOs, OpenAPI, TypeScript types, Pydantic schemas and contract compatibility.

Acceptance: contract reviewed, schemas align, internal endpoint is protected.

Stop for approval.

### Phase 5 — PostgreSQL foundation and ownership

- Select local PostgreSQL setup.
- Define `app` and `ai` schema ownership.
- Configure separate database roles/credentials.
- Choose migration ownership for each schema.
- Add only the first required table; do not create every future table.

Teach database/schema/table/row/column, primary and foreign keys, indexes, constraints, transactions, connection pools, ORM and migrations.

Acceptance: both services connect with separate permissions, migration ownership is clear, secrets are not committed.

Stop for approval.

### Phase 6 — First complete vertical slice: project creation

1. Build Next.js create-project UI.
2. Agree on request/response contract.
3. Express verifies identity and creator permission.
4. Express validates request and business rules.
5. Express persists project in PostgreSQL.
6. Frontend displays the created project.
7. Add unit/API/integration tests.

FastAPI is not involved unless this feature has an actual AI requirement.

Teach each Express/database concept.

Acceptance: project can be created/retrieved, validation and authorization work, UI states work, tests pass.

Stop for approval.

### Phase 7 — Clerk authentication and resource authorization

- Verify Clerk tokens in Express using current official docs.
- Map verified identity to application user.
- Enforce project ownership and creator/participant permissions.
- Define separate service identity for Express-to-FastAPI calls.

Teach authentication vs authorization, JWT, signature verification, claims, middleware, 401 vs 403 and resource ownership.

Acceptance: invalid/absent tokens rejected, valid identity resolved, unauthorized project access blocked.

Stop for approval.

### Phase 8 — Secure project-context handoff to FastAPI

Choose one approach:
- Express sends a scoped project snapshot to FastAPI.
- FastAPI calls an authorized Express internal context endpoint.
- A restricted read-only database view/role is used.

Choose based on data size, privacy and latency. Do not grant FastAPI broad write access to Express-owned tables.

Teach internal API, service authentication, DTOs, timeout and error handling.

Acceptance: FastAPI receives only authorized context and cannot modify application project rows.

Stop for approval.

### Phase 9 — First AI feature: challenge suggestions

- Creator requests bug/challenge suggestions.
- Express verifies creator and project access.
- FastAPI receives scoped context and instructions.
- FastAPI calls a selected model.
- FastAPI validates structured output.
- Express stores application challenge records.
- Creator reviews and approves suggestions.

Teach LLM request/response, prompt templates, structured output validation, token usage/cost, timeouts and why AI output is untrusted.

Acceptance: suggestions generated and validated, creator approval required, hidden evaluation data protected.

Stop for approval.

### Phase 10 — Embeddings and retrieval

Evaluate PostgreSQL + pgvector first.

Teach embeddings, vector dimensions, similarity metrics, chunking, metadata filtering, RAG and project isolation.

Implement a small indexing/retrieval example. Filter every query by project/session authorization context. Do not add a separate vector database without measured justification.

Acceptance: relevant chunks retrieved and cross-project retrieval prevented.

Stop for approval.

### Phase 11 — Challenges, sessions and invitations

Build one small feature at a time:
1. Challenge CRUD/approval.
2. Session creation.
3. Invitation creation/revocation.
4. Participant joining.
5. Creator permissions.
6. Server-authoritative timer.

Express owns these application workflows.

Teach state machines, transactions, secure invitation tokens, role-based access, timestamps, race conditions and idempotency.

Suggested session states:
`draft`, `ready`, `waiting`, `provisioning`, `active`, `paused`, `submitting`, `completed`, `expired`, `failed`, `cleaning_up`, `destroyed`.

Stop after each sub-feature for approval.

### Phase 12 — Socket.IO realtime events

Use Express as the initial realtime gateway.

Implement authenticated connections, authorized session rooms, presence, timer/session events and AI job progress notifications.

Teach WebSocket vs HTTP, event lifecycle, rooms, reconnect, authorization on socket events and payload validation.

Presence is not collaborative editing.

Stop for approval.

### Phase 13 — Background jobs

Only now evaluate a durable queue based on actual needs.

Teach long-running tasks, job lifecycle, retries/backoff, idempotency, workers and failure handling.

Implement one job type first. Do not add Kafka, Redis or Celery without selecting a specific queue design and explaining its operational cost.

Stop for approval.

### Phase 14 — Ephemeral sandbox and browser IDE

Prototype isolation/provider choices before full integration.

Teach containers vs VMs/microVMs, untrusted code execution, filesystem/network isolation, CPU/memory/time quotas, short-lived credentials, snapshots, artifact persistence and cleanup.

Rules:
- Never execute participant code inside Express or FastAPI processes.
- A basic Docker container is not automatically a sufficient security boundary for hostile code.
- Provision only when session starts.
- Save approved artifacts/results.
- Revoke temporary credentials.
- Destroy temporary environment after session.
- Make cleanup idempotent and retryable.
- Keep persistent reports separate from temporary compute.

Stop after a small proof of concept.

### Phase 15 — AI assistant, collaboration and code provenance

Add gradually:
- Project-context AI assistant.
- Permission-aware model access.
- Streaming responses.
- Server-checked AI tool calls.
- Shared editing evaluation (Yjs/CRDT or alternative).
- Human/AI change metadata.

Do not claim perfect human-vs-AI authorship detection. Track explicit editor/AI operations and correlate with diffs; explain limitations.

Stop after each capability.

### Phase 16 — Evaluation and reports

Implement submission snapshots, deterministic tests in isolated environments, test results, scoring rubric, AI-assisted feedback, human review and report persistence.

Do not use an LLM as the sole authority for correctness or scoring.

Stop for approval.

### Phase 17 — Production readiness

Only after core workflows:
- Deploy frontend, Express and FastAPI independently.
- HTTPS and secure service networking.
- Secrets management and CORS allowlist.
- Rate limits.
- Structured logs, request IDs, metrics and tracing.
- Database backups and restore tests.
- Migration deployment.
- CI tests and dependency scanning.
- Load/failure testing.
- Sandbox cost controls and cleanup alerts.

Do not introduce Kubernetes by default.

---

# 11. Testing requirements

Test continuously.

Frontend: component tests, form validation, auth states, API loading/error/success and E2E creator/participant journeys.

Express: route tests, middleware tests, business logic, database integration, auth/authorization, Socket.IO authorization, state transitions and idempotency.

FastAPI: route/schema tests, service tests, mocked AI provider tests, retrieval tests, internal endpoint auth, timeout/failure tests and output validation.

Cross-service: contract tests, internal authentication, timeout/retry behavior, duplicate job submission and request ID propagation.

Do not use production databases or paid model calls in routine unit tests.

## Performance and reliability

- Keep frontend bundles small; lazy-load heavy editor features.
- Paginate large lists.
- Avoid N+1 database queries.
- Add indexes based on measured query patterns.
- Use connection pools correctly.
- Keep transactions short.
- Never hold a DB transaction open while waiting for an LLM or sandbox provider.
- Use internal HTTP timeouts and bounded retries.
- Use idempotency for retryable operations.
- Avoid excessive polling; use realtime events where suitable.
- Measure before optimizing.

## Security baseline

- Verify Clerk tokens in Express.
- Authenticate Express-to-FastAPI calls.
- Enforce resource authorization server-side.
- Use separate database roles per service.
- Keep secrets out of Git and client bundles.
- Use exact CORS origins.
- Validate all HTTP and socket payloads.
- Rate-limit invitation and expensive AI endpoints.
- Use random, expiring invitation tokens.
- Keep hidden tests/answers server-side.
- Scope vector retrieval by project/session.
- Treat model output and generated code as untrusted.
- Never execute untrusted code in API processes.
- Isolate sandbox network, CPU, memory and filesystem.
- Redact secrets/private code from logs.
- Define retention/deletion policies.

---

# 12. Graphify and token-efficient AI workflow

Use Graphify to understand code relationships without repeatedly loading the entire repository into model context.

At the start of each task:
1. Read this guide.
2. Read the relevant service context file.
3. Read the latest learning-log entry.
4. Query Graphify for the current feature/symbol if installed and indexed.
5. Inspect only relevant source files.
6. Verify graph-derived assumptions in actual source.

Useful questions:
- How are Express project routes connected to services and repositories?
- Where is Clerk authentication middleware applied?
- How does FastAPI call the LLM provider?
- Where are embeddings stored and queried?
- How are Socket.IO rooms authorized?

Do not paste the entire graph into context. Do not rebuild it for every tiny edit. If unavailable, say so and inspect targeted files; never claim Graphify ran if it did not. Follow current Graphify documentation and installed skill instructions rather than inventing commands.

---

# 13. Required context and learning files

Maintain concise files so future AI sessions can continue without rereading the entire repository.

### Root `PROJECT_CONTEXT.md`
- Product summary.
- Repository structure.
- Service responsibilities.
- Accepted architecture decisions.
- How to run each app.
- Current phase and completed phases.
- Entry points, known issues and next approved task.

### `backend/express-api/EXPRESS_CONTEXT.md`
- Node/Express versions.
- Package manager and scripts.
- Route/module structure.
- Database ownership/connection.
- Authentication approach.
- Tests and current feature.
- Next task.

### `backend/express-api/EXPRESS_LEARNING_LOG.md`
After each Express phase: concepts taught, files changed, commands learned, what owner should understand, debugging lessons, questions to revisit and next phase.

### `backend/fastapi-ai/FASTAPI_CONTEXT.md`
- Python/FastAPI versions.
- uv commands.
- App entry point.
- Router/service structure.
- Internal authentication.
- Database/vector ownership.
- Tests, current AI feature and next task.

### `backend/fastapi-ai/FASTAPI_LEARNING_LOG.md`
After each FastAPI phase: Python/FastAPI concepts taught, files changed, commands learned, explanation of decorators/type hints/async/dependencies/schemas/database concepts as relevant, what owner should understand, debugging lessons and next phase.

### `docs/architecture/decisions.md`
For each decision: date, context, decision, alternatives, reason, consequences and status (`proposed`, `accepted`, `superseded`). Do not mark a proposal accepted before owner approval.

---

# 14. Official documentation

Use current official documentation and verify version compatibility before installing packages.

Frontend:
- Next.js project structure: https://nextjs.org/docs/app/getting-started/project-structure
- Next.js architecture: https://nextjs.org/docs/architecture
- Clerk Next.js: https://clerk.com/docs/nextjs
- TanStack Query: https://tanstack.com/query/latest/docs/framework/react/overview
- shadcn/ui: https://ui.shadcn.com/docs

Express / Node:
- Express routing: https://expressjs.com/en/guide/routing.html
- Express middleware: https://expressjs.com/en/guide/using-middleware.html
- Node.js: https://nodejs.org/docs/latest/api/
- TypeScript: https://www.typescriptlang.org/docs/

FastAPI / Python:
- FastAPI first steps: https://fastapi.tiangolo.com/tutorial/first-steps/
- FastAPI bigger applications: https://fastapi.tiangolo.com/tutorial/bigger-applications/
- FastAPI dependencies: https://fastapi.tiangolo.com/tutorial/dependencies/
- FastAPI security: https://fastapi.tiangolo.com/tutorial/security/
- FastAPI testing: https://fastapi.tiangolo.com/tutorial/testing/
- Python tutorial: https://docs.python.org/3/tutorial/
- uv: https://docs.astral.sh/uv/

Data and realtime:
- PostgreSQL: https://www.postgresql.org/docs/
- pgvector: https://github.com/pgvector/pgvector
- SQLAlchemy: https://docs.sqlalchemy.org/en/20/
- Alembic: https://alembic.sqlalchemy.org/en/latest/
- Socket.IO: https://socket.io/docs/v4/
- OpenAPI: https://www.openapis.org/
- Docker: https://docs.docker.com/

FastAPI's official bigger-applications guide explains splitting an API into modules and composing routers. Express's official routing and middleware guides explain route handlers and middleware flow. pgvector's project documentation describes vector similarity search inside PostgreSQL. Use official docs rather than outdated tutorials.

---

# 15. First instruction to the coding agent — Phase 0 only

**Do not initialize all three applications. Do not install all dependencies. Do not build product features.**

1. Acknowledge that the owner wants to learn while building and is new to FastAPI.
2. Inspect the current repository without overwriting existing code.
3. Confirm the existing frontend folder and root structure.
4. Check Node.js, package manager, Python, uv, Git and Graphify availability.
5. Propose the exact target folders: `frontend/`, `backend/express-api/`, `backend/fastapi-ai/`.
6. Explain why each application is separate and how they communicate.
7. Explain database ownership in simple language.
8. Create/update only the architecture and learning notes needed for Phase 0.
9. Report findings, uncertainties and decisions requiring approval.
10. Stop and ask permission to start Phase 1.

When the owner approves, implement only the next approved phase. Never jump ahead.

**The goal is not merely to finish the code. The goal is to build a maintainable platform while the owner understands how Next.js, Express, FastAPI, databases, AI services and realtime components work together.**
