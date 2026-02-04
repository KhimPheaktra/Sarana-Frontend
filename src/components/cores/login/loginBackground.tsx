import React from 'react';
import { ToolOutlined, SettingOutlined } from '@ant-design/icons';

const LoginBackground: React.FC = () => {
  return (
    <div className="background-icons">
      <ToolOutlined className="bg-icon icon-1" />
      <SettingOutlined className="bg-icon icon-2" />
      <ToolOutlined className="bg-icon icon-3" />
      <SettingOutlined className="bg-icon icon-4" />
      <ToolOutlined className="bg-icon icon-5" />
    </div>
  );
};

export default LoginBackground;