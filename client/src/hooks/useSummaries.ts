import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import api from '../services/api';
import type { RootState, AppDispatch } from '../store/store';
import {
  fetchSummariesFromApi,
  setActionMessage,
  deleteSummaryFromStore,
  updateSummaryInStore,
} from '../store/summariesSlice';

type EditSummaryData = {
  courseName: string;
  university: string;
  subject: string;
  description: string;
};

function useSummaries() {
  const dispatch = useDispatch<AppDispatch>();

  const summaries = useSelector((state: RootState) => state.summaries.items);
  const loading = useSelector((state: RootState) => state.summaries.loading);
  const error = useSelector((state: RootState) => state.summaries.error);
  const actionMessage = useSelector(
    (state: RootState) => state.summaries.actionMessage
  );

  const fetchSummaries = useCallback(async () => {
    await dispatch(fetchSummariesFromApi());
  }, [dispatch]);

  const deleteSummary = useCallback(
    async (id: string) => {
      await api.delete(`/summaries/${id}`);

      dispatch(deleteSummaryFromStore(id));
      dispatch(setActionMessage('Summary deleted successfully'));
    },
    [dispatch]
  );

  const updateSummary = useCallback(
    async (id: string, data: EditSummaryData) => {
      const response = await api.put(`/summaries/${id}`, data);

      dispatch(updateSummaryInStore(response.data.data));
      dispatch(setActionMessage('Summary updated successfully'));
    },
    [dispatch]
  );

  const clearActionMessage = useCallback(() => {
    dispatch(setActionMessage(''));
  }, [dispatch]);

  return {
    summaries,
    loading,
    error,
    actionMessage,
    fetchSummaries,
    deleteSummary,
    updateSummary,
    clearActionMessage,
  };
}

export default useSummaries;