# Architecture

## Overview
System design and component breakdown for the AI Job Hunt Agent.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite) |
| Backend | FastAPI (Python) |
| AI | OpenAI API |
| Database | TBD |
| Hosting | TBD |

---

## Folder Structure

```
ai-job-hunt-agent/
├── backend/
│   ├── main.py          # FastAPI app entry point
│   ├── config.py        # Environment & app config
│   ├── routes/          # API route handlers
│   │   ├── jobs.py
│   │   ├── resume.py
│   │   └── coverletter.py
│   ├── services/        # Business logic & AI calls
│   │   └── ai_service.py
│   ├── tools/           # Utility/tool functions
│   │   └── job_tools.py
│   ├── models/          # DB models
│   ├── schemas/         # Pydantic schemas
│   └── db/              # Database connection
├── frontend/
│   └── src/
│       ├── pages/       # Page components
│       ├── components/  # Reusable UI components
│       ├── services/    # API calls (api.js)
│       └── utils/       # Helper functions
└── docs/                # Project documentation
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/jobs` | Fetch/search jobs |
| POST | `/resume` | Analyze resume |
| POST | `/coverletter` | Generate cover letter |

---

## Data Flow
1. User uploads resume / enters job details via frontend
2. Frontend calls FastAPI backend via REST
3. Backend processes request using AI service (OpenAI)
4. Response returned to frontend and displayed

