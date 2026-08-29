import yt_dlp
import os
import uuid
from services.file_manager import FileManager

class Downloader:
    @staticmethod
    def download_video(url: str, format_id: str, job_id: str) -> str:
        job_dir = FileManager.create_job_dir(job_id)
        output_template = os.path.join(job_dir, '%(title)s.%(ext)s')
        
        ydl_opts = {
            'format': f"{format_id}+bestaudio/best",
            'outtmpl': output_template,
            'quiet': True,
            'no_warnings': True,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.extract_info(url, download=True)
            for f in os.listdir(job_dir):
                if f.endswith('.mp4') or f.endswith('.webm') or f.endswith('.mkv'):
                    return os.path.join(job_dir, f)
            return ""

    @staticmethod
    def download_audio(url: str, format_id: str, job_id: str) -> str:
        job_dir = FileManager.create_job_dir(job_id)
        output_template = os.path.join(job_dir, '%(title)s.%(ext)s')
        
        ydl_opts = {
            'format': format_id,
            'outtmpl': output_template,
            'quiet': True,
            'no_warnings': True,
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.extract_info(url, download=True)
            for f in os.listdir(job_dir):
                if f.endswith('.mp3') or f.endswith('.m4a'):
                    return os.path.join(job_dir, f)
            return ""
