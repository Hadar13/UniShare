import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Browse = lazy(() => import('./pages/Browse'));
const SummaryDetail = lazy(() => import('./pages/SummaryDetail'));
const Upload = lazy(() => import('./pages/Upload'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <Suspense fallback={<LoadingSpinner text="Loading page..." />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/summaries/:id" element={<SummaryDetail />} />

            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;