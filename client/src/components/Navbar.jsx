import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-700">
          UniShare
        </Link>

        <div className="flex gap-6 text-slate-700 font-medium">
          <Link to="/" className="hover:text-blue-700">Home</Link>
          <Link to="/browse" className="hover:text-blue-700">Browse</Link>
          <Link to="/upload" className="hover:text-blue-700">Upload</Link>

          {isLoggedIn ? (
            <button
              onClick={logout}
              className="hover:text-blue-700 font-medium"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="hover:text-blue-700">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;