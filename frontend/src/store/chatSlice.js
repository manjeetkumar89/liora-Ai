import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  chats: [
    // { id: 1, title: 'React Development Help', timestamp: 'Just now', active: true },
    // { id: 2, title: 'AI Assistance', timestamp: '2 hours ago', active: false },
    // { id: 3, title: 'Project Planning', timestamp: '1 day ago', active: false },
  ],
  isTyping: false,
  systemPrompt: 'You are a helpful AI assistant.',
  currentChatId: null,
  error: null,
  status: 'idle' // 'idle' | 'loading' | 'succeeded' | 'failed'
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
      console.log("messages set to state : ", state.messages)
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setIsTyping: (state, action) => {
      state.isTyping = action.payload;
    },
    setSystemPrompt: (state, action) => {
      state.systemPrompt = action.payload;
    },
    setChats: (state, action) => {
      state.chats = action.payload;
      console.log(state.chats);
    },
    addChat: (state, action) => {
      state.chats = [action.payload, ...state.chats.map(chat => ({ ...chat, active: false }))];
      state.currentChatId = action.payload._id;
    },
    deleteChat: (state, action) => {
      state.chats = state.chats.filter(chat => chat._id !== action.payload);
      if (state.currentChatId === action.payload) {
        state.currentChatId = state.chats[0]?._id || null;
        state.messages = [];
      }
    },
    setActiveChatId: (state, action) => {
      state.currentChatId = action.payload;
      state.chats = state.chats.map(chat => ({
        ...chat,
        active: chat._id === action.payload
      }));
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.status = 'failed';
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    }
  }
});

export const {
  setMessages,
  addMessage,
  setIsTyping,
  setSystemPrompt,
  setChats,
  addChat,
  deleteChat,
  setActiveChatId,
  clearMessages,
  setError,
  setStatus
} = chatSlice.actions;

// Selectors
export const selectMessages = (state) => state.chat.messages;
export const selectChats = (state) => state.chat.chats;
export const selectIsTyping = (state) => state.chat.isTyping;
export const selectSystemPrompt = (state) => state.chat.systemPrompt;
export const selectCurrentChatId = (state) => state.chat.currentChatId;
export const selectCurrentChat = (state) => 
  state.chat.chats.find(chat => chat.id === state.chat.currentChatId);
export const selectError = (state) => state.chat.error;
export const selectStatus = (state) => state.chat.status;

export default chatSlice.reducer;
