// Performance optimization utilities

// Debounce function for performance
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

// Throttle function for performance
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Memoization helper
export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// Virtual scrolling helper for large lists
export const createVirtualizer = (items, itemHeight, containerHeight) => {
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const bufferCount = Math.floor(visibleCount / 2);
  
  return {
    getVisibleRange: (scrollTop) => {
      const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - bufferCount);
      const endIndex = Math.min(items.length - 1, startIndex + visibleCount + bufferCount * 2);
      return { startIndex, endIndex };
    },
    getItemStyle: (index) => ({
      position: 'absolute',
      top: index * itemHeight,
      height: itemHeight,
      width: '100%'
    }),
    getTotalHeight: () => items.length * itemHeight
  };
};

// Image optimization
export const optimizeImage = (src, width, height, quality = 80) => {
  // In a real app, this would connect to an image CDN like Cloudinary
  // For now, return the original src
  return src;
};

// Bundle analyzer helper
export const analyzePerformance = () => {
  if (typeof window !== 'undefined' && window.performance) {
    const perfData = window.performance.getEntriesByType('navigation')[0];
    
    console.group('Performance Metrics');
    console.log('DNS Lookup:', perfData.domainLookupEnd - perfData.domainLookupStart);
    console.log('TCP Connection:', perfData.connectEnd - perfData.connectStart);
    console.log('Request:', perfData.responseStart - perfData.requestStart);
    console.log('Response:', perfData.responseEnd - perfData.responseStart);
    console.log('DOM Content Loaded:', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart);
    console.log('Load Complete:', perfData.loadEventEnd - perfData.loadEventStart);
    console.groupEnd();

    return {
      dnsLookup: perfData.domainLookupEnd - perfData.domainLookupStart,
      tcpConnection: perfData.connectEnd - perfData.connectStart,
      request: perfData.responseStart - perfData.requestStart,
      response: perfData.responseEnd - perfData.responseStart,
      domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
      loadComplete: perfData.loadEventEnd - perfData.loadEventStart
    };
  }
  return null;
};

// Memory usage monitor
export const monitorMemoryUsage = () => {
  if (typeof window !== 'undefined' && window.performance && window.performance.memory) {
    const memory = window.performance.memory;
    console.log('Memory Usage:', {
      used: Math.round(memory.usedJSHeapSize / 1048576 * 100) / 100 + ' MB',
      total: Math.round(memory.totalJSHeapSize / 1048576 * 100) / 100 + ' MB',
      limit: Math.round(memory.jsHeapSizeLimit / 1048576 * 100) / 100 + ' MB'
    });
    return memory;
  }
  return null;
};

// Resource hints
export const addResourceHint = (rel, href, as = null, crossorigin = null) => {
  const link = document.createElement('link');
  link.rel = rel;
  link.href = href;
  if (as) link.as = as;
  if (crossorigin) link.crossOrigin = crossorigin;
  document.head.appendChild(link);
};

// Preconnect to external domains
export const preconnectDomains = (domains) => {
  domains.forEach(domain => {
    addResourceHint('preconnect', domain);
  });
};

// Critical CSS inlining helper
export const inlineCriticalCSS = (css) => {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
};
