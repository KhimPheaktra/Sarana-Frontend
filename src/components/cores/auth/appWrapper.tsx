import React, { useEffect, useState } from 'react';
import { useAuth } from './authContext';
import { LoadingOverlay } from '../../common/loadingOverlay';
import { AppContent } from '../../layout/appContent/appContent';

export const AppWrapper: React.FC = () => {
  const { authReady } = useAuth();
  const [showContent, setShowContent] = useState(false);
  const [hideOverlay, setHideOverlay] = useState(false);

  useEffect(() => {
    if (authReady) {
      const contentTimer = setTimeout(() => {
        setShowContent(true);
        const overlayTimer = setTimeout(() => {
          setHideOverlay(true);
          document.getElementById('root')?.classList.add('ready');
        }, 200);
        return () => clearTimeout(overlayTimer);
      }, 150);
      return () => clearTimeout(contentTimer);
    }
  }, [authReady]);

  return (
    <>
      <LoadingOverlay show={!hideOverlay} />
      <div style={{ visibility: hideOverlay ? 'visible' : 'hidden' }}>
        {showContent && <AppContent />}
      </div>
    </>
  );
};