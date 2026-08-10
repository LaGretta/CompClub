import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [userName, setUserName] = useState(localStorage.getItem('userName') || null);
  
  // Стан для збереження аватарки
  const [avatar, setAvatar] = useState(null);

  // Секрет збереження: коли змінюється юзер (хтось зайшов), підтягуємо його особисту аватарку
  useEffect(() => {
    if (userName) {
      setAvatar(localStorage.getItem(`userAvatar_${userName}`) || null);
    } else {
      setAvatar(null);
    }
  }, [userName]);
  
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
    if (userName) {
      // Зберігаємо аватарку з прив'язкою до конкретного нікнейму (наприклад: userAvatar_Misha)
      localStorage.setItem(`userAvatar_${userName}`, newAvatarUrl);
      setAvatar(newAvatarUrl);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');

    setToken(null);
    setUserName(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, userName, avatar, login, logout, updateAvatar }}>
      {children}
    </AuthContext.Provider>
  );
};