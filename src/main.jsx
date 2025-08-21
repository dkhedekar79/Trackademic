import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.css";

// Enable Concurrent Features for better performance
const root = ReactDOM.createRoot(document.getElementById("root"));

// Use concurrent mode for better performance
root.render(<App />);

// Register service worker for caching (if available)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Performance monitoring
if (import.meta.env.DEV) {
  import('react-dom/profiling').then(({ unstable_Profiler }) => {
    // Enable React Profiler in development
    console.log('React Profiler available for performance monitoring');
  }).catch(() => {
    // Profiler not available, that's okay
  });
}
