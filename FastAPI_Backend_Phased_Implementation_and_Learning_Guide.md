# FastAPI Backend Implementation & Learning Guide
## AI-Powered Real-World Project and Interview Simulation Platform

**Purpose:** Guide an AI coding assistant to build this platform's backend incrementally while teaching the owner FastAPI and backend concepts. The owner is new to FastAPI. Explanations are a required part of every implementation task.

**Critical instruction:** Work phase by phase. Start with Phase 0, explain it, complete it, verify it, and wait for the owner's instruction before moving forward. Do not implement the entire backend in one response.

---

# 1. Instructions to the AI assistant

You are both:
1. The backend implementation assistant.
2. A patient FastAPI instructor helping a developer who is new to backend development with FastAPI.

The owner has frontend experience and understands JavaScript/TypeScript, React, Next.js and APIs at a general level. Do not assume they already understand Python backend conventions, FastAPI internals, SQLAlchemy, dependency injection, migrations, async database access, authentication middleware or backend security.

## 1.1 Mandatory teaching rules

For every meaningful implementation step:

1. **Explain the purpose first:** what are we building and why?
2. **Explain the concept in plain English:** compare with familiar Next.js/Node.js concepts when useful, but explain where the comparison is not exact.
3. **Explain the file:** why it exists, what belongs there and what should not.
4. **Explain the code:** line by line or block by block. Cover unfamiliar Python syntax, decorators, type hints, `async`/`await`, dependencies, Pydantic and SQLAlchemy.
5. **Explain the request flow:** browser → FastAPI → validation → business logic → database → response.
6. **Explain important alternatives:** why this approach was chosen and when another is appropriate.
7. **Run and verify:** give exact commands and expected results.
8. **Explain common errors:** what they mean and how to troubleshoot.
9. **Give a small learning checkpoint:** one or two short questions or a tiny exercise when useful.
10. **Stop at the phase boundary:** do not move forward until the owner asks to continue or approves it.

Teach concepts immediately before and during their use. Do not overwhelm the owner with a backend textbook before writing code.

## 1.2 Required response structure for each phase

```text
Phase N — Name

1. Goal
2. What we are building
3. Concepts to understand first
4. Files we will create or modify
5. Implementation, explained step by step
6. How to run it
7. How to test it (Swagger UI when relevant)
8. What happens internally / request flow
9. Common mistakes and troubleshooting
10. Completion checklist
11. What comes next (do not implement it yet)
```

Keep explanations simple, practical and professional. Define technical terms when first introduced.

## 1.3 Never do these things

- Do not generate the complete backend in one go.
- Do not create dozens of empty folders before they are needed.
- Do not introduce microservices prematurely.
- Do not add MongoDB just because the product uses AI.
- Do not add Redis, Celery, Kafka, Kubernetes or a message broker before a real requirement exists.
- Do not put all business logic inside route functions.
- Do not share a global database session across requests.
- Do not hardcode secrets or commit `.env`.
- Do not trust user IDs, roles or organization IDs sent by the frontend.
- Do not invent Clerk JWT claims or assume an unverified token is valid.
- Do not use FastAPI's example username/password OAuth flow as a replacement for Clerk.
- Do not silently change architecture decisions.
- Do not continue to the next phase without explaining and verifying the current one.

---

# 2. Product understanding

We are building an AI-powered real-world project and interview simulation platform.

Creators/instructors/interviewers can:
- Create a project specification.
- Generate or import a software project.
- Ask AI to introduce intentional bugs, missing features, performance issues or security issues.
- Review and approve challenges.
- Create sessions and invite participants.
- Configure timer, collaboration and AI permissions.
- Start, pause, resume and end interviews.
- Review submissions and evaluation reports.

Participants can:
- Join a session securely.
- Read assigned engineering tasks.
- Work in an isolated browser IDE.
- Use AI only when allowed.
- Run code and tests.
- Submit work.
- View permitted feedback and reports.

Long-term platform capabilities:
- AI project generation.
- AI challenge generation and bug injection.
- Cloud IDE and isolated code execution.
- Collaborative editing and realtime presence.
- AI project-context assistant.
- Human vs AI code-change provenance.
- Automated and human evaluation.
- Ephemeral execution environments.

