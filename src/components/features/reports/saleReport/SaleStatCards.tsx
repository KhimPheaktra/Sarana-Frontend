import { Card, Col, Row, Statistic } from 'antd';
import { FileDoneOutlined, FileTextOutlined, TagsOutlined, DollarOutlined } from '@ant-design/icons';

interface SaleStatCardsProps {
    total_invoice: number;
    total_quote_approve: number;
    total_items_sold: number;
    total_revenue: number;
}

export function SaleStatCards({ total_invoice, total_quote_approve, total_items_sold, total_revenue }: SaleStatCardsProps) {
    return (
        <Row gutter={[16, 16]} className="stats-row">
            <Col xs={24} sm={12} md={12} lg={6}>
                <Card variant="borderless" style={{ borderRadius: '8px', boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
                    <Statistic
                        prefix={
                            <span style={{ fontSize: 24, color: '#1890ff', backgroundColor: '#e6f7ff', padding: '8px 12px', borderRadius: '8px', marginRight: '8px' }}>
                                <FileDoneOutlined />
                            </span>
                        }
                        title={<span style={{ fontSize: 14, color: '#8c8c8c' }}>Total Invoices</span>}
                        value={total_invoice}
                        style={{ fontWeight: 600 }}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} md={12} lg={6}>
                <Card variant="borderless" style={{ borderRadius: '8px', boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
                    <Statistic
                        title={<span style={{ fontSize: 14, color: '#8c8c8c' }}>Total Quote Approve</span>}
                        value={total_quote_approve}
                        prefix={
                            <span style={{ fontSize: 24, color: '#f300df', backgroundColor: '#fff0fe', padding: '8px 12px', borderRadius: '8px', marginRight: '8px' }}>
                                <FileTextOutlined />
                            </span>
                        }
                        style={{ fontWeight: 600 }}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} md={12} lg={6}>
                <Card variant="borderless" style={{ borderRadius: '8px', boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
                    <Statistic
                        title={<span style={{ fontSize: 14, color: '#8c8c8c' }}>Total Item Sold</span>}
                        prefix={
                            <span style={{ fontSize: 24, color: '#722ed1', backgroundColor: '#f9f0ff', padding: '8px 12px', borderRadius: '8px', marginRight: '8px' }}>
                                <TagsOutlined />
                            </span>
                        }
                        value={total_items_sold}
                        style={{ fontWeight: 600 }}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} md={12} lg={6}>
                <Card variant="borderless" style={{ borderRadius: '8px', boxShadow: '0 1px 8px rgba(0,0,0,0.08)' }}>
                    <Statistic
                        title={<span style={{ fontSize: 14, color: '#8c8c8c' }}>Total Revenue</span>}
                        prefix={
                            <span style={{ fontSize: 24, color: '#52c41a', backgroundColor: '#f6ffed', padding: '8px 12px', borderRadius: '8px', marginRight: '8px' }}>
                                <DollarOutlined />
                            </span>
                        }
                        value={total_revenue.toFixed(2)}
                        style={{ color: '#52c41a', fontWeight: 600 }}
                    />
                </Card>
            </Col>
        </Row>
    );
}