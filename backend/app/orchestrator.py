from fastapi import WebSocket
from .llm_client import LLMClient

class ConversationHandler:
    def __init__(self):
        self.llm_client = LLMClient()
        self.history = []

    async def handle_message(self, websocket: WebSocket, message_data: dict):
        if message_data.get("type") == "user_message":
            content = message_data.get("content", "")
            self.history.append({"role": "user", "content": content})
            llm_response = self.llm_client.get_response(self.history)
            if llm_response.chat_message:
                self.history.append({"role": "assistant", "content": llm_response.chat_message})
            await websocket.send_json(llm_response.dict())