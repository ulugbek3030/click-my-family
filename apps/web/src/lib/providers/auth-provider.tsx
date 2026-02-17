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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    const stored = getAuthToken();
    if (stored) setTokenState(stored);
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
