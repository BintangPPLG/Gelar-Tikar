import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, User } from '../api/client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const initAuth = async () => {
    const savedToken = localStorage.getItem('aurora_token');
    const savedUser = localStorage.getItem('aurora_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        // Verify with backend
        const res = await api.auth.me();
        if (res.success && res.user) {
          setUser(res.user);
          localStorage.setItem('aurora_user', JSON.stringify(res.user));
        }
      } catch (err) {
        console.warn('Session expired or invalid, clearing local session.');
        localStorage.removeItem('aurora_token');
        localStorage.removeItem('aurora_user');
        setToken(null);
        setUser(null);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    initAuth();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const res = await api.auth.login(credentials);
    if (res.success && res.token && res.user) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('aurora_token', res.token);
      localStorage.setItem('aurora_user', JSON.stringify(res.user));
    } else {
      throw new Error(res.message || 'Login gagal.');
    }
  };

  const register = async (data: { name: string; email: string; password: string; phone?: string }) => {
    const res = await api.auth.register(data);
    if (res.success && res.token && res.user) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('aurora_token', res.token);
      localStorage.setItem('aurora_user', JSON.stringify(res.user));
    } else {
      throw new Error(res.message || 'Registrasi gagal.');
    }
  };

  const logout = () => {
    localStorage.removeItem('aurora_token');
    localStorage.removeItem('aurora_user');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await api.auth.me();
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('aurora_user', JSON.stringify(res.user));
      }
    } catch {
      logout();
    }
  };

  const isLoggedIn = !!user && !!token;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isLoggedIn,
        isAdmin,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
