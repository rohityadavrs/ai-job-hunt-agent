"""
Job search tools — external action layer.
Each function calls an external source (Naukri, Indeed, etc.).
AI logic lives in services/, not here.
"""
from typing import Any


def search_naukri(role: str) -> list[dict[str, Any]]:
    """
    Scrape / call Naukri API for job listings.
    TODO: replace mock with real Naukri integration.
    """
    return [
        {
            "id": "naukri_1",
            "title": f"{role} – Senior Engineer",
            "company": "TechCorp India",
            "location": "Bengaluru",
            "salary": "₹18–25 LPA",
            "posted": "1 day ago",
            "matchScore": 88,
            "description": f"Looking for an experienced {role} to lead backend systems.",
            "requirements": ["Python", "FastAPI", "AWS", "PostgreSQL"],
            "applyUrl": "https://naukri.com/job/1",
            "source": "naukri",
        },
        {
            "id": "naukri_2",
            "title": f"Junior {role}",
            "company": "StartupXYZ",
            "location": "Remote",
            "salary": "₹8–12 LPA",
            "posted": "3 days ago",
            "matchScore": 75,
            "description": f"Great opportunity for a {role} fresher or 1-2 yr exp.",
            "requirements": ["Python", "Django", "Docker"],
            "applyUrl": "https://naukri.com/job/2",
            "source": "naukri",
        },
    ]


def search_indeed(role: str) -> list[dict[str, Any]]:
    """
    Scrape / call Indeed API for job listings.
    TODO: replace mock with real Indeed integration.
    """
    return [
        {
            "id": "indeed_1",
            "title": f"{role} – Mid Level",
            "company": "GlobalSoft",
            "location": "Hyderabad",
            "salary": "$80,000",
            "posted": "2 days ago",
            "matchScore": 82,
            "description": f"Mid-level {role} role with focus on microservices.",
            "requirements": ["Go", "Kubernetes", "gRPC"],
            "applyUrl": "https://indeed.com/job/1",
            "source": "indeed",
        },
    ]

