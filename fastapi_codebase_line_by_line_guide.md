# Complete Line-by-Line Guide to the MockPrep FastAPI AI Backend

Welcome! This guide is written specifically for you as you learn Python backend development and FastAPI. It walks through **every single file** and **every single line of code** in the `MockPrep_FastAPI` microservice built so far.

---

## 1. High-Level Overview: What is `MockPrep_FastAPI`?

In our 3-tier architecture:

1. **Frontend (`Next.js 16`):** The interactive web app running in the user's browser.
2. **Main Application Backend (`MockPrep_Express`):** The primary server managing users, projects, countdown timers, and permissions.
3. **Dedicated AI Service (`MockPrep_FastAPI`):** The computational intelligence engine. It runs in the background and is responsible for:
   - Generating realistic software bugs and coding challenges.
   - Analyzing project source code and summarizing architectures.
   - Future RAG (Retrieval-Augmented Generation) with vector embeddings.
   - Automated code evaluation and grading.

### Key Python Concepts Used:

- **`async` / `await`:** Non-blocking asynchronous programming so FastAPI can handle thousands of requests without waiting on slow I/O.
- **Pydantic v2:** Automatic data validation using standard Python type hints.
- **SQLAlchemy 2.0 Async:** Modern, type-safe database interaction using Python objects.
- **Alembic:** Database migration tool for Python.
- **Dependency Injection:** FastAPI's system to inject things like database sessions and security checks into route functions cleanly.

---

## 2. Directory Tree

```text
MockPrep_FastAPI/
├── pyproject.toml                         # Project metadata, dependencies & settings
├── alembic.ini                            # Alembic migration configuration
├── app/
│   ├── main.py                            # ASGI application entrypoint & routing mounts
│   ├── core/
│   │   ├── config.py                      # Application settings & environment variables
│   │   └── __init__.py                    # Package marker
│   ├── db/
│   │   ├── base.py                        # SQLAlchemy DeclarativeBase with 'ai' schema
│   │   ├── session.py                     # Async engine & request-scoped session dependency
│   │   ├── init_db.py                     # Standalone script to initialize schema & tables
│   │   └── __init__.py                    # Package marker
│   ├── models/
│   │   ├── job.py                         # SQLAlchemy ORM model for ai.ai_jobs
│   │   └── __init__.py                    # Package marker
│   ├── schemas/
│   │   ├── challenge.py                   # Pydantic DTOs for challenge requests/responses
│   │   ├── error.py                       # Standard error envelope schema
│   │   └── __init__.py                    # Package marker
│   ├── api/
│   │   ├── deps.py                        # Security dependency: X-Service-Token verification
│   │   ├── __init__.py                    # Package marker
│   │   ├── v1/
│   │   │   ├── router.py                  # Public v1 router
│   │   │   ├── __init__.py                # Package marker
│   │   │   └── endpoints/
│   │   │       ├── health.py              # GET /health probe endpoint
│   │   │       └── __init__.py            # Package marker
│   │   └── internal/
│   │       └── v1/
│   │           ├── router.py              # Internal M2M router
│   │           ├── __init__.py            # Package marker
│   │           └── endpoints/
│   │               ├── challenges.py      # POST /generate & GET /jobs/{job_id} endpoints
│   │               └── __init__.py        # Package marker
│   └── utils/
│       ├── health_paths.py                # Health endpoint path constants
│       ├── challenge_paths.py             # Challenge endpoint path constants
│       ├── api_paths.py                   # Consolidated API paths
│       └── __init__.py                    # Package marker
├── migrations/
│   ├── env.py                             # Alembic async migration environment with schema isolation
│   ├── script.py.mako                     # Migration template
│   └── versions/
│       └── 1b927feeecfc_create_ai_jobs_table.py  # Migration creating ai.ai_jobs table
└── tests/
    ├── conftest.py                        # Pytest fixtures (TestClient)
    ├── test_health.py                     # Health & docs endpoint tests
    ├── test_challenges.py                 # Challenge generation & security tests
    └── test_database.py                   # Live Neon database CRUD integration tests
```

---

## 3. Project Configuration & Dependencies

### File: `pyproject.toml`

This is the standard configuration file for modern Python projects (managed via `uv`).

```toml
1: [project]
2: name = "mockprep-fastapi-ai"
3: version = "0.1.0"
4: description = "Dedicated AI and Code Intelligence microservice for MockPrep platform"
5: readme = "README.md"
6: requires-python = ">=3.11"
```

* **Lines 1–6:** Project metadata. `requires-python = ">=3.11"` guarantees we can use modern Python type hinting features.

```toml
7: dependencies = [
8:     "alembic>=1.14.0",
9:     "asyncpg>=0.30.0",
10:     "fastapi[standard]>=0.162.0",
11:     "sqlalchemy[asyncio]>=2.0.0",
12: ]
```

