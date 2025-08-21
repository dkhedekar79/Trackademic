import React from 'react';
import { useLazyImage } from '../hooks/useLazyLoad';

const LazyImage = ({ 
  src, 
  alt, 
  placeholder = '', 
  className = '',
  fallbackSrc = '',
  ...props 
}) => {
  const { ref, src: imageSrc, isLoaded, isError, isVisible } = useLazyImage(src, placeholder);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Placeholder while loading */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Error state */}
      {isError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-500">
          <span className="text-sm">Failed to load image</span>
        </div>
      )}
      
      {/* Actual image */}
      {isVisible && (
        <img
          src={isError && fallbackSrc ? fallbackSrc : imageSrc}
          alt={alt}
          className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          {...props}
        />
      )}
    </div>
  );
};

export default LazyImage;
