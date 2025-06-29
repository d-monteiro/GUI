import os
from dotenv import load_dotenv
from google import genai    
from google.genai import types

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

# Define a function declaration for testing
create_button_function = {
    "name": "create_button",
    "description": "Creates a button with a label and an action.",
    "parameters": {
        "type": "object",
        "properties": {
            "label": {
                "type": "string",
                "description": "The text to display on the button."
            },
            "action": {
                "type": "string",
                "description": "The action to perform when the button is clicked."
            }
        },
        "required": ["label", "action"]
    }
}

# Set up tools and config
tools = types.Tool(function_declarations=[create_button_function])
config = types.GenerateContentConfig(tools=[tools])

# Compose a prompt that should trigger the function call
prompt = "Create a button labeled 'Click Me' that shows an alert when clicked."

# Call the Gemini API
response = genai.Client().models.generate_content(
    model="gemini-2.5-flash",
    contents=prompt,
    config=config,
)

# Parse and print the function call from the response
parts = response.candidates[0].content.parts
found_function = False
for part in parts:
    if hasattr(part, "function_call") and part.function_call:
        found_function = True
        function_call = part.function_call
        print(f"Function to call: {function_call.name}")
        print(f"Arguments: {function_call.args}")
if not found_function:
    print("No function call found in the response.")
    for part in parts:
        if hasattr(part, "text"):
            print("Text:", part.text)




{
      "name":"AddButtonCommand",
      "description":"None",
      "parameters":{
         "type":"object",
         "properties":{
            "container_id":{
               "type":"STRING"
            },
            "command":{
               "type":"STRING"
            },
            "button_id":{
               "type":"STRING"
            },
            "text":{
               "type":"STRING"
            }
         },
         "required":[
            "button_id",
            "text"
         ]
      }
   },
{
    "name": "create_bar_chart",
    "description": "Creates a bar chart given a title, labels, and corresponding values.",
    "parameters": {
        "type": "object",
        "properties": {
            "title": {
                "type": "string",
                "description": "The title for the chart.",
            },
            "labels": {
                "type": "array",
                "items": {"type": "string"},
                "description": "List of labels for the data points (e.g., ['Q1', 'Q2', 'Q3']).",
            },
            "values": {
                "type": "array",
                "items": {"type": "number"},
                "description": "List of numerical values corresponding to the labels (e.g., [50000, 75000, 60000]).",
            },
        },
        "required": ["title", "labels", "values"],
    },