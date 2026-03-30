import { Card, Col, Row } from 'antd';
import {
    UserAddOutlined, DollarCircleOutlined,
    TeamOutlined, BookOutlined, MenuOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function QuickActions() {
    const navigate = useNavigate();
    const { t } = useTranslation('dashboard');

    const quickActions = [
        { label: t('quickActions.user'),     icon: <UserAddOutlined />,      route: '/users',          color: '#1890ff', bgColor: '#e6f7ff' },
        { label: t('quickActions.payment'),  icon: <DollarCircleOutlined />, route: '/payments',       color: '#52c41a', bgColor: '#f6ffed' },
        { label: t('quickActions.customer'), icon: <TeamOutlined />,         route: '/customers',      color: '#722ed1', bgColor: '#f9f0ff' },
        { label: t('quickActions.report'),   icon: <BookOutlined />,         route: '/reports/sales',  color: '#fa8c16', bgColor: '#fff7e6' },
    ];

    return (
        <Card
            title={
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <MenuOutlined style={{ color: '#722ed1', fontSize: 18 }} />
                    {t('quickActions.title')}
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
                            style={{ borderLeft: `4px solid ${action.color}`, transition: 'all 0.3s ease' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ fontSize: 24, color: action.color, backgroundColor: action.bgColor, padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {action.icon}
                                </div>
                                <div style={{ fontSize: 15, fontWeight: 500 }}>{action.label}</div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Card>
    );
}