import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, ToolOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Link } = Typography;

interface LoginFormValues {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const onFinish = (values: LoginFormValues): void => {
    setLoading(true);
    setTimeout(() => {
      sessionStorage.setItem('isAuthenticated', 'true');
      sessionStorage.setItem('username', values.username);
      
      message.success('Login successful!');
      setLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      position: 'fixed',
      top: 0,
      left: 0,
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.08,
        pointerEvents: 'none'
      }}>
        <ToolOutlined style={{ 
          position: 'absolute', 
          fontSize: '150px', 
          top: '10%', 
          left: '15%', 
          color: '#fff',
          transform: 'rotate(-15deg)'
        }} />
        <SettingOutlined style={{ 
          position: 'absolute', 
          fontSize: '120px', 
          top: '60%', 
          left: '10%', 
          color: '#fff',
          animation: 'rotate 20s linear infinite'
        }} />
        <ToolOutlined style={{ 
          position: 'absolute', 
          fontSize: '100px', 
          top: '20%', 
          right: '20%', 
          color: '#fff',
          transform: 'rotate(25deg)'
        }} />
        <SettingOutlined style={{ 
          position: 'absolute', 
          fontSize: '180px', 
          bottom: '15%', 
          right: '15%', 
          color: '#fff',
          animation: 'rotate 15s linear infinite reverse'
        }} />
        <ToolOutlined style={{ 
          position: 'absolute', 
          fontSize: '90px', 
          top: '45%', 
          right: '5%', 
          color: '#fff',
          transform: 'rotate(-45deg)'
        }} />
      </div>

        {/* Login card */}
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '40px 32px',
        width: '90%',
        maxWidth: '380px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
        zIndex: 1
      }}>
        {/* Logo Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '12px'
          }}>
            <SettingOutlined style={{ 
              fontSize: '42px', 
              color: '#1890ff',
              animation: 'rotate 10s linear infinite'
            }} />
            <Title level={2} style={{ 
              margin: 0, 
              color: '#1890ff',
              fontWeight: 700,
              fontSize: '28px'
            }}>
              SH Workshop
            </Title>
          </div>
        </div>

        {/* Login Form */}
        <Form<LoginFormValues>
          name="workshop_login"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            label={<Text strong style={{ color: '#666' }}>Username</Text>}
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input 
              prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Enter your username"
              size="large"
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>

          <Form.Item
            label={<Text strong style={{ color: '#666' }}>Password</Text>}
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
            style={{ marginBottom: '12px' }}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Enter your password"
              size="large"
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>

          <div style={{ textAlign: 'right', marginBottom: '24px' }}>
            <Link href="#" style={{ fontSize: '14px' }}>
              Forgot password?
            </Link>
          </div>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              size="large"
              loading={loading}
              style={{ 
                borderRadius: '6px',
                height: '48px',
                fontSize: '16px',
                fontWeight: 600,
                background: '#1890ff',
                borderColor: '#1890ff'
              }}
            >
              LOG IN
            </Button>
          </Form.Item>
        </Form>
      </div>
{/* 
      <style>{`
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style> */}
    </div>
  );
};

export default Login;