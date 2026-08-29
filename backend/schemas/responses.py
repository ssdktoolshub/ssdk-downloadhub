from typing import Any, Optional

def success_response(data: Any):
    return {
        "success": True,
        "data": data,
        "error": None
    }

def error_response(code: str, message: str, status_code: int = 400):
    # fastapi allows changing status code by Response but keeping schema consistent
    return {
        "success": False,
        "data": None,
        "error": {
            "code": code,
            "message": message
        }
    }
