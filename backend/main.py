from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from routes import health, analyze, video, audio
from utils.logging_config import setup_logging
import os

setup_logging()

limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title='SSDK DownloadHub API')
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

raw_origins = os.getenv('CORS_ORIGINS', 'http://localhost:3000,http://127.0.0.1:3000,http://localhost:8000,http://127.0.0.1:8000,null').split(',')
origins = [origin.strip().rstrip('/') for origin in raw_origins]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(health.router, prefix='/api', tags=['health'])
app.include_router(analyze.router, prefix='/api', tags=['analyze'])
app.include_router(video.router, prefix='/api', tags=['video'])
app.include_router(audio.router, prefix='/api', tags=['audio'])

@app.get('/')
@limiter.limit("10/minute")
def read_root(request: Request):
    return {'message': 'SSDK DownloadHub API is running.'}
