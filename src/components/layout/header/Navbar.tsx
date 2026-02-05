import React, { useEffect } from 'react';
import { Typography, Layout, Input, Badge, Avatar, Dropdown, Button, Space, type MenuProps, Card, Popover } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  SearchOutlined,
  DownOutlined,
  UserSwitchOutlined,
  SettingOutlined,
  LogoutOutlined,
  FileImageOutlined,
} from '@ant-design/icons';
import './navbar.css';
import { useNavigate } from 'react-router-dom';
import userAvatar from "../../../assets/images/user-avatar.png";
import { useAuth } from '../../cores/auth/authContext';
import { LoadingOverlay } from '../../common/LoadingOverlay';

const { Header } = Layout;
const { Text } = Typography;

interface NavbarProps {
  collapsed: boolean;
  onToggle: () => void;
}
interface NotificationItem {
  id: string;
  title: string;
  date: string;
  image?: string;
}

const Navbar: React.FC<NavbarProps> = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();
  const { setIsAuthenticated, username, setUsername } = useAuth();
  const [loading, setLoading] = React.useState(false);
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
    setLoading(true);
    navigate('/login');
    setTimeout(() => {
      setLoading(false);
      navigate('/login');
    }, 300);
  };

  const notifications: NotificationItem[] = [
    {
      id: '1',
      title: 'Electric maintenance',
      date: '7 days remaining',
      image: "https://media.licdn.com/dms/image/v2/D5612AQHd5nam1Z-GzA/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1694199183311?e=2147483647&v=beta&t=j3-4IHeUsLtsDscjnfp59wQG_3pg--p4c9n8PBr_j7E"
    },
    { id: '2', title: 'Fire Service', date: '10 days remaining' },
  ];

  const notificationContent = (
    <Card
      style={{
        maxWidth: 300,
        width: '90vw',
        margin: '16px',
        overflowY: 'auto',
        maxHeight: '320px',
      }}
    >
     <Space orientation="vertical" style={{ width: "100%" }}>
        {notifications.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "8px 0"
            }}
          >
            {item.image ? (
              <Avatar
                src={item.image}
                shape="square"
                size={48}
                style={{ cursor: "pointer" }}
              />
            ) : (
              <Avatar
                shape="square"
                size={48}
                icon={<FileImageOutlined />}
                style={{ backgroundColor: "#f0f0f0", color: "#bfbfbf" }}
              />
            )}

            <div style={{ lineHeight: 1.3 }}>
              <Text strong>{item.title}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>
                {item.date}
              </Text>
            </div>
          </div>
        ))}
      </Space>
    </Card>
  );

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
    <>
      {loading && <LoadingOverlay show={true} />}
    
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
            <Popover
              content={notificationContent}
              title="Service items nearing deadline"
              trigger="click"
              placement={window.innerWidth < 768 ? 'bottom' : 'bottomRight'}
            >
              <Badge dot offset={[-2, 4]}>
                <BellOutlined className="nav-icon" style={{ fontSize: 20, cursor: 'pointer' }} />
              </Badge>
            </Popover>
            <Dropdown
              menu={{ items: userMenuItems, onClick: handleMenuClick }}
              trigger={['click']}
              placement="bottomRight"
              getPopupContainer={(trigger) => trigger.parentElement!}
            >
              <Space className="user-profile">
                <Text strong>{username || 'User'}</Text>
                <Avatar src={userAvatar} />
                <DownOutlined className="dropdown-arrow" />
              </Space>
            </Dropdown>
          </Space>
        </div>
      </Header>

    
    </>
  );
};

export default Navbar;