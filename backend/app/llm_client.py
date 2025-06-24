# backend/app/llm_client.py
import time
from .models import LLMResponsePacket

class LLMClient:
    """A mock LLM client that returns predefined responses."""

    def get_response(self, history: list) -> LLMResponsePacket:
        # In a real app, this method would format the history and call
        # the OpenAI/Anthropic/etc. API.
        # For now, we simulate it based on the last message.

        last_message = history[-1]["content"].lower()
        print(f"Mock LLM received: '{last_message}'")
        
        time.sleep(1) # Simulate network latency

        if "trip" in last_message:
            return LLMResponsePacket(
                chat_message="Of course! Let's plan your trip. What's your budget?",
                ui_commands=[
                    {"command": "CLEAR_CONTAINER", "container_id": "main_workspace"},
                    {"command": "ADD_TEXT", "text": "Trip Planner", "style": "header"},
                    {"command": "ADD_SLIDER", "slider_id": "budget_slider", "label": "Budget ($)", "min_val": 500, "max_val": 5000, "default_val": 2000},
                    {"command": "ADD_BUTTON", "button_id": "generate_plan", "text": "Generate Itinerary"},
                ]
            )
        elif "button_click" in last_message and "generate_plan" in last_message:
            # This simulates reacting to the user submitting the form
            budget = "unknown" # extract from the message if needed
            return LLMResponsePacket(
                chat_message=f"Great! I am now generating an itinerary for you with a budget of ${budget}...",
                ui_commands=[
                    {"command": "CLEAR_CONTAINER", "container_id": "main_workspace"},
                    {"command": "ADD_TEXT", "text": "Generating your amazing trip...", "style": "body"},
                ]
            )
        else:
            return LLMResponsePacket(chat_message="I'm sorry, I don't understand. Could you rephrase?")