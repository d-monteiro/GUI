import os
from google import genai
from google.genai import types
from dotenv import load_dotenv
from jsonschema import validate, ValidationError

# Load API key
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

# Define the function schema
add_dropdown_function = {
    "name": "AddDropdownCommand",
    "description": "Adds a dropdown element to the UI in the specified container.",
    "parameters": {
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
                "items": {"type": "string"},
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
}

# Configure tool and model
tools = types.Tool(function_declarations=[add_dropdown_function])
config = types.GenerateContentConfig(tools=[tools])

# Send prompt
response = client.models.generate_content(
    model="gemini-1.5-flash",
    contents=(
        "Create a dropdown for choosing your favorite programming language. "
        "It should be inside the container 'sidebar'. The options are: Python, JavaScript, Rust. "
        "Default should be Python. Placeholder: Select a language."
    ),
    config=config,
)
print(response)

# Extract and handle function call
parts = response.candidates[0].content.parts

if parts and parts[0].function_call:
    function_call = parts[0].function_call
    print(f"Function to call: {function_call.name}")
    print(f"Arguments: {function_call.args}")

    # Validate against JSON schema
    try:
        validate(instance=function_call.args, schema=add_dropdown_function["parameters"])
        print("✅ Output is valid according to schema.")
    except ValidationError as e:
        print("❌ Schema validation failed:", e)

else:
    print("No function call found in the response.")
    print(response.text)
