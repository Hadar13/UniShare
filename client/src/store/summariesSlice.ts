import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
export type Summary = {
  _id: string;
  courseName: string;
  university: string;
  subject: string;
  description?: string;
  fileUrl: string;
  createdAt?: string;
  uploader?: {
    name?: string;
  };
};

type SummariesState = {
  items: Summary[];
  loading: boolean;
  error: string;
  actionMessage: string;
};

const initialState: SummariesState = {
  items: [],
  loading: true,
  error: '',
  actionMessage: '',
};

const summariesSlice = createSlice({
  name: 'summaries',
  initialState,
  reducers: {
    setSummaries: (state, action: PayloadAction<Summary[]>) => {
      state.items = action.payload;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    setActionMessage: (state, action: PayloadAction<string>) => {
      state.actionMessage = action.payload;
    },

    deleteSummaryFromStore: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (summary) => summary._id !== action.payload
      );
    },

    updateSummaryInStore: (state, action: PayloadAction<Summary>) => {
      state.items = state.items.map((summary) =>
        summary._id === action.payload._id ? action.payload : summary
      );
    },
  },
});

export const {
  setSummaries,
  setLoading,
  setError,
  setActionMessage,
  deleteSummaryFromStore,
  updateSummaryInStore,
} = summariesSlice.actions;

export default summariesSlice.reducer;