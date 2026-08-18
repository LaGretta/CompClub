import React, { createContext, useState, useEffect } from 'react';
import { usersApi } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [userName, setUserName] = useState(localStorage.getItem('userName') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  
  // Стан для ролі Адміна
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Стан для збереження аватарки
  const [avatar, setAvatar] = useState(null);
  
  // Стан для балансу з сервера
  const [balance, setBalance] = useState(0);

  // Перевіряє ТІЛЬКИ чи є ти Адміном
  const checkAdminRole = (jwtToken) => {
    if (!jwtToken) { 
      setIsAdmin(false); 
      return; 
    }
    try {
      const payload = JSON.parse(decodeURIComponent(window.atob(jwtToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')));
      const roleClaim = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || payload.role;
      setIsAdmin(Array.isArray(roleClaim) ? roleClaim.includes("Admin") : roleClaim === "Admin");
    } catch (e) { 
      setIsAdmin(false); 
    }
  };

  // Оновлює баланс
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
      checkAdminRole(token);
      refreshProfile();
    } else {
      setBalance(0);
      setIsAdmin(false);
    }
  }, [userName, token]);
  
  const login = (newToken, name = "Гравець") => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('userName', name);
    
    setToken(newToken);
    setUserName(name);
    setIsAuthenticated(true);
    checkAdminRole(newToken);
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
    setIsAdmin(false);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, isAdmin, userName, avatar, balance, login, logout, updateAvatar, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};