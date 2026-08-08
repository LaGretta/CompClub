import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TournamentsPage from './pages/TournamentsPage';
import AuthModal from './components/AuthModal';
import Profile from './pages/Profile';

// Звичайний захист (для профілю) – пускає всіх авторизованих
const ProtectedRoute = ({ isAuth, children }) => {
  if (!isAuth) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default function App() {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleLoginSuccess = (userData) => {
    // userData містить { name, token }, який ми передаємо з AuthModal
    setUser(userData);
    setIsAuth(true);
  };

  // Оновлений вихід із системи з викликом бекенду
  const handleLogout = async () => {
    try {
      // Відправляємо запит на видалення сесії та куки на сервері
      await fetch('https://localhost:7262/api/logout', {
      meqthod: 'DELETE',
      credentials: 'include'
  });
    } catch (error) {
      console.error("Помилка під час виходу з системи:", error);
    } finally {
      // У будь-якому випадку очищаємо стейт фронтенду
      setUser(null);
      setIsAuth(false);
    }
  };

  return (
    <Router>
      <Navbar 
        isAuth={isAuth} 
        user={user} 
        onOpenAuth={() => setIsAuthModalOpen(true)} 
        onLogout={handleLogout}
      />
      
      <Routes>
        <Route path="/" element={
          <Home onRequireAuth={() => {
            if (!isAuth) {
              setIsAuthModalOpen(true);
            } else {
              alert(`Успішно заброньовано на ім'я ${user.name}!`);
            }
          }} />
        } />
        <Route path="/tournaments" element={<TournamentsPage />} />
        
        {/* Будь-який авторизований користувач має доступ до свого профілю */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute isAuth={isAuth}>
              <Profile />
            </ProtectedRoute>
          } 
        />
      </Routes>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
      />
    </Router>
  );
}