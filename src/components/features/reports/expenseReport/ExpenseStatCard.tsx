import { Col, Row } from "antd";
import { StatCard } from "../../../common/StatCard";
import { useTranslation } from "react-i18next";

interface ExpenseStatCardProps {
    total_expenses: number;
    total_purchases: number;
    total_spend: number;
}

export function ExpenseStatCards({ total_expenses, total_purchases, total_spend }: ExpenseStatCardProps) {
    const { t } = useTranslation('expenseReport');

    return (
        <div style={{ marginBottom: '24px' }}>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                    <StatCard label={t('totalExpenses')} value={total_expenses} textColor="#ff4d4f" bgColor="#fff1f0" />
                </Col>
                <Col xs={24} sm={8}>
                    <StatCard label={t('totalPurchases')} value={total_purchases} textColor="#faad14" bgColor="#fffbe6" />
                </Col>
                <Col xs={24} sm={8}>
                    <StatCard label={t('totalSpend')} value={total_spend} textColor="#722ed1" bgColor="#f9f0ff" />
                </Col>
            </Row>
        </div>
    );
}