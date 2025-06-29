# backend/app/orchestrator.py
from fastapi import WebSocket
from .llm_client import LLMClient
from .models import UIEvent, AddButtonCommand, AddSliderCommand, AddTextCommand, ClearContainerCommand

class ConversationHandler:
    """Manages the state and logic for a single user conversation."""
    def __init__(self):
        self.history = []
        self.llm_client = LLMClient()
        print("New ConversationHandler created.")

    def _add_to_history(self, role: str, content: str):
        self.history.append({"role": role, "content": content})

    # Frontend -> Backend -> LLM
    async def handle_message(self, websocket: WebSocket, message_data: dict):
        """Processes an incoming message from the frontend WebSocket."""

        message_type = message_data.get("type")

        if message_type == "user_message":
            content = message_data.get("content", "")
            print(message_data)
            self._add_to_history("user", content)

        elif message_type == "ui_event":
            # Here we "translate" the structured UI event into natural language
            # so the LLM can understand the user's action.
            try:
                event = UIEvent.model_validate(message_data.get("payload"))
                event_description = f"User performed action: {event.event_type} on element '{event.element_id}'. Current form state: {event.state}"
                self._add_to_history("system", event_description) # 'system' role is good for non-user inputs
            except Exception as e:
                print(f"Error validating UIEvent: {e}")
                return

        # No matter the input type, we get a new response from the LLM
        llm_response = self.llm_client.get_response(self.history)
        
        # Add the assistant's response to history for context in the next turn
        if llm_response.chat_message:
            self._add_to_history("assistant", llm_response.chat_message)

        # Send the final packet to the frontend
        await websocket.send_json(llm_response.model_dump())