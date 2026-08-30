import yt_dlp
import logging
from urllib.parse import urlparse

logger = logging.getLogger(__name__)

class Extractor:
    @staticmethod
    def extract_metadata(url: str) -> dict:
        parsed = urlparse(url)
        if 'youtube.com' in parsed.netloc or 'youtu.be' in parsed.netloc:
            return Extractor._extract_youtube(url)
            
        clients_to_try = ['tv', 'android_vr', 'mweb', 'web_creator', 'ios']
        
        for client in clients_to_try:
            ydl_opts = {
                'quiet': True,
                'no_warnings': True,
                'skip_download': True,
                'format_sort': ['res', 'vcodec:h264', 'ext:mp4:m4a'],
                'extractor_args': {'youtube': [f'player_client={client}']}
            }
            try:
                with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                    info = ydl.extract_info(url, download=False)
                    return {
                        "title": info.get('title', 'Unknown Title'),
                        "duration": info.get('duration', 0),
                        "thumbnail": info.get('thumbnail'),
                        "formats": Extractor._parse_formats(info.get('formats', [])),
                        "extractor": info.get('extractor')
                    }
            except Exception as e:
                if 'Sign in to confirm' in str(e) or 'bot' in str(e):
                    continue
                else:
                    raise Exception(f"yt-dlp error: {str(e)}")
                    
        raise Exception("YouTube has temporarily blocked your Render server IP for bot-like activity. Please try again later or add cookies.")

    @staticmethod
    def _extract_youtube(url: str) -> dict:
        try:
            from pytubefix import YouTube
            yt = YouTube(url, 'WEB')
            
            video_formats = []
            audio_formats = []
            
            # Map pytubefix streams to our format
            for stream in yt.streams:
                if stream.includes_video_track and not stream.includes_audio_track:
                    # Video only (DASH)
                    res = getattr(stream, 'resolution', None)
                    if res:
                        res_val = int(res.replace('p', ''))
                        vcodec = getattr(stream, 'video_codec', 'unknown')
                        if 'av01' in vcodec or 'vp9' in vcodec:
                            continue # skip av1/vp9 for better compatibility
                            
                        if res_val >= 2160: label = "4K (2160p)"
                        elif res_val >= 1440: label = "2K (1440p)"
                        elif res_val >= 1000: label = "HD (1080p)"
                        elif res_val >= 700: label = "HD (720p)"
                        elif res_val >= 480: label = "SD (480p)"
                        elif res_val >= 360: label = "SD (360p)"
                        else: label = f"Low ({res_val}p)"
                        
                        video_formats.append({
                            "format_id": str(stream.itag),
                            "ext": stream.subtype,
                            "resolution": label,
                            "vcodec": vcodec,
                            "height": res_val,
                            "filesize": getattr(stream, 'filesize', 0)
                        })
                elif stream.includes_audio_track and not stream.includes_video_track:
                    # Audio only
                    abr = getattr(stream, 'abr', None)
                    if abr:
                        abr_val = int(abr.replace('kbps', ''))
                        audio_formats.append({
                            "format_id": str(stream.itag),
                            "ext": stream.subtype,
                            "abr": abr_val,
                            "filesize": getattr(stream, 'filesize', 0)
                        })
                        
            # Sort
            video_formats.sort(key=lambda x: x['height'], reverse=True)
            audio_formats.sort(key=lambda x: x['abr'], reverse=True)
            
            # Deduplicate video
            unique_v = {}
            for v in video_formats:
                if v['height'] not in unique_v:
                    unique_v[v['height']] = v
            video_formats = list(unique_v.values())
            
            # Deduplicate audio
            unique_a = {}
            for a in audio_formats:
                if a['abr'] not in unique_a:
                    unique_a[a['abr']] = a
            audio_formats = list(unique_a.values())

            return {
                "title": yt.title,
                "duration": yt.length,
                "thumbnail": yt.thumbnail_url,
                "formats": {
                    "video": video_formats,
                    "audio": audio_formats
                },
                "extractor": "youtube"
            }
        except Exception as e:
            raise Exception(f"pytubefix error: {str(e)}")

    @staticmethod
    def _parse_formats(formats: list) -> dict:
        video_formats = []
        audio_formats = []
        
        def safe_int(v):
            try:
                return int(v) if v is not None else 0
            except:
                return 0

        quality_buckets = {}

        for f in formats:
            if f.get('acodec') != 'none' and f.get('acodec') is not None and f.get('vcodec') == 'none':
                fsize = f.get('filesize') or f.get('filesize_approx')
                if not fsize and f.get('abr') and f.get('duration'):
                    fsize = int((f.get('abr') * 1024 / 8) * f.get('duration'))
                    
                audio_formats.append({
                    "format_id": f.get('format_id'),
                    "ext": f.get('ext'),
                    "abr": f.get('abr', 0) or 0,
                    "filesize": fsize
                })

            if f.get('vcodec') != 'none' and f.get('vcodec') is not None:
                vcodec = str(f.get('vcodec')).lower()
                
                if 'av01' in vcodec or 'av1' in vcodec:
                    continue
                
                w = safe_int(f.get('width'))
                h = safe_int(f.get('height'))
                short_edge = min(w, h) if w > 0 and h > 0 else (h if h > 0 else 0)

                if short_edge == 0: continue
                elif short_edge >= 2160: quality = 2160; label = "4K (2160p)"
                elif short_edge >= 1440: quality = 1440; label = "2K (1440p)"
                elif short_edge >= 1000: quality = 1080; label = "HD (1080p)"
                elif short_edge >= 700: quality = 720; label = "HD (720p)"
                elif short_edge >= 480: quality = 480; label = "SD (480p)"
                elif short_edge >= 360: quality = 360; label = "SD (360p)"
                else: quality = 240; label = "Low (240p)"

                fsize = f.get('filesize') or f.get('filesize_approx')
                if not fsize and f.get('tbr') and f.get('duration'):
                    fsize = int((f.get('tbr') * 1024 / 8) * f.get('duration'))
                
                fmt = {
                    "format_id": f.get('format_id'),
                    "ext": f.get('ext'),
                    "resolution": label,
                    "vcodec": vcodec,
                    "height": quality,
                    "filesize": fsize
                }
                
                if quality not in quality_buckets:
                    quality_buckets[quality] = fmt
                else:
                    existing = quality_buckets[quality]
                    is_h264_new = 'avc' in vcodec or 'h264' in vcodec
                    is_h264_old = 'avc' in existing['vcodec'] or 'h264' in existing['vcodec']
                    
                    if is_h264_new and not is_h264_old:
                        quality_buckets[quality] = fmt
                    elif (is_h264_new == is_h264_old) and (fmt.get('filesize') or 0) > (existing.get('filesize') or 0):
                        quality_buckets[quality] = fmt
                        
        video_formats = list(quality_buckets.values())
        video_formats.sort(key=lambda x: safe_int(x.get('height')), reverse=True)
        
        unique_audio = {}
        for a in audio_formats:
            abr = safe_int(a.get('abr'))
            if abr > 0 and abr not in unique_audio:
                unique_audio[abr] = a
        audio_formats = list(unique_audio.values())
        audio_formats.sort(key=lambda x: safe_int(x.get('abr')), reverse=True)

        return {
            "video": video_formats,
            "audio": audio_formats
        }