* **Line 8 (`alembic`):** The database migration tool for SQLAlchemy.
* **Line 9 (`asyncpg`):** The fastest asynchronous PostgreSQL driver for Python.
* **Line 10 (`fastapi[standard]`):** The FastAPI web framework along with standard production tools like `uvicorn` (ASGI web server) and `pydantic`.
* **Line 11 (`sqlalchemy[asyncio]`):** The industry-standard Python Object-Relational Mapper (ORM) configured with async support.

```toml
14: [dependency-groups]
15: dev = [
16:     "httpx>=0.28.1",
17:     "pytest>=9.2.0",
18: ]
```

* **Line 16 (`httpx`):** An async HTTP client used by FastAPI's `TestClient` to make fast test requests.
* **Line 17 (`pytest`):** Python's leading testing framework.

```toml
20: [tool.fastapi]
21: entrypoint = "app.main:app"
22: 
23: [tool.pytest.ini_options]
24: testpaths = ["tests"]
25: pythonpath = ["."]
```

* **Line 21:** Tells the `fastapi dev` command where to find the application instance (`app` object in `app/main.py`).
* **Lines 23–25:** Configures `pytest` to automatically find tests in the `tests/` directory and include the root folder in Python's import search path.

---

## 4. Application Settings & Configuration

### File: `app/core/config.py`

Loads and validates configuration from environment variables and `.env`.

```python
1: from pydantic import computed_field
2: from pydantic_settings import BaseSettings, SettingsConfigDict
```

* Imports Pydantic's specialized settings tools.

```python
5: class Settings(BaseSettings):
6:     """
7:     Application settings powered by Pydantic Settings.
8:     Automatically reads variables from the environment and falls back to .env.
9:     """
10: 
11:     model_config = SettingsConfigDict(
12:         env_file=".env",
13:         env_file_encoding="utf-8",
14:         extra="ignore",
15:     )
```

* **Lines 5–15:** Defines a `Settings` class inheriting from `BaseSettings`. Pydantic automatically checks system environment variables first; if not found, it reads from `.env`. `extra="ignore"` means extra unknown environment variables won't cause crashes.

```python
17:     ENVIRONMENT: str = "development"
18:     PROJECT_NAME: str = "MockPrep AI Service"
19:     VERSION: str = "0.1.0"
20:     API_V1_STR: str = "/api/v1"
21:     INTERNAL_API_PREFIX: str = "/internal/v1"
```

* **Lines 17–21:** Default values for environment, project title, version, and route prefixes.

```python
23:     # Shared secret header token for Express -> FastAPI machine-to-machine communication
24:     INTERNAL_SERVICE_TOKEN: str = "mockprep-internal-secret-token-change-in-prod"
25: 
26:     # Database connection string (PostgreSQL / Neon)
27:     DATABASE_URL: str = (
28:         "postgresql+asyncpg://neondb_owner:npg_2UGQ8pKSuwej@ep-mute-queen-abfugb4p-pooler.eu-west-2.aws.neon.tech/neondb"
29:     )
30: 
31:     HOST: str = "127.0.0.1"
32:     PORT: int = 8000
```

* **Line 24:** The shared secret token. Express must include this in the `X-Service-Token` header to call internal AI endpoints.
* **Lines 27–29:** The connection string pointing to Neon PostgreSQL.

```python
35:     BACKEND_CORS_ORIGINS: list[str] = [
36:         "http://localhost:3000",  # Next.js frontend
37:         "http://localhost:4000",  # Express API
38:     ]
```

* **Lines 35–38:** Whitelisted CORS origins.

```python
40:     @computed_field
41:     @property
42:     def is_production(self) -> bool:
43:         return self.ENVIRONMENT.lower() == "production"
```

* **Lines 40–43:** A computed helper property returning `True` only if running in production.

```python
45:     @computed_field
46:     @property
47:     def async_database_url(self) -> str:
48:         """
49:         Normalizes database URL to ensure postgresql+asyncpg driver prefix.
50:         Strips query strings for clean engine connect_args usage.
51:         """
52:         url = self.DATABASE_URL
53:         if url.startswith("postgres://"):
54:             url = url.replace("postgres://", "postgresql+asyncpg://", 1)
55:         elif url.startswith("postgresql://") and not url.startswith("postgresql+asyncpg://"):
56:             url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
57: 
58:         if "?" in url:
59:             url = url.split("?")[0]
60:         return url
```

* **Lines 45–60:** `async_database_url` computed property:
  * Neon URLs often start with `postgres://` or `postgresql://`. But SQLAlchemy async requires the specific driver name: `postgresql+asyncpg://`.
  * URL query parameters like `?sslmode=require` cause syntax errors in `asyncpg`. This property strips `?sslmode=require` because we pass SSL directly into the driver connection settings instead.

```python
63: settings = Settings()
```

* **Line 63:** Instantiates a singleton `settings` object used throughout the application.

---

## 5. Application Entrypoint & Lifespan

### File: `app/main.py`

