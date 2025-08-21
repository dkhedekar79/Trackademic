import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TimerProvider } from './context/TimerContext';
import { GamificationProvider } from './context/GamificationContext';
import ProtectedRoute from './routes/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorFallback from './components/ErrorFallback';
import { preloadCriticalRoutes, setupSmartPrefetch } from './utils/preloader';
import './styles/index.css';

// Import lazy components from centralized file
import {
  LazyLanding,
  LazyLogin,
  LazySignup,
  LazyDashboard,
  LazyGamifiedDashboard,
  LazySubjects,
  LazyStudy,
  LazyTasks,
  LazySchedule,
  LazyInsights,
  LazyPrivacy,
  LazySidebar,
  LazyNavbar
} from './components/LazyComponents';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} resetError={() => this.setState({ hasError: false, error: null })} />;
    }

    return this.props.children;
  }
}

function App() {
  useEffect(() => {
    // Setup preloading and smart prefetching
    preloadCriticalRoutes();
    setupSmartPrefetch();
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <GamificationProvider>
          <TimerProvider>
            <Router>
              <Suspense fallback={<LoadingSpinner variant="fullscreen" text="Loading Application..." />}>
                <Routes>
                  <Route path="/" element={<LazyLanding />} />
                  <Route path="/login" element={<LazyLogin />} />
                  <Route path="/signup" element={<LazySignup />} />

                  {/* Protected Routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingSpinner variant="fullscreen" text="Loading Dashboard..." />}>
                        <Layout>
                          <LazyGamifiedDashboard />
                        </Layout>
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/classic-dashboard" element={
                    <ProtectedRoute>
                      <Layout>
                        <Suspense fallback={<LoadingSpinner text="Loading Classic Dashboard..." />}>
                          <LazyDashboard />
                        </Suspense>
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/subjects" element={
                    <ProtectedRoute>
                      <Layout>
                        <Suspense fallback={<LoadingSpinner text="Loading Subjects..." />}>
                          <LazySubjects />
                        </Suspense>
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/study" element={
                    <ProtectedRoute>
                      <Layout>
                        <Suspense fallback={<LoadingSpinner text="Loading Study..." />}>
                          <LazyStudy />
                        </Suspense>
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/tasks" element={
                    <ProtectedRoute>
                      <Layout>
                        <Suspense fallback={<LoadingSpinner text="Loading Tasks..." />}>
                          <LazyTasks />
                        </Suspense>
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/schedule" element={
                    <ProtectedRoute>
                      <Layout>
                        <Suspense fallback={<LoadingSpinner text="Loading Schedule..." />}>
                          <LazySchedule />
                        </Suspense>
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/insights" element={
                    <ProtectedRoute>
                      <Layout>
                        <Suspense fallback={<LoadingSpinner text="Loading Insights..." />}>
                          <LazyInsights />
                        </Suspense>
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/privacy" element={
                    <ProtectedRoute>
                      <Layout>
                        <Suspense fallback={<LoadingSpinner text="Loading Privacy..." />}>
                          <LazyPrivacy />
                        </Suspense>
                      </Layout>
                    </ProtectedRoute>
                  } />
                </Routes>
              </Suspense>
            </Router>
          </TimerProvider>
        </GamificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

// Extract common layout with lazy loaded components
const Layout = ({ children }) => (
  <div className="flex h-screen bg-gray-50">
    <Suspense fallback={<div className="w-64 bg-gray-200 animate-pulse" />}>
      <LazySidebar />
    </Suspense>
    <div className="flex-1 flex flex-col">
      <Suspense fallback={<div className="h-16 bg-gray-200 animate-pulse" />}>
        <LazyNavbar />
      </Suspense>
      <main className="flex-1 overflow-auto">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
    </div>
  </div>
);

export default App;
