import { Card, Col, Row, Statistic } from 'antd';
import { StatCard } from '../../../common/StatCard';

interface ProfitStatCardsProps {
    totalRevenue: number;
    totalExpenses: number;
    totalPurchases: number;
    totalCommissions: number;
    totalSpend: number;
    netProfit: number;
    isProfit: boolean;
}

export function ProfitStatCards({
    totalRevenue,
    totalExpenses,
    totalPurchases,
    totalCommissions,
    totalSpend,
    netProfit,
    isProfit,
}: ProfitStatCardsProps) {
    return (
        <div style={{ marginBottom: '24px' }}>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={8}>
                    <StatCard label="Total Revenue" value={totalRevenue} bgColor="#f6ffed" textColor="#52c41a" />
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <StatCard label="Total Expenses" value={totalExpenses} bgColor="#fff1f0" textColor="#ff4d4f" />
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <StatCard label="Total Purchases" value={totalPurchases} bgColor="#fffbe6" textColor="#faad14" />
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <StatCard label="Total Commissions" value={totalCommissions} bgColor="#f9f0ff" textColor="#722ed1" />
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <StatCard label="Total Spend" value={totalSpend} bgColor="#e6f7ff" textColor="#1890ff" />
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Card variant="borderless" style={{ borderRadius: '8px', boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
                        <Statistic
                            title={<span style={{ fontSize: 14, color: '#8c8c8c' }}>Net {isProfit ? 'Profit' : 'Loss'}</span>}
                            value={Math.abs(netProfit)}
                            precision={2}
                            prefix={
                                <span style={{
                                    fontSize: 20,
                                    color: isProfit ? '#52c41a' : '#ff4d4f',
                                    backgroundColor: isProfit ? '#f6ffed' : '#fff1f0',
                                    padding: '6px 10px',
                                    borderRadius: '8px',
                                    marginRight: '8px',
                                }}>
                                    {isProfit ? '+$' : '-$'}
                                </span>
                            }
                            style={{ color: isProfit ? '#52c41a' : '#ff4d4f', fontWeight: 600 }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}