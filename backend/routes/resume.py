import os
import aiofiles
from fastapi import APIRouter, UploadFile, File, HTTPException
from services.ai_service import analyze_resume
from config import STORAGE_DIR

router = APIRouter()

@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    """Upload a resume file (PDF or TXT) to local storage."""
    if not file.filename.endswith((".pdf", ".txt")):
        raise HTTPException(status_code=400, detail="Only .pdf and .txt supported")

    os.makedirs(STORAGE_DIR, exist_ok=True)
    file_path = os.path.join(STORAGE_DIR, file.filename)
    content = await file.read()

    async with aiofiles.open(file_path, "wb") as out_file:
        await out_file.write(content)

    return {"message": "uploaded", "filename": file.filename}


@router.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    """Parse resume and return structured profile data."""
    try:
        file_bytes = await file.read()
        result = await analyze_resume(file_bytes, file.filename)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
