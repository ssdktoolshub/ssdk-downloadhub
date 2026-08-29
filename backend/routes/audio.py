import uuid
import os
from fastapi import APIRouter, BackgroundTasks
from fastapi.responses import FileResponse
from schemas.requests import AudioDownloadRequest
from schemas.responses import error_response
from services.downloader import Downloader
from services.trimmer import Trimmer
from services.file_manager import FileManager

router = APIRouter()

@router.post('/download/audio')
def download_audio_route(req: AudioDownloadRequest, background_tasks: BackgroundTasks):
    job_id = str(uuid.uuid4())
    try:
        file_path = Downloader.download_audio(req.url, req.format_id, job_id)
        if not file_path:
            return error_response("DOWNLOAD_FAILED", "Could not download audio")
            
        if req.trim:
            file_path = Trimmer.trim_media(file_path, req.start_time, req.end_time)
            
        filename = os.path.basename(file_path)
        
        background_tasks.add_task(FileManager.cleanup_job, job_id)
        
        return FileResponse(path=file_path, filename=filename, media_type='audio/mpeg')
    except Exception as e:
        FileManager.cleanup_job(job_id)
        return error_response("PROCESSING_FAILED", str(e))
