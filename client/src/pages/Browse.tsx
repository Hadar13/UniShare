import { useEffect, useMemo, useState, type ChangeEvent } from 'react';

import LoadingSpinner from '../components/LoadingSpinner';
import SummaryCard from '../components/SummaryCard';
import useSummaries from '../hooks/useSummaries';
import type { Summary } from '../store/summariesSlice';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

/**
 * Displays the Browse Summaries page.
 * The page loads summaries, allows users to search and filter them,
 * and lets the original uploader edit or delete their own summaries.
 *
 * @returns The Browse page UI.
 */
function Browse() {
  const {
    summaries,
    loading,
    error,
    actionMessage,
    fetchSummaries,
    deleteSummary,
    updateSummary,
    clearActionMessage,
  } = useSummaries();

  const { isLoggedIn } = useAuth();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [university, setUniversity] = useState('');
  const [subject, setSubject] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    courseName: '',
    university: '',
    subject: '',
    description: '',
  });

  useEffect(() => {
    fetchSummaries();
  }, [fetchSummaries]);

  useEffect(() => {
    /**
     * Fetches the currently logged-in user from the backend.
     * The user ID is used to decide whether edit/delete actions should be shown.
     *
     * @returns Resolves after setting the current user ID, or null if the user is not logged in.
     */
    const fetchCurrentUser = async () => {
      if (!isLoggedIn) {
        setCurrentUserId(null);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        setCurrentUserId(response.data.data._id || response.data.data.id);
      } catch {
        setCurrentUserId(null);
      }
    };

    fetchCurrentUser();
  }, [isLoggedIn]);

  /**
   * Filters summaries by course search, university, and subject.
   * useMemo prevents recalculating the filtered list unless the summaries or filters change.
   */
  const filteredSummaries = useMemo(() => {
    return summaries.filter((summary) => {
      const matchesSearch = summary.courseName
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesUniversity =
        university === '' || summary.university === university;

      const matchesSubject = subject === '' || summary.subject === subject;

      return matchesSearch && matchesUniversity && matchesSubject;
    });
  }, [summaries, search, university, subject]);

  /**
   * Clears all selected filters and restores the full summaries list.
   *
   * @returns Nothing.
   */
  const resetFilters = () => {
    setSearch('');
    setUniversity('');
    setSubject('');
  };

  /**
   * Deletes a summary after the user confirms the action.
   *
   * @param id - The MongoDB ID of the summary to delete.
   * @returns Resolves after the summary is deleted, or stops if the user cancels.
   */
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this summary?'
    );

    if (!confirmDelete) {
      return;
    }

    await deleteSummary(id);
  };

  /**
   * Starts edit mode for a selected summary and fills the edit form with its current values.
   *
   * @param summary - The summary selected for editing.
   * @returns Nothing.
   */
  const startEdit = (summary: Summary) => {
    setEditingId(summary._id);
    setEditForm({
      courseName: summary.courseName,
      university: summary.university,
      subject: summary.subject,
      description: summary.description || '',
    });
    clearActionMessage();
  };

  /**
   * Cancels edit mode and clears the edit form values.
   *
   * @returns Nothing.
   */
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({
      courseName: '',
      university: '',
      subject: '',
      description: '',
    });
  };

  /**
   * Updates the local edit form state when the user changes an input, select, or textarea field.
   *
   * @param e - The form change event from the edited field.
   * @returns Nothing.
   */
  const handleEditChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * Sends the updated summary data to the backend and closes edit mode.
   *
   * @param id - The MongoDB ID of the summary to update.
   * @returns Resolves after the summary is updated.
   */
  const handleUpdate = async (id: string) => {
    await updateSummary(id, editForm);
    setEditingId(null);
  };

  if (loading) {
    return <LoadingSpinner text="Loading summaries..." />;
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-8 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Browse Summaries
        </h1>

        <p className="text-slate-600 mb-6">
          Search and filter academic summaries uploaded by students.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-slate-300 rounded-lg px-4 py-2"
          />

          <select
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            className="border border-slate-300 rounded-lg px-4 py-2"
          >
            <option value="">All Universities</option>
            <option value="Bar-Ilan University">Bar-Ilan University</option>
            <option value="Tel Aviv University">Tel Aviv University</option>
            <option value="Hebrew University">Hebrew University</option>
            <option value="Technion">Technion</option>
            <option value="University of Haifa">University of Haifa</option>
            <option value="Ariel University">Ariel University</option>
          </select>

          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="border border-slate-300 rounded-lg px-4 py-2"
          >
            <option value="">All Subjects</option>
            <option value="Artificial Intelligence">
              Artificial Intelligence
            </option>
            <option value="Databases">Databases</option>
            <option value="Psychology">Psychology</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Science">Information Science</option>
            <option value="Statistics">Statistics</option>
          </select>

          <button
            onClick={resetFilters}
            className="bg-slate-200 text-slate-700 rounded-lg px-4 py-2 font-semibold hover:bg-slate-300"
          >
            Reset
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="bg-white rounded-2xl shadow-md p-4 mb-6 text-center text-slate-700">
          {actionMessage}
        </div>
      )}

      {filteredSummaries.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-8 text-center text-slate-600">
          No summaries found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredSummaries.map((summary) => {
            // Compare the uploader ID with the current user ID to allow only owners to edit/delete.
            const uploaderId = summary.uploader?._id || summary.uploader?.id;
            const isOwner = !!currentUserId && uploaderId === currentUserId;

            return (
              <SummaryCard
                key={summary._id}
                summary={summary}
                isOwner={isOwner}
                isEditing={editingId === summary._id}
                editForm={editForm}
                onStartEdit={startEdit}
                onCancelEdit={cancelEdit}
                onEditChange={handleEditChange}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Browse;