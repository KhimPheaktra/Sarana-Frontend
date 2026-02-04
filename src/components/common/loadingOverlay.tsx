import React from 'react';
import { Spin } from 'antd';

interface LoadingOverlayProps {
  show: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f0f2f5',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 999999,
        opacity: 1,
      }}
    >
      <Spin size="large" />
    </div>
  );
};