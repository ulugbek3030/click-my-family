'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { setAuthToken, getAuthToken } from '../api/client';

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  isAuthenticated: false,
});

function generateDevToken(): string {
  const header = btoa(JSON.stringify({ typ: 'JWT', alg: 'RS256' }))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const now = Math.floor(Date.now() / 1000);
  const payload = btoa(JSON.stringify({
    sub: '+998901234567',
    iat: now,
    exp: now + 365 * 24 * 60 * 60,
    roles: ['user'],
  })).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${header}.${payload}.dev_signature`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    let stored = getAuthToken();
    if (!stored) {
      // Auto-generate dev token for development
      stored = generateDevToken();
      setAuthToken(stored);
    }
    setTokenState(stored);
  }, []);

  const handleSetToken = (newToken: string | null) => {
    setAuthToken(newToken);
    setTokenState(newToken);
  };

  return (
    <AuthContext.Provider value={{ token, setToken: handleSetToken, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