## 2.1 Backend responsibilities

The backend is the trusted system that owns:
- Authentication verification and authorization decisions.
- User and organization membership.
- Project metadata and project-generation jobs.
- Challenge definitions and hidden evaluation configuration.
- Session state and server-authoritative timer data.
- Invitation validation.
- AI permission policy.
- Sandbox provisioning and cleanup orchestration.
- Submissions, audit events and reports.
- Persistent data and API contracts.

The frontend must never be trusted to enforce security or assessment rules.

---

# 3. Recommended backend technology direction

Verify current stable versions and compatibility before installation.

| Concern | Initial recommendation | Why |
|---|---|---|
| Backend framework | FastAPI | Python API framework with type hints and OpenAPI |
| Python | Current supported stable version; prefer 3.12+ if dependencies support it | Modern typing and runtime support |
| Package/environment manager | `uv` | Dependency and environment management |
| API validation | Pydantic v2 | Request/response validation and settings |
| Main database | PostgreSQL | Relational project/session/user data and transactions |
| ORM | SQLAlchemy 2.x | Mature relational ORM and explicit database control |
| Database driver | `asyncpg` | Async PostgreSQL driver |
| Migrations | Alembic | Version-controlled database schema changes |
| Configuration | pydantic-settings | Typed environment configuration |
| Tests | pytest + HTTPX | API and service testing |
| Lint/format | Ruff | Python linting and formatting |
| API contract | FastAPI-generated OpenAPI | Frontend integration |
| Authentication | Clerk JWT verification | Reuse the platform's Clerk identity |
| Realtime (later) | FastAPI WebSockets or dedicated realtime service | Session events and collaboration |
| Background jobs (later) | Decide when long-running generation requires it | Avoid premature queue infrastructure |
| Object storage (later) | S3-compatible storage | Project snapshots and artifacts |

## 3.1 Why PostgreSQL first?

The platform has naturally related records:
- Users and organizations.
- Projects.
- Challenges.
- Sessions.
- Participants.
- Invitations.
- Submissions.
- Evaluations.
- Audit events.

PostgreSQL provides relational constraints and transactions for these relationships. PostgreSQL JSONB can hold flexible configuration where appropriate.

**Do not add MongoDB in the first backend milestone.** Reconsider it only when a specific document-oriented workload provides a clear benefit. Do not duplicate the same data in PostgreSQL and MongoDB without a strong reason.

## 3.2 Why SQLAlchemy 2.x?

SQLAlchemy is mature and gives control over relationships, queries and transactions. Pydantic will define and validate API input/output separately. Keeping ORM models and API schemas separate teaches a useful backend boundary.

FastAPI's official tutorial also demonstrates SQLModel, a simpler option built on SQLAlchemy and Pydantic. SQLModel is valid, but for this product we will initially use SQLAlchemy 2.x + Pydantic so persistence models and API contracts remain explicit. Do not mix SQLModel and SQLAlchemy models in the initial implementation.

## 3.3 Important async note

FastAPI supports both `def` and `async def` route functions. `async def` is useful when code uses awaitable I/O. It does not automatically make blocking libraries asynchronous.

For this project, use async SQLAlchemy and `asyncpg` consistently for database I/O. Do not call blocking network or database operations directly inside async route functions. Explain async/await carefully before database integration.

---

# 4. Backend architecture — begin as a modular monolith

Start with one FastAPI application organized by feature. A modular monolith means one deployable backend with clearly separated internal modules. It is easier to develop, test and deploy than many microservices at the beginning.

Do not split AI orchestration, sessions, projects and sandbox management into separate services until scale, security or deployment requirements justify it.

## 4.1 High-level request flow

```text
Next.js frontend
      |
      | HTTPS request + Clerk session token
      v
FastAPI application
      |
      v
Authentication verification
      |
      v
Authorization / resource permission
      |
      v
API router
      |
      v
Pydantic request validation
      |
      v
Service / business logic
      |
      v
Repository / SQLAlchemy
      |
      v
PostgreSQL
      |
      v
Pydantic response schema
      |
      v
JSON response to frontend
```

