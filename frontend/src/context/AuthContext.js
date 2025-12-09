import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Ideally verify token with backend, but for now just assume logged in if token exists
      // We could decode the token to get the username if needed
      setUser({ token }); 
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const response = await authService.login(username, password);
    const { access_token } = response.data;
    localStorage.setItem('token', access_token);
    setUser({ username, token: access_token });
  };

  const register = async (username, password) => {
    await authService.register(username, password);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
