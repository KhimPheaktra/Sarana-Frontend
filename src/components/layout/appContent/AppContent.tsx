import React, { memo, useEffect, useState } from 'react';
import { Layout } from 'antd';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { routes } from '../../../router';
import { Sidebar } from '../sidebar/Sidebar';
import Navbar from '../header/Navbar';

const { Content, Sider } = Layout;

const isMobileOrTablet = () => {
  const width = window.innerWidth;
  const userAgent = navigator.userAgent.toLowerCase();
  const isTablet =
    /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch)))/.test(
      userAgent
    );

  return width < 1200 || isTablet;
};

export const AppContent: React.FC = memo(() => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(isMobileOrTablet());
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAuthenticated = !!sessionStorage.getItem('isAuthenticated'); 
  const isLoginPage = location.pathname === '/login';

  useEffect(() => {
    const handleResize = () => {
      const mobile = isMobileOrTablet();
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) setMobileOpen(false);
  }, [location.pathname, isMobile]);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
      setCollapsed(false);
    } else {
      setCollapsed(!collapsed);
    }
  };

  if (!isAuthenticated && !isLoginPage) {
    return <Navigate to="/login" replace />;
  }

  if (isLoginPage) {
    return (
      <Routes>
        {routes.map((route, i) => (
          <Route key={i} path={route.path} element={route.element} />
        ))}
      </Routes>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        collapsedWidth={isMobile ? 0 : 80}
        width={240}
        trigger={null}
        style={{
          position: isMobile ? 'fixed' : 'relative',
          height: '100vh',
          zIndex: 1001,
          transform:
            isMobile && !mobileOpen ? 'translateX(-100%)' : 'translateX(0)',
          transition: 'all 0.3s',
        }}
      >
        <Sidebar
          collapsed={collapsed}
          isMobile={isMobile}
          onClose={() => setMobileOpen(false)}
        />
      </Sider>

      <Layout
        style={{
          marginLeft: isMobile ? 0 : collapsed ? 80 : 220,
          transition: 'margin-left 0.3s',
        }}
      >
        <Navbar collapsed={collapsed} onToggle={toggleSidebar} />

        <Content style={{ margin: 16, padding: 16 }}>
          <Routes>
            {routes.map((route, i) => (
              <Route key={i} path={route.path} element={route.element} />
            ))}
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
});

AppContent.displayName = 'AppContent';
