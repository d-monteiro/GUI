// frontend/src/store/types.ts

// --- UI Command Types ---

export interface BaseCommand {
  command: string;
  container_id: string;
}

export interface AddTextCommand extends BaseCommand {
  command: "ADD_TEXT";
  text: string;
  style: "header" | "body" | "code";
}

export interface AddButtonCommand extends BaseCommand {
  command: "ADD_BUTTON";
  button_id: string;
  text: string;
}

export interface AddSliderCommand extends BaseCommand {
  command: "ADD_SLIDER";
  slider_id: string;
  label: string;
  min_val: number;
  max_val: number;
  default_val: number;
}

export interface ClearContainerCommand {
  command: "CLEAR_CONTAINER";
  container_id: string;
}

export type UICommand = AddTextCommand | AddButtonCommand | AddSliderCommand | ClearContainerCommand;


// --- Other Types ---

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

// The complete packet received from the backend WebSocket
export interface BackendPacket {
  chat_message?: string;
  ui_commands: UICommand[];
}