This is the main application file that initializes FastAPI and configures routes.

```python
1: from collections.abc import AsyncIterator
2: from contextlib import asynccontextmanager
3: from datetime import datetime, timezone
4: from fastapi import FastAPI
5: from fastapi.middleware.cors import CORSMiddleware
6: from app.api.internal.v1.router import internal_router
7: from app.api.v1.endpoints.health import HealthResponse
8: from app.api.v1.router import api_router
9: from app.core.config import settings
10: from app.utils.challenge_paths import CHALLENGE_PATHS
11: from app.utils.health_paths import HEALTH_PATHS
```

* Standard imports from Python and our project packages.

```python
14: @asynccontextmanager
15: async def lifespan(app: FastAPI) -> AsyncIterator[None]:
16:     """
17:     Lifespan context manager runs startup and shutdown logic.
18:     Replaces deprecated @app.on_event('startup') and @app.on_event('shutdown').
19:     """
20:     # Startup: Initialize connections, thread pools, or model cache
21:     print(f"[{settings.PROJECT_NAME}] Starting up in {settings.ENVIRONMENT} mode...")
22:     yield
23:     # Shutdown: Clean up connections or resources
24:     print(f"[{settings.PROJECT_NAME}] Shutting down gracefully...")
```

* **Lines 14–25 (`lifespan`):**
  * Modern FastAPI uses a Python **context manager** (`@asynccontextmanager`) for application lifecycles.
  * Everything before `yield` runs when the server starts up (e.g. warming up AI models, preparing database connections).
  * The server then runs and serves traffic during the `yield`.
  * Everything after `yield` runs when the server receives a shutdown signal (closing database pools cleanly).

```python
27: app = FastAPI(
28:     title=settings.PROJECT_NAME,
29:     version=settings.VERSION,
30:     description="Dedicated AI and Code Intelligence microservice for MockPrep platform.",
31:     docs_url="/docs",
32:     redoc_url="/redoc",
33:     openapi_url="/openapi.json",
34:     lifespan=lifespan,
35: )
```

* **Lines 27–35:** Creates the `FastAPI` app instance:
  * `docs_url="/docs"`: Enables interactive Swagger UI.
  * `redoc_url="/redoc"`: Enables alternative ReDoc documentation.
  * `openapi_url="/openapi.json"`: Generates the OpenAPI 3.1 JSON schema.

```python
37: # Configure CORS
38: if settings.BACKEND_CORS_ORIGINS:
39:     app.add_middleware(
40:         CORSMiddleware,
41:         allow_origins=settings.BACKEND_CORS_ORIGINS,
42:         allow_credentials=True,
43:         allow_methods=["*"],
44:         allow_headers=["*"],
45:     )
```

* **Lines 37–45:** Adds CORS middleware allowing calls from port 3000 (Next.js) and port 4000 (Express).

```python
49: @app.get(
50:     HEALTH_PATHS.ROOT,
51:     summary="Root Service Index",
52:     tags=["Root"],
53: )
54: async def root() -> dict[str, str]:
55:     """Simple root greeting pointing to documentation."""
56:     return {
57:         "message": f"{settings.PROJECT_NAME} is running",
58:         "docs": HEALTH_PATHS.DOCS,
59:         "version": settings.VERSION,
60:     }
```

* **Lines 49–60 (`GET /`):** Friendly root endpoint returning a JSON greeting with a link to `/docs`.

```python
64: @app.get(
65:     HEALTH_PATHS.HEALTH,
66:     response_model=HealthResponse,
67:     summary="Top-Level Health Check",
68:     tags=["Health"],
69: )
70: async def root_health() -> HealthResponse:
71:     """Standard health check accessible at root level for orchestrators."""
72:     return HealthResponse(
73:         status="ok",
74:         service=settings.PROJECT_NAME,
75:         version=settings.VERSION,
76:         environment=settings.ENVIRONMENT,
77:         timestamp=datetime.now(timezone.utc),
78:     )
```

* **Lines 64–78 (`GET /health`):** Top-level liveness probe used by Docker, Kubernetes, or cloud load balancers.

```python
81: # Mount versioned API routes under /api/v1
82: app.include_router(api_router, prefix=settings.API_V1_STR)
83: 
84: # Mount internal service-to-service routes under /internal/v1
85: app.include_router(internal_router, prefix=CHALLENGE_PATHS.INTERNAL_PREFIX)
```

* **Line 82:** Mounts public API routes under `/api/v1`.
* **Line 85:** Mounts internal machine-to-machine AI routes under `/internal/v1`.

---

## 6. Database Layer & Schema Ownership

### File: `app/db/base.py`

Defines the base class for all database tables and locks them to the `ai` schema.

