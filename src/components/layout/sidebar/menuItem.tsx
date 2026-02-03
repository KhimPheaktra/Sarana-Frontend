import React from 'react';
import {
  HomeOutlined,
  DollarCircleOutlined,
  ShoppingOutlined,
  TeamOutlined,
  BarChartOutlined,
  TagsOutlined,
  TruckOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

export interface AppMenuItem {
  route?: string;
  children?: AppMenuItem[];
  key: string;
  icon?: React.ReactNode;
  label: React.ReactNode;
}

export type MenuItem = Required<MenuProps>['items'][number];

export const menuItems: AppMenuItem[] = [
  {
    key: 'dashboard',
    icon: <HomeOutlined />,
    label: 'Dashboard',
    route: '/',
  },
    {
    key: 'catalogItems',
    icon: <TagsOutlined />,
    label: 'Items',
    route: '/catalog-items',
  },
    
  {
    key: 'purchases',
    label: 'Purchases',
    icon: <ShoppingOutlined />,
    route: '/purchases',
  },
  {
    key: 'suppliers',
    label: 'Suppliers',
    icon: <TruckOutlined />,
    route: '/suppliers',
  },
  {
    key: 'sales',
    icon: <DollarCircleOutlined />,
    label: 'Sales & Revenue',
    children: [
      {
        key: 'quotes',
        label: 'Quotes',
        route: '/quotes',
      },
      {
        key: 'invoices',
        label: 'Invoices',
        route: '/invoices',
      },
      {
        key: 'payments',
        label: 'Payments',
        route: '/payments',
      },
      {
        key: 'commissions',
        label: 'Commissions',
        route: '/commissions',
      },
    ],
  },

  {
    key: 'people',
    icon: <TeamOutlined />,
    label: 'People',
    children: [
      {
        key: 'users',
        label: 'Users',
        route: '/users',
      },
      {
        key: 'customers',
        label: 'Customers',
        route: '/customers',
      },
      {
        key: 'workers',
        label: 'Workers',
        route: '/workers',
      },
    ],
  },
  {
    key: 'financial',
    icon: <BarChartOutlined />,
    label: 'Financial',
    children: [
      {
        key: 'expenses',
        label: 'Expenses',
        route: '/expenses',
      },
      {
        key: 'reports',
        label: 'Reports',
        children: [
          {
            key: 'reports-sales',
            label: 'Sales Reports',
            route: '/reports/sales',
          },
          {
            key: 'reports-expenses',
            label: 'Expense Reports',
            route: '/reports/expenses',
          },
          {
            key: 'reports-profit',
            label: 'Profit & Loss',
            route: '/reports/profit-loss',
          },
          
        ],
      },
    ],
  },

 
 
];