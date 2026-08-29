import httpx
import asyncio

async def test():
    async with httpx.AsyncClient() as client:
        res = await client.post("http://localhost:8000/api/analyze", json={"url": "https://www.youtube.com/watch?v=jNQXAC9IVRw"})
        print(res.json())

asyncio.run(test())
