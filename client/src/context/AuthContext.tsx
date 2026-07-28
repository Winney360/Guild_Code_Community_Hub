import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  isActive: boolean;
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; user?: User }>;
  signup: (userData: any) => Promise<{ success: boolean; message?: string }>;
  loginWithOAuth: (
    provider: 'google' | 'github',
    oauthData?: { email?: string; fullName?: string; profilePicture?: string; credential?: string }
  ) => Promise<{ success: boolean; message?: string; user?: User }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('guild_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState<boolean>(true);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        if (data.user) {
          localStorage.setItem('guild_user', JSON.stringify(data.user));
        } else {
          localStorage.removeItem('guild_user');
        }
      } else {
        setUser(null);
        localStorage.removeItem('guild_user');
      }
    } catch (err) {
      setUser(null);
      localStorage.removeItem('guild_user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        if (data.user) {
          localStorage.setItem('guild_user', JSON.stringify(data.user));
        }
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (err) {
      return { success: false, message: 'An error occurred during login' };
    }
  };

  const signup = async (userData: any) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (err) {
      return { success: false, message: 'An error occurred during signup' };
    }
  };

  const loginWithOAuth = async (
    provider: 'google' | 'github',
    oauthData?: { email?: string; fullName?: string; profilePicture?: string; credential?: string }
  ) => {
    try {
      const endpoint = provider === 'google' ? '/api/auth/google' : '/api/auth/oauth-mock';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          credential: oauthData?.credential,
          email: oauthData?.email,
          fullName: oauthData?.fullName,
          profilePicture: oauthData?.profilePicture,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        if (data.user) {
          localStorage.setItem('guild_user', JSON.stringify(data.user));
        }
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message || 'OAuth authentication failed' };
      }
    } catch (err) {
      return { success: false, message: 'An error occurred during OAuth' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      setUser(null);
      localStorage.removeItem('guild_user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, loginWithOAuth, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
