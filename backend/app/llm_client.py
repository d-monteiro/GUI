import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv
from typing import List, Dict, Any
from .models import AddButtonCommand, AddSliderCommand, AddTextCommand, ClearContainerCommand


from .models import LLMResponsePacket, AnyCommand  # Your local models

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

SYSTEM_PROMPT = """
You are an advanced AI assistant named "Kai" (Kreator of Adaptive Interfaces). Your primary purpose is to help users accomplish complex tasks by building interactive user interfaces for them in real-time. You are a collaborator, not just a chatbot.

**Your Core Directives:**

1.  **Think Step-by-Step:** Before generating any UI, you MUST use a <thinking> block to outline your reasoning. Deconstruct the user's request into smaller, logical steps. Analyze what information you have and what you still need. This reasoning is for your internal use and will not be shown to the user.

2.  **Always Use Functions:** Your primary output method is to call functions that build UI components. Do not describe the UI in plain text. For every step in your plan, decide which function is the most appropriate to call. You can call multiple functions at once.

3.  **Be Proactive, Not Passive:** Don't just wait for the user to tell you exactly what to do. If a user's request is ambiguous ("Help me with my data"), ask clarifying questions by building a UI to gather the necessary information (e.g., a file upload button and a text input for their goal).

4.  **Maintain Context:** Pay close attention to the entire conversation history. Refer back to previous user actions and your own UI changes to inform your next step.

5.  **Acknowledge and Confirm:** Always provide a brief, helpful `chat_message` to the user acknowledging their request or explaining what the new UI you've just built is for.

**Example Interaction Flow:**

User Message: "I want to plan a trip to Tokyo."

Your Response (This is what you will generate):
<thinking>
The user wants to plan a trip. This is a complex task.
1.  First, I need to know their budget. A slider is perfect for this.
2.  Next, I need their primary interest to tailor the plan. A dropdown is good for predefined choices.
3.  Finally, I need a button to trigger the planning process once they've filled out the information.
4.  I will clear any previous UI to start fresh.
</thinking>
{
  "chat_message": "Great! I can help with that. To start, what is your budget and main interest for the trip?",
  "ui_commands": [
    { "command": "CLEAR_CONTAINER", "container_id": "main_workspace" },
    { "command": "ADD_TEXT", "text": "Tokyo Trip Planner", "style": "header" },
    { "command": "ADD_SLIDER", "slider_id": "budget", "label": "Budget ($)", "min_val": 500, "max_val": 5000, "default_val": 1500 },
    { "command": "ADD_BUTTON", "button_id": "generate_plan", "text": "Generate Plan" }
  ]
}
"""

# Load function declarations directly from schema.json
SCHEMA_PATH = os.path.join(os.path.dirname(__file__), "../schema.json")
with open(SCHEMA_PATH, "r") as f:
    function_declarations = json.load(f)

tools = types.Tool(function_declarations=function_declarations)
config = types.GenerateContentConfig(tools=[tools])

class LLMClient:
    def __init__(self):
        self.config = config

    def get_response(self, history: List[Dict[str, str]]) -> LLMResponsePacket:
        print("Sending request to Gemini with history...")

        # Build Gemini-style history
        gemini_history = [
            {
                "role": "user",
                "parts": [{"text": f"System Instructions: {SYSTEM_PROMPT}\n\nPlease acknowledge these instructions."}]
            },
            {
                "role": "model",
                "parts": [{"text": "I understand. I am Kai, and I will help users by building interactive UIs using function calls. I will think step-by-step and be proactive in my assistance."}]
            }
        ]
        for msg in history:
            gemini_history.append({
                "role": msg["role"],
                "parts": [{"text": msg["content"]}]
            })

        try:
            response = genai.Client().models.generate_content(
                model="gemini-1.5-flash",
                contents=gemini_history,
                config=self.config,
            )
            print(response)


            COMMAND_MODELS = {
                "AddButtonCommand": AddButtonCommand,
                "AddSliderCommand": AddSliderCommand,
                "AddTextCommand": AddTextCommand,
                "ClearContainerCommand": ClearContainerCommand,
            }

            ui_commands = []
            for part in response.candidates[0].content.parts:
                if hasattr(part, "function_call") and part.function_call:
                    func_name = part.function_call.name
                    args = part.function_call.args
                    model_cls = COMMAND_MODELS.get(func_name)
                    if model_cls:
                        try:
                            # Only pass the args; let the model set its own default "command"
                            ui_commands.append(model_cls(**args))
                        except Exception as e:
                            print(f"Error parsing {func_name}: {e}")
                    else:
                        print(f"Unknown function: {func_name}")

            print(f"---------------- LLM Thinking ----------------------")

            return LLMResponsePacket(
                #chat_message=chat_message,
                ui_commands=ui_commands
            )

        except Exception as e:
            print(f"Error calling Gemini API: {str(e)}")
            return LLMResponsePacket(chat_message=f"Error: {str(e)}")