# backend/app/models.py
from pydantic import BaseModel, Field
from typing import List, Literal, Union, Dict, Any, Optional

# UI Commands (LLM -> Backend)
# "GUI Instruction Set Architecture (ISA)"

class BaseCommand(BaseModel):
    """The base for any command that modifies the UI."""
    container_id: str = "main_workspace" # Default container for now

class AddTextCommand(BaseCommand):
    command: Literal["ADD_TEXT"] = "ADD_TEXT"
    text: str
    style: Literal["header", "body", "code"] = "body"

class AddButtonCommand(BaseCommand):
    command: Literal["ADD_BUTTON"] = "ADD_BUTTON"
    button_id: str
    text: str

class AddSliderCommand(BaseCommand):
    command: Literal["ADD_SLIDER"] = "ADD_SLIDER"
    slider_id: str
    label: str
    min_val: float
    max_val: float
    default_val: float

class ClearContainerCommand(BaseModel):
    command: Literal["CLEAR_CONTAINER"] = "CLEAR_CONTAINER"
    container_id: str

# A Union type to represent any possible UI command.
# FastAPI will use this for validation.
AnyCommand = Union[
    AddTextCommand,
    AddButtonCommand,
    AddSliderCommand,
    ClearContainerCommand
]

class LLMResponsePacket(BaseModel):
    """The full, structured packet the LLM should return."""
    chat_message: Optional[str] = None
    ui_commands: List[AnyCommand] = Field(default_factory=list)


# --- UI Events (Frontend -> Backend) ---
# This defines the data structure for user interactions.

class UIEvent(BaseModel):
    event_type: Literal["button_click", "slider_change"]
    element_id: str
    state: Dict[str, Any] = Field(default_factory=dict)