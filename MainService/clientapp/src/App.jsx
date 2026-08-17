import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';

// Компоненти
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute'; // <-- ПОВЕРНУЛИ НАШОГО ОХОРОНЦЯ!

// Сторінки
import Home from './pages/Home';
import Profile from './pages/Profile';
import TournamentsPage from './pages/TournamentsPage';
import AdminDashboard from './pages/AdminDashboard';

function AppContent() {
  const { showToast } = useToast();
  const location = useLocation();
  
  // Ховаємо Navbar, якщо ми на сторінці адмінки
  const isAdminPage = location.pathname === '/admin';

  return (
    <>
      {!isAdminPage && <Navbar />}
      
      <div className="main-content">
        <Routes>
          <Route 
            path="/" 
            element={<Home onRequireAuth={() => showToast('Будь ласка, увійдіть в акаунт для бронювання', 'error')} />} 
          />
          
          <Route path="/tournaments" element={<TournamentsPage />} />

          {/* ЗАХИЩЕНА СТОРІНКА ПРОФІЛЮ (Тільки для залогінених) */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          {/* СУВОРО ЗАХИЩЕНА СТОРІНКА АДМІНКИ (Тільки для Адмінів) */}
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <AppContent />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}