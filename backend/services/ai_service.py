"""
AI Service — all OpenAI interactions live here.
Never call os.getenv() directly; import from config instead.
"""
import json
from functools import lru_cache

from openai import AsyncOpenAI
from config import OPENAI_API_KEY, OPENAI_MODEL


@lru_cache(maxsize=1)
def _get_client() -> AsyncOpenAI:
    if not OPENAI_API_KEY:
        raise RuntimeError("OPENAI_API_KEY is not set. Add it to backend/.env")
    return AsyncOpenAI(api_key=OPENAI_API_KEY)


async def analyze_resume(file_bytes: bytes, filename: str) -> dict:
    """
    Parse resume and return a structured profile.

    TODO: restore AI parsing (Week 2).
    Currently returns mock data to validate frontend↔backend integration.
    """
    return {
        "name": "Rohit",
        "currentTitle": "Software Engineer",
        "desiredRole": "Backend Developer",
        "skills": ["Java", "Spring Boot", "AWS", "Angular"],
        "yearsExperience": 2.6,
        "location": "Delhi",
        "education": "B.Tech",
        "summary": "Backend engineer with Java and Spring Boot experience.",
    }


async def match_jobs(resume_text: str, job_listings: list[dict]) -> list[dict]:
    """Score and rank job listings against a resume."""
    client = _get_client()
    listings_text = "\n\n".join(
        f"Job {i+1}:\nTitle: {j.get('title')}\nDescription: {j.get('description')}"
        for i, j in enumerate(job_listings)
    )
    response = await client.chat.completions.create(
        model=OPENAI_MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a job matching expert. Given a resume and a list of job postings, "
                    "score each job from 0-100 based on fit and explain why. "
                    "Return a JSON object with key 'jobs': [{title, score, reason}]"
                ),
            },
            {"role": "user", "content": f"Resume:\n{resume_text}\n\nJob Listings:\n{listings_text}"},
        ],
        response_format={"type": "json_object"},
    )
    result = json.loads(response.choices[0].message.content)
    return result.get("jobs", result)


async def generate_cover_letter(
    resume_text: str, job_description: str, tone: str = "professional"
) -> str:
    """Generate a tailored cover letter."""
    client = _get_client()
    response = await client.chat.completions.create(
        model=OPENAI_MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    f"You are an expert cover letter writer. Write a {tone} cover letter "
                    "tailored to the job description using the candidate's resume. "
                    "Keep it concise (3-4 paragraphs), compelling, and ATS-friendly."
                ),
            },
            {
                "role": "user",
                "content": f"Resume:\n{resume_text}\n\nJob Description:\n{job_description}",
            },
        ],
    )
    return response.choices[0].message.content