Explain each layer when implemented. Do not add repository abstractions everywhere if they only create boilerplate; use clear service and data-access boundaries without overengineering.

## 4.2 Suggested directory structure

Create this gradually. Do not create all files in Phase 0.

```text
backend/
  pyproject.toml
  uv.lock
  .env.example
  .gitignore
  README.md

  app/
    __init__.py
    main.py

    core/
      __init__.py
      config.py
      logging.py

    api/
      __init__.py
      deps.py
      v1/
        __init__.py
        router.py
        endpoints/
          health.py

    db/
      __init__.py
      session.py
      base.py

    models/
      __init__.py

    schemas/
      __init__.py

    services/
      __init__.py

    repositories/
      __init__.py

    features/
      projects/
      challenges/
      sessions/
      users/

    auth/
      __init__.py
      clerk.py
      permissions.py

  migrations/
  tests/
    conftest.py
    api/
    services/
```

Folder meanings:
- `main.py`: creates the FastAPI application and connects top-level routers/lifespan.
- `core/`: application-wide configuration and shared infrastructure.
- `api/`: HTTP route definitions and dependencies.
- `db/`: database engine, session and ORM metadata.
- `models/`: SQLAlchemy database models.
- `schemas/`: Pydantic request and response models.
- `services/`: business rules and workflows.
- `repositories/`: database access functions when separation is useful.
- `features/`: feature-specific modules as the application grows.
- `auth/`: token verification and permission helpers.
- `tests/`: automated tests.

Do not create empty folders simply to match this diagram. Add them when the corresponding phase needs them.

---

# 5. Phase-by-phase roadmap

## Phase 0 — Repository audit and backend learning setup

**Do not write business features in this phase.**

Tasks:
1. Inspect the existing repository and identify whether frontend and backend will live in a monorepo or separate repositories.
2. Check current Python version and whether Python is installed.
3. Check whether `uv` is installed.
4. Check Git status and existing ignore files.
5. Check whether a backend directory already exists.
6. Agree on the backend directory location.
7. Create `BACKEND_CONTEXT.md`, `BACKEND_LEARNING_LOG.md` and `BACKEND_DECISIONS.md`.

Explain:
- What Python does in this backend.
- What FastAPI is.
- What a backend server does.
- What an HTTP request and response are.
- What an API endpoint is.
- Why a separate backend is being considered alongside Next.js.

Acceptance:
- Repository and environment audit is complete.
- No existing code was overwritten.
- Backend location is agreed.
- Context and learning files exist.
- No unnecessary packages or services were installed.

Stop and explain the audit before continuing.

## Phase 1 — Initialize FastAPI and run the first endpoint

**Goal:** Run the smallest possible FastAPI application and understand each part.

### 1.1 Create the environment

Use `uv` if it is available and appropriate.

From the agreed backend directory, typical current workflow:

```bash
uv init
uv add "fastapi[standard]"
```

If the repository already has `pyproject.toml`, inspect and reuse it rather than initializing over it.

The `fastapi[standard]` extra provides the standard FastAPI command-line/server dependencies. Verify installed versions from the lock file.

### 1.2 Create the first application

Start with a minimal `app/main.py`:

```python
from fastapi import FastAPI

app = FastAPI(
    title="Engineering Simulation Platform API",
    version="0.1.0",
)


@app.get("/")
async def root():
    return {"message": "API is running"}
```

Explain:
- `from fastapi import FastAPI`: imports the framework class.
- `app = FastAPI(...)`: creates the application instance.
- `@app.get("/")`: decorator that registers a GET route.
- `async def root()`: async Python function used for this route.
- `return {...}`: FastAPI serializes the Python dictionary to JSON.

### 1.3 Configure the entry point

If using the `app/main.py` structure, add the current FastAPI CLI entrypoint to `pyproject.toml`:

```toml
[tool.fastapi]
entrypoint = "app.main:app"
```

