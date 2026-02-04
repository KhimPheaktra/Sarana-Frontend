import React, { createContext, useContext, useState, createElement } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string;
  authReady: boolean;
  setIsAuthenticated: (value: boolean) => void;
  setUsername: (value: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('isAuthenticated') === 'true';
  });
  
  const [username, setUsername] = useState(() => {
    return sessionStorage.getItem('username') || 'User';
  });
  
  const [authReady] = useState(true);

  return createElement(
    AuthContext.Provider,
    {
      value: {
        isAuthenticated,
        username,
        authReady,
        setIsAuthenticated,
        setUsername,
      },
    },
    children
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('Somthing when wrong!');
  }
  return context;
};