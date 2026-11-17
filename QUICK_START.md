# Quick Start Guide: Running All 3 MockPrep Applications

This guide provides the simplest and fastest ways to start all 3 services in the MockPrep platform:
1. **Frontend:** Next.js 16 (Port `3000`)
2. **Main Application API:** Node.js Express (Port `4000`)
3. **AI Intelligence Engine:** Python FastAPI (Port `8000`)

---

## ⚡ Method 1: The 1-Command Magic Method (Fastest)

Open a terminal at the project root (`MockPrep/`) and run:

```bash
npm run dev:all
```

### What happens?
This runs all 3 applications simultaneously in a single terminal with color-coded log prefixes:
- 🟣 **`[next]` (Magenta):** Next.js Frontend on `http://localhost:3000`
- 🔵 **`[express]` (Blue):** Express API on `http://localhost:4000`
- 🟢 **`[fastapi]` (Green):** FastAPI AI Service on `http://127.0.0.1:8000`

To stop all 3 services at once: press **`Ctrl + C`** in that terminal.

---

## 🖥️ Method 2: The 3-Terminal Method (Best for Debugging)

If you prefer having separate terminal tabs so you can inspect individual logs cleanly without text mixing:

### Terminal 1: Next.js Frontend
```bash
# In project root:
npm run dev
```
👉 Opens at: **http://localhost:3000**

---

### Terminal 2: Express API
```bash
# In project root:
npm run dev:express

# OR inside MockPrep_Express folder:
cd MockPrep_Express
npm run dev
```
👉 Health check probe: **http://localhost:4000/health**

---

### Terminal 3: FastAPI AI Engine
```bash
# In project root:
npm run dev:fastapi

# OR inside MockPrep_FastAPI folder:
cd MockPrep_FastAPI
uv run fastapi dev
```
👉 Interactive Swagger UI: **http://127.0.0.1:8000/docs**  
👉 Health check probe: **http://127.0.0.1:8000/health**

---

## 🔄 Method 3: The 2-Terminal Split (Backends + Frontend)

If you want both backends combined in one terminal and the frontend in another:

* **Terminal 1 (Both Backends):**
  ```bash
  npm run dev:services
  ```
  *(Launches Express :4000 and FastAPI :8000 together)*

* **Terminal 2 (Frontend):**
  ```bash
  npm run dev
  ```
  *(Launches Next.js :3000)*

---

## 📋 Pre-Flight Checklist (Required Before First Run)

Ensure your 3 local `.env` files are configured:

### 1. Frontend (`.env.local` in project root)
```ini
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### 2. Express API (`MockPrep_Express/.env`)
```ini
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
FASTAPI_BASE_URL=http://127.0.0.1:8000

# Shared M2M Token
INTERNAL_SERVICE_TOKEN=mockprep-internal-secret-token-change-in-prod

# Neon PostgreSQL
DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@YOUR_HOST.neon.tech/neondb?sslmode=require
```

### 3. FastAPI AI Service (`MockPrep_FastAPI/.env`)
```ini
ENVIRONMENT=development
PROJECT_NAME="MockPrep AI Service"
VERSION="0.1.0"
HOST=127.0.0.1
PORT=8000
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://localhost:4000"]

# Shared M2M Token (Must match Express token!)
INTERNAL_SERVICE_TOKEN=mockprep-internal-secret-token-change-in-prod

# Neon PostgreSQL
DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@YOUR_HOST.neon.tech/neondb?sslmode=require
```

---

## 🗄️ One-Time Database Setup (If Using a New Neon Database)

If you ever change your database or set up on a new machine, run these two quick commands from the project root to create the tables:

```bash
# 1. Create Express 'app' schema and 'app.projects' table:
npm --prefix MockPrep_Express run migrate:app

# 2. Create FastAPI 'ai' schema and 'ai.ai_jobs' table:
uv run --directory MockPrep_FastAPI python -m app.db.init_db
```

---

## 🌐 Quick Verification URLs

Once running, verify each service in your browser:

| Service | URL | Expected Response |
| :--- | :--- | :--- |
| **Next.js Frontend** | `http://localhost:3000` | Landing page / Sign-in UI |
| **Express Health** | `http://localhost:4000/health` | `{"status":"ok","service":"mockprep-express-api",...}` |
| **FastAPI Root** | `http://127.0.0.1:8000/` | `{"message":"MockPrep AI Service is running",...}` |
| **FastAPI Docs** | `http://127.0.0.1:8000/docs` | Interactive Swagger UI API Documentation |
| **FastAPI Health** | `http://127.0.0.1:8000/health` | `{"status":"ok","service":"MockPrep AI Service",...}` |

---

## 🛠️ Troubleshooting Common Startup Issues

* **Port Already in Use (`EADDRINUSE: 3000 / 4000 / 8000`):**  
  A previous process is still running. In PowerShell, find and kill the process:
  ```powershell
  # Find PID:
  Get-NetTCPConnection -LocalPort 4000 -ErrorAction SilentlyContinue | Select-Object OwningProcess
  # Kill it (replace PID with the number found):
  Stop-Process -Id <PID> -Force
  ```
* **FastAPI `ValidationError: Field required: DATABASE_URL`:**  
  Make sure `MockPrep_FastAPI/.env` exists and contains your Neon connection string.
* **Express `Database query error`:**  
  Ensure `MockPrep_Express/.env` has the correct `DATABASE_URL` with `?sslmode=require`.
