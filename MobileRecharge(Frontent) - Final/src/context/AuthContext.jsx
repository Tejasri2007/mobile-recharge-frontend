import { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [sessionTimer, setSessionTimer] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const loginTime = localStorage.getItem('loginTime');
    
    if (token && userData && loginTime) {
      const now = Date.now();
      const sessionDuration = 10 * 60 * 1000; // 10 minutes
      
      if (now - parseInt(loginTime) < sessionDuration) {
        setIsLoggedIn(true);
        setUser(JSON.parse(userData));
        startSessionTimer();
      } else {
        logout();
      }
    }
  }, []);

  const startSessionTimer = () => {
    if (sessionTimer) clearTimeout(sessionTimer);
    
    const timer = setTimeout(() => {
      alert('Session expired. Please login again.');
      logout();
    }, 10 * 60 * 1000); // 10 minutes
    
    setSessionTimer(timer);
  };

  const register = async (userData) => {
    try {
      const response = await apiService.register(userData);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const login = async (credentials) => {
    try {
      const response = await apiService.login(credentials);
      if (response.success) {
        const loginTime = Date.now().toString();
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('loginTime', loginTime);
        setIsLoggedIn(true);
        setUser(response.user);
        startSessionTimer();
        return { success: true, user: response.user };
      }
      return { success: false, error: 'Login failed' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    if (sessionTimer) clearTimeout(sessionTimer);
    setIsLoggedIn(false);
    setUser(null);
    setSessionTimer(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const value = {
    isLoggedIn,
    user,
    theme,
    register,
    login,
    logout,
    toggleTheme
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};