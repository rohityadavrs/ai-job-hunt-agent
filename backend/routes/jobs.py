from fastapi import APIRouter
from tools.job_tools import search_naukri, search_indeed

router = APIRouter()


@router.get("/search")
async def search_jobs(role: str):
    """
    Search jobs from multiple sources.
    Currently uses mock data — real Naukri/Indeed calls live in tools/job_tools.py.
    Week 2: wire up LangGraph browser agent here.
    """
    jobs = []
    try:
        jobs.extend(search_naukri(role))
        jobs.extend(search_indeed(role))
        return {"count": len(jobs), "jobs": jobs}
    except Exception as e:
        return {"count": 0, "jobs": [], "error": str(e)}
