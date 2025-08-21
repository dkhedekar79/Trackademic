// Preload critical resources
export const preloadRoute = (routeImport) => {
  try {
    const componentImport = typeof routeImport === 'function' ? routeImport() : routeImport;
    
    if (componentImport && typeof componentImport.then === 'function') {
      componentImport.catch(() => {
        console.warn('Failed to preload route');
      });
    }
    
    return componentImport;
  } catch (error) {
    console.warn('Error in preloadRoute:', error);
    return null;
  }
};

// Preload images
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = reject;
    img.src = src;
  });
};

// Preload multiple images
export const preloadImages = (srcArray) => {
  return Promise.allSettled(srcArray.map(preloadImage));
};

// Intersection Observer for lazy loading
export const createLazyObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };

  if ('IntersectionObserver' in window) {
    return new IntersectionObserver(callback, defaultOptions);
  }
  
  return null;
};

// Preload critical routes based on user behavior
export const preloadCriticalRoutes = () => {
  try {
    // Preload dashboard and study routes as they're most accessed
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // These imports are wrapped in try-catch to prevent errors
        import('../pages/Dashboard').catch(() => {});
        import('../pages/Study').catch(() => {});
        import('../components/GamifiedDashboard').catch(() => {});
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        import('../pages/Dashboard').catch(() => {});
        import('../pages/Study').catch(() => {});
        import('../components/GamifiedDashboard').catch(() => {});
      }, 2000);
    }
  } catch (error) {
    console.warn('Error in preloadCriticalRoutes:', error);
  }
};

// Smart prefetching based on user interaction
export const setupSmartPrefetch = () => {
  try {
    if (typeof window === 'undefined') return;

    const prefetchOnHover = (selector, moduleLoader) => {
      let hoverTimer;
      
      const handleMouseEnter = (e) => {
        if (e.target.matches && e.target.matches(selector)) {
          hoverTimer = setTimeout(() => {
            moduleLoader().catch(() => {});
          }, 100);
        }
      };

      const handleMouseLeave = (e) => {
        if (e.target.matches && e.target.matches(selector) && hoverTimer) {
          clearTimeout(hoverTimer);
        }
      };

      document.addEventListener('mouseenter', handleMouseEnter, true);
      document.addEventListener('mouseleave', handleMouseLeave, true);
    };

    // Prefetch routes on navigation hover
    prefetchOnHover('[href="/dashboard"]', () => import('../pages/Dashboard'));
    prefetchOnHover('[href="/study"]', () => import('../pages/Study'));
    prefetchOnHover('[href="/insights"]', () => import('../pages/Insights'));
    prefetchOnHover('[href="/schedule"]', () => import('../pages/Schedule'));
    prefetchOnHover('[href="/tasks"]', () => import('../pages/Tasks'));
    prefetchOnHover('[href="/subjects"]', () => import('../pages/Subjects'));
  } catch (error) {
    console.warn('Error in setupSmartPrefetch:', error);
  }
};
