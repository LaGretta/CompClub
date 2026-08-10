import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TournamentsPage from './pages/TournamentsPage';
import AuthModal from './components/AuthModal';
import Profile from './pages/Profile';

export default function App() {
  // Єдине джерело правди про авторизацію — AuthContext (його ж читають Navbar/BookingMap/Profile).
  const { isAuthenticated } = useContext(AuthContext);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <Router>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<Home onRequireAuth={() => setIsAuthModalOpen(true)} />}
        />
        <Route path="/tournaments" element={<TournamentsPage />} />
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/" replace />}
        />
      </Routes>

      {/* Модалка для сценарію "гість тисне Забронювати" */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </Router>
  );
}
