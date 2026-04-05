import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../../api/authService';
import { normalizeRole } from '../lib/crediflow';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('crediflow_user');
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        if (user && user.token) {
          const profile = await authService.getCurrentUser();
          if (profile) {
            const nextUser = {
              ...user,
              ...profile,
              role: normalizeRole(profile.role || user.role),
            };
            setUser(nextUser);
            localStorage.setItem('crediflow_user', JSON.stringify(nextUser));
          }
        }
      } catch (err) {
        console.error('Session verification failed', err);
        logout();
      } finally {
        setLoading(false);
      }
    };
    verifySession();
  }, []);

  const login = async (email, password, role) => {
    try {
      const payloadData = await authService.login(email, password);
      const actualUser = payloadData?.user || {};
      const userPayload = {
        ...actualUser,
        token: payloadData?.accessToken,
        refreshToken: payloadData?.refreshToken,
        role: normalizeRole(actualUser.role || role || 'borrower'),
      };
      setUser(userPayload);
      localStorage.setItem('crediflow_user', JSON.stringify(userPayload));
      return userPayload;
    } catch (err) {
      console.error('Login failed', err);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const payloadData = await authService.register(userData);
      const actualUser = payloadData?.user || {};
      const userPayload = {
        ...actualUser,
        token: payloadData?.accessToken,
        refreshToken: payloadData?.refreshToken,
        role: normalizeRole(actualUser.role || userData.role || 'borrower'),
      };
      setUser(userPayload);
      localStorage.setItem('crediflow_user', JSON.stringify(userPayload));
      return userPayload;
    } catch (err) {
      console.error('Registration failed', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      if (user && user.token) {
        await authService.logout();
      }
    } catch (err) {
      console.error('Logout error UI side', err);
    } finally {
      setUser(null);
      localStorage.removeItem('crediflow_user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
