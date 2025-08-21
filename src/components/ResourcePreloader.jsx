import { useEffect } from 'react';
import { usePreload } from '../hooks/useLazyLoad';

const ResourcePreloader = () => {
  // Preload critical CSS
  useEffect(() => {
    // Preload critical fonts
    const preloadFont = (href) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = href;
      document.head.appendChild(link);
    };

    // Preload DNS for external services
    const preloadDNS = (href) => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = href;
      document.head.appendChild(link);
    };

    // Preload critical external domains
    preloadDNS('//fonts.googleapis.com');
    preloadDNS('//fonts.gstatic.com');
    preloadDNS('//firebase.googleapis.com');

    // Preload critical images
    const preloadImage = (src) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    };

    // Add any critical images here
    // preloadImage('/path/to/critical-image.jpg');

  }, []);

  // Preload critical chunks
  const { isPreloaded: dashboardPreloaded } = usePreload(
    () => import('../pages/Dashboard'),
    []
  );

  const { isPreloaded: studyPreloaded } = usePreload(
    () => import('../pages/Study'),
    []
  );

  // Preload gamification components after initial load
  useEffect(() => {
    if (dashboardPreloaded) {
      import('../components/AchievementSystem').catch(() => {});
      import('../components/RewardSystem').catch(() => {});
      import('../components/LeaderboardSystem').catch(() => {});
    }
  }, [dashboardPreloaded]);

  // This component doesn't render anything
  return null;
};

export default ResourcePreloader;
