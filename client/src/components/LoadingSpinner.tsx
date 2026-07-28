type LoadingSpinnerProps = {
    text?: string;
  };
  
  function LoadingSpinner({ text = 'Loading...' }: LoadingSpinnerProps) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-8 text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-700"></div>
  
        <p className="text-slate-600 font-medium">
          {text}
        </p>
      </div>
    );
  }
  
  export default LoadingSpinner;