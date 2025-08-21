import { useState, useEffect, useRef } from 'react';

// Custom hook for lazy loading components based on intersection
export const useLazyLoad = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const elementRef = useRef(null);

  const defaultOptions = {
    threshold: 0.1,
    rootMargin: '50px',
    ...options
  };

  useEffect(() => {
    const element = elementRef.current;
    
    if (!element || hasLoaded) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasLoaded(true);
          observer.unobserve(element);
        }
      },
      defaultOptions
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [hasLoaded, defaultOptions]);

  return [elementRef, isVisible];
};

// Hook for lazy loading images
export const useLazyImage = (src, placeholder = '') => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [ref, isVisible] = useLazyLoad();

  useEffect(() => {
    if (!isVisible || !src) return;

    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
    
    img.onerror = () => {
      setIsError(true);
    };
    
    img.src = src;
  }, [isVisible, src]);

  return {
    ref,
    src: imageSrc,
    isLoaded,
    isError,
    isVisible
  };
};

// Hook for preloading data/components
export const usePreload = (preloadFn, dependencies = []) => {
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    const preload = async () => {
      try {
        await preloadFn();
        if (!isCancelled) {
          setIsPreloaded(true);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err);
        }
      }
    };

    preload();

    return () => {
      isCancelled = true;
    };
  }, dependencies);

  return { isPreloaded, error };
};

// Hook for debounced preloading (useful for hover effects)
export const useDebouncedPreload = (preloadFn, delay = 100) => {
  const timeoutRef = useRef(null);
  const [isPreloading, setIsPreloading] = useState(false);

  const startPreload = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsPreloading(true);
    timeoutRef.current = setTimeout(() => {
      preloadFn().finally(() => {
        setIsPreloading(false);
      });
    }, delay);
  };

  const cancelPreload = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      setIsPreloading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { startPreload, cancelPreload, isPreloading };
};
