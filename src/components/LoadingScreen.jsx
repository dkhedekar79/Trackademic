import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingScreen = () => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
    <Loader2 className="w-12 h-12 animate-spin text-purple-600 mb-4" />
    <p className="text-gray-600 font-medium">Loading Dashboard...</p>
  </div>
);

export default LoadingScreen;
