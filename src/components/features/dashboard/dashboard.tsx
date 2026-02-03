import React from 'react';
import { Card, Row, Col, Statistic, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  UserOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import './dashboard.css';

interface TableDataType {
  key: string;
  id: string;
  customer: string;
  item: string;
  amount: string;
  status: string;
}

export const Dashboard: React.FC = () => {
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
    { key: '1', id: '#001', customer: 'Customer 1',item: "Electrice", amount: '234.50', status: 'completed' },
    { key: '2', id: '#002', customer: 'Customer 2',item: "Fire Service", amount: '567.80', status: 'completed' },
   
  ];

  const quickActions: string[] = [
    'User',
    'Payment',
    'Add Customer',
    'Report',
  ];

  return (
    <>
      <h2 className="dashboard-title">Overview</h2>
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} md={12} lg={6}>
          <Card variant="borderless" className="stat-card">
            <Statistic
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
          <Card title="Suppliers" variant="borderless" >
            {[1, 2].map((item) => (
              <div key={item} className="supplier-item">
                <div className="supplier-icon">
                  <UserOutlined />
                </div>
                <div className="supplier-info">
                  <div className="supplier-name">Supplier {item}</div>
                  <div className="supplier-time">{item} week ago</div>
                </div>
              </div>
            ))}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Quick Actions" variant="borderless" >
            <Row gutter={[12, 12]}>
              {quickActions.map((action, index) => (
                <Col xs={24} sm={12} key={index}>
                  <Card
                    size="small"
                    hoverable
                    className="quick-action-card"
                  >
                    <div className="quick-action-content">
                      {action}
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
