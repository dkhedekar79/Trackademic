import React from 'react';
import { Loader2, BookOpen } from 'lucide-react';

const AppLoadingScreen = () => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 z-50">
    <div className="text-center">
      <div className="mb-8">
        <BookOpen className="w-16 h-16 text-purple-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Study App</h1>
        <p className="text-gray-600">Preparing your learning experience...</p>
      </div>
      
      <div className="flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
      
      <div className="mt-8 flex space-x-1">
        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  </div>
);

export default AppLoadingScreen;
