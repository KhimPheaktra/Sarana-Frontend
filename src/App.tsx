import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './components/cores/auth/authContext';
import { AppWrapper } from './components/cores/auth/appWrapper';
import { LoadingOverlay } from './components/common/loadingOverlay';
;

const App: React.FC = () => {
  const [routerReady, setRouterReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRouterReady(true);
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  if (!routerReady) {
    return <LoadingOverlay show={true} />;
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppWrapper />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;