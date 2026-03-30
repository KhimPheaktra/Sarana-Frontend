import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './components/cores/auth/authContext';
import { AppWrapper } from './components/cores/auth/AppWrapper';
import { LoadingOverlay } from './components/common/LoadingOverlay';
import { AppModalProvider } from './shared/modal/AppModalProvider';
import { applyAllFonts, applySidebarColor, applyTheme, DEFAULT_SETTINGS } from './components/features/user-setting/UserSetting';

const App: React.FC = () => {
  const [routerReady, setRouterReady] = useState(false);

  useEffect(() => {

    try {
  const raw = localStorage.getItem("app_user_settings");
  if (raw) {
    const s = JSON.parse(raw);
    if (s.theme)        applyTheme(s.theme);
    if (s.sidebarColor) applySidebarColor(s.sidebarColor);
    if (s.fontSettings) applyAllFonts({ ...DEFAULT_SETTINGS.fontSettings, ...s.fontSettings });
      }
    } catch { }

    const timer = setTimeout(() => setRouterReady(true), 150);
    return () => clearTimeout(timer);
  }, []);

  if (!routerReady) {
    return <LoadingOverlay show={true} />;
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppModalProvider>
          <AppWrapper />
        </AppModalProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;