```python
1: from sqlalchemy import MetaData
2: from sqlalchemy.orm import DeclarativeBase
3: 
4: # Define 'ai' as the default schema for all models inheriting from Base.
5: # This enforces the architectural boundary: FastAPI owns the 'ai' schema.
6: metadata_obj = MetaData(schema="ai")
7: 
8: 
9: class Base(DeclarativeBase):
10:     """
11:     Base class for all SQLAlchemy ORM models in the FastAPI service.
12:     """
13: 
14:     metadata = metadata_obj
```

* **Lines 1–14:**
  * In SQLAlchemy, `DeclarativeBase` is the parent class for all database models.
  * `MetaData(schema="ai")`: **Crucial Architectural Rule!** By assigning `schema="ai"` to the metadata object, every table created by FastAPI automatically lives inside the `ai` schema namespace in PostgreSQL (e.g. `ai.ai_jobs`). FastAPI will never accidentally pollute the `public` schema or the Express `app` schema.

---

### File: `app/db/session.py`

Manages the async database connection engine and request-scoped sessions.

```python
1: from collections.abc import AsyncIterator
2: from sqlalchemy.ext.asyncio import (
3:     AsyncSession,
4:     async_sessionmaker,
5:     create_async_engine,
6: )
7: from app.core.config import settings
```

* Imports SQLAlchemy's asynchronous session tools.

```python
9: # Create async SQLAlchemy engine with connection pool
10: async_engine = create_async_engine(
11:     settings.async_database_url,
12:     echo=False,
13:     connect_args={"ssl": "require"},
14:     pool_size=5,
15:     max_overflow=10,
16:     pool_pre_ping=True,
17: )
```

* **Lines 10–17 (`async_engine`):**
  * `create_async_engine`: Creates the pool of async connections to Neon PostgreSQL.
  * `connect_args={"ssl": "require"}`: Enforces SSL encryption.
  * `pool_size=5`: Maintains 5 persistent database connections ready to use.
  * `max_overflow=10`: Allows up to 10 additional temporary connections during high traffic spikes.
  * `pool_pre_ping=True`: Tests each connection with a tiny `ping` before handing it to a query. If Neon dropped an idle connection, it transparently reconnects without crashing the request.

```python
19: # Factory for request-scoped async sessions
20: async_session_maker = async_sessionmaker(
21:     bind=async_engine,
22:     class_=AsyncSession,
23:     expire_on_commit=False,
24: )
```

* **Lines 20–24 (`async_session_maker`):**
  * A factory that generates new `AsyncSession` instances.
  * `expire_on_commit=False`: Keeps object attributes loaded in memory even after committing, preventing unexpected database refetches.

```python
27: async def get_db() -> AsyncIterator[AsyncSession]:
28:     """
29:     FastAPI dependency yielding a request-scoped AsyncSession.
30:     Automatically commits on success and rolls back on exception.
31:     """
32:     async with async_session_maker() as session:
33:         try:
34:             yield session
35:             await session.commit()
36:         except Exception:
37:             await session.rollback()
38:             raise
```

* **Lines 27–38 (`get_db` dependency):**
  * This is a **FastAPI Dependency Generator**:
  * Whenever a route handler writes `db: AsyncSession = Depends(get_db)`:
    1. It opens a clean async session (`async with async_session_maker()`).
    2. It `yield`s the session to the route so the route can run queries.
    3. If the route finishes without errors, it automatically runs `await session.commit()`.
    4. If an exception occurs, it jumps to `except`, runs `await session.rollback()`, and re-raises the error.
    5. The session is closed automatically when exiting the `with` block!

---

### File: `app/models/job.py`

The SQLAlchemy ORM database model representing an AI background job.

```python
1: from datetime import datetime, timezone
2: from typing import Any
3: from sqlalchemy import DateTime, Integer, String, Text
4: from sqlalchemy.dialects.postgresql import JSONB
5: from sqlalchemy.orm import Mapped, mapped_column
6: from app.db.base import Base
```

* Imports modern SQLAlchemy 2.0 type mapping utilities and PostgreSQL's native `JSONB` data type.

```python
9: class AIJob(Base):
10:     """
11:     SQLAlchemy ORM model representing an asynchronous AI computation job.
12:     Persisted within the 'ai' schema (ai.ai_jobs).
13:     """
14: 
15:     __tablename__ = "ai_jobs"
```

* **Line 9:** Inherits from `Base`, placing this table inside `ai.ai_jobs`.
* **Line 15:** Table name in the database.

```python
17:     id: Mapped[str] = mapped_column(String(64), primary_key=True)
18:     project_id: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
19:     status: Mapped[str] = mapped_column(String(32), nullable=False, default="queued")
20:     message: Mapped[str | None] = mapped_column(Text, nullable=True)
21:     estimated_duration_seconds: Mapped[int] = mapped_column(Integer, default=15)
22:     result: Mapped[dict[str, Any] | None] = mapped_column(JSONB, nullable=True)
23:     error: Mapped[str | None] = mapped_column(Text, nullable=True)
24:     created_at: Mapped[datetime] = mapped_column(
25:         DateTime(timezone=True),
26:         default=lambda: datetime.now(timezone.utc),
27:         nullable=False,
28:     )
29:     updated_at: Mapped[datetime] = mapped_column(
30:         DateTime(timezone=True),
31:         default=lambda: datetime.now(timezone.utc),
32:         onupdate=lambda: datetime.now(timezone.utc),
33:         nullable=False,
34:     )
```

