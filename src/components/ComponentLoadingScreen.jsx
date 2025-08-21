import React from 'react';
import { Loader2 } from 'lucide-react';

const ComponentLoadingScreen = ({ size = "sm", message = "Loading..." }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-purple-600 mb-2`} />
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );
};

export default ComponentLoadingScreen;
