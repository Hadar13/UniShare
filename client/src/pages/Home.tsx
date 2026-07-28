import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="space-y-8">
      <section className="bg-white rounded-3xl shadow-md p-10 md:p-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="inline-block bg-blue-50 text-blue-700 font-semibold px-4 py-2 rounded-full mb-5">
              Academic sharing made simple
            </p>

            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Share summaries.
              <br />
              Study smarter.
            </h1>

            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              UniShare helps students upload, browse, and manage academic
              summaries in one organized platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/browse"
                className="bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-center hover:bg-blue-800"
              >
                Browse Summaries
              </Link>

              <Link
                to="/upload"
                className="border-2 border-blue-700 text-blue-700 px-8 py-4 rounded-xl font-bold text-center hover:bg-blue-50"
              >
                Upload Summary
              </Link>
            </div>
          </div>

          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
            <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
              <p className="text-sm text-slate-500 mb-1">Course</p>
              <h3 className="text-xl font-bold text-slate-800">
                Advanced Databases
              </h3>
              <p className="text-slate-600 mt-2">
                Summary file uploaded by a student
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
              <p className="text-sm text-slate-500 mb-1">Subject</p>
              <h3 className="text-xl font-bold text-slate-800">
                Information Science
              </h3>
              <p className="text-slate-600 mt-2">
                Search, filter, open, edit, and manage summaries.
              </p>
            </div>

            <div className="bg-blue-700 text-white rounded-2xl p-5">
              <h3 className="text-xl font-bold mb-2">Secure Access</h3>
              <p className="text-blue-100">
                Login, Google authentication, and protected pages.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="text-3xl mb-4">📚</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Browse Materials
          </h2>
          <p className="text-slate-600">
            Find academic summaries by course, subject, or university.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="text-3xl mb-4">⬆️</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Upload Files
          </h2>
          <p className="text-slate-600">
            Upload PDF, Word, or image files and share them with others.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="text-3xl mb-4">🔐</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Personal Profile
          </h2>
          <p className="text-slate-600">
            Manage your account, profile image, and uploaded summaries.
          </p>
        </div>
      </section>

      <section className="bg-white rounded-3xl shadow-md p-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-6 text-center">
          How UniShare Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-bold text-slate-800 mb-2">Create Account</h3>
            <p className="text-slate-600">
              Register normally or sign in using Google.
            </p>
          </div>

          <div>
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-bold text-slate-800 mb-2">Upload Summary</h3>
            <p className="text-slate-600">
              Add course details and attach a summary file.
            </p>
          </div>

          <div>
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-bold text-slate-800 mb-2">Browse & Study</h3>
            <p className="text-slate-600">
              Search, filter, open, edit, or delete summaries.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;