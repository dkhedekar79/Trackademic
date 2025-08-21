import React, { createContext, useContext, useEffect, useState } from 'react';
import { analyzePerformance, monitorMemoryUsage, preconnectDomains } from '../utils/performanceOptimizer';

const PerformanceContext = createContext();

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
};

export const PerformanceProvider = ({ children }) => {
  const [performanceData, setPerformanceData] = useState(null);
  const [memoryUsage, setMemoryUsage] = useState(null);

  useEffect(() => {
    // Setup performance monitoring
    const measurePerformance = () => {
      const perfData = analyzePerformance();
      const memory = monitorMemoryUsage();
      
      setPerformanceData(perfData);
      setMemoryUsage(memory);
    };

    // Preconnect to critical domains
    preconnectDomains([
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://firebase.googleapis.com'
    ]);

    // Initial measurement
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
    }

    // Monitor memory usage every 30 seconds in development
    let memoryInterval;
    if (import.meta.env.DEV) {
      memoryInterval = setInterval(() => {
        const memory = monitorMemoryUsage();
        setMemoryUsage(memory);
      }, 30000);
    }

    return () => {
      window.removeEventListener('load', measurePerformance);
      if (memoryInterval) {
        clearInterval(memoryInterval);
      }
    };
  }, []);

  // Web Vitals reporting (if available)
  useEffect(() => {
    if ('web-vitals' in window) {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(console.log);
        getFID(console.log);
        getFCP(console.log);
        getLCP(console.log);
        getTTFB(console.log);
      }).catch(() => {
        // Web Vitals not available
      });
    }
  }, []);

  const value = {
    performanceData,
    memoryUsage,
    logPerformance: analyzePerformance,
    logMemory: monitorMemoryUsage
  };

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
};
