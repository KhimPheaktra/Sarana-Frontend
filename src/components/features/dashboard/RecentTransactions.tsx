import { Card, Table, Tag } from 'antd';
import { DollarCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';

interface TableDataType {
    key: string;
    id: string;
    customer: string;
    item: string;
    amount: string;
    status: string;
}

const tableData: TableDataType[] = [
    { key: '1', id: '#001', customer: 'Customer 1', item: 'Electric Service', amount: '234.50', status: 'completed' },
    { key: '2', id: '#002', customer: 'Customer 2', item: 'Fire Service',     amount: '567.80', status: 'completed' },
];

export function RecentTransactions() {
    const { t } = useTranslation('dashboard');

    const columns: ColumnsType<TableDataType> = [
        { title: t('recentTransactions.id'),       dataIndex: 'id',       key: 'id' },
        { title: t('recentTransactions.customer'), dataIndex: 'customer', key: 'customer' },
        { title: t('recentTransactions.item'),     dataIndex: 'item',     key: 'item' },
        {
            title: t('recentTransactions.amount'),
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: string) => `$${amount}`,
        },
        {
            title: t('recentTransactions.status'),
            dataIndex: 'status',
            key: 'status',
            render: () => <Tag color="success">{t('recentTransactions.completed')}</Tag>,
        },
    ];

    return (
        <Card
            title={
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <DollarCircleOutlined style={{ color: '#52c41a', fontSize: 18 }} />
                    {t('recentTransactions.title')}
                </span>
            }
            variant="borderless"
            className="table-card"
        >
            <Table<TableDataType>
                columns={columns}
                dataSource={tableData}
                pagination={false}
                scroll={{ x: 800 }}
            />
        </Card>
    );
}