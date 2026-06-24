import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function Upload() {
  const { isLoggedIn } = useAuth();

  const [formData, setFormData] = useState({
    courseName: '',
    university: '',
    subject: '',
    description: '',
  });

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md p-8 text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">
          Login Required
        </h1>

        <p className="text-slate-600 mb-6">
          You need to login before uploading a summary.
        </p>

        <Link
          to="/login"
          className="inline-block bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const data = new FormData();

      data.append('courseName', formData.courseName);
      data.append('university', formData.university);
      data.append('subject', formData.subject);
      data.append('description', formData.description);

      if (file) {
        data.append('file', file);
      }
      
      await api.post('/summaries', data);

      setMessage('Summary uploaded successfully!');

      setFormData({
        courseName: '',
        university: '',
        subject: '',
        description: '',
      });

      setFile(null);
    } catch (error) {
        console.log(error.response?.data || error.message);
      
        setMessage(
          error.response?.data?.message ||
          'Upload failed. Please choose a file and make sure you are logged in.'
        );
      } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">
        Upload Summary
      </h1>

      <p className="text-slate-600 mb-6">
        Fill in the details and upload a PDF, Word document, or image.
      </p>

      {message && (
        <p className="mb-4 font-semibold text-blue-700">
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-slate-700 font-medium mb-1">
            Course Name
          </label>
          <input
            type="text"
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-lg px-4 py-2"
            placeholder="Example: Introduction to AI"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-medium mb-1">
            University
          </label>
          <select
            name="university"
            value={formData.university}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-lg px-4 py-2"
          >
            <option value="">Choose university</option>
            <option value="Bar-Ilan University">Bar-Ilan University</option>
            <option value="Tel Aviv University">Tel Aviv University</option>
            <option value="Hebrew University">Hebrew University</option>
            <option value="Technion">Technion</option>
            <option value="University of Haifa">University of Haifa</option>
            <option value="Ariel University">Ariel University</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-700 font-medium mb-1">
            Subject
          </label>
          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-lg px-4 py-2"
          >
            <option value="">Choose subject</option>
            <option value="Artificial Intelligence">Artificial Intelligence</option>
            <option value="Databases">Databases</option>
            <option value="Psychology">Psychology</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Science">Information Science</option>
            <option value="Statistics">Statistics</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-700 font-medium mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-slate-300 rounded-lg px-4 py-2"
            placeholder="Write a short description about the summary..."
          />
        </div>

        <div>
          <label className="block text-slate-700 font-medium mb-1">
            Upload File
          </label>
          <input
            type="file"
            name="file"
            onChange={handleFileChange}
            className="w-full border border-slate-300 rounded-lg px-4 py-2"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
          />
          <p className="text-sm text-slate-500 mt-1">
            Allowed: PDF, Word, JPG, PNG, WebP.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 disabled:bg-slate-400"
        >
          {loading ? 'Uploading...' : 'Upload Summary'}
        </button>
      </form>
    </div>
  );
}

export default Upload;
