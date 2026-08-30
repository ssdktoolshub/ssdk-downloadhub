from fastapi import APIRouter
from schemas.requests import AnalyzeRequest
from schemas.responses import success_response, error_response
from utils.validator import is_valid_url
from services.platform_detector import PlatformDetector
from services.extractor import Extractor

router = APIRouter()

@router.post('/analyze')
def analyze_url(req: AnalyzeRequest):
    if not is_valid_url(req.url):
        return error_response("INVALID_URL", "Please enter a valid media URL.")
    
    platform = PlatformDetector.detect(req.url)
    if platform == "unknown":
        return error_response("UNSUPPORTED_PLATFORM", "This platform is not supported.")
    
    try:
        metadata = Extractor.extract_metadata(req.url)
        metadata["platform"] = platform
        return success_response(metadata)
    except Exception as e:
        return error_response("ANALYSIS_FAILED", str(e))

@router.post('/analyze_debug')
def analyze_debug(req: AnalyzeRequest):
    import yt_dlp
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'skip_download': True,
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        try:
            info = ydl.extract_info(req.url, download=False)
            return success_response(info)
        except Exception as e:
            return error_response("FAILED", str(e))
