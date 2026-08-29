import re
from urllib.parse import urlparse

class PlatformDetector:
    @staticmethod
    def detect(url: str) -> str:
        parsed = urlparse(url)
        hostname = parsed.hostname or ""
        hostname = hostname.lower()

        if "youtube.com" in hostname or "youtu.be" in hostname:
            return "youtube"
        elif "facebook.com" in hostname or "fb.watch" in hostname or "fb.com" in hostname:
            return "facebook"
        elif "instagram.com" in hostname:
            return "instagram"
        elif "twitter.com" in hostname or "x.com" in hostname:
            return "twitter"
        else:
            return "unknown"
