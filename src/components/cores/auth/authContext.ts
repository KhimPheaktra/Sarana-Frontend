import { createContext, useContext, useState, useEffect, createElement } from 'react';
import { Spin } from 'antd';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return createElement(
      'div',
      {
        style: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: '#f0f2f5'
        }
      },
      createElement(Spin, { size: 'large' })
    );
  }

  return createElement(
    AuthContext.Provider,
    { value: { isAuthenticated, username, setIsAuthenticated, setUsername } },
    children
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('Something when wrong!');
  }
  return context;
};

export default AuthContext;