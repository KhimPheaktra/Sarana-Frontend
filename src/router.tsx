import React from 'react';
import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
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
import Quote from './components/features/quote/quote';
import Invoice from './components/features/invoice/invoice';
import Commision from './components/features/commision/commission';
import SaleReport from './components/features/reports/saleReport/saleReport';
import ExpenseReport from './components/features/reports/expenseReport/expenseReport';
import ProfitReport from './components/features/reports/profitReport/profitReport';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, authReady } = useAuth();
  
  if (!authReady) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: '#f0f2f5'
      }}>
        <Spin size="large" />
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, authReady } = useAuth();
  
  if (!authReady) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: '#f0f2f5'
      }}>
        <Spin size="large" />
      </div>
    );
  }
  
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

const RootRedirect = () => {
  const { isAuthenticated, authReady } = useAuth();
  
  if (!authReady) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: '#f0f2f5'
      }}>
        <Spin size="large" />
      </div>
    );
  }
  
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
};

export const routes = [
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/users',
    element: (
      <ProtectedRoute>
        <User />
      </ProtectedRoute>
    ),
  },
  {
    path: '/workers',
    element: (
      <ProtectedRoute>
        <Worker />
      </ProtectedRoute>
    ),
  },
  {
    path: '/customers',
    element: (
      <ProtectedRoute>
        <Customer />
      </ProtectedRoute>
    ),
  },
  {
    path: '/catalog-items',
    element: (
      <ProtectedRoute>
        <CatalogItem />
      </ProtectedRoute>
    ),
  },
  {
    path: '/suppliers',
    element: (
      <ProtectedRoute>
        <Supplier />
      </ProtectedRoute>
    ),
  },
  {
    path: '/purchases',
    element: (
      <ProtectedRoute>
        <Purchase />
      </ProtectedRoute>
    ),
  },
  {
    path: '/payments',
    element: (
      <ProtectedRoute>
        <Payment />
      </ProtectedRoute>
    ),
  },
  {
    path: '/expenses',
    element: (
      <ProtectedRoute>
        <Expenses />
      </ProtectedRoute>
    ),
  },
   {
    path: '/quotes',
    element: (
      <ProtectedRoute>
        <Quote />
      </ProtectedRoute>
    ),
  },
  {
    path: '/invoices',
    element: (
      <ProtectedRoute>
        <Invoice />
      </ProtectedRoute>
    ),
  },
  {
    path: '/commissions',
    element: (
      <ProtectedRoute>
        <Commision />
      </ProtectedRoute>
    ),
  },
  {
    path: '/reports/sales',
    element: (
      <ProtectedRoute>
        <SaleReport />
      </ProtectedRoute>
    ),
  },
  {
    path: '/reports/expenses',
    element: (
      <ProtectedRoute>
        <ExpenseReport />
      </ProtectedRoute>
    ),
  },
  {
    path: '/reports/profit',
    element: (
      <ProtectedRoute>
        <ProfitReport />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <RootRedirect />,
  },
];