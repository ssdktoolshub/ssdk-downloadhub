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
            'format_sort': ['res', 'vcodec:h264', 'ext:mp4:m4a'], 'extractor_args': {'youtube': ['player_client=tv']}
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
        
        def safe_int(v):
            try:
                return int(v) if v is not None else 0
            except:
                return 0

        # Bucket video formats by quality to avoid duplicates
        quality_buckets = {}

        for f in formats:
            # AUDIO
            if f.get('acodec') != 'none' and f.get('acodec') is not None and f.get('vcodec') == 'none':
                fsize = f.get('filesize') or f.get('filesize_approx')
                if not fsize and f.get('abr') and info.get('duration'):
                    fsize = int((f.get('abr') * 1024 / 8) * info.get('duration'))
                    
                audio_formats.append({
                    "format_id": f.get('format_id'),
                    "ext": f.get('ext'),
                    "abr": f.get('abr', 0) or 0,
                    "filesize": fsize
                })

            # VIDEO
            if f.get('vcodec') != 'none' and f.get('vcodec') is not None:
                vcodec = str(f.get('vcodec')).lower()
                
                # Exclude AV1 as it is rarely supported by native players like Windows Media Player
                if 'av01' in vcodec or 'av1' in vcodec:
                    continue
                
                w = safe_int(f.get('width'))
                h = safe_int(f.get('height'))
                
                if w > 0 and h > 0:
                    short_edge = min(w, h)
                else:
                    short_edge = h if h > 0 else 0

                # Determine standard quality label
                if short_edge == 0:
                    continue
                elif short_edge >= 2160:
                    quality = 2160
                    label = "4K (2160p)"
                elif short_edge >= 1440:
                    quality = 1440
                    label = "2K (1440p)"
                elif short_edge >= 1000:
                    quality = 1080
                    label = "HD (1080p)"
                elif short_edge >= 700:
                    quality = 720
                    label = "HD (720p)"
                elif short_edge >= 480:
                    quality = 480
                    label = "SD (480p)"
                elif short_edge >= 360:
                    quality = 360
                    label = "SD (360p)"
                else:
                    quality = 240
                    label = "Low (240p)"

                fsize = f.get('filesize') or f.get('filesize_approx')
                if not fsize and f.get('tbr') and info.get('duration'):
                    fsize = int((f.get('tbr') * 1024 / 8) * info.get('duration'))
                
                fmt = {
                    "format_id": f.get('format_id'),
                    "ext": f.get('ext'),
                    "resolution": label,
                    "vcodec": vcodec,
                    "height": quality,
                    "filesize": fsize
                }
                
                # If bucket empty, add it. If not, only replace if this format is better (H.264 > others)
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

        # Sort videos by height desc
        video_formats.sort(key=lambda x: safe_int(x.get('height')), reverse=True)
        # Sort audios by abr desc
        audio_formats.sort(key=lambda x: safe_int(x.get('abr')), reverse=True)
        
        # Deduplicate audios by ABR
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


