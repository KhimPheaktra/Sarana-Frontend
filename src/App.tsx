import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { BrowserRouter, Route, Routes, useLocation, Navigate } from 'react-router-dom';

import './App.css';
import { Sidebar } from './components/layout/sidebar/sidebar';
import Navbar from './components/layout/header/navbar';
import { routes } from './router';
import { AuthProvider, useAuth } from './components/cores/auth/authContext';


const { Content, Sider } = Layout;

const isMobileOrTablet = () => {
  const width = window.innerWidth;
  const userAgent = navigator.userAgent.toLowerCase();
  const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent);
  
  return width < 1200 || isTablet;
};

const AppContent: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(isMobileOrTablet());
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth(); 

  const isLoginPage = location.pathname === '/login';
  const isRootPage = location.pathname === '/';

  useEffect(() => {
    const handleResize = () => {
      const isMobileDevice = isMobileOrTablet();
      setIsMobile(isMobileDevice);
      if (!isMobileDevice) setMobileOpen(false);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
      setCollapsed(false);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const closeMobileSidebar = () => {
    if (isMobile) setMobileOpen(false);
  };

  if (isRootPage) {
    return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
  }

  if (isLoginPage) {
    return (
      <Routes>
        {routes.map((route, index) => (
          <Route
            key={`${route.path}-${index}`}
            path={route.path}
            element={route.element}
          />
        ))}
      </Routes>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={240}
        collapsedWidth={isMobile ? 0 : 80}
        className={isMobile && mobileOpen ? 'mobile-open' : ''}
        style={{
          position: isMobile ? 'fixed' : 'relative',
          zIndex: 1001,
          top: 0,
          height: '100vh',
          left: 0,
          transition: 'all 0.3s',
          transform: isMobile && !mobileOpen ? 'translateX(-100%)' : 'translateX(0)',
        }}
      >
        <Sidebar
          collapsed={collapsed}
          isMobile={isMobile}
          onClose={closeMobileSidebar}
        />
      </Sider>
      {isMobile && mobileOpen && (
        <div className="sidebar-overlay" onClick={closeMobileSidebar} />
      )}
      <Layout
        className="main-layout"
        style={{
          marginLeft: isMobile
            ? 0
            : collapsed
            ? 80
            : 220,
          transition: 'margin-left 0.3s',
        }}
      >
        <Navbar collapsed={collapsed} onToggle={toggleSidebar} />

        <Content
          style={{
            margin: 24,
            padding: 16,
            minHeight: 'calc(100vh - 64px)',
            background: '#f0f2f5',
          }}
        >
          <Routes>
            {routes.map((route, index) => (
              <Route
                key={`${route.path}-${index}`}
                path={route.path}
                element={route.element}
              />
            ))}
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;