import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [userName, setUserName] = useState(localStorage.getItem('userName') || null);
  
  // Стан для збереження аватарки
  const [avatar, setAvatar] = useState(null);
  
  // Стан для балансу
  const [balance, setBalance] = useState(0);

  // Секрет збереження: коли змінюється юзер, підтягуємо його дані
  useEffect(() => {
    if (userName) {
      setAvatar(localStorage.getItem(`userAvatar_${userName}`) || null);
      
      // Ініціалізація балансу: якщо немає, даруємо 2000 ₴
      const savedBalance = localStorage.getItem(`userBalance_${userName}`);
      if (savedBalance !== null) {
        setBalance(Number(savedBalance));
      } else {
        localStorage.setItem(`userBalance_${userName}`, 2000);
        setBalance(2000);
      }
    } else {
      setAvatar(null);
      setBalance(0);
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
      localStorage.setItem(`userAvatar_${userName}`, newAvatarUrl);
      setAvatar(newAvatarUrl);
    }
  };

  // Функція для оновлення балансу (списання / поповнення)
  const updateBalance = (newBalance) => {
    if (userName) {
      localStorage.setItem(`userBalance_${userName}`, newBalance);
      setBalance(newBalance);
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
    <AuthContext.Provider value={{ token, isAuthenticated, userName, avatar, balance, login, logout, updateAvatar, updateBalance }}>
      {children}
    </AuthContext.Provider>
  );
};