Explain that `app.main:app` means:
- First `app`: Python package directory.
- `main`: Python module/file (`main.py`).
- Final `app`: FastAPI application variable inside that module.

### 1.4 Run the development server

```bash
uv run fastapi dev
```

Open:
- `http://127.0.0.1:8000/`
- `http://127.0.0.1:8000/docs`
- `http://127.0.0.1:8000/redoc`
- `http://127.0.0.1:8000/openapi.json`

Explain the difference between development and production commands. `fastapi dev` is for local development; production deployment needs an appropriate production command/runtime and deployment configuration.

### 1.5 Learning checkpoint

The owner should be able to explain:
- What is the `app` variable?
- What does `@app.get("/")` do?
- What is the difference between GET and POST?
- What does `/docs` provide?
- What does JSON mean?

**Acceptance:** App starts, root endpoint responds, Swagger UI works. Stop here and wait for approval.

## Phase 2 — Python and FastAPI foundations through small examples

Do not build product CRUD yet. Teach only the Python and FastAPI concepts needed next.

Topics:
1. Python modules and packages (`__init__.py`).
2. Functions and return values.
3. Type hints (`str`, `int`, `list`, `dict`, optional/union types).
4. `async def` and `await`.
5. Decorators such as `@app.get`.
6. HTTP methods and status codes.
7. Path parameters and query parameters.
8. Request body.
9. Pydantic models.
10. FastAPI dependency injection with `Depends`.
11. Exception handling using `HTTPException`.
12. Response models.

Build small endpoints to demonstrate:
- `GET /health`
- `GET /examples/{item_id}`
- `GET /examples?search=...`
- `POST /examples`

Do not connect a database yet.

Explain the request lifecycle and how FastAPI uses Python type annotations and Pydantic to validate input and generate OpenAPI documentation.

Acceptance:
- Owner can explain path vs query vs body parameters.
- Owner can explain Pydantic validation.
- Owner can test endpoints in Swagger UI.
- Tests or manual checks confirm expected status codes.

## Phase 3 — Configuration and environment variables

Goal: configure the backend safely for local development and future deployments.

Add:
- `pydantic-settings`.
- `app/core/config.py`.
- `.env.example`.
- `.gitignore` rules for `.env`, virtual environments, caches and generated files.

Configuration concepts:
- Application name.
- Environment (`development`, `test`, `production`).
- API prefix.
- Database URL (introduced when needed).
- Clerk issuer/JWKS configuration (introduced in auth phase).
- Allowed frontend origins.

Do not put secrets in source code. `.env.example` contains placeholders only. Actual `.env` stays local and untracked.

Explain:
- Environment variables.
- Why development and production configuration differ.
- Why secrets must not be committed.
- Why `pydantic-settings` validates configuration at startup.

Acceptance:
- App reads safe settings from environment.
- Missing required production settings fail clearly.
- No secrets appear in Git.

## Phase 4 — API organization and first feature contract

Goal: introduce route organization and define the first vertical slice: Projects.

Before coding, align the contract with the Next.js frontend.

Proposed first project endpoints (final shape to be agreed):
- `POST /api/v1/projects`
- `GET /api/v1/projects`
- `GET /api/v1/projects/{project_id}`
- `PATCH /api/v1/projects/{project_id}`

First define:
- Request fields.
- Response fields.
- Validation rules.
- Error responses.
- Pagination/filtering approach.
- Authentication requirement.
- Authorization rules.

Use Pydantic request/response schemas. Explain why an API schema is not the same as a database table.

Initially, implement a temporary in-memory example only if it helps teach routing and schemas. Clearly label it as temporary and replace it with PostgreSQL in the next phase. Do not present in-memory data as persistent.

Acceptance:
- Router is mounted under `/api/v1`.
- OpenAPI docs show the project contract.
- Validation and error responses are tested.
- Frontend and backend agree on the contract.

## Phase 5 — PostgreSQL, SQLAlchemy 2.x and Alembic

Goal: persist project data safely.

### 5.1 Concepts to teach first