* **Line 17 (`id`):** Primary key string (e.g., `job_a1b2c3d4e5f6`).
* **Line 18 (`project_id`):** The project context ID, indexed (`index=True`) for fast lookups.
* **Line 19 (`status`):** `queued`, `processing`, `completed`, or `failed`.
* **Line 22 (`result`):** Uses PostgreSQL native **`JSONB`**! Because AI outputs (prompts, generated code, bug explanations) can have flexible structures, `JSONB` lets us store rich JSON dictionaries that can still be queried inside PostgreSQL.
* **Lines 24–34 (`created_at`, `updated_at`):** UTC timezone-aware datetimes with automatic `onupdate` timestamps.

---

### File: `app/db/init_db.py`

A direct script to create the `ai` schema and tables without running Alembic migrations.

```python
1: import asyncio
2: from sqlalchemy import text
3: from app.db.base import Base
4: from app.db.session import async_engine
5: import app.models.job  # noqa: F401
6: 
7: 
8: async def init_ai_schema() -> None:
9:     """
10:     Ensures the 'ai' schema exists and creates all FastAPI-owned tables.
11:     """
12:     print("[DB Init] Initializing FastAPI 'ai' schema...")
13:     async with async_engine.begin() as conn:
14:         await conn.execute(text("CREATE SCHEMA IF NOT EXISTS ai;"))
15:         await conn.run_sync(Base.metadata.create_all)
16:     print("[DB Init] 'ai' schema and tables initialized successfully.")
17: 
18: 
19: if __name__ == "__main__":
20:     asyncio.run(init_ai_schema())
```

* **Lines 13–15:** Executes `CREATE SCHEMA IF NOT EXISTS ai;` and calls `Base.metadata.create_all`, which inspects all imported models (like `AIJob`) and generates the tables if they don't already exist.

---

## 7. Alembic Database Migrations & Schema Isolation

### File: `migrations/env.py`

This is the configuration script for Alembic migrations. We customized it with **strict schema filters**.

```python
18: target_metadata = Base.metadata
```

* Tells Alembic to read table definitions from our SQLAlchemy `Base`.

```python
21: def include_object(object, name, type_, reflected, compare_to):
22:     """
23:     Ensure Alembic only touches tables and indexes within the 'ai' schema.
24:     Prevents accidental inspection or deletion of 'app' or other foreign tables.
25:     """
26:     if type_ == "table":
27:         return object.schema == "ai"
28:     return True
29: 
30: 
31: def include_name(name, type_, parent_names):
32:     """
33:     Filters schemas so Alembic only inspects the 'ai' schema.
34:     """
35:     if type_ == "schema":
36:         return name == "ai"
37:     return True
```

