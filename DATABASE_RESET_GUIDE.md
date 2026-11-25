# MockPrep Database Reset & Fresh Start Guide

This guide provides instructions and commands to clear all corrupted or test database records and start completely fresh at any time.

---

## Method 1: Instant Data Wipe (Recommended)
This method instantly clears all data across all application and AI tables while **preserving table schemas, columns, foreign keys, indexes, and migrations**.

### Run from Terminal:
From the project root:
```bash
npm run db:reset
```

Or directly inside `MockPrep_Express/`:
```bash
npm --prefix MockPrep_Express run db:reset
```

### What this command does:
1. Connects to your PostgreSQL database (Neon).
2. Executes a cascaded truncation:
   ```sql
   TRUNCATE TABLE 
     app.sessions,
     app.invites,
     app.project_bookmarks,
     app.projects,
     app.user_roles,
     ai.ai_jobs
   RESTART IDENTITY CASCADE;
   ```
3. Resets all sequence identities (IDs restart cleanly).
4. Inspects and prints verified table counts to the terminal (confirming `0 rows` for all tables).

---

## Method 2: Direct SQL Query (Neon Console / DBeaver / psql)
If you prefer running a direct query through the Neon Web SQL Editor or a PostgreSQL client (DBeaver, TablePlus, pgAdmin, psql):

### 1. Wipe All Data (Keep Schema)
```sql
TRUNCATE TABLE 
  app.sessions,
  app.invites,
  app.project_bookmarks,
  app.projects,
  app.user_roles,
  ai.ai_jobs
RESTART IDENTITY CASCADE;
```

---

## Method 3: Full Nuclear Reset (Drop & Re-Migrate Schemas)
Use this method if the schema migrations or table structures themselves ever become corrupted and you want to rebuild every table from zero.

### Step 1: Drop & Recreate Schemas via SQL
Execute in Neon SQL Editor or psql:
```sql
DROP SCHEMA IF EXISTS app CASCADE;
DROP SCHEMA IF EXISTS ai CASCADE;

CREATE SCHEMA app;
CREATE SCHEMA ai;
```

### Step 2: Run Express Migrations
Recreates all 5 application tables and indexes:
```bash
npm run db:migrate
# or
npm --prefix MockPrep_Express run migrate:app
```

### Step 3: Run FastAPI AI Migrations
Recreates the AI job tables:
```bash
cd MockPrep_FastAPI
uv run alembic upgrade head
cd ..
```

---

## Active Tables Reference

| Schema | Table Name | Purpose |
| :--- | :--- | :--- |
| `app` | `user_roles` | User onboarding, candidate/assessor roles, organizations & titles |
| `app` | `projects` | Challenge repositories created by assessors (public & private) |
| `app` | `project_bookmarks` | Projects bookmarked by candidates |
| `app` | `invites` | Single-use email invites and public universal challenge links |
| `app` | `sessions` | Live candidate test environments and assessment countdown sessions |
| `ai` | `ai_jobs` | Background AI challenge generation tasks |
| `ai` | `alembic_version` | Migration tracking for FastAPI |

---

## Starting the Application Fresh
After clearing the database, start all three services in parallel:

```bash
npm run dev:all
```
This concurrently starts:
- **Next.js Frontend**: [http://localhost:3000](http://localhost:3000)
- **Express Backend**: [http://localhost:4000](http://localhost:4000)
- **FastAPI AI Engine**: [http://localhost:8000](http://localhost:8000)
