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

/**
 * Custom hook that centralizes summary-related state and actions.
 * It connects the Browse page and summary components to Redux state and summary API requests.
 *
 * @returns {{
 *   summaries: import('../store/summariesSlice').Summary[],
 *   loading: boolean,
 *   error: string,
 *   actionMessage: string,
 *   fetchSummaries: () => Promise<void>,
 *   deleteSummary: (id: string) => Promise<void>,
 *   updateSummary: (id: string, data: EditSummaryData) => Promise<void>,
 *   clearActionMessage: () => void
 * }} Summary state values and actions for fetching, updating, deleting, and clearing messages.
 */
function useSummaries() {
  const dispatch = useDispatch<AppDispatch>();

  // Read summaries-related values from the Redux store in one reusable hook.
  const summaries = useSelector((state: RootState) => state.summaries.items);
  const loading = useSelector((state: RootState) => state.summaries.loading);
  const error = useSelector((state: RootState) => state.summaries.error);
  const actionMessage = useSelector(
    (state: RootState) => state.summaries.actionMessage
  );

  /**
   * Fetches all summaries from the backend API using a Redux async thunk.
   *
   * @returns {Promise<void>} Resolves after the fetch action is dispatched.
   */
  const fetchSummaries = useCallback(async () => {
    await dispatch(fetchSummariesFromApi());
  }, [dispatch]);

  /**
   * Deletes a summary by ID from the backend and then removes it from the Redux store.
   *
   * @param {string} id - The MongoDB ID of the summary to delete.
   * @returns {Promise<void>} Resolves after the summary is deleted and the store is updated.
   */
  const deleteSummary = useCallback(
    async (id: string) => {
      await api.delete(`/summaries/${id}`);

      dispatch(deleteSummaryFromStore(id));
      dispatch(setActionMessage('Summary deleted successfully'));
    },
    [dispatch]
  );

  /**
   * Updates a summary by ID and syncs the updated summary with the Redux store.
   *
   * @param {string} id - The MongoDB ID of the summary to update.
   * @param {EditSummaryData} data - The updated summary fields.
   * @returns {Promise<void>} Resolves after the summary is updated and the store is synced.
   */
  const updateSummary = useCallback(
    async (id: string, data: EditSummaryData) => {
      const response = await api.put(`/summaries/${id}`, data);

      dispatch(updateSummaryInStore(response.data.data));
      dispatch(setActionMessage('Summary updated successfully'));
    },
    [dispatch]
  );

  /**
   * Clears the action message shown after summary actions.
   *
   * @returns {void}
   */
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