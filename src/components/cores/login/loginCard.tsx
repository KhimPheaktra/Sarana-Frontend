import React from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { UserOutlined, LockOutlined, SettingOutlined } from '@ant-design/icons';

const { Title, Text, Link } = Typography;

interface LoginFormValues {
  username: string;
  password: string;
}

interface LoginCardProps {
  onFinish: (values: LoginFormValues) => void;
  loading: boolean;
}

const LoginCard: React.FC<LoginCardProps> = ({ onFinish, loading }) => {
  return (
    <div className="login-card">
      <div className="login-header">
        <div className="logo-container">
          <SettingOutlined className="logo-icon" />
          <Title level={2} className="logo-title">
            SH Workshop
          </Title>
        </div>
      </div>

      <Form<LoginFormValues>
        name="workshop_login"
        onFinish={onFinish}
        layout="vertical"
        requiredMark={false}
      >
        <Form.Item
          label={<Text strong className="form-label">Username</Text>}
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input 
            prefix={<UserOutlined className="input-icon" />}
            placeholder="Enter your username"
            size="large"
            className="login-input"
          />
        </Form.Item>

        <Form.Item
          label={<Text strong className="form-label">Password</Text>}
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
          style={{ marginBottom: '12px' }}
        >
          <Input.Password
            prefix={<LockOutlined className="input-icon" />}
            placeholder="Enter your password"
            size="large"
            className="login-input"
          />
        </Form.Item>

        <div className="forgot-password">
          <Link href="#" className="forgot-link">
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
            className="submit-button"
          >
            LOG IN
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginCard;