import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-8 text-center">
      <h1 className="text-4xl font-bold text-blue-700 mb-4">
        404
      </h1>

      <h2 className="text-2xl font-bold text-slate-800 mb-3">
        Page Not Found
      </h2>

      <p className="text-slate-600 mb-6">
        The page you are looking for does not exist.
      </p>

      <Link
        to="/"
        className="inline-block bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800"
      >
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;