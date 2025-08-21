// Performance monitoring utilities for the app

// Measure component loading times
export const measureComponentLoad = (componentName) => {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`⚡ ${componentName} loaded in ${loadTime.toFixed(2)}ms`);
    }
    
    // Send to analytics if needed
    if (window.gtag) {
      window.gtag('event', 'component_load_time', {
        event_category: 'Performance',
        event_label: componentName,
        value: Math.round(loadTime),
      });
    }
  };
};

// Track largest contentful paint
export const trackLCP = () => {
  if ('PerformanceObserver' in window) {
    const po = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 LCP:', lastEntry.startTime.toFixed(2), 'ms');
      }
      
      if (window.gtag) {
        window.gtag('event', 'largest_contentful_paint', {
          event_category: 'Performance',
          value: Math.round(lastEntry.startTime),
        });
      }
    });
    
    po.observe({ type: 'largest-contentful-paint', buffered: true });
  }
};

// Track first input delay
export const trackFID = () => {
  if ('PerformanceObserver' in window) {
    const po = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const firstInput = entries[0];
      
      if (process.env.NODE_ENV === 'development') {
        console.log('⚡ FID:', firstInput.processingStart - firstInput.startTime, 'ms');
      }
      
      if (window.gtag) {
        window.gtag('event', 'first_input_delay', {
          event_category: 'Performance',
          value: Math.round(firstInput.processingStart - firstInput.startTime),
        });
      }
    });
    
    po.observe({ type: 'first-input', buffered: true });
  }
};

// Initialize performance tracking
export const initPerformanceTracking = () => {
  // Track core web vitals
  trackLCP();
  trackFID();
  
  // Track initial page load
  window.addEventListener('load', () => {
    const loadTime = performance.now();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 Initial page load:', loadTime.toFixed(2), 'ms');
    }
    
    if (window.gtag) {
      window.gtag('event', 'page_load_time', {
        event_category: 'Performance',
        value: Math.round(loadTime),
      });
    }
  });
};
