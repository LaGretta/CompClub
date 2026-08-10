import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import TournamentsPage from './pages/TournamentsPage';
import AdminDashboard from './pages/AdminDashboard';

function AppContent() {
  const { showToast } = useToast();
  return (
    <Router>
      <Navbar />
      
      <div className="main-content">
        <Routes>
          <Route 
            path="/" 
            element={
              <Home onRequireAuth={() => showToast('Будь ласка, увійдіть в акаунт для бронювання', 'error')} />
            } 
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/tournaments" element={<TournamentsPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}