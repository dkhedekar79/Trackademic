import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TimerProvider } from './context/TimerContext';
import { GamificationProvider } from './context/GamificationContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import GamifiedDashboard from './components/GamifiedDashboard';
import Subjects from './pages/Subjects';
import Study from './pages/Study';
import Tasks from './pages/Tasks';
import Schedule from './pages/Schedule';
import Insights from './pages/Insights';
import Settings from './pages/Settings';
import './styles/index.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  return children;
};

function App() {
  return (
    <GamificationProvider>
      <TimerProvider>
        <Router>
          <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Navbar />
              <main className="flex-1 overflow-auto">
                <Routes>
                  <Route path="/" element={<ProtectedRoute><GamifiedDashboard /></ProtectedRoute>} />
                  <Route path="/dashboard" element={<ProtectedRoute><GamifiedDashboard /></ProtectedRoute>} />
                  <Route path="/classic-dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/subjects" element={<ProtectedRoute><Subjects /></ProtectedRoute>} />
                  <Route path="/study" element={<ProtectedRoute><Study /></ProtectedRoute>} />
                  <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
                  <Route path="/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
                  <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                </Routes>
              </main>
            </div>
          </div>
        </Router>
      </TimerProvider>
    </GamificationProvider>
  );
}

export default App;
