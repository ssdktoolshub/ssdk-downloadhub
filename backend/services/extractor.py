import yt_dlp
import logging

logger = logging.getLogger(__name__)

class Extractor:
    @staticmethod
    def extract_metadata(url: str) -> dict:
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'skip_download': True,
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            try:
                info = ydl.extract_info(url, download=False)
                return {
                    "title": info.get('title', 'Unknown Title'),
                    "duration": info.get('duration', 0),
                    "thumbnail": info.get('thumbnail'),
                    "formats": Extractor._parse_formats(info.get('formats', [])),
                    "extractor": info.get('extractor')
                }
            except Exception as e:
                logger.error(f"Error extracting metadata: {str(e)}")
                raise Exception(f"yt-dlp error: {str(e)}")
                
    @staticmethod
    def _parse_formats(formats: list) -> dict:
        video_formats = []
        audio_formats = []
        
        for f in formats:
            if f.get('vcodec') != 'none' and f.get('vcodec') is not None:
                res = f.get('resolution') or f"{f.get('width', '')}x{f.get('height', '')}"
                if res and res != 'x':
                    video_formats.append({
                        "format_id": f.get('format_id'),
                        "ext": f.get('ext'),
                        "resolution": res,
                        "height": f.get('height', 0) or 0,
                        "filesize": f.get('filesize') or f.get('filesize_approx')
                    })
            
            if f.get('acodec') != 'none' and f.get('acodec') is not None:
                audio_formats.append({
                    "format_id": f.get('format_id'),
                    "ext": f.get('ext'),
                    "abr": f.get('abr', 0) or 0,
                    "filesize": f.get('filesize') or f.get('filesize_approx')
                })
                
        def safe_int(v):
            try:
                return int(v) if v is not None else 0
            except:
                return 0

        # Sort videos by height desc
        video_formats.sort(key=lambda x: safe_int(x.get('height')), reverse=True)
        # Sort audios by abr desc
        audio_formats.sort(key=lambda x: safe_int(x.get('abr')), reverse=True)
        
        return {
            "video": video_formats,
            "audio": audio_formats
        }
