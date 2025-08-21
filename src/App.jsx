import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TimerProvider } from './context/TimerContext';
import { GamificationProvider } from './context/GamificationContext';
import ProtectedRoute from './routes/ProtectedRoute';
import AppLoadingScreen from './components/AppLoadingScreen';
import PageLoadingScreen from './components/PageLoadingScreen';
import ComponentLoadingScreen from './components/ComponentLoadingScreen';
import LazyLoadErrorBoundary from './components/LazyLoadErrorBoundary';
import { preloadCriticalRoutes } from './utils/preloadRoutes';
import './styles/index.css';

// Lazy-loaded components for better code splitting
const Navbar = lazy(() => import('./components/Navbar'));
const Sidebar = lazy(() => import('./components/Sidebar'));

// Lazy-loaded pages
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const GamifiedDashboard = lazy(() => import('./components/GamifiedDashboard'));
const Subjects = lazy(() => import('./pages/Subjects'));
const Study = lazy(() => import('./pages/Study'));
const Tasks = lazy(() => import('./pages/Tasks'));
const Schedule = lazy(() => import('./pages/Schedule'));
const Insights = lazy(() => import('./pages/Insights'));
const Privacy = lazy(() => import('./pages/Privacy'));

function App() {
  // Preload critical routes on app initialization
  useEffect(() => {
    // Use requestIdleCallback if available, otherwise use setTimeout
    if (typeof window !== 'undefined') {
      if (window.requestIdleCallback) {
        window.requestIdleCallback(preloadCriticalRoutes);
      } else {
        setTimeout(preloadCriticalRoutes, 1000);
      }
    }
  }, []);

  return (
    <AuthProvider>
      <GamificationProvider>
        <TimerProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/" 
                element={
                  <Suspense fallback={<AppLoadingScreen />}>
                    <Landing />
                  </Suspense>
                } 
              />
              <Route 
                path="/login" 
                element={
                  <Suspense fallback={<PageLoadingScreen message="Loading login..." />}>
                    <Login />
                  </Suspense>
                } 
              />
              <Route 
                path="/signup" 
                element={
                  <Suspense fallback={<PageLoadingScreen message="Loading signup..." />}>
                    <Signup />
                  </Suspense>
                } 
              />

              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<AppLoadingScreen />}>
                      <DashboardLayout>
                        <GamifiedDashboard />
                      </DashboardLayout>
                    </Suspense>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/classic-dashboard" 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<AppLoadingScreen />}>
                      <StandardLayout>
                        <Dashboard />
                      </StandardLayout>
                    </Suspense>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/subjects" 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<PageLoadingScreen message="Loading subjects..." />}>
                      <StandardLayout>
                        <Subjects />
                      </StandardLayout>
                    </Suspense>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/study" 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<PageLoadingScreen message="Loading study session..." />}>
                      <StandardLayout>
                        <Study />
                      </StandardLayout>
                    </Suspense>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/tasks" 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<PageLoadingScreen message="Loading tasks..." />}>
                      <StandardLayout>
                        <Tasks />
                      </StandardLayout>
                    </Suspense>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/schedule" 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<PageLoadingScreen message="Loading schedule..." />}>
                      <StandardLayout>
                        <Schedule />
                      </StandardLayout>
                    </Suspense>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/insights" 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<PageLoadingScreen message="Loading insights..." />}>
                      <StandardLayout>
                        <Insights />
                      </StandardLayout>
                    </Suspense>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/privacy" 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<PageLoadingScreen message="Loading privacy policy..." />}>
                      <StandardLayout>
                        <Privacy />
                      </StandardLayout>
                    </Suspense>
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Router>
        </TimerProvider>
      </GamificationProvider>
    </AuthProvider>
  );
}

// Layout Components with their own loading states
const StandardLayout = ({ children }) => (
  <div className="flex h-screen bg-gray-50">
    <Suspense fallback={<ComponentLoadingScreen size="md" message="Loading navigation..." />}>
      <Sidebar />
    </Suspense>
    <div className="flex-1 flex flex-col">
      <Suspense fallback={<ComponentLoadingScreen size="sm" message="Loading header..." />}>
        <Navbar />
      </Suspense>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  </div>
);

const DashboardLayout = ({ children }) => (
  <div className="flex h-screen bg-gray-50">
    <Suspense fallback={<ComponentLoadingScreen size="md" message="Loading navigation..." />}>
      <Sidebar />
    </Suspense>
    <div className="flex-1 flex flex-col">
      <Suspense fallback={<ComponentLoadingScreen size="sm" message="Loading header..." />}>
        <Navbar />
      </Suspense>
      <main className="flex-1 overflow-auto">
        <Suspense fallback={<ComponentLoadingScreen size="lg" message="Loading dashboard..." />}>
          {children}
        </Suspense>
      </main>
    </div>
  </div>
);

export default App;
