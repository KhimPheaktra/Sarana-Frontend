import { Col, Row } from 'antd';
import {
    UserOutlined, ArrowUpOutlined, ArrowDownOutlined,
    TeamOutlined, ShoppingCartOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { StatCard } from '../../common/StatCard';


export function DashboardStatCards() {
    const { t } = useTranslation('dashboard');

    return (
        <Row gutter={[16, 16]} className="stats-row">
            <Col xs={24} sm={12} md={12} lg={6}>
                <StatCard
                    label={t('stats.totalUsers')}
                    value={5}
                    textColor="#1890ff"
                    bgColor="#e6f7ff"
                    icon={<UserOutlined />}
                    suffix={<span style={{ fontSize: 14, color: '#52c41a' }}><ArrowUpOutlined /> 12%</span>}
                />
            </Col>
            <Col xs={24} sm={12} md={12} lg={6}>
                <StatCard
                    label={t('stats.revenue')}
                    value={45231}
                    textColor="#52c41a"
                    bgColor="#f6ffed"
                    icon="$"
                    suffix={<span style={{ fontSize: 14, color: '#52c41a' }}><ArrowUpOutlined /> 8%</span>}
                />
            </Col>
            <Col xs={24} sm={12} md={12} lg={6}>
                <StatCard
                    label={t('stats.totalCustomers')}
                    value={100}
                    textColor="#722ed1"
                    bgColor="#f9f0ff"
                    icon={<TeamOutlined />}
                    suffix={<span style={{ fontSize: 14, color: '#ff4d4f' }}><ArrowDownOutlined /> 1%</span>}
                />
            </Col>
            <Col xs={24} sm={12} md={12} lg={6}>
                <StatCard
                    label={t('stats.totalItems')}
                    value={50}
                    textColor="#fa8c16"
                    bgColor="#fff7e6"
                    icon={<ShoppingCartOutlined />}
                    suffix={<span style={{ fontSize: 14, color: '#52c41a' }}><ArrowUpOutlined /> 10%</span>}
                />
            </Col>
        </Row>
    );
}