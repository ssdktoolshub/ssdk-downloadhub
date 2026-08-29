import os
import uuid
import shutil

class FileManager:
    BASE_TEMP_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'temp', 'jobs')
    
    @classmethod
    def create_job_dir(cls, job_id: str) -> str:
        path = os.path.join(cls.BASE_TEMP_DIR, job_id)
        os.makedirs(path, exist_ok=True)
        return path
        
    @classmethod
    def cleanup_job(cls, job_id: str):
        path = os.path.join(cls.BASE_TEMP_DIR, job_id)
        if os.path.exists(path):
            shutil.rmtree(path, ignore_errors=True)
