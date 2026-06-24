function Home() {
    return (
      <section className="bg-white rounded-2xl shadow-md p-10 text-center">
        <h1 className="text-5xl font-bold text-blue-700 mb-4">
          UniShare
        </h1>
  
        <p className="text-xl text-slate-600 mb-8">
          A collaborative platform for sharing academic summaries between students.
        </p>
  
        <div className="flex justify-center gap-4">
          <a href="/browse" className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800">
            Browse Summaries
          </a>
  
          <a href="/upload" className="border border-blue-700 text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50">
            Upload Summary
          </a>
        </div>
      </section>
    );
  }
  
  export default Home;
