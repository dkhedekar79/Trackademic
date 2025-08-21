import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TimerProvider } from './context/TimerContext';
import { GamificationProvider } from './context/GamificationContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import './styles/index.css';

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
  return (
    <AuthProvider>
      <GamificationProvider>
        <TimerProvider>
          <Router>
            <Suspense fallback={<div className="flex items-center justify-center h-screen text-2xl">Loading…</div>}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Layout><GamifiedDashboard /></Layout>
                  </ProtectedRoute>
                } />
                <Route path="/classic-dashboard" element={
                  <ProtectedRoute>
                    <Layout><Dashboard /></Layout>
                  </ProtectedRoute>
                } />
                <Route path="/subjects" element={
                  <ProtectedRoute>
                    <Layout><Subjects /></Layout>
                  </ProtectedRoute>
                } />
                <Route path="/study" element={
                  <ProtectedRoute>
                    <Layout><Study /></Layout>
                  </ProtectedRoute>
                } />
                <Route path="/tasks" element={
                  <ProtectedRoute>
                    <Layout><Tasks /></Layout>
                  </ProtectedRoute>
                } />
                <Route path="/schedule" element={
                  <ProtectedRoute>
                    <Layout><Schedule /></Layout>
                  </ProtectedRoute>
                } />
                <Route path="/insights" element={
                  <ProtectedRoute>
                    <Layout><Insights /></Layout>
                  </ProtectedRoute>
                } />
                <Route path="/privacy" element={
                  <ProtectedRoute>
                    <Layout><Privacy /></Layout>
                  </ProtectedRoute>
                } />
              </Routes>
            </Suspense>
          </Router>
        </TimerProvider>
      </GamificationProvider>
    </AuthProvider>
  );
}

// Extract common layout
const Layout = ({ children }) => (
  <div className="flex h-screen bg-gray-50">
    <Sidebar />
    <div className="flex-1 flex flex-col">
      <Navbar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  </div>
);

export default App;
