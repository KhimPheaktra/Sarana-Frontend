import React, { useState } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

import './login.css';
import LoginBackground from './loginBackground';
import LoginCard from './loginCard';
import { useAuth } from '../auth/authContext';

interface LoginFormValues {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  const onFinish = (values: LoginFormValues): void => {
    setLoading(true);
    setTimeout(() => {
      sessionStorage.setItem('isAuthenticated', 'true');
      sessionStorage.setItem('username', values.username);
      
      setIsAuthenticated(true); 
      
      message.success('Login successful!');
      setLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="login-container">
      <LoginBackground />
      <LoginCard onFinish={onFinish} loading={loading} />
    </div>
  );
};

export default Login;