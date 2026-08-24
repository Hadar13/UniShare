import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

import api from '../services/api';

export type Summary = {
  _id: string;
  courseName: string;
  university: string;
  subject: string;
  description?: string;
  fileUrl: string;
  createdAt?: string;
  uploader?: {
    _id?: string;
    id?: string;
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

export const fetchSummariesFromApi = createAsyncThunk<
  Summary[],
  void,
  { rejectValue: string }
>('summaries/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/summaries');
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to load summaries'
    );
  }
});

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

  extraReducers: (builder) => {
    builder
      .addCase(fetchSummariesFromApi.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchSummariesFromApi.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSummariesFromApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load summaries';
      });
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