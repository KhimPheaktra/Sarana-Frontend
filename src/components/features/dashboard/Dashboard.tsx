import React from 'react';
import { Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { DashboardStatCards } from './DashboardStatCards';


import './dashboard.css';
import { QuickActions } from './QuickActions';
import { MostSoldItemTable } from './MostSoldTable';
import { RecentTransactions } from './RecentTransactions';

export const Dashboard: React.FC = () => {
    const { t } = useTranslation();

    return (
        <>
            <h2 className="dashboard-title">{t('title.dashboard')}</h2>
            <DashboardStatCards />

            <Row gutter={[16, 16]} style={{ marginBottom: 16, marginTop: 24 }}>
                <Col xs={24} lg={12}>
                    <MostSoldItemTable />
                </Col>
                <Col xs={24} lg={12}>
                    <QuickActions />
                </Col>
            </Row>

            <RecentTransactions />
        </>
    );
};

export default Dashboard;