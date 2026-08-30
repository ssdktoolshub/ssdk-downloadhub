import httpx
from fastapi import APIRouter, Response
from fastapi.responses import JSONResponse
import urllib.parse

router = APIRouter()

@router.get('/download/image')
async def download_image(url: str):
    try:
        decoded_url = urllib.parse.unquote(url)
        
        # Spoof standard browser headers to bypass 403 Forbidden on CDNs (like Instagram/Facebook)
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Referer": "https://www.instagram.com/"
        }
        
        async with httpx.AsyncClient() as client:
            resp = await client.get(decoded_url, headers=headers, follow_redirects=True, timeout=15)
            if resp.status_code != 200:
                return JSONResponse(status_code=400, content={"success": False, "error": {"message": f"HTTP {resp.status_code} from CDN"}})
            
            content_type = resp.headers.get('content-type', 'image/jpeg')
            
            ext = '.jpg'
            if 'png' in content_type: ext = '.png'
            elif 'webp' in content_type: ext = '.webp'
            
            return Response(content=resp.content, media_type=content_type, headers={
                "Content-Disposition": f'attachment; filename="image_download{ext}"'
            })
    except Exception as e:
        return JSONResponse(status_code=400, content={"success": False, "error": {"message": str(e)}})
