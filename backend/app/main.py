from fastapi import FastAPI, WebSocket
from .orchestrator import ConversationHandler

app = FastAPI()
handler = ConversationHandler()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("connection open")
    try:
        while True:
            data = await websocket.receive_json()
            await handler.handle_message(websocket, data)
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        await websocket.close()