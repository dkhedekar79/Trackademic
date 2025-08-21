import React from 'react';
import { Loader2 } from 'lucide-react';

const PageLoadingScreen = ({ message = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center h-64 bg-white">
    <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-4" />
    <p className="text-gray-600 font-medium">{message}</p>
  </div>
);

export default PageLoadingScreen;
