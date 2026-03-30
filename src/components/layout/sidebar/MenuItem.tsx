
import { useTranslation } from 'react-i18next';
import {
  HomeOutlined, DollarCircleOutlined, ShoppingOutlined,
  TeamOutlined, BarChartOutlined, TagsOutlined, CreditCardOutlined,
} from '@ant-design/icons';
import type { AppMenuItem } from './menu.types';

export const useMenuItems = (): AppMenuItem[] => {
  const { t } = useTranslation();
  return [
    {
      key: 'dashboard',
      icon: <HomeOutlined />,
      label: t('menu.dashboard'),
      route: '/dashboard'
    },
    { 
      key: 'catalogItems', 
      icon: <TagsOutlined />, 
      label: t('menu.items'), 
      route: '/catalog-items' 
    },
    { 
      key: 'purchases', 
      icon: <ShoppingOutlined />, 
      label: t('menu.purchases'), 
      route: '/purchases' 
    },
    {
      key: 'sales', icon: <DollarCircleOutlined />, label: t('menu.salesRevenue'),
      children: [
        { 
          key: 'quotes', 
          label: t('menu.quotes'),
          route: '/quotes' },
        { 
          key: 'invoices', 
          label: t('menu.invoices'), 
          route: '/invoices' 
        },
        { 
          key: 'payments', 
          label: t('menu.payments'), 
          route: '/payments' 
        },
      ],
    },
    {
      key: 'people', icon: <TeamOutlined />, label: t('menu.people'),
      children: [
        { 
          key: 'users', 
          label: t('menu.users'), 
          route: '/users' 
        },
        {
          key: 'customers', 
          label: t('menu.customers'), 
          route: '/customers' 
        },
        { 
          key: 'suppliers', 
          label: t('menu.suppliers'), 
          route: '/suppliers' 
        },
      ],
    },
    {
      key: 'financial', icon: <CreditCardOutlined />, label: t('menu.financial'),
      children: [
        { 
          key: 'expenses', 
          label: t('menu.expenses'), 
          route: '/expenses' 
        },
        {
          key: 'commissions', label: t('menu.commissions'),
          children: [
            { 
              key: 'personal-commissions', 
              label: t('menu.personalCommissions'), 
              route: '/personal-commissions' 
            },
            { 
              key: 'project-commissions', 
              label: t('menu.projectCommissions'), 
              route: '/project-commissions' 
            },
          ],
        },
      ],
    },
    {
      key: 'reports', icon: <BarChartOutlined />, label: t('menu.reports'),
      children: [
        { 
          key: 'reports-sales', 
          label: t('menu.salesReports'), 
          route: '/reports/sales' 
        },
        { 
          key: 'reports-expenses', 
          label: t('menu.expenseReports'), 
          route: '/reports/expenses' 
        },
        { 
          key: 'reports-profit', 
          label: t('menu.profitLoss'), 
          route: '/reports/profit' 
        },
      ],
    },
  ];
};