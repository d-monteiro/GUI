import json
import pytest
from jsonschema import validate, ValidationError

# The function call schema
ADD_DROPDOWN_COMMAND_SCHEMA = {
    "type": "object",
    "properties": {
        "container_id": {
            "type": "string",
            "description": "The ID of the container where the dropdown will be placed."
        },
        "dropdown_id": {
            "type": "string",
            "description": "Unique identifier for the dropdown element."
        },
        "label": {
            "type": "string",
            "description": "The label text for the dropdown."
        },
        "options": {
            "type": "array",
            "items": { "type": "string" },
            "description": "List of dropdown options (e.g., ['Option 1', 'Option 2'])."
        },
        "default_value": {
            "type": "string",
            "description": "The default selected value."
        },
        "placeholder": {
            "type": "string",
            "description": "Placeholder text when no option is selected."
        }
    },
    "required": ["container_id", "options"]
}

def test_valid_add_dropdown_command():
    valid_input = {
        "container_id": "main_container",
        "dropdown_id": "country_selector",
        "label": "Select a country",
        "options": ["Portugal", "Spain", "France"],
        "default_value": "Portugal",
        "placeholder": "Choose a country"
    }
    try:
        validate(instance=valid_input, schema=ADD_DROPDOWN_COMMAND_SCHEMA)
    except ValidationError:
        pytest.fail("Valid input failed schema validation")

def test_missing_required_field():
    invalid_input = {
        "options": ["One", "Two"]
    }
    with pytest.raises(ValidationError):
        validate(instance=invalid_input, schema=ADD_DROPDOWN_COMMAND_SCHEMA)

def test_invalid_option_type():
    invalid_input = {
        "container_id": "box",
        "options": [1, 2, 3]  # integers instead of strings
    }
    with pytest.raises(ValidationError):
        validate(instance=invalid_input, schema=ADD_DROPDOWN_COMMAND_SCHEMA)