Explain in plain English:
- Database vs database server.
- Table, row, column and primary key.
- Foreign key and relationship.
- Index and uniqueness constraint.
- SQL query.
- ORM and why it exists.
- SQLAlchemy Engine.
- Database connection pool.
- Session and transaction.
- Migration and why schema changes need version history.
- Sync vs async database access.

### 5.2 Dependencies to consider

Add only when this phase starts:
- `sqlalchemy[asyncio]`
- `asyncpg`
- `alembic`

Use compatible current versions and lock them.

### 5.3 Database configuration

Use a SQLAlchemy async engine and a session factory. Provide one request-scoped `AsyncSession` through a FastAPI dependency.

Teach:
- What the engine does.
- What a connection pool does.
- Why a session is created per request.
- Why a session must not be shared globally between requests.
- How commit, rollback and close work.
- Why `yield` is useful in a dependency.

### 5.4 ORM model and API schema separation

Conceptual separation:
- SQLAlchemy `Project` model: how the project is stored in PostgreSQL.
- Pydantic `ProjectCreate`: what the API accepts.
- Pydantic `ProjectRead`: what the API returns.

Do not return database models blindly. Define response schemas deliberately.

### 5.5 Alembic migrations

Use Alembic to create and apply schema migrations. Do not rely on `create_all()` as the production schema migration strategy.

Teach:
- What a migration is.
- Why migrations are committed to Git.
- What autogeneration does and does not guarantee.
- How to inspect a generated migration before applying it.
- How to upgrade and downgrade.

Typical commands (verify current project configuration):
```bash
alembic revision --autogenerate -m "create projects table"
alembic upgrade head
alembic current
alembic history
```

Acceptance:
- PostgreSQL connection works.
- Project table is created by migration.
- Create/list/detail/update project operations persist data.
- Each request gets a safe database session.
- Database errors do not expose secrets or internal traces.

## Phase 6 — Clerk authentication and application authorization

The frontend uses Clerk. FastAPI must independently verify the token sent by the frontend.

Important: Do not copy FastAPI's tutorial username/password authentication flow as the application's auth design. Clerk is the identity provider.

Teach:
- Authentication vs authorization.
- Session token / JWT.
- JWT header, payload and signature.
- Issuer and audience.
- Expiration (`exp`).
- JWKS and public keys.
- Why decoding a JWT without verifying its signature is unsafe.
- How Clerk tokens are obtained and verified for the selected Clerk integration.
- How to handle missing, expired and invalid tokens.

Implementation:
1. Confirm the exact Clerk frontend token flow and backend verification requirements from current Clerk documentation.
2. Configure expected issuer and authorized party/audience as applicable.
3. Verify signatures and required claims using a maintained JWT library or Clerk-supported verification method.
4. Cache public signing keys safely and handle key rotation.
5. Create a FastAPI dependency that returns a trusted current-user identity.
6. Add application-level authorization for project ownership, organization membership, creator and participant roles.
7. Test 401 and 403 behavior.

Do not assume claim names. Inspect the actual configured Clerk token template/claims and official docs before implementation. Never accept a user ID or role from the request body as identity proof.

Acceptance:
- Missing/invalid/expired tokens are rejected.
- Valid Clerk token maps to trusted user identity.
- User can access only authorized resources.
- Creator-only actions reject participants.
- Frontend and backend use the same agreed identity model.

## Phase 7 — Challenges and AI project-generation job model

Goal: add challenge records and asynchronous generation workflow without prematurely implementing a complex agent platform.

Teach:
- Why long-running AI generation should not block a normal HTTP request.
- Job status and state transitions.
- Idempotency and retry basics.
- Background tasks vs durable job queues.
- Why FastAPI `BackgroundTasks` is not a full distributed job system.

Initial records:
- Project.
- Challenge.
- Challenge task.
- Generation job.
- Generation status.

Possible statuses:
- queued
- running
- validating
- completed
- failed
- cancelled

Start with a clear service interface and a fake/mock generation adapter if the real AI provider is not ready. Select a durable queue only after retry, persistence, concurrency and worker scaling requirements are understood.

Acceptance:
- Creator can request challenge generation.
- API returns a job identifier/status.
- Job status can be retrieved.
- Failures are recorded safely.
- Hidden expected answers remain server-side.

