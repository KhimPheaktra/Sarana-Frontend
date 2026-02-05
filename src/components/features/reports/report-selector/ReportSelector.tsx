import { Segmented, ConfigProvider } from 'antd';
import type { SegmentedProps } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { menuItems } from '../../../layout/sidebar/MenuItem';
import './ReportStyle.css';

const ReportSelector = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const financialMenu = menuItems.find(item => item.key === 'financial');
  const reportRoutes = financialMenu?.children?.filter(child => 
    child.key.startsWith('reports-')
  ) || [];

  const options: SegmentedProps['options'] = reportRoutes.map(route => ({
    label: route.label,
    value: route.route || '',
  }));

  const handleChange = (value: string | number) => {
    navigate(value as string);
  };

  if (reportRoutes.length === 0) {
    return null;
  }

  return (
    <div style={{ 
      marginBottom: '24px', 
      padding: '16px 20px', 
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      overflowX: 'auto',
    }}>
      <ConfigProvider
        theme={{
          components: {
            Segmented: {
              itemSelectedColor: '#1890ff',
              itemHoverColor: '#1890ff',
              trackBg: 'transparent',
            },
          },
        }}
      >
        <Segmented
          options={options}
          value={location.pathname}
          onChange={handleChange}
          size="large"
          className="report-segmented-spaced"
        />
      </ConfigProvider>
    </div>
  );
};

export default ReportSelector;