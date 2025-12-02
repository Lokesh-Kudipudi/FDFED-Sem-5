import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './slices/chatSlice';
import recommendationReducer from './slices/recommendationSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    recommendation: recommendationReducer,
  },
});
