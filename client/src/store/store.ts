import { configureStore } from '@reduxjs/toolkit';
import summariesReducer from './summariesSlice';

export const store = configureStore({
  reducer: {
    summaries: summariesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;