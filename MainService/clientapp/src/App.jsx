import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import TournamentsPage from './pages/TournamentsPage';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Navbar />
          
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home onRequireAuth={() => alert('Будь ласка, увійдіть в акаунт (кнопка в правому верхньому куті)!')} />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/tournaments" element={<TournamentsPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}