## Phase 8 — Session, invitation and timer APIs

Goal: build the trusted interview/session lifecycle.

Teach:
- State machines.
- Valid and invalid transitions.
- Server-authoritative timestamps.
- Race conditions.
- Transactions and locking where needed.
- Invitation token security.
- Role-based resource access.

Suggested session states:
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

Suggested actions:
- Create session.
- Create/revoke invitation.
- Join session.
- Start session.
- Pause session.
- Resume session.
- End session.
- Get session status.
- Submit work.

Rules:
- Only authorized creator can start/pause/resume/end.
- Participant can join only with valid invitation and appropriate permissions.
- Timer start/end timestamps are set by backend.
- Browser clock is display-only.
- Enforce valid state transitions on server.
- Use transactions and concurrency protection for important transitions.
- Do not reveal hidden tests or challenge solutions.

Acceptance:
- State transitions are tested.
- Invalid transitions return meaningful errors.
- Invitation expiry/revocation works.
- Timer is server-authoritative.

## Phase 9 — Ephemeral sandbox orchestration

Goal: create and destroy temporary execution environments safely.

Do not implement arbitrary code execution inside the FastAPI process.

Teach:
- Why untrusted code must be isolated.
- Container vs VM vs microVM.
- Resource quotas.
- Network egress restrictions.
- Temporary credentials.
- Environment lifecycle.
- Cleanup and reconciliation.
- Persistent snapshots vs temporary runtime.
- Why Docker alone is not automatically a sufficient security boundary for hostile workloads.

Backend responsibilities:
1. Store validated project snapshot in persistent storage.
2. Create session without a running environment.
3. On authorized start, ask an environment provider to provision a sandbox.
4. Store provider environment ID and lifecycle status.
5. Issue short-lived, scoped access credentials.
6. Save required artifacts before ending.
7. Revoke temporary credentials.
8. Destroy environment and temporary databases/processes.
9. Run a reconciliation worker to detect leaked environments and retry cleanup.

Evaluate providers and hardened runtimes separately. Assess isolation, network controls, persistence, lifecycle APIs, region, pricing, quotas and auditability.

Acceptance:
- Session start provisions an isolated environment.
- Session end saves artifacts and triggers cleanup.
- Cleanup is idempotent and retryable.
- Abandoned sessions are cleaned up by server-side policy.
- No participant code runs in the API process.

## Phase 10 — Realtime collaboration and AI assistant

Goal: add realtime features after core REST APIs and session lifecycle are stable.

Teach:
- HTTP request/response vs WebSocket connection.
- Connection lifecycle and reconnect.
- Presence vs durable state.
- Event authorization.
- Collaborative editing and CRDT concepts.
- Streaming model responses.
- AI tool permissions and audit logging.

Potential features:
- Participant presence.
- Creator timer/session events.
- Shared chat.
- Collaborative code editing (evaluate Yjs/CRDT).
- AI response streaming.
- AI tool calls with explicit permission checks.
- AI usage audit events.

Do not broadcast secrets, hidden test data or another participant's private workspace. WebSocket messages require authorization just like REST endpoints.

## Phase 11 — Evaluation, submissions and reports

Goal: evaluate participant work with deterministic tests plus review signals.

Teach:
- Test execution isolation.
- Hidden tests.
- Static analysis.
- Functional correctness.
- Scoring rubrics.
- Auditability and reproducibility.
- Why an LLM alone should not be the source of truth for scoring.

Persist:
- Submission snapshot.
- Test results.
- Evaluation breakdown.
- AI usage events according to retention policy.
- Human/AI code-change provenance as best-effort metadata.
- Final report.

Do not claim perfect human-vs-AI authorship detection. Track recorded editor and AI operations and correlate them with diffs; explain limitations.

## Phase 12 — Production readiness

Topics:
- Docker packaging for the API.
- Production server process.
- Reverse proxy and HTTPS.
- CORS allowlist.
- Rate limiting.
- Structured logging.
- Metrics and tracing.
- Health/readiness checks.
- Database backups and restore testing.
- Migration deployment.
- Secrets management.
- CI tests and deployment.
- Dependency/security scanning.
- Load testing and capacity planning.

