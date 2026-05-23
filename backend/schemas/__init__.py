"""
Pydantic schemas — request / response shapes shared across routes.
"""
from pydantic import BaseModel
from typing import Optional, Literal


# ── Resume ────────────────────────────────────────────────────────────────────
class ResumeProfile(BaseModel):
    name: str
    currentTitle: str
    desiredRole: str
    skills: list[str]
    yearsExperience: float
    location: str
    education: str
    summary: str


# ── Jobs ──────────────────────────────────────────────────────────────────────
class JobListing(BaseModel):
    id: str
    title: str
    company: str
    location: str
    salary: Optional[str] = None
    posted: str
    matchScore: int
    description: str
    requirements: list[str]
    applyUrl: str
    source: Optional[str] = None


class JobSearchResponse(BaseModel):
    count: int
    jobs: list[JobListing]


# ── Cover Letter ──────────────────────────────────────────────────────────────
class CoverLetterRequest(BaseModel):
    resume_text: str
    job_description: str
    tone: Literal["professional", "enthusiastic", "concise"] = "professional"


class CoverLetterResponse(BaseModel):
    cover_letter: str

