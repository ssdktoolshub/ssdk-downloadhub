from urllib.parse import urlparse
import re

def is_valid_url(url: str) -> bool:
    try:
        result = urlparse(url)
        if not all([result.scheme, result.netloc]):
            return False
        if result.scheme not in ['http', 'https']:
            return False
        netloc = result.netloc.lower()
        if re.search(r'(localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2[0-9]|3[0-1])\.\d+\.\d+|0\.0\.0\.0)', netloc):
            return False
        return True
    except:
        return False
