import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin } = useContext(AuthContext);

  // Якщо не залогінений — миттєво викидаємо на головну сторінку
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Якщо сторінка тільки для адмінів, а юзер не адмін — теж на головну
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Все ок, перевірку пройдено — рендеримо сторінку (наприклад, Профіль або Адмінку)
  return children;
}