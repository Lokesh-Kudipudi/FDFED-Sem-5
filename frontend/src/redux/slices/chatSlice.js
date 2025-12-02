import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  open: false,
  messages: [],
  history: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    toggleChat: (state) => {
      state.open = !state.open;
    },
    setOpen: (state, action) => {
      state.open = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addHistory: (state, action) => {
      state.history.push(action.payload);
    },
    setHistory: (state, action) => {
      state.history = action.payload;
    },
  },
});

export const { toggleChat, setOpen, addMessage, setMessages, addHistory, setHistory } = chatSlice.actions;
export default chatSlice.reducer;
