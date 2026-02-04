import React from 'react';
import { Menu } from 'antd';
import './sidebar.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { menuItems } from './menuItem';
import { CloseOutlined } from '@ant-design/icons';
import { mapToAntdMenuItems } from './menuMapper';

interface SidebarProps {
  collapsed: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onClose, isMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItemslist = mapToAntdMenuItems(menuItems);

  const findeSelectKey = (items: any[]): string | undefined => {
    for (const item of items) {
      if (item.route === location.pathname) return item.key;
      if (item.children) {
        const key = findeSelectKey(item.children);
        if (key) return key;
      }
    }
  };
  
  const selectedKey = findeSelectKey(menuItems);

  const findRouteByKey = (items: any[], key: string): string | undefined => {
    for (const item of items) {
      if (item.key === key && item.route) return item.route;
      if (item.children) {
        const route = findRouteByKey(item.children, key);
        if (route) return route;
      }
    }
  };

  const handleMenuClick = ({ key }: { key: string }) => {
  const route = findRouteByKey(menuItems, key);

    if (route && route !== location.pathname) {
      navigate(route);
      if (isMobile && onClose) onClose();
    }
  };


  return (
    <>
      <div className="sidebar-header">
        {!collapsed && !isMobile && (
          <div className="sidebar-logo">SH</div>
        )}
        {isMobile && (
          <>
            <div className="sidebar-logo">SH</div>
            <CloseOutlined 
              className="sidebar-close-icon" 
              onClick={onClose}
            />
          </>
        )}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        items={menuItemslist}
        selectedKeys={selectedKey ? [selectedKey] : []}
        onClick={handleMenuClick}
      />
    </>
  );
};