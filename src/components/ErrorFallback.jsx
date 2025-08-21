import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const ErrorFallback = ({ error, resetError }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-8 text-center">
      <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
      <h2 className="text-lg font-semibold text-gray-900 mb-2">
        Something went wrong
      </h2>
      <p className="text-gray-600 mb-4 max-w-md">
        We're having trouble loading this content. Please try again.
      </p>
      {resetError && (
        <button
          onClick={resetError}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorFallback;
