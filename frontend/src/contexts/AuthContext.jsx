import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté au chargement
    const token = localStorage.getItem('token');
    if (token) {
      // Ici on pourrait faire un appel API pour vérifier la validité du token
      // Pour simplifier, on considère que si le token existe, l'utilisateur est connecté
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.login({ email, password });
      setUser({
        token: response.token,
        userId: response.user.id,
        nom: response.user.nom,
        email: response.user.email
      });
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.register(userData);
      if (response.success) {
        setUser({
          token: response.token,
          userId: response.user.id,
          nom: response.user.nom,
          email: response.user.email
        });
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message, errors: response.errors };
      }
    } catch (error) {
      return { success: false, message: error.message, errors: error.errors };
    }
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
