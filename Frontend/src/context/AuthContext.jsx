import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [userName, setUserName] = useState(localStorage.getItem('userName') || null);
  
  // Стан для збереження аватарки
  const [avatar, setAvatar] = useState(localStorage.getItem('userAvatar') || null);
  
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  const login = (newToken, name = "Гравець") => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('userName', name);
    setToken(newToken);
    setUserName(name);
    setIsAuthenticated(true);
  };

  // Функція для оновлення аватарки
  const updateAvatar = (newAvatarUrl) => {
    localStorage.setItem('userAvatar', newAvatarUrl);
    setAvatar(newAvatarUrl);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userAvatar'); // Видаляємо аватарку при виході
    setToken(null);
    setUserName(null);
    setAvatar(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, userName, avatar, login, logout, updateAvatar }}>
      {children}
    </AuthContext.Provider>
  );
};