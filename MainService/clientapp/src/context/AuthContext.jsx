import React, { createContext, useState, useEffect } from 'react';
import { usersApi } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [userName, setUserName] = useState(localStorage.getItem('userName') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  
  // Стан для збереження аватарки
  const [avatar, setAvatar] = useState(null);
  
  // Стан для реального балансу з сервера
  const [balance, setBalance] = useState(0);

  // Оновлює баланс напряму з сервера
  const refreshProfile = async () => {
    if (token) {
      try {
        const userData = await usersApi.getMe();
        if (userData.balance !== undefined) {
          setBalance(userData.balance);
        }
      } catch (e) {
        console.error("Не вдалося отримати баланс з сервера:", e.message);
      }
    }
  };

  useEffect(() => {
    if (userName) {
      setAvatar(localStorage.getItem(`userAvatar_${userName}`) || null);
    } else {
      setAvatar(null);
    }
    
    if (token) {
      refreshProfile();
    } else {
      setBalance(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName, token]);
  
  const login = (newToken, name = "Гравець") => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('userName', name);
    setToken(newToken);
    setUserName(name);
    setIsAuthenticated(true);
  };

  const updateAvatar = (newAvatarUrl) => {
    if (userName) {
      localStorage.setItem(`userAvatar_${userName}`, newAvatarUrl);
      setAvatar(newAvatarUrl);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');

    setToken(null);
    setUserName(null);
    setBalance(0);
    setIsAuthenticated(false);
  };

  return (
    // Передаємо refreshProfile, щоб інші компоненти могли попросити оновити баланс
    <AuthContext.Provider value={{ token, isAuthenticated, userName, avatar, balance, login, logout, updateAvatar, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};