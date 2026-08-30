import yt_dlp
import os
import imageio_ffmpeg
from urllib.parse import urlparse
from services.file_manager import FileManager

class Downloader:
    @staticmethod
    def get_base_opts():
        return {
            'quiet': True,
            'no_warnings': True,
            'ffmpeg_location': imageio_ffmpeg.get_ffmpeg_exe()
        }

    @staticmethod
    def download_video(url: str, format_id: str, job_id: str) -> str:
        parsed = urlparse(url)
        if 'youtube.com' in parsed.netloc or 'youtu.be' in parsed.netloc:
            return Downloader._download_youtube_video(url, format_id, job_id)
            
        job_dir = FileManager.create_job_dir(job_id)
        output_template = os.path.join(job_dir, '%(id)s.%(ext)s')
        
        ydl_opts = Downloader.get_base_opts()
        ydl_opts.update({
            'format': f"{format_id}+bestaudio/best",
            'outtmpl': output_template,
            'format_sort': ['res', 'vcodec:h264', 'ext:mp4:m4a'],
            'extractor_args': {'youtube': ['player_client=ios']}
        })
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.extract_info(url, download=True)
            for f in os.listdir(job_dir):
                if f.endswith('.mp4') or f.endswith('.webm') or f.endswith('.mkv'):
                    return os.path.join(job_dir, f)
            return ""
            
    @staticmethod
    def _download_youtube_video(url: str, format_id: str, job_id: str) -> str:
        try:
            from pytubefix import YouTube
            job_dir = FileManager.create_job_dir(job_id)
            yt = YouTube(url, 'WEB')
            
            video_stream = yt.streams.get_by_itag(int(format_id))
            if not video_stream:
                return ""
                
            # If the video stream is progressive (has audio), just download it
            if video_stream.is_progressive:
                return video_stream.download(output_path=job_dir, filename=f"{job_id}.mp4")
                
            # Otherwise, we need to download video and audio separately and merge them using ffmpeg
            video_path = video_stream.download(output_path=job_dir, filename=f"{job_id}_video.mp4")
            
            audio_stream = yt.streams.get_audio_only()
            audio_path = audio_stream.download(output_path=job_dir, filename=f"{job_id}_audio.mp4")
            
            output_path = os.path.join(job_dir, f"{job_id}.mp4")
            
            ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
            cmd = f'"{ffmpeg_exe}" -y -i "{video_path}" -i "{audio_path}" -c copy "{output_path}"'
            os.system(cmd)
            
            if os.path.exists(output_path):
                # Clean up intermediate files
                try:
                    os.remove(video_path)
                    os.remove(audio_path)
                except:
                    pass
                return output_path
            return ""
        except Exception as e:
            raise Exception(f"pytubefix download error: {str(e)}")

    @staticmethod
    def download_audio(url: str, format_id: str, job_id: str) -> str:
        parsed = urlparse(url)
        if 'youtube.com' in parsed.netloc or 'youtu.be' in parsed.netloc:
            return Downloader._download_youtube_audio(url, format_id, job_id)
            
        job_dir = FileManager.create_job_dir(job_id)
        output_template = os.path.join(job_dir, '%(id)s.%(ext)s')
        
        ydl_opts = Downloader.get_base_opts()
        ydl_opts.update({
            'format': format_id,
            'outtmpl': output_template,
            'extractor_args': {'youtube': ['player_client=ios']},
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
            
    @staticmethod
    def _download_youtube_audio(url: str, format_id: str, job_id: str) -> str:
        try:
            from pytubefix import YouTube
            job_dir = FileManager.create_job_dir(job_id)
            yt = YouTube(url, 'WEB')
            
            audio_stream = yt.streams.get_by_itag(int(format_id))
            if not audio_stream:
                return ""
                
            audio_path = audio_stream.download(output_path=job_dir, filename=f"{job_id}_raw.m4a")
            
            # Convert to mp3 using ffmpeg
            output_path = os.path.join(job_dir, f"{job_id}.mp3")
            ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
            cmd = f'"{ffmpeg_exe}" -y -i "{audio_path}" -vn -ar 44100 -ac 2 -b:a 192k "{output_path}"'
            os.system(cmd)
            
            if os.path.exists(output_path):
                try:
                    os.remove(audio_path)
                except:
                    pass
                return output_path
            return ""
        except Exception as e:
            raise Exception(f"pytubefix download error: {str(e)}")
