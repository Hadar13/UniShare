import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="space-y-10">
      <section className="bg-gradient-to-br from-blue-50 via-white to-teal-50 rounded-3xl shadow-md p-8 md:p-12 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white text-blue-700 px-5 py-2 rounded-full shadow-sm font-semibold mb-6">
            <span>🎓</span>
            <span>Academic Summary Sharing Platform</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-5 leading-tight">
            Welcome to <span className="text-blue-700">UniShare</span>
          </h1>

          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto mb-8">
            Upload, browse, and manage academic summaries in one organized,
            friendly, and secure platform built for students.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/browse"
              className="bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-blue-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              📚 Browse Summaries
            </Link>

            <Link
              to="/upload"
              className="bg-white border-2 border-blue-700 text-blue-700 px-8 py-3 rounded-xl font-bold shadow-sm hover:bg-blue-50 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
            >
              ⬆️ Upload Summary
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="group bg-white rounded-3xl shadow-md p-7 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-200">
          <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-200">
            🔎
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-3">
            Search Easily
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Find summaries by course, subject, or university using simple search
            and filters.
          </p>
        </div>

        <div className="group bg-white rounded-3xl shadow-md p-7 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-200">
          <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-200">
            📄
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-3">
            Upload Files
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Share PDF, Word, and image files with other students in a few simple
            steps.
          </p>
        </div>

        <div className="group bg-white rounded-3xl shadow-md p-7 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-200">
          <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-200">
            🔐
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-3">
            Secure Access
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Log in with email or Google and access protected upload and profile
            pages.
          </p>
        </div>
      </section>

      <section className="bg-white rounded-3xl shadow-md p-8">
        <div className="text-center mb-8">
          <p className="text-blue-700 font-semibold mb-2">✨ Main Features</p>
          <h2 className="text-3xl font-bold text-slate-800">
            Everything students need in one place
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          <div className="bg-slate-50 rounded-2xl p-5 hover:bg-blue-50 hover:shadow-md transition-all duration-200">
            <p className="font-semibold text-slate-800">✅ User registration and login</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 hover:bg-blue-50 hover:shadow-md transition-all duration-200">
            <p className="font-semibold text-slate-800">✅ Google authentication</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 hover:bg-blue-50 hover:shadow-md transition-all duration-200">
            <p className="font-semibold text-slate-800">✅ Protected upload and profile pages</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 hover:bg-blue-50 hover:shadow-md transition-all duration-200">
            <p className="font-semibold text-slate-800">✅ Summary files with media preview</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 hover:bg-blue-50 hover:shadow-md transition-all duration-200">
            <p className="font-semibold text-slate-800">✅ Edit and delete summaries</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 hover:bg-blue-50 hover:shadow-md transition-all duration-200">
            <p className="font-semibold text-slate-800">✅ Search and filtering options</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;