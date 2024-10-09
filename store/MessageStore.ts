import { create } from "zustand";
import { MessageType } from "../types/DataTypes";

type MessagesState = {
  messages: Array<MessageType>;
  setMessages: (newValue: Array<MessageType>) => void;
};

export const useMessageStore = create<MessagesState>((set) => ({
  messages: [],
  setMessages: (newValue: Array<MessageType>) => set({ messages: newValue }),
}));
