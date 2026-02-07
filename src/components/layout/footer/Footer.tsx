import { Layout, Row, Col, Space, Typography, Divider } from 'antd';
import {
  ToolOutlined,
  TeamOutlined,
  SafetyOutlined,
  CustomerServiceOutlined,
} from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Text, Link } = Typography;

function Footer() {
  return (
    <AntFooter style={{ background: '#f0f2f5', padding: '24px 50px', borderTop: '1px solid #d9d9d9' }}>
      <Row gutter={[24, 16]} align="middle">
        <Col xs={24} md={12}>
          <Space separator={<Divider orientation="vertical" />} size="small">
            <Text type="secondary">
              <ToolOutlined /> Workshop Management System 
            </Text>
            <Text type="secondary">Internal Use Only</Text>
          </Space>
        </Col>
        <Col xs={24} md={12} style={{ textAlign: 'right' }}>
          <Space separator={<Divider orientation="vertical" />} size="small">
            <Link href="#" style={{ fontSize: '13px' }}>
              <CustomerServiceOutlined /> Support
            </Link>
            <Link href="#" style={{ fontSize: '13px' }}>
              <SafetyOutlined /> Privacy Policy
            </Link>
            <Link href="#" style={{ fontSize: '13px' }}>
              <TeamOutlined /> User Guide
            </Link>
          </Space>
        </Col>
      </Row>

      <Row style={{ marginTop: '16px' }}>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            © {new Date().getFullYear()} Senghun WorkShop
          </Text>
        </Col>
      </Row>
    </AntFooter>
  );
}

export default Footer;