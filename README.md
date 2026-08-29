# SSDK DownloadHub

Download. Trim. Simplified.

## Architecture
- Frontend: Vanilla HTML/CSS/JS (deploy to Vercel)
- Backend: Python FastAPI + yt-dlp + FFmpeg (deploy to Render)

## Setup
### Backend
1. \cd backend\
2. \pip install -r requirements.txt\
3. \uvicorn main:app --reload\

### Frontend
Serve the \rontend\ directory using any HTTP server (e.g. \
px serve frontend\).

## Integrations
Uses \yt-dlp\ for metadata and format extraction.
Uses \FFmpeg\ for precise media trimming and conversion.

## License
Responsible Use: Ensure you have authorization to download media.
