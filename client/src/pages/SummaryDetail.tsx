import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import type { Summary } from '../store/summariesSlice';

function SummaryDetail() {
  const { id } = useParams();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const apiBaseUrl =
    import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

  const serverBaseUrl = apiBaseUrl.replace(/\/api\/?$/, '');

  useEffect(() => {
    const fetchSummary = async () => {
      if (!id) {
        setError('Summary id is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/summaries/${id}`);
        setSummary(response.data.data);
      } catch {
        setError('Summary not found');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [id]);

  if (loading) {
    return <LoadingSpinner text="Loading summary..." />;
  }

  if (error || !summary) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-8 text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-3">
          Summary not found
        </h1>

        <p className="text-slate-600 mb-6">
          The summary you are looking for does not exist or could not be loaded.
        </p>

        <Link
          to="/browse"
          className="inline-block bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-800"
        >
          Back to Browse
        </Link>
      </div>
    );
  }

  const fileFullUrl = `${serverBaseUrl}${summary.fileUrl}`;
  const isImageFile = /\.(jpg|jpeg|png|webp|gif)$/i.test(summary.fileUrl);

  return (
    <div className="bg-white rounded-2xl shadow-md p-8 max-w-3xl mx-auto">
      <Link
        to="/browse"
        className="inline-block text-blue-700 font-semibold mb-6 hover:underline"
      >
        ← Back to Browse
      </Link>

      <h1 className="text-3xl font-bold text-blue-700 mb-4">
        {summary.courseName}
      </h1>

      <div className="space-y-3 text-slate-700">
        <p>
          <strong>Subject:</strong> {summary.subject}
        </p>

        <p>
          <strong>University:</strong> {summary.university}
        </p>

        <p>
          <strong>Uploader:</strong> {summary.uploader?.name || 'Unknown'}
        </p>

        {summary.description && (
          <p>
            <strong>Description:</strong> {summary.description}
          </p>
        )}

        <p className="text-slate-500 text-sm">
          Uploaded at:{' '}
          {summary.createdAt
            ? new Date(summary.createdAt).toLocaleDateString()
            : 'No date'}
        </p>
      </div>

      {isImageFile && (
        <img
          src={fileFullUrl}
          alt={summary.courseName}
          className="w-full max-h-96 object-cover rounded-xl my-6 border"
        />
      )}

      <a
        href={fileFullUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-6 block text-center w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800"
      >
        Open File
      </a>
    </div>
  );
}

export default SummaryDetail;