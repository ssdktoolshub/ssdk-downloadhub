import httpx
from fastapi import APIRouter, Response
from fastapi.responses import JSONResponse
import urllib.parse

router = APIRouter()

@router.get('/download/image')
async def download_image(url: str):
    try:
        decoded_url = urllib.parse.unquote(url)
        async with httpx.AsyncClient() as client:
            resp = await client.get(decoded_url, follow_redirects=True, timeout=15)
            if resp.status_code != 200:
                return JSONResponse(status_code=400, content={"success": False, "error": {"message": "Could not download image"}})
            
            content_type = resp.headers.get('content-type', 'image/jpeg')
            
            # Simple extension logic based on content type
            ext = '.jpg'
            if 'png' in content_type: ext = '.png'
            elif 'webp' in content_type: ext = '.webp'
            
            return Response(content=resp.content, media_type=content_type, headers={
                "Content-Disposition": f'attachment; filename="image_download{ext}"'
            })
    except Exception as e:
        return JSONResponse(status_code=400, content={"success": False, "error": {"message": str(e)}})
