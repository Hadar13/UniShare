import { memo, type ChangeEvent } from 'react';
import type { Summary } from '../store/summariesSlice';
import { Link } from 'react-router-dom';

type EditForm = {
  courseName: string;
  university: string;
  subject: string;
  description: string;
};

type SummaryCardProps = {
  summary: Summary;
  isEditing: boolean;
  isOwner: boolean;
  editForm: EditForm;
  onStartEdit: (summary: Summary) => void;
  onCancelEdit: () => void;
  onEditChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  onUpdate: (id: string) => void;
  onDelete: (id: string) => void;
};

function SummaryCard({
  summary,
  isEditing,
  isOwner,
  editForm,
  onStartEdit,
  onCancelEdit,
  onEditChange,
  onUpdate,
  onDelete,
}: SummaryCardProps) {
  const apiBaseUrl =
    import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

  const serverBaseUrl = apiBaseUrl.replace(/\/api\/?$/, '');

  const fileFullUrl = `${serverBaseUrl}${summary.fileUrl}`;
  const isImageFile = /\.(jpg|jpeg|png|webp|gif)$/i.test(summary.fileUrl);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      {isEditing && isOwner ? (
        <div className="space-y-3">
          <input
            type="text"
            name="courseName"
            value={editForm.courseName}
            onChange={onEditChange}
            className="w-full border border-slate-300 rounded-lg px-4 py-2"
          />

          <select
            name="subject"
            value={editForm.subject}
            onChange={onEditChange}
            className="w-full border border-slate-300 rounded-lg px-4 py-2"
          >
            <option value="Artificial Intelligence">Artificial Intelligence</option>
            <option value="Databases">Databases</option>
            <option value="Psychology">Psychology</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Science">Information Science</option>
            <option value="Statistics">Statistics</option>
          </select>

          <select
            name="university"
            value={editForm.university}
            onChange={onEditChange}
            className="w-full border border-slate-300 rounded-lg px-4 py-2"
          >
            <option value="Bar-Ilan University">Bar-Ilan University</option>
            <option value="Tel Aviv University">Tel Aviv University</option>
            <option value="Hebrew University">Hebrew University</option>
            <option value="Technion">Technion</option>
            <option value="University of Haifa">University of Haifa</option>
            <option value="Ariel University">Ariel University</option>
          </select>

          <textarea
            name="description"
            value={editForm.description}
            onChange={onEditChange}
            placeholder="Description"
            rows={3}
            className="w-full border border-slate-300 rounded-lg px-4 py-2"
          />

          <button
            onClick={() => onUpdate(summary._id)}
            className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700"
          >
            Save Changes
          </button>

          <button
            onClick={onCancelEdit}
            className="w-full bg-slate-300 text-slate-700 py-2 rounded-lg font-semibold hover:bg-slate-400"
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-bold text-blue-700 mb-2">
            {summary.courseName}
          </h2>

          <p className="text-slate-600 mb-1">
            <strong>Subject:</strong> {summary.subject}
          </p>

          <p className="text-slate-600 mb-1">
            <strong>University:</strong> {summary.university}
          </p>

          <p className="text-slate-600 mb-1">
            <strong>Uploader:</strong>{' '}
            {summary.uploader?.name || 'Unknown'}
          </p>

          {summary.description && (
            <p className="text-slate-600 mb-1">
              <strong>Description:</strong> {summary.description}
            </p>
          )}

          <p className="text-slate-500 text-sm mb-4">
            Uploaded at:{' '}
            {summary.createdAt
              ? new Date(summary.createdAt).toLocaleDateString()
              : 'No date'}
          </p>

          {isImageFile && (
            <img
              src={fileFullUrl}
              alt={summary.courseName}
              className="w-full h-40 object-cover rounded-lg mb-4 border"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}

          <a
            href={fileFullUrl}
            target="_blank"
            rel="noreferrer"
            className="block text-center w-full bg-blue-700 text-white py-2 rounded-lg font-semibold hover:bg-blue-800"
          >
            Open File
          </a>

          <Link
            to={`/summaries/${summary._id}`}
            className="mt-3 block text-center w-full bg-slate-200 text-slate-700 py-2 rounded-lg font-semibold hover:bg-slate-300"
          >
            View Details
          </Link>

          {isOwner && (
            <>
              <button
                onClick={() => onStartEdit(summary)}
                className="mt-3 w-full bg-yellow-500 text-white py-2 rounded-lg font-semibold hover:bg-yellow-600"
              >
                Edit
              </button>

              <button
                onClick={() => onDelete(summary._id)}
                className="mt-3 w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700"
              >
                Delete
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default memo(SummaryCard);