Do not add Kubernetes by default. Select deployment infrastructure based on actual workload and operational needs.

---

# 6. API design standards

Use a versioned prefix such as `/api/v1`.

Conventions:
- Nouns for resource paths.
- HTTP methods express operations.
- Consistent response shapes.
- Appropriate HTTP status codes.
- Pydantic validation.
- Pagination for potentially large lists.
- Stable error format.
- Request IDs/correlation IDs for diagnostics.
- Never expose stack traces or internal database details to clients.

Proposed future resources:
- `/users/me`
- `/projects`
- `/projects/{project_id}`
- `/projects/{project_id}/challenges`
- `/challenges/{challenge_id}`
- `/generation-jobs/{job_id}`
- `/sessions`
- `/sessions/{session_id}`
- `/sessions/{session_id}/invitations`
- `/sessions/{session_id}/participants`
- `/sessions/{session_id}/start`
- `/sessions/{session_id}/pause`
- `/sessions/{session_id}/resume`
- `/sessions/{session_id}/end`
- `/sessions/{session_id}/submissions`
- `/sessions/{session_id}/report`

These are planning names, not final API contracts. Agree on exact payloads with the frontend before implementation.

---

# 7. Frontend integration rules

Frontend is Next.js with Clerk, TanStack Query and TypeScript.

- Define API request/response contracts before implementing a feature.
- Keep FastAPI OpenAPI schema available in development.
- Use OpenAPI to generate TypeScript types/client when the contract stabilizes.
- Do not manually maintain duplicate types if generation is reliable.
- Decide how the Clerk token is attached to requests; never expose backend secrets.
- Configure CORS for exact allowed origins, not wildcard origins with credentials.
- Handle 401 and 403 distinctly.
- Use TanStack Query for client-side server-state caching and mutations.
- Use Next.js Server Components for suitable initial server rendering.
- Use WebSockets for realtime session events when implemented.
- Keep mock frontend services separate from real API services.

The frontend must not call the database directly.

---

# 8. Testing strategy

Use pytest. Add tests progressively rather than waiting until the backend is complete.

Test categories:
- Unit tests for service/business logic.
- API tests for route validation and status codes.
- Database integration tests using a separate test database.
- Auth tests for missing/invalid/valid identities.
- Authorization tests for ownership and roles.
- Migration tests.
- Session state-transition tests.
- Sandbox provider adapter tests using fakes.
- End-to-end tests across frontend and backend later.

Use HTTPX/TestClient patterns supported by the installed FastAPI version. Ensure test database data is isolated and cleaned safely.

Minimum cases:
- Valid request.
- Invalid request body.
- Missing resource.
- Duplicate resource.
- Unauthorized request.
- Forbidden request.
- Database unavailable.
- Unexpected service failure.
- Concurrent session start/end.
- Repeated cleanup request.

---

# 9. Performance and reliability

- Use connection pooling appropriately.
- Avoid N+1 database queries.
- Add indexes based on actual query patterns.
- Paginate list endpoints.
- Select only required columns when useful.
- Keep database transactions short.
- Do not hold a database transaction open while calling an LLM or provisioning a sandbox.
- Put long-running work into durable jobs.
- Add timeouts and bounded retries for external providers.
- Make cleanup and job handlers idempotent.
- Avoid unbounded in-memory state in API workers.
- Use structured logs without tokens, passwords or private code.
- Measure before optimizing.

---

# 10. Security baseline

- Verify Clerk JWT signatures and claims.
- Enforce resource-level authorization in backend.
- Validate every input.
- Use parameterized ORM queries; never concatenate untrusted SQL.
- Keep secrets in environment/secret management.
- Use exact CORS origins.
- Apply rate limits to invitation, AI and expensive endpoints.
- Use random, unguessable invitation tokens; store only a secure hash when practical.
- Expire and revoke invitations.
- Keep hidden tests and expected solutions server-side.
- Use short-lived sandbox credentials.
- Restrict sandbox network access and resource consumption.
- Never execute untrusted code in the FastAPI process.
- Redact sensitive values from logs.
- Define retention/deletion rules for code, AI history and session recordings.

