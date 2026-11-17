# How to Run All Services

### Option 1: Run Everything Together (Single Command)

Open a terminal in the project root and run:

```bash
npm run dev:all
```

*Press `Ctrl + C` to stop all 3 services at once.*

---

### Option 2: Run in Separate Terminals

If you want separate terminal tabs for each service:

**Terminal 1 — Frontend (Next.js):**
```bash
npm run dev
```

**Terminal 2 — Backend API (Express):**
```bash
npm run dev:express
```

**Terminal 3 — AI Backend (FastAPI):**
```bash
npm run dev:fastapi
```

---

### Service URLs

| Service | Port | URL |
|---|---|---|
| **Frontend** | 3000 | [http://localhost:3000](http://localhost:3000) |
| **Express API** | 4000 | [http://localhost:4000/health](http://localhost:4000/health) |
| **FastAPI AI (Swagger Docs)** | 8000 | [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) |
| **FastAPI AI (Health)** | 8000 | [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health) |
