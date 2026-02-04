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
}

const quickActions: QuickAction[] = [
  {
    label: 'User',
    icon: <UserAddOutlined />,
    route: '/users',
  },
  {
    label: 'Payment',
    icon: <DollarCircleOutlined />,
    route: '/payments',
  },
  {
    label: 'Customer',
    icon: <TeamOutlined />,
    route: '/customers',
  },
  {
    label: 'Report',
    icon: <BookOutlined />,
    route: '/',
  },
];

  return (
    <>
      <h2 className="dashboard-title">Overview</h2>
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} md={12} lg={6}>
          <Card variant="borderless" className="stat-card">
            <Statistic
              prefix={<UserOutlined />}
              title="Total Users" 
              value={5}
              suffix={
                <span className="stat-suffix-up">
                  <ArrowUpOutlined /> 12%
                </span>
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={12} lg={6}>
          <Card variant="borderless"  className="stat-card">
            <Statistic
              title="Revenue"
              value={45231}
              prefix="$"
              suffix={
                <span className="stat-suffix-up">
                  <ArrowUpOutlined /> 8%
                </span>
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={12} lg={6}>
          <Card variant="borderless"  className="stat-card">
            <Statistic
              title="Total Customers"
              prefix={<TeamOutlined/>}
              value={20}
              suffix={
                <span className="stat-suffix-down">
                  <ArrowDownOutlined /> 1%
                </span>
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={12} lg={6}>
          <Card variant="borderless"  className="stat-card">
            <Statistic
              title="Total Items"
              prefix={<ShoppingCartOutlined/>}
              value={50}
              suffix={
                <span className="stat-suffix-up">
                  <ArrowUpOutlined /> 10%
                </span>
              }
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 16, marginTop:24 }}>
        <Col xs={24} lg={12}>
          <Card title="Most Sold Items" variant="borderless">
            <Table<MostSoldItemType>
              columns={mostSoldColumns}
              dataSource={mostSoldItems}
              pagination={false}
              scroll={{ x: 500 }}
            />
          </Card>
        </Col>


       <Col xs={24} lg={12}>
          <Card title="Quick Actions" variant="borderless" >
            <Row gutter={[12, 12]}>
              {quickActions.map((action, index) => (
                <Col xs={24} sm={12} key={index} onClick={() => navigate(action.route)}>
                  <Card
                    size="small"
                    hoverable
                    className="quick-action-card"
                  >
                    <div className="quick-action-content">
                      <div className="quick-action-icon">{action.icon}</div>
                      <div className="quick-action-label">{action.label}</div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      <Card title="Recent Transactions" variant="borderless" className="table-card">
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
