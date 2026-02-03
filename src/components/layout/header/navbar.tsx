import React from 'react';
import { Typography,Layout, Input, Badge, Avatar, Dropdown, Button, Space, type MenuProps } from 'antd';
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

const { Header } = Layout;

interface NavbarProps {
  collapsed: boolean;
  onToggle: () => void;
}


const Navbar: React.FC<NavbarProps> = ({ collapsed, onToggle }) => {
const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'User';

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
  const { Text } = Typography;


  return (
    <Header className="custom-navbar">
      {/* Left: Toggle & Search */}
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
              <Text strong>{username}</Text>
              <DownOutlined className="dropdown-arrow" />
            </Space>
          </Dropdown>
        </Space>
      </div>
    </Header>
  );
};

export default Navbar;