* **Lines 21–37 (`include_object` & `include_name`):**
  * **Critical Safeguard!**
  * Neon PostgreSQL hosts multiple schemas (like `neon_auth` and Express's `app` schema).
  * By default, Alembic looks at the *entire* database. If it sees tables that aren't defined in FastAPI's `Base`, it tries to generate `DROP TABLE` statements!
  * These filter functions instruct Alembic: *"If the schema is NOT 'ai', ignore it completely."*

```python
40: def run_migrations_offline() -> None:
...
50:         version_table_schema="ai",
...
57: def do_run_migrations(connection: Connection) -> None:
...
64:         version_table_schema="ai",
```

* `version_table_schema="ai"`: Stores Alembic's tracking table inside `ai.alembic_version` instead of `public.alembic_version`.

```python
71: async def run_async_migrations() -> None:
72:     """Run migrations in 'online' mode using async engine."""
73:     connectable = create_async_engine(
74:         settings.async_database_url,
75:         poolclass=pool.NullPool,
76:         connect_args={"ssl": "require"},
77:     )
78: 
79:     async with connectable.connect() as connection:
80:         await connection.run_sync(do_run_migrations)
81: 
82:     await connectable.dispose()
```

* Runs the migrations asynchronously using `NullPool` (closing connections immediately after the migration finishes).

---

### File: `migrations/versions/1b927feeecfc_create_ai_jobs_table.py`

The actual versioned migration file.

```python
21: def upgrade() -> None:
22:     """Upgrade schema: ensure schema 'ai' exists and create 'ai_jobs' table."""
23:     op.execute("CREATE SCHEMA IF NOT EXISTS ai;")
24:     op.execute("""
25:     CREATE TABLE IF NOT EXISTS ai.ai_jobs (
26:         id VARCHAR(64) PRIMARY KEY,
27:         project_id VARCHAR(64) NOT NULL,
28:         status VARCHAR(32) NOT NULL DEFAULT 'queued',
29:         message TEXT,
30:         estimated_duration_seconds INTEGER NOT NULL DEFAULT 15,
31:         result JSONB,
32:         error TEXT,
33:         created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
34:         updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
35:     );
36:     """)
37:     op.execute("CREATE INDEX IF NOT EXISTS ix_ai_ai_jobs_project_id ON ai.ai_jobs (project_id);")
38: 
39: 
40: def downgrade() -> None:
41:     """Downgrade schema."""
42:     op.execute("DROP TABLE IF EXISTS ai.ai_jobs;")
```

* **Lines 21–38 (`upgrade`):** Creates the `ai` schema, creates `ai.ai_jobs`, and adds the index on `project_id`.
* **Lines 40–42 (`downgrade`):** Safely drops the table if you ever need to rollback this migration.

---

## 8. Data Contracts & Pydantic Schemas

### File: `app/schemas/challenge.py`

Defines the exact shape of request and response payloads between Express and FastAPI.

```python
8: class DifficultyLevel(str, Enum):
9:     """Target difficulty level for engineering challenges."""
10:     EASY = "easy"
11:     MEDIUM = "medium"
12:     HARD = "hard"
```

* **Lines 8–13:** An Enum enforcing that `difficulty` can only ever be `"easy"`, `"medium"`, or `"hard"`. Any other string gets automatically rejected with a `422 Unprocessable Entity` error.

```python
16: class ChallengeType(str, Enum):
17:     BUG_FIX = "bug_fix"
18:     FEATURE_ADDITION = "feature_addition"
19:     REFACTORING = "refactoring"
20:     PERFORMANCE_OPTIMIZATION = "performance_optimization"
21:     SECURITY_HARDENING = "security_hardening"
22: 
23: class JobStatus(str, Enum):
24:     QUEUED = "queued"
25:     PROCESSING = "processing"
26:     COMPLETED = "completed"
27:     FAILED = "failed"
```

* Enums for allowed challenge types and job lifecycle states.

```python
35: class CamelModel(BaseModel):
36:     """
37:     Base schema configured to support both camelCase (JSON API standard)
38:     and snake_case (Python standard) seamlessly.
39:     """
40:     model_config = ConfigDict(
41:         alias_generator=to_camel,
42:         populate_by_name=True,
43:     )
```

* **Lines 35–44 (`CamelModel`):**
  * **Brilliant Bridging Utility:**
  * In Python, variables are written in `snake_case` (e.g. `project_id`).
  * In JavaScript/Express, variables are written in `camelCase` (e.g. `projectId`).
  * `alias_generator=to_camel` automatically converts incoming `projectId` from Express into `project_id` in Python, and serializes `project_id` back to `projectId` in JSON responses!

```python
47: class ChallengeGenerateRequest(CamelModel):
48:     project_id: str = Field(..., min_length=1, description="Identifier of the project context")
49:     project_name: str = Field(..., min_length=1, description="Human-readable project title")
50:     difficulty: DifficultyLevel = Field(
51:         default=DifficultyLevel.MEDIUM,
52:         description="Target difficulty level",
53:     )
54:     tech_stack: list[str] = Field(
55:         default_factory=list,
56:         description="List of primary programming languages and frameworks",
57:     )
58:     code_summary: str = Field(
59:         ...,
60:         min_length=5,
61:         description="Architectural overview or summarized files of the project",
62:     )
63:     challenge_types: list[ChallengeType] = Field(
64:         default_factory=lambda: [ChallengeType.BUG_FIX],
65:         description="Types of challenges requested",
66:     )
67:     custom_instructions: str | None = Field(
68:         default=None,
69:         description="Optional author prompt notes or constraints",
70:     )
```

* **Lines 47–75 (`ChallengeGenerateRequest`):**
  * The DTO sent by Express.
  * `Field(...)` means the field is required.
  * `min_length=5` prevents empty or meaningless summaries.

```python
77: class ChallengeJobResponse(CamelModel):
78:     job_id: str = Field(..., description="Unique tracking identifier for this background job")
79:     project_id: str = Field(..., description="Target project identifier")
80:     status: JobStatus = Field(default=JobStatus.QUEUED)
81:     message: str = Field(...)
82:     estimated_duration_seconds: int = Field(default=15)
83:     created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
84:     updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
85:     result: dict[str, Any] | None = Field(default=None)
86:     error: str | None = Field(default=None)
```

* **Lines 77–108 (`ChallengeJobResponse`):** The response DTO containing tracking metadata and the eventual result payload.

---

### File: `app/schemas/error.py`

Standardizes error responses across Express and FastAPI.

```python
5: class ErrorDetail(BaseModel):
6:     code: str = Field(..., description="Machine-readable error classification code")
7:     message: str = Field(..., description="Human-readable explanation of what went wrong")
8:     details: list[dict[str, Any]] | None = Field(default=None)
9: 
10: class ErrorResponse(BaseModel):
11:     error: ErrorDetail
```

* Enforces that all error responses follow the shape `{ "error": { "code": "...", "message": "..." } }`.

---

## 9. Security & Dependency Injection

### File: `app/api/deps.py`

Secures internal endpoints so only Express can invoke them.

```python
1: from typing import Annotated
2: from fastapi import Header, HTTPException, status
3: from app.core.config import settings
4: 
5: 
6: async def verify_service_token(
7:     x_service_token: Annotated[str | None, Header(alias="X-Service-Token")] = None,
8: ) -> str:
9:     """
10:     Dependency to authenticate internal service-to-service requests.
11:     Validates that the caller provided the expected shared secret in the 'X-Service-Token' header.
12:     Rejects unauthorized external callers with 401 Unauthorized.
13:     """
14:     if not x_service_token:
15:         raise HTTPException(
16:             status_code=status.HTTP_401_UNAUTHORIZED,
17:             detail="Missing required internal authentication header: X-Service-Token",
18:             headers={"WWW-Authenticate": "ServiceToken"},
19:         )
20: 
21:     if x_service_token != settings.INTERNAL_SERVICE_TOKEN:
22:         raise HTTPException(
23:             status_code=status.HTTP_401_UNAUTHORIZED,
24:             detail="Invalid service token provided",
25:             headers={"WWW-Authenticate": "ServiceToken"},
26:         )
27: 
28:     return x_service_token
```

* **Lines 6–8:** Reads the `X-Service-Token` header using `Annotated[..., Header(...)]`.
* **Lines 14–19:** If the header is missing, immediately throws HTTP `401 Unauthorized`.
* **Lines 21–26:** If the token does not match `settings.INTERNAL_SERVICE_TOKEN`, immediately throws HTTP `401 Unauthorized`.
* Any endpoint that adds `_token: str = Depends(verify_service_token)` is automatically protected!

---

## 10. Endpoints & Routers

### File: `app/api/v1/endpoints/health.py`

Public health check probe.

```python
10: class HealthResponse(BaseModel):
11:     status: str = Field(default="ok")
12:     service: str = Field(...)
13:     version: str = Field(...)
14:     environment: str = Field(...)
15:     timestamp: datetime = Field(...)
```

* Pydantic schema for the health payload.

```python
22: @router.get(
23:     HEALTH_PATHS.HEALTH,
24:     response_model=HealthResponse,
25:     status_code=status.HTTP_200_OK,
26: )
27: async def check_health() -> HealthResponse:
28:     return HealthResponse(
29:         status="ok",
30:         service=settings.PROJECT_NAME,
31:         version=settings.VERSION,
32:         environment=settings.ENVIRONMENT,
33:         timestamp=datetime.now(timezone.utc),
34:     )
```

* Responds with HTTP `200 OK` and current service metadata.

---

### File: `app/api/internal/v1/endpoints/challenges.py`

Protected internal endpoints for AI challenge generation.

```python
16: _jobs_db: dict[str, ChallengeJobResponse] = {}
```

* An in-memory store for tracking jobs during Phase 4 (persisted to `ai.ai_jobs` in Phase 5+).

```python
19: @router.post(
20:     CHALLENGE_PATHS.GENERATE,
21:     response_model=ChallengeJobResponse,
22:     status_code=status.HTTP_202_ACCEPTED,
23: )
24: async def generate_challenge(
25:     payload: ChallengeGenerateRequest,
26:     _token: str = Depends(verify_service_token),
27: ) -> ChallengeJobResponse:
```

* **Line 22:** Returns HTTP **202 Accepted** (indicating the job has been queued).
* **Line 26:** Enforces `verify_service_token` security check.

```python
35:     job_id = f"job_{uuid.uuid4().hex[:12]}"
36:     now = datetime.now(timezone.utc)
37: 
38:     job = ChallengeJobResponse(
39:         job_id=job_id,
40:         project_id=payload.project_id,
41:         status=JobStatus.QUEUED,
42:         message=f"Challenge generation job accepted for project '{payload.project_name}'.",
43:         estimated_duration_seconds=15,
44:         created_at=now,
45:         updated_at=now,
46:     )
47: 
48:     _jobs_db[job_id] = job
49:     return job
```

* **Lines 35–49:** Generates a unique `job_id`, records the initial status as `JobStatus.QUEUED`, stores it, and returns the tracking metadata to Express.

```python
52: @router.get(
53:     CHALLENGE_PATHS.JOB_BY_ID,
54:     response_model=ChallengeJobResponse,
55:     status_code=status.HTTP_200_OK,
56: )
57: async def get_challenge_job(
58:     job_id: str,
59:     _token: str = Depends(verify_service_token),
60: ) -> ChallengeJobResponse:
61:     job = _jobs_db.get(job_id)
62:     if not job:
63:         raise HTTPException(
64:             status_code=status.HTTP_404_NOT_FOUND,
65:             detail=f"Job with ID '{job_id}' not found",
66:         )
67:     return job
```

* **Lines 52–67 (`GET /jobs/{job_id}`):** Allows Express to poll the status of a queued AI generation job. Returns `404 Not Found` if the job does not exist.

---

### Files: `app/api/v1/router.py` & `app/api/internal/v1/router.py`

* `app/api/v1/router.py`: Aggregates public endpoints (`api_router.include_router(health.router, tags=["Health"])`).
* `app/api/internal/v1/router.py`: Aggregates internal endpoints (`internal_router.include_router(challenges.router, prefix="/challenges")`).

---

## 11. Centralized Path Constants

### File: `app/utils/challenge_paths.py`

```python
class ChallengePaths:
    INTERNAL_PREFIX: str = "/internal/v1"
    CHALLENGES_PREFIX: str = "/challenges"
    GENERATE: str = "/generate"
    JOB_BY_ID: str = "/jobs/{job_id}"
    FULL_GENERATE: str = "/internal/v1/challenges/generate"
    FULL_JOB_BASE: str = "/internal/v1/challenges/jobs"

    @staticmethod
    def full_job_by_id(job_id: str) -> str:
        return f"/internal/v1/challenges/jobs/{job_id}"

CHALLENGE_PATHS = ChallengePaths()
```

* Centralized path constants prevent bugs caused by typographical errors in route URLs.

---

## 12. Automated Test Suite (pytest + httpx)

FastAPI has 13 automated tests across three files:

### File: `tests/conftest.py`

```python
@pytest.fixture(scope="session")
def client() -> Generator[TestClient, None, None]:
    with TestClient(app) as test_client:
        yield test_client
```

* Creates a reusable in-memory `TestClient` that makes synchronous HTTP requests directly to the FastAPI ASGI application without binding to live TCP ports.

### File: `tests/test_health.py` (5 tests)

1. `test_root_endpoint`: Verifies `GET /` returns `200` and contains a link to `/docs`.
2. `test_top_level_health_endpoint`: Verifies `GET /health` returns `200` with status `"ok"`.
3. `test_v1_health_endpoint`: Verifies `GET /api/v1/health` returns `200`.
4. `test_openapi_schema`: Verifies `/openapi.json` is generated correctly.
5. `test_swagger_docs`: Verifies `/docs` serves the Swagger UI HTML.

### File: `tests/test_challenges.py` (6 tests)

1. `test_generate_challenge_unauthorized_missing_token`: Verifies that omitting `X-Service-Token` returns `401 Unauthorized`.
2. `test_generate_challenge_unauthorized_invalid_token`: Verifies that an incorrect token returns `401 Unauthorized`.
3. `test_generate_challenge_validation_error`: Verifies that sending missing or invalid fields returns `422 Unprocessable Entity`.
4. `test_generate_challenge_success`: Verifies that a valid payload returns `202 Accepted` with a `jobId`.
5. `test_get_challenge_job_status_success`: Verifies polling `GET /jobs/{job_id}` returns `200` and status `"queued"`.
6. `test_get_challenge_job_status_not_found`: Verifies querying a non-existent job returns `404 Not Found`.

### File: `tests/test_database.py` (2 tests)

1. `test_database_connection`: Connects to Neon PostgreSQL and asserts `SELECT 1` equals 1.
2. `test_ai_job_crud_in_ai_schema`: Tests the full CRUD lifecycle on `ai.ai_jobs`:
   * Inserts an `AIJob` with `JSONB` data.
   * Reads it back and asserts fields match.
   * Updates its status to `"completed"`.
   * Deletes the job and confirms it no longer exists.
   * Uses `poolclass=pool.NullPool` to prevent Windows `ProactorEventLoop` teardown errors.

---

## 13. End-to-End Request Flow Diagram

```text
1. Express API (Caller)
   │  POST /internal/v1/challenges/generate
   │  Header: X-Service-Token: mockprep-internal-...
   │  Header: X-Correlation-ID: uuid-...
   │  Body: { projectId, projectName, codeSummary }
   │
   ▼
2. app/main.py ──► FastAPI Router
   │
   ▼
3. app/api/deps.py (verify_service_token Dependency)
   ├── Missing/Invalid Token? ──► Returns 401 Unauthorized immediately
   └── Valid Token? ──► Continues to route handler
   │
   ▼
4. app/schemas/challenge.py (Pydantic Validation)
   ├── Invalid types/Missing fields? ──► Returns 422 Unprocessable Entity
   └── Valid? ──► Converts camelCase JSON to snake_case Python DTO
   │
   ▼
5. app/api/internal/v1/endpoints/challenges.py
   ├── Generates unique job_id (e.g., job_9a8b7c6d5e4f)
   ├── Records status as "queued"
   └── Returns HTTP 202 Accepted { jobId, status: "queued", ... }
```
