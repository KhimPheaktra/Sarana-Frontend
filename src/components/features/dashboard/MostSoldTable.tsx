import { Card, Table } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';

interface MostSoldItemTable {
    key: string;
    name: string;
    category: string;
    sold: number;
    revenue: number;
}

const mostSoldItems: MostSoldItemTable[] = [
    { key: '1', name: 'Electric Service', category: 'Electronics', sold: 120, revenue: 2400 },
    { key: '2', name: 'Fire Service', category: 'Safety', sold: 80, revenue: 3200 },
];

export function MostSoldItemTable() {
    const { t } = useTranslation('dashboard');

    const columns: ColumnsType<MostSoldItemTable> = [
        { title: t('mostSoldItems.itemName'), dataIndex: 'name', key: 'name' },
        { title: t('mostSoldItems.category'), dataIndex: 'category', key: 'category' },
        { title: t('mostSoldItems.unitsSold'), dataIndex: 'sold', key: 'sold' },
        {
            title: t('mostSoldItems.revenue'),
            dataIndex: 'revenue',
            key: 'revenue',
            render: (revenue: number) => `$${revenue.toLocaleString()}`,
        },
    ];

    return (
        <Card
            title={
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ShoppingCartOutlined style={{ color: '#1890ff', fontSize: 18 }} />
                    {t('mostSoldItems.title')}
                </span>
            }
            variant="borderless"
        >
            <Table<MostSoldItemTable>
                columns={columns}
                dataSource={mostSoldItems}
                pagination={false}
                scroll={{ x: 500 }}
            />
        </Card>
    );
}