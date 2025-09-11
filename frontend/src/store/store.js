import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './chatSlice';
import userReducer from './UserSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    user: userReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these paths in the state
        ignoredActions: ['chat/setError'],
        ignoredPaths: ['chat.error'],
      },
    }),
});
