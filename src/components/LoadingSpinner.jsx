import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ 
  size = 'default', 
  variant = 'default',
  text = 'Loading...',
  className = ''
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const variants = {
    default: 'flex items-center justify-center p-8',
    fullscreen: 'fixed inset-0 flex flex-col items-center justify-center bg-white z-50',
    inline: 'flex items-center gap-2',
    minimal: 'flex items-center justify-center'
  };

  const spinnerClass = `${sizeClasses[size]} animate-spin text-purple-600`;
  const containerClass = `${variants[variant]} ${className}`;

  if (variant === 'inline') {
    return (
      <div className={containerClass}>
        <Loader2 className={spinnerClass} />
        <span className="text-gray-600">{text}</span>
      </div>
    );
  }

  if (variant === 'fullscreen') {
    return (
      <div className={containerClass}>
        <Loader2 className={spinnerClass} />
        <p className="text-gray-600 font-medium mt-4">{text}</p>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <Loader2 className={spinnerClass} />
      {variant !== 'minimal' && (
        <p className="text-gray-600 mt-2">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