---

# 11. Learning and progress files

Maintain these files at the backend root.

## `BACKEND_CONTEXT.md`

Keep it short and factual:
- Backend purpose.
- Current architecture.
- Python/FastAPI/dependency versions.
- How to run the app.
- Current API prefix.
- Database setup.
- Auth design.
- Implemented features and entry points.
- Current phase.
- Known issues and next step.

## `BACKEND_LEARNING_LOG.md`

The owner is learning FastAPI. After each phase, record:
- Concepts taught.
- What the owner should now understand.
- Commands learned.
- Files created/changed.
- Important code patterns.
- Questions or topics to revisit.
- Next phase.

Example:
```md
## Phase 1 — First FastAPI endpoint

### Concepts learned
- FastAPI application instance
- Route decorator
- GET request
- Async endpoint
- JSON response
- Swagger/OpenAPI docs

### Commands
- `uv run fastapi dev`

### Files
- `app/main.py`
- `pyproject.toml`

### Owner can explain
- What `app` represents
- What `@app.get` registers
- How to open `/docs`

### Questions to revisit
- Difference between `def` and `async def`

### Next
- Phase 2: request parameters and Pydantic
```

## `BACKEND_DECISIONS.md`

Record architecture decisions:
- Decision.
- Reason.
- Alternatives.
- Consequences.
- Date.
- Status.

Do not reread every backend source file in future AI sessions. Read these context files, query Graphify for the current task area if available, then inspect only relevant source.

---

# 12. Official documentation and learning references

Use current official documentation. Do not rely on outdated tutorials for package commands or security.

- FastAPI first steps: https://fastapi.tiangolo.com/tutorial/first-steps/
- FastAPI tutorial: https://fastapi.tiangolo.com/tutorial/
- FastAPI dependencies: https://fastapi.tiangolo.com/tutorial/dependencies/
- FastAPI SQL databases: https://fastapi.tiangolo.com/tutorial/sql-databases/
- FastAPI security: https://fastapi.tiangolo.com/tutorial/security/
- FastAPI CORS: https://fastapi.tiangolo.com/tutorial/cors/
- FastAPI testing: https://fastapi.tiangolo.com/tutorial/testing/
- FastAPI bigger applications: https://fastapi.tiangolo.com/tutorial/bigger-applications/
- SQLAlchemy 2.x: https://docs.sqlalchemy.org/en/20/
- Alembic: https://alembic.sqlalchemy.org/en/latest/
- Pydantic: https://docs.pydantic.dev/latest/
- pydantic-settings: https://docs.pydantic.dev/latest/concepts/pydantic_settings/
- pytest: https://docs.pytest.org/
- uv: https://docs.astral.sh/uv/
- Clerk backend/JWT documentation: https://clerk.com/docs
- OpenAPI: https://www.openapis.org/

FastAPI's official first-steps documentation explains the application instance, route decorators, development server, Swagger UI at `/docs`, ReDoc at `/redoc` and OpenAPI at `/openapi.json`. Its dependency documentation explains reusable dependencies for database sessions and authorization. Read the official SQL database guide before finalizing the exact ORM/session pattern.

---

# 13. First instruction — start now, only with Phase 0

The first response must not create the whole backend.

1. Acknowledge that the owner is new to FastAPI and that you will teach as you build.
2. Inspect the current repository and determine where the backend should live.
3. Check Python, `uv`, Git and existing project files.
4. Use Graphify if available to understand the relevant repository structure without reading the whole project.
5. Explain the proposed backend location and why.
6. Create the three backend learning/context files if appropriate.
7. Do not install the entire technology stack.
8. Report findings and ask for approval to start Phase 1.

After approval, implement Phase 1 only: initialize FastAPI, create the first endpoint, run it, test `/docs`, and explain every relevant line.

**The owner must understand the backend being built. Do not optimize for typing code quickly at the expense of teaching.**
