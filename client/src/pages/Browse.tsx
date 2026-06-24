import { useEffect, useState } from 'react';
import api from '../services/api';

function Browse() {
    const [summaries, setSummaries] = useState([]);
    const [search, setSearch] = useState('');
    const [university, setUniversity] = useState('');
    const [subject, setSubject] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSummaries = async () => {
            try {
                const response = await api.get('/summaries');
                setSummaries(response.data.data);
            } catch (err) {
                setError('Failed to load summaries');
            } finally {
                setLoading(false);
            }
        };

        fetchSummaries();
    }, []);

    const filteredSummaries = summaries.filter((summary) => {
        const matchesSearch = summary.courseName
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesUniversity =
            university === '' || summary.university === university;

        const matchesSubject =
            subject === '' || summary.subject === subject;

        return matchesSearch && matchesUniversity && matchesSubject;
    });

    const resetFilters = () => {
        setSearch('');
        setUniversity('');
        setSubject('');
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-md p-8 text-center text-slate-600">
                Loading summaries...
            </div>
        );
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
                        <option value="Artificial Intelligence">Artificial Intelligence</option>
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

            {filteredSummaries.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-md p-8 text-center text-slate-600">
                    No summaries found.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filteredSummaries.map((summary) => (
                        <div
                            key={summary._id}
                            className="bg-white rounded-2xl shadow-md p-6"
                        >
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

                            <p className="text-slate-500 text-sm mb-4">
                                Uploaded at:{' '}
                                {summary.createdAt
                                    ? new Date(summary.createdAt).toLocaleDateString()
                                    : 'No date'}
                            </p>

                            <a
                                href={`http://127.0.0.1:5000${summary.fileUrl}`}
                                target="_blank"
                                rel="noreferrer"
                                className="block text-center w-full bg-blue-700 text-white py-2 rounded-lg font-semibold hover:bg-blue-800"
                            >
                                Download PDF
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Browse;
