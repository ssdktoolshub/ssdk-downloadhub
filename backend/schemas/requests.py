from pydantic import BaseModel
from typing import Optional, Union

class AnalyzeRequest(BaseModel):
    url: str

class VideoDownloadRequest(BaseModel):
    url: str
    format_id: str
    quality: str = "best"
    trim: bool = False
    start_time: Optional[Union[int, float]] = 0
    end_time: Optional[Union[int, float]] = 0

class AudioDownloadRequest(BaseModel):
    url: str
    format_id: str
    quality: str = "best"
    trim: bool = False
    start_time: Optional[Union[int, float]] = 0
    end_time: Optional[Union[int, float]] = 0
