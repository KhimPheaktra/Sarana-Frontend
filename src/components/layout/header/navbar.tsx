import React, {useEffect } from 'react';
import { Typography, Layout, Input, Badge, Avatar, Dropdown, Button, Space, type MenuProps } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  SearchOutlined,
  DownOutlined,
  UserSwitchOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import './navbar.css';
import { useNavigate } from 'react-router-dom';
import userAvatar from "../../../assets/images/user-avatar.png";
import { useAuth } from '../../cores/auth/authContext';

const { Header } = Layout;
const { Text } = Typography;

interface NavbarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();
  const { setIsAuthenticated, username, setUsername } = useAuth();
  
  useEffect(() => {
    if (!username || username === 'User') {
      const storedUsername = sessionStorage.getItem('username');
      if (storedUsername && setUsername) {
        setUsername(storedUsername);
      }
    }
  }, [username, setUsername]);

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    switch (e.key) {
      case '1':
        break;
      case '2': 
        break;
      case '3':
        handleLogout();
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('username');
    setIsAuthenticated(false);
    setUsername('User');     
    navigate('/login');
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: '1',
      label: 'Profile',
      icon: <UserSwitchOutlined />
    },
    {
      key: '2',
      label: 'Settings',
      icon: <SettingOutlined />
    },
    {
      type: 'divider'
    },
    {
      key: '3',
      label: 'Logout',
      icon: <LogoutOutlined />,
      danger: true
    },
  ];

  return (
    <Header className="custom-navbar">
      <div className="navbar-left">
        <Button
          type="text"
          onClick={onToggle}
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          className="toggle-btn"
        />
        <Input
          placeholder="Search..."
          prefix={<SearchOutlined />}
          className="search-input"
        />
      </div>

      <div className="navbar-right">
        <Space size={20}>
          <Badge dot offset={[-2, 4]}>
            <BellOutlined className="nav-icon" />
          </Badge>

          <Dropdown 
            menu={{ items: userMenuItems, onClick: handleMenuClick }}
            trigger={['click']}
            placement="bottomRight"
            getPopupContainer={(trigger) => trigger.parentElement!}
          >
            <Space className="user-profile">
              <Avatar src={userAvatar} />
              <Text strong>{username || 'User'}</Text>
              <DownOutlined className="dropdown-arrow" />
            </Space>
          </Dropdown>
        </Space>
      </div>
    </Header>
  );
};

export default Navbar;