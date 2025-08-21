// Preload critical routes to improve perceived performance
export const preloadRoute = (importFn) => {
  const componentImport = importFn();
  return componentImport;
};

// Preload critical components on app load
export const preloadCriticalRoutes = () => {
  // Preload dashboard components since they're most likely to be accessed
  import('../pages/Dashboard');
  import('../components/GamifiedDashboard');
  import('../components/Navbar');
  import('../components/Sidebar');
  
  // Preload authentication pages for quick access
  import('../pages/Login');
  import('../pages/Signup');
};

// Preload routes when user hovers over navigation links
export const preloadOnHover = (routeName) => {
  const routeMap = {
    'dashboard': () => import('../pages/Dashboard'),
    'gamified-dashboard': () => import('../components/GamifiedDashboard'),
    'subjects': () => import('../pages/Subjects'),
    'study': () => import('../pages/Study'),
    'tasks': () => import('../pages/Tasks'),
    'schedule': () => import('../pages/Schedule'),
    'insights': () => import('../pages/Insights'),
    'login': () => import('../pages/Login'),
    'signup': () => import('../pages/Signup'),
  };
  
  if (routeMap[routeName]) {
    routeMap[routeName]();
  }
};
