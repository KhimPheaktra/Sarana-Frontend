import React from 'react';
import { Card, Row, Col, Statistic, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  UserOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  UserAddOutlined,
  DollarCircleOutlined,
  BookOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  MenuOutlined,

} from '@ant-design/icons';
import './dashboard.css';
import { useNavigate } from 'react-router-dom';

interface TableDataType {
  key: string;
  id: string;
  customer: string;
  item: string;
  amount: string;
  status: string;
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const tableColumns: ColumnsType<TableDataType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Item',
      dataIndex: 'item',
      key: 'item',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: string) => `$${amount}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: () => <Tag color="success">Completed</Tag>,
    },
  ];

  const tableData: TableDataType[] = [
    { key: '1', id: '#001', customer: 'Customer 1',item: "Electrice Service", amount: '234.50', status: 'completed' },
    { key: '2', id: '#002', customer: 'Customer 2',item: "Fire Service", amount: '567.80', status: 'completed' },
   
  ];
  interface MostSoldItemType {
  key: string;
  name: string;
  category: string;
  sold: number;
  revenue: number;
}

const mostSoldItems: MostSoldItemType[] = [
  { key: '1', name: 'Electric Service', category: 'Electronics', sold: 120, revenue: 2400 },
  { key: '2', name: 'Fire Service', category: 'Safety', sold: 80, revenue: 3200 },
];

const mostSoldColumns: ColumnsType<MostSoldItemType> = [
  { title: 'Item Name', dataIndex: 'name', key: 'name' },
  { title: 'Category', dataIndex: 'category', key: 'category' },
  { title: 'Units Sold', dataIndex: 'sold', key: 'sold' },
  { 
    title: 'Revenue', 
    dataIndex: 'revenue', 
    key: 'revenue',
    render: (revenue: number) => `$${revenue.toLocaleString()}`,
  },
];

  interface QuickAction {
  label: string;
  icon: React.ReactNode;
  route: string;
  color: string;
  bgColor: string;
}

const quickActions: QuickAction[] = [
  {
    label: 'User',
    icon: <UserAddOutlined />,
    route: '/users',
    color: '#1890ff',
    bgColor: '#e6f7ff',
  },
  {
    label: 'Payment',
    icon: <DollarCircleOutlined />,
    route: '/payments',
    color: '#52c41a',
    bgColor: '#f6ffed',
  },
  {
    label: 'Customer',
    icon: <TeamOutlined />,
    route: '/customers',
    color: '#722ed1',
    bgColor: '#f9f0ff',
  },
  {
    label: 'Report',
    icon: <BookOutlined />,
    route: '/',
    color: '#fa8c16',
    bgColor: '#fff7e6',
  },
];

  return (
    <>
      <h2 className="dashboard-title">Overview</h2>
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} md={12} lg={6}>
          <Card variant="borderless" className="stat-card">
            <Statistic
              prefix={
                <span style={{ 
                  fontSize: 24, 
                  color: '#1890ff',
                  backgroundColor: '#e6f7ff',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  marginRight: '8px'
                }}>
                  <UserOutlined />
                </span>
              }
              title={<span style={{ fontSize: 14, color: '#8c8c8c' }}>Total Users</span>} 
              value={5}
              style={{ color: '#1890ff', fontWeight: 600 }}
              suffix={
                <span className="stat-suffix-up" style={{ fontSize: 14, color: '#52c41a' }}>
                  <ArrowUpOutlined /> 12%
                </span>
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={12} lg={6}>
          <Card variant="borderless" className="stat-card">
            <Statistic
              title={<span style={{ fontSize: 14, color: '#8c8c8c' }}>Revenue</span>}
              value={45231}
              prefix={
                <span style={{ 
                  fontSize: 24, 
                  color: '#52c41a',
                  backgroundColor: '#f6ffed',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  marginRight: '8px'
                }}>
                  $
                </span>
              }
              style={{ color: '#52c41a', fontWeight: 600 }}
              suffix={
                <span className="stat-suffix-up" style={{ fontSize: 14, color: '#52c41a' }}>
                  <ArrowUpOutlined /> 8%
                </span>
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={12} lg={6}>
          <Card variant="borderless" className="stat-card">
            <Statistic
              title={<span style={{ fontSize: 14, color: '#8c8c8c' }}>Total Customers</span>}
              prefix={
                <span style={{ 
                  fontSize: 24, 
                  color: '#722ed1',
                  backgroundColor: '#f9f0ff',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  marginRight: '8px'
                }}>
                  <TeamOutlined/>
                </span>
              }
              value={20}
              valueStyle={{ color: '#722ed1', fontWeight: 600 }}
              suffix={
                <span className="stat-suffix-down" style={{ fontSize: 14, color: '#ff4d4f' }}>
                  <ArrowDownOutlined /> 1%
                </span>
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={12} lg={6}>
          <Card variant="borderless" className="stat-card">
            <Statistic
              title={<span style={{ fontSize: 14, color: '#8c8c8c' }}>Total Items</span>}
              prefix={
                <span style={{ 
                  fontSize: 24, 
                  color: '#fa8c16',
                  backgroundColor: '#fff7e6',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  marginRight: '8px'
                }}>
                  <ShoppingCartOutlined/>
                </span>
              }
              value={50}
              valueStyle={{ color: '#fa8c16', fontWeight: 600 }}
              suffix={
                <span className="stat-suffix-up" style={{ fontSize: 14, color: '#52c41a' }}>
                  <ArrowUpOutlined /> 10%
                </span>
              }
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 16, marginTop:24 }}>
        <Col xs={24} lg={12}>
          <Card 
            title={
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShoppingCartOutlined style={{ color: '#1890ff', fontSize: 18 }} />
                Most Sold Items
              </span>
            } 
            variant="borderless"
          >
            <Table<MostSoldItemType>
              columns={mostSoldColumns}
              dataSource={mostSoldItems}
              pagination={false}
              scroll={{ x: 500 }}
            />
          </Card>
        </Col>


       <Col xs={24} lg={12}>
          <Card 
            title={
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <MenuOutlined style={{ color: '#722ed1', fontSize: 18 }} />
                Quick Actions
              </span>
            } 
            variant="borderless"
          >
            <Row gutter={[12, 12]}>
              {quickActions.map((action, index) => (
                <Col xs={24} sm={12} key={index} onClick={() => navigate(action.route)}>
                  <Card
                    size="small"
                    hoverable
                    className="quick-action-card"
                    style={{
                      borderLeft: `4px solid ${action.color}`,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div className="quick-action-content" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div 
                        className="quick-action-icon" 
                        style={{ 
                          fontSize: 24, 
                          color: action.color,
                          backgroundColor: action.bgColor,
                          padding: '12px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {action.icon}
                      </div>
                      <div className="quick-action-label" style={{ fontSize: 15, fontWeight: 500 }}>
                        {action.label}
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      <Card 
        title={
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <DollarCircleOutlined style={{ color: '#52c41a', fontSize: 18 }} />
            Recent Transactions
          </span>
        } 
        variant="borderless" 
        className="table-card"
      >
        <Table<TableDataType>
          columns={tableColumns}
          dataSource={tableData}
          pagination={false}
          scroll={{ x: 800 }}
        />
      </Card>

    </>
  );
};

export default Dashboard;