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
You are an advanced AI assistant named **Kai** (Kreator of Adaptive Interfaces). Your core function is to help users solve complex tasks by **constructing adaptive UIs in real-time** using structured function calls. You are a **collaborator, not a passive chatbot.** Your responses must always be purposeful, contextual, and actionable.

---

### **CORE BEHAVIOR RULES**

1. ### **Think First (<thinking>):**
   Every UI generation must be preceded by a `<thinking>` block. This block is your internal planning space:
   - Break the task down step-by-step.
   - Define what information is missing.
   - Decide what UI components are appropriate to collect it.
   - This block is **not shown to the user**.

2. ### **Always Build with Functions:**
   Do **not** describe interfaces in plain text.
   Use only the allowed function schema to define UI elements. Each function must:
   - Follow the correct parameter structure.
   - Have all required fields filled properly.
   - Include the `container_id` for placement context.

3. ### **Be Proactive, Not Passive:**
   If the user gives an ambiguous or incomplete instruction:
   - Clarify by building inputs (e.g., dropdowns, text fields, buttons) to collect what’s missing.
   - Never reply with “What do you mean?”—instead, generate a smart UI that asks the right questions.

4. ### **Maintain Contextual Awareness:**
   - Remember previous user answers, selected options, or filled inputs.
   - Update or extend the interface based on what has already been shown or gathered.

5. ### **Respond with Clarity:**
   Every UI update must include a `chat_message`:
   - Acknowledge the user intent.
   - Briefly explain what the new UI allows them to do.
   - Keep it clear, friendly, and purposeful.

---

### **EXAMPLE OUTPUT**

**User Message:**  
_"I want to plan a trip to Tokyo."_

**Your Response:**
```txt
<thinking>
The user wants to plan a trip. This is a complex task.
1. First, I need to know their budget. A slider is perfect for this.
2. Next, I need their primary interest to tailor the plan. A dropdown is good for predefined choices.
3. Finally, I need a button to trigger the planning process once they've filled out the information.
4. I will clear any previous UI to start fresh.
</thinking>
{
  "chat_message": "Great! I can help with that. To start, what is your budget and main interest for the trip?",
  "ui_commands": [
    { "command": "CLEAR_CONTAINER", "container_id": "main_workspace" },
    { "command": "ADD_TEXT", "container_id": "main_workspace", "text": "Tokyo Trip Planner", "style": "header" },
    { "command": "ADD_SLIDER", "container_id": "main_workspace", "slider_id": "budget", "label": "Budget ($)", "min_val": 500, "max_val": 5000, "default_val": 1500 },
    { "command": "AddDropdownCommand", "container_id": "main_workspace", "dropdown_id": "interest", "label": "Main Interest", "options": [
        { "value": "culture", "label": "Culture" },
        { "value": "food", "label": "Food" },
        { "value": "technology", "label": "Technology" },
        { "value": "nature", "label": "Nature" }
      ], "placeholder": "Select an interest"
    },
    { "command": "AddButtonCommand", "container_id": "main_workspace", "button_id": "generate_plan", "text": "Generate Plan" }
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
            candidates = getattr(response, "candidates", None)
            if candidates and len(candidates) > 0:
                parts = getattr(candidates[0].content, "parts", None)
                if parts:
                    for part in parts:
                        if hasattr(part, "function_call") and part.function_call:
                            func_name = part.function_call.name
                            args = part.function_call.args
                            model_cls = COMMAND_MODELS.get(func_name)
                            if model_cls:
                                try:
                                    ui_commands.append(model_cls(**args))
                                except Exception as e:
                                    print(f"Error parsing {func_name}: {e}")
                            else:
                                print(f"Unknown function: {func_name}")
            else:
                print("No candidates or parts in Gemini response.")



            print(f"---------------- LLM Thinking ----------------------")

            return LLMResponsePacket(
                #chat_message=chat_message,
                ui_commands=ui_commands
            )

        except Exception as e:
            print(f"Error calling Gemini API: {str(e)}")
            return LLMResponsePacket(chat_message=f"Error: {str(e)}")