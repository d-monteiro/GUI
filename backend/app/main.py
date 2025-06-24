# backend/app/main.py
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from .orchestrator import ConversationHandler

app = FastAPI()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    handler = ConversationHandler() # Create a new session for each connection

    try:
        # Send a welcome message or initial state if needed
        # For now, we wait for the first user message
        while True:
            data = await websocket.receive_json()
            await handler.handle_message(websocket, data)
    except WebSocketDisconnect:
        print(f"Client disconnected: {websocket.client}")
        # Add any cleanup logic here