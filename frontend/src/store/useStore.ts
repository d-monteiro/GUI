// frontend/src/store/useStore.ts
import { create } from 'zustand';
import { UICommand, ChatMessage, BackendPacket } from './types';

// Define the shape of our store's state
interface AppState {
  connectionStatus: "connected" | "disconnected" | "connecting";
  chatHistory: ChatMessage[];
  uiSchema: UICommand[];
  setConnectionStatus: (status: AppState['connectionStatus']) => void;
  handleBackendPacket: (packet: BackendPacket) => void;
  addClientMessage: (content: string) => void;
}

export const useStore = create<AppState>()((set, get) => ({
  // --- STATE ---
  connectionStatus: "disconnected",
  chatHistory: [],
  uiSchema: [],

  // --- ACTIONS ---
  setConnectionStatus: (status) => set({ connectionStatus: status }),

  addClientMessage: (content) => {
    // Adds a user's message to the chat history immediately for a snappy UI feel.
    const userMessage: ChatMessage = { role: "user", content };
    set((state) => ({ chatHistory: [...state.chatHistory, userMessage] }));
  },

  handleBackendPacket: (packet) => {
    // This is the core action that updates state based on the LLM's response.
    console.log("Received packet from backend:", packet);

    // Add the assistant's chat message to the history
    if (packet.chat_message) {
      const assistantMessage: ChatMessage = { role: "assistant", content: packet.chat_message };
      set((state) => ({ chatHistory: [...state.chatHistory, assistantMessage] }));
    }
    
    // Check for a CLEAR command first and process it separately
    const clearCommand = packet.ui_commands.find(cmd => cmd.command === 'CLEAR_CONTAINER');
    let newSchema = get().uiSchema;

    if (clearCommand) {
        // If the workspace is cleared, start with an empty schema
        newSchema = []; 
    }
    
    // Filter out the clear command so we don't try to render it
    const renderableCommands = packet.ui_commands.filter(cmd => cmd.command !== 'CLEAR_CONTAINER');

    // For simplicity, our MVP will append new commands.
    // A more complex app might replace the schema entirely.
    newSchema = [...newSchema, ...renderableCommands];
    set({ uiSchema: newSchema });
  },
}));