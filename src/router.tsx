import Dashboard from './components/features/dashboard/Dashboard';
import User from './components/features/user/User';
import Customer from './components/features/customer/Customer';
import CatalogItem from './components/features/catalogItem/CatalogItem';
import Supplier from './components/features/supplier/Supplier';
import Purchase from './components/features/purchase/Purchase';
import Expenses from './components/features/expenses/Expenses';
import { useAuth } from './components/cores/auth/authContext';
import Quote from './components/features/quote/Quote';
import SaleReport from './components/features/reports/saleReport/SaleReport';
import ExpenseReport from './components/features/reports/expenseReport/ExpenseReport';
import ProfitReport from './components/features/reports/profitReport/ProfitReport';
import Login from './components/cores/login/Login';
import Invoice from './components/features/invoice/Invoice';
import { Spin } from 'antd';
import { Navigate } from 'react-router-dom';
import Payment from './components/features/payement/Payment';
import Commision from './components/features/commision/Commission';
import ReportSelector from './components/features/reports/report-selector/ReportSelector';



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
  path: '/reports/report-selector',
    element: (
      <ProtectedRoute>
        <ReportSelector />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <RootRedirect />,
  },
];