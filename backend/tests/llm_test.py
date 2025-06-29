# Gemini API Setup & Debug Guide
# Run this script to test your Gemini API setup step by step

import os
import json
from typing import List, Dict, Any
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

print("=== GEMINI API SETUP & DEBUG GUIDE ===\n")

# Step 1: Check if google-generativeai is installed
print("Step 1: Checking dependencies...")
try:
    import google.generativeai as genai
    print("✅ google-generativeai is installed")
except ImportError:
    print("❌ google-generativeai not found. Install it with:")
    print("pip install google-generativeai")
    exit(1)

# Step 2: Check API key
print("\nStep 2: Checking API key...")
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("❌ GOOGLE_API_KEY not found in environment variables")
    print("Get your API key from: https://aistudio.google.com/app/apikey")
    print("Add it to your .env file as: GOOGLE_API_KEY=your_key_here")
    exit(1)
else:
    print(f"✅ API key found: {api_key[:8]}...{api_key[-4:]}")

# Step 3: Configure Gemini
print("\nStep 3: Configuring Gemini...")
try:
    genai.configure(api_key=api_key)
    print("✅ Gemini configured successfully")
except Exception as e:
    print(f"❌ Error configuring Gemini: {e}")
    exit(1)

# Step 4: Test basic connection
print("\nStep 4: Testing basic connection...")
try:
    # List available models
    models = list(genai.list_models())
    print(f"✅ Connection successful! Found {len(models)} models")
    
    # Show available models
    print("\nAvailable models:")
    for model in models[:5]:  # Show first 5
        print(f"  - {model.name}")
        if hasattr(model, 'supported_generation_methods'):
            methods = model.supported_generation_methods
            print(f"    Methods: {', '.join(methods)}")
except Exception as e:
    print(f"❌ Connection failed: {e}")
    exit(1)

# Step 5: Test simple text generation
print("\nStep 5: Testing simple text generation...")
try:
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content("Say hello and confirm you're working!")
    print(f"✅ Text generation works!")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"❌ Text generation failed: {e}")
    print("This might be an API quota or authentication issue")

# Step 6: Create test Pydantic models for function calling
print("\nStep 6: Setting up test function calling...")

class TestUICommand(BaseModel):
    """Test UI command for debugging function calling"""
    thinking: str = Field(description="Your reasoning process")
    chat_message: str = Field(description="Message to show to user")
    ui_commands: List[Dict[str, Any]] = Field(description="List of UI commands to execute")

def pydantic_to_gemini_function(model_class: BaseModel) -> Dict[str, Any]:
    """Convert Pydantic model to Gemini function declaration"""
    schema = model_class.model_json_schema()
    
    def convert_type(prop_type):
        type_mapping = {
            "string": "STRING",
            "integer": "INTEGER", 
            "number": "NUMBER",
            "boolean": "BOOLEAN",
            "array": "ARRAY",
            "object": "OBJECT"
        }
        return type_mapping.get(prop_type, "STRING")
    
    def convert_properties(properties):
        converted = {}
        for prop_name, prop_def in properties.items():
            converted_prop = {
                "type": convert_type(prop_def.get("type", "string"))
            }
            if "description" in prop_def:
                converted_prop["description"] = prop_def["description"]
            if prop_def.get("type") == "array" and "items" in prop_def:
                converted_prop["items"] = {"type": convert_type(prop_def["items"].get("type", "object"))}
            converted[prop_name] = converted_prop
        return converted
    
    return {
        "name": model_class.__name__,
        "description": model_class.__doc__ or f"Execute {model_class.__name__}",
        "parameters": {
            "type": "object",
            "properties": convert_properties(schema.get("properties", {})),
            "required": schema.get("required", [])
        }
    }

# Step 7: Test function calling setup
print("\nStep 7: Testing function calling setup...")
try:
    # Create function declaration
    function_declaration = pydantic_to_gemini_function(TestUICommand)
    print("✅ Function declaration created:")
    print(json.dumps(function_declaration, indent=2))
    
    # Create model with tools
    model_with_tools = genai.GenerativeModel(
        model_name='gemini-1.5-flash',
        tools=[{"function_declarations": [function_declaration]}]
    )
    print("✅ Model with tools created successfully")
    
except Exception as e:
    print(f"❌ Function setup failed: {e}")
    print("Error details:", str(e))

