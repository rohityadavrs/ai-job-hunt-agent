from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import ALLOWED_ORIGINS
from routes.resume import router as resume_router
from routes.jobs import router as jobs_router
from routes.coverletter import router as coverletter_router

app = FastAPI(
    title="AI Job Hunt API",
    description="Backend API for AI-powered job hunting assistant",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume_router, prefix="/resume", tags=["Resume"])
app.include_router(jobs_router, prefix="/jobs", tags=["Jobs"])
app.include_router(coverletter_router, prefix="/coverletter", tags=["Cover Letter"])


@app.get("/", tags=["Health"])
async def root():
    return {"status": "ok", "message": "AI Job Hunt API is running"}


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "healthy"}
