import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated } = useContext(AuthContext);

  // Якщо не залогінений — викидаємо на головну сторінку
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Якщо все ок — рендеримо компоненти (наприклад, адмінку)
  return <Outlet />;
}