# Step 8: Test actual function calling
print("\nStep 8: Testing function calling...")
try:
    system_prompt = """
    You are a helpful assistant. When the user asks for help, respond using the TestUICommand function.
    Always include thinking, chat_message, and ui_commands in your response.
    """
    
    # Test with system instruction
    model_with_system = genai.GenerativeModel(
        model_name='gemini-1.5-flash',
        tools=[{"function_declarations": [function_declaration]}],
        system_instruction=system_prompt
    )
    
    response = model_with_system.generate_content("Help me create a simple button")
    
    print("✅ Function calling response received!")
    
    # Debug response structure
    print("\n--- Response Analysis ---")
    print(f"Response type: {type(response)}")
    print(f"Candidates: {len(response.candidates)}")
    
    for i, candidate in enumerate(response.candidates):
        print(f"\nCandidate {i}:")
        print(f"  Parts: {len(candidate.content.parts)}")
        
        for j, part in enumerate(candidate.content.parts):
            print(f"  Part {j}:")
            if hasattr(part, 'function_call'):
                print(f"    Function call: {part.function_call}")
                if part.function_call:
                    print(f"    Function name: {part.function_call.name}")
                    print(f"    Function args: {dict(part.function_call.args)}")
            if hasattr(part, 'text'):
                print(f"    Text: {part.text}")

except Exception as e:
    print(f"❌ Function calling failed: {e}")
    print("Error details:", str(e))
    import traceback
    traceback.print_exc()

# Step 9: Test your actual LLMClient
print("\nStep 9: Testing with your LLMClient implementation...")

class MockLLMResponsePacket:
    def __init__(self, chat_message="", ui_commands=None):
        self.chat_message = chat_message
        self.ui_commands = ui_commands or []

class DebugLLMClient:
    def __init__(self, available_tools_models: List[BaseModel]):
        self.function_declarations = [pydantic_to_gemini_function(model) for model in available_tools_models]
        self.model = genai.GenerativeModel(
            model_name='gemini-1.5-flash',
            tools=[{"function_declarations": self.function_declarations}] if self.function_declarations else None,
            system_instruction="""
            You are Kai, an AI that builds UIs. Always respond using function calls.
            Include thinking, chat_message, and ui_commands in every response.
            """
        )

    def get_response(self, history: List[Dict[str, str]]) -> MockLLMResponsePacket:
        print(f"Processing {len(history)} messages...")
        
        try:
            # Convert history
            gemini_history = []
            for msg in history:
                role = "user" if msg["role"] == "user" else "model"
                gemini_history.append({
                    "role": role,
                    "parts": [{"text": msg["content"]}]
                })

            # Generate response
            response = self.model.generate_content(gemini_history)
            
            # Process response
            for part in response.candidates[0].content.parts:
                if hasattr(part, 'function_call') and part.function_call:
                    args = dict(part.function_call.args)
                    print(f"✅ Function call successful: {part.function_call.name}")
                    print(f"Args: {args}")
                    
                    return MockLLMResponsePacket(
                        chat_message=args.get("chat_message", "Response received"),
                        ui_commands=args.get("ui_commands", [])
                    )
                elif hasattr(part, 'text'):
                    print(f"⚠️  Got text instead of function call: {part.text}")
                    return MockLLMResponsePacket(chat_message=part.text)
            
            print("❌ No valid response parts found")
            return MockLLMResponsePacket(chat_message="No response generated")
            
        except Exception as e:
            print(f"❌ Error in get_response: {e}")
            import traceback
            traceback.print_exc()
            return MockLLMResponsePacket(chat_message=f"Error: {e}")

# Test the client
try:
    client = DebugLLMClient([TestUICommand])
    test_history = [
        {"role": "user", "content": "Create a button that says 'Click me'"}
    ]
    
    result = client.get_response(test_history)
    print(f"✅ LLMClient test completed!")
    print(f"Chat message: {result.chat_message}")
    print(f"UI commands: {result.ui_commands}")
    
except Exception as e:
    print(f"❌ LLMClient test failed: {e}")
    import traceback
    traceback.print_exc()

print("\n=== SETUP COMPLETE ===")
print("\nIf you see ✅ for most steps, your setup is working!")
print("If you see ❌ errors, check the error messages above for solutions.")

# Common issues and solutions
print("\n=== COMMON ISSUES & SOLUTIONS ===")
print("1. 'API key not found' → Get key from https://aistudio.google.com/app/apikey")
print("2. 'Function calling not working' → Check your Pydantic model structure")
print("3. 'Quota exceeded' → You've hit the free tier limit, wait or upgrade")
print("4. 'Model not found' → Use 'gemini-1.5-flash' for free tier")
print("5. 'Import errors' → Run: pip install google-generativeai pydantic python-dotenv")