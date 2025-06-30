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

export interface AddDropdownCommand extends BaseCommand {
  command: "ADD_DROPDOWN";
  dropdown_id: string;
  label?: string;
  options: DropdownOption[];
  default_value?: string;
  placeholder?: string;
}

export interface AddDatePickerCommand extends BaseCommand {
  command: "ADD_DATE_PICKER";
  date_picker_id: string;
  label?: string;
  default_date?: string;
  min_date?: string;
  max_date?: string;
  date_format?: "YYYY-MM-DD" | "MM/DD/YYYY" | "DD/MM/YYYY";
}

export interface AddTextInputCommand extends BaseCommand {
  command: "ADD_TEXT_INPUT";
  input_id: string;
  label?: string;
  placeholder?: string;
  default_value?: string;
  input_type?: "text" | "email" | "password" | "number" | "tel" | "url";
  required?: boolean;
  max_length?: number;
}

// Supporting interfaces
export interface DropdownOption {
  value: string;
  label: string;
}

export interface ClearContainerCommand {
  command: "CLEAR_CONTAINER";
  container_id: string;
}

export type UICommand = AddTextCommand | AddButtonCommand | AddSliderCommand | AddTextCommand | AddDropdownCommand | AddDatePickerCommand | AddTextInputCommand | ClearContainerCommand;


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