import subprocess
import os
import imageio_ffmpeg

class Trimmer:
    @staticmethod
    def trim_media(input_path: str, start: int, end: int) -> str:
        if start < 0 or end <= start:
            raise ValueError("Invalid trim range")
            
        base, ext = os.path.splitext(input_path)
        output_path = f"{base}_trimmed{ext}"
        
        ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
        
        command = [
            ffmpeg_exe, '-y',
            '-i', input_path,
            '-ss', str(start),
            '-to', str(end),
            '-c', 'copy',
            output_path
        ]
        
        process = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if process.returncode != 0:
            raise Exception("FFmpeg processing failed")
            
        return output_path
