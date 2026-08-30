import yt_dlp
import os
import uuid
import imageio_ffmpeg
from services.file_manager import FileManager

class Downloader:
    @staticmethod
    def get_base_opts():
        return {
            'quiet': True,
            'no_warnings': True, 'extractor_args': {'youtube': ['player_client=tv']},
            'ffmpeg_location': imageio_ffmpeg.get_ffmpeg_exe()
        }

    @staticmethod
    def download_video(url: str, format_id: str, job_id: str) -> str:
        job_dir = FileManager.create_job_dir(job_id)
        output_template = os.path.join(job_dir, '%(id)s.%(ext)s')
        
        ydl_opts = Downloader.get_base_opts()
        ydl_opts.update({
            'format': f"{format_id}+bestaudio/best",
            'outtmpl': output_template,
            'format_sort': ['res', 'vcodec:h264', 'ext:mp4:m4a']
        })
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.extract_info(url, download=True)
            for f in os.listdir(job_dir):
                if f.endswith('.mp4') or f.endswith('.webm') or f.endswith('.mkv'):
                    return os.path.join(job_dir, f)
            return ""

    @staticmethod
    def download_audio(url: str, format_id: str, job_id: str) -> str:
        job_dir = FileManager.create_job_dir(job_id)
        output_template = os.path.join(job_dir, '%(id)s.%(ext)s')
        
        ydl_opts = Downloader.get_base_opts()
        ydl_opts.update({
            'format': format_id,
            'outtmpl': output_template,
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }]
        })
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.extract_info(url, download=True)
            for f in os.listdir(job_dir):
                if f.endswith('.mp3') or f.endswith('.m4a') or f.endswith('.wav'):
                    return os.path.join(job_dir, f)
            return ""


