from fastapi import APIRouter, HTTPException
from services.ai_service import generate_cover_letter
from schemas import CoverLetterRequest, CoverLetterResponse

router = APIRouter()


@router.post("/generate", response_model=CoverLetterResponse)
async def generate(payload: CoverLetterRequest):
    """Generate a tailored cover letter based on resume and job description."""
    if not payload.resume_text.strip():
        raise HTTPException(status_code=400, detail="Resume text cannot be empty.")
    if not payload.job_description.strip():
        raise HTTPException(status_code=400, detail="Job description cannot be empty.")

    letter = await generate_cover_letter(
        payload.resume_text, payload.job_description, payload.tone
    )
    return {"cover_letter": letter}
