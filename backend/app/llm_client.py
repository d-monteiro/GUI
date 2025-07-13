# llm_client.py
import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from langchain_core.tools import tool
from pydantic import BaseModel
from typing import List
from .models import LLMResponsePacket 


from .models import AddButtonCommand, AddSliderCommand, AddTextCommand, ClearContainerCommand

load_dotenv()

COMMAND_MODELS = {
    "ADD_BUTTON": AddButtonCommand,
    "ADD_SLIDER": AddSliderCommand,
    "ADD_TEXT": AddTextCommand,
    "CLEAR_CONTAINER": ClearContainerCommand,
}

# Define your UI commands using @tool (automatically supports function calling)
@tool
def AddButtonCommand(container_id: str, button_id: str, text: str) -> dict:
    """Adds a button to a UI container."""
    return {
        "command": "ADD_BUTTON",
        "container_id": container_id,
        "button_id": button_id,
        "text": text
    }

@tool
def AddSliderCommand(container_id: str, slider_id: str, label: str, min_val: int, max_val: int, default_val: int) -> dict:
    """Adds a button to a UI container."""

    return {
        "command": "ADD_SLIDER",
        "container_id": container_id,
        "slider_id": slider_id,
        "label": label,
        "min_val": min_val,
        "max_val": max_val,
        "default_val": default_val
    }

@tool
def AddTextCommand(container_id: str, text: str, style: str = "body") -> dict:
    """Adds a button to a UI container."""
   
    return {
        "command": "ADD_TEXT",
        "container_id": container_id,
        "text": text,
        "style": style
    }

@tool
def ClearContainerCommand(container_id: str) -> dict:
    """Adds a button to a UI container."""
   
    return {
        "command": "CLEAR_CONTAINER",
        "container_id": container_id
    }


# System prompt
SYSTEM_PROMPT = """
You are an advanced AI assistant named **Kai** (Kreator of Adaptive Interfaces). Your core function is to help users solve complex tasks by **constructing adaptive UIs in real-time** using structured function calls. You are a **collaborator, not a passive chatbot.** Your responses must always be purposeful, contextual, and actionable.
Never output JSON or describe UI in text.
Always use the provided tools to add UI elements.
Respond to the user with a chat message as plain text.
---

### **CORE BEHAVIOR RULES**

1. Before building, think step-by-step in a <thinking> block (not shown to the user).
After thinking, use function calls to add UI elements.

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


"""

class LLMClient:
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            google_api_key=os.getenv("GEMINI_API_KEY"),
            model_kwargs={
                "tools": [
                    AddButtonCommand,
                    AddSliderCommand,
                    AddTextCommand,
                    ClearContainerCommand,
                ]
            }
        )

    def get_response(self, history: List[dict]) -> LLMResponsePacket:
        """Calls Gemini with history and returns parsed function calls + message."""
        messages = [SystemMessage(content=SYSTEM_PROMPT)]
        messages.append(AIMessage(content="I understand. I am Kai..."))

        for msg in history:
            role = msg["role"]
            content = msg["content"]
            if role == "user":
                messages.append(HumanMessage(content=content))
            else:
                messages.append(AIMessage(content=content))

        response = self.llm.invoke(messages)

        # Parse tool calls into Pydantic models
        parsed_tools = getattr(response, "tool_calls", [])
        ui_commands = []
        for tool_call in parsed_tools:
            # tool_call may be a dict or an object with .args
            data = tool_call if isinstance(tool_call, dict) else getattr(tool_call, "args", {})
            command_type = data.get("command")
            model_cls = COMMAND_MODELS.get(command_type)
            if model_cls:
                try:
                    ui_commands.append(model_cls(**data))
                except Exception as e:
                    print(f"Error parsing {command_type}: {e}")

        chat_message = getattr(response, "content", "")

        return LLMResponsePacket(
            chat_message=chat_message,
            ui_commands=ui_commands
        )