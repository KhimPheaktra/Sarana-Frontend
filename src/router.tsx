import React from 'react';
import { Navigate } from 'react-router-dom';
import { Dashboard } from './components/features/dashboard/dashboard';
import User from './components/features/user/user';
import Worker from './components/features/worker/worker';
import Customer from './components/features/customer/customer';
import CatalogItem from './components/features/catalogItem/catalogItem';
import Supplier from './components/features/supplier/supplier';
import Purchase from './components/features/purchase/purchase';
import Payment from './components/features/payement/payment';
import Expenses from './components/features/expenses/expenses';
import Login from './components/cores/login/login';
import { useAuth } from './components/cores/auth/authContext';

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
}

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const RootRedirect: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
};

export const routes: RouteConfig[] = [
  {
    path: '/login',
    element: <PublicRoute><Login /></PublicRoute>
  },
  {
    path: '/',
    element: <RootRedirect />,
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
  },
  {
    path: '/users',
    element: <ProtectedRoute><User /></ProtectedRoute>,
  },
  {
    path: '/workers',
    element: <ProtectedRoute><Worker /></ProtectedRoute>,
  },
  {
    path: '/Customers',
    element: <ProtectedRoute><Customer /></ProtectedRoute>,
  },
  {
    path: '/catalog-items',
    element: <ProtectedRoute><CatalogItem /></ProtectedRoute>,
  },
  {
    path: '/suppliers',
    element: <ProtectedRoute><Supplier /></ProtectedRoute>,
  },
  {
    path: '/purchases',
    element: <ProtectedRoute><Purchase /></ProtectedRoute>,
  },
  {
    path: '/payments',
    element: <ProtectedRoute><Payment /></ProtectedRoute>
  },
  {
    path: '/expenses',
    element: <ProtectedRoute><Expenses /></ProtectedRoute>
  }
];