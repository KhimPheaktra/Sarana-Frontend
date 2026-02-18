import { Button, Col, DatePicker, Form, Row, Space } from 'antd';
import { ClearOutlined, DownloadOutlined } from '@ant-design/icons';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import Banner from '../../../../assets/images/banner.png';
import type { InvoiceType } from '../../invoice/invoice.types';
import type { ExpensesType } from '../../expenses/expenses.types';
import type { PurchaseType } from '../../purchase/purchase.types';
import type { CommissionType } from '../../commision/commission.types';
import { exportProfit } from './ProfitExport';
import { useProfitDateFilter } from './ProfitFilterDate';
import { ProfitChart } from './ProfitChart';
import { ProfitStatCards } from './ProfitStatCard';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


interface ProfitReportTableProps {
    invoices?: InvoiceType[];
    expenses?: ExpensesType[];
    purchases?: PurchaseType[];
    commissions?: CommissionType[];
}

function ProfitReportTable({
    invoices = [],
    expenses = [],
    purchases = [],
    commissions = [],
}: ProfitReportTableProps) {
    const [form] = Form.useForm();

    const {
        filteredInvoices,
        filteredExpenses,
        filteredPurchases,
        filteredCommissions,
        handleFilter,
        handleShowAll,
        handleClearFilter,
        isMobile,
    } = useProfitDateFilter(invoices, expenses, purchases, commissions, form);

    const totalRevenue     = filteredInvoices.reduce((s, i) => s + i.total_amount, 0);
    const totalExpenses    = filteredExpenses.reduce((s, e) => s + e.amount, 0);
    const totalPurchases   = filteredPurchases.reduce((s, p) => s + p.total_amount, 0);
    const totalCommissions = filteredCommissions.reduce((s, c) => s + c.amount, 0);
    const totalSpend       = totalExpenses + totalPurchases + totalCommissions;
    const netProfit        = totalRevenue - totalSpend;
    const isProfit         = netProfit >= 0;

    const handleExport = async () => {
        await exportProfit(
            filteredInvoices,
            filteredExpenses,
            filteredPurchases,
            filteredCommissions,
            Banner
        );
    };

    return (
        <div style={{ overflow: 'visible', minHeight: '600px' }}>

            {/* ── Date Filter ── */}
            <Form form={form} layout="vertical" requiredMark={false}>
                <Row gutter={6} align="bottom">
                    {isMobile ? (
                        <>
                            <Col xs={24} sm={12}>
                                <Form.Item label="From Date" name="report_date_from">
                                    <DatePicker
                                        placeholder="From date"
                                        format="YYYY-MMMM-DD"
                                        style={{ width: '100%' }}
                                        onChange={handleFilter}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item label="To Date" name="report_date_to">
                                    <DatePicker
                                        placeholder="To Date"
                                        format="YYYY-MMMM-DD"
                                        style={{ width: '100%' }}
                                        onChange={handleFilter}
                                    />
                                </Form.Item>
                            </Col>
                        </>
                    ) : (
                        <Col xs={24} sm={24} md={8}>
                            <Form.Item label="Report Date Range" name="report_date_range">
                                <DatePicker.RangePicker
                                    placeholder={['From Date', 'To Date']}
                                    format="YYYY-MMMM-DD"
                                    style={{ width: '100%' }}
                                    onChange={handleFilter}
                                />
                            </Form.Item>
                        </Col>
                    )}
                    <Col xs={24} sm={24} md={10}>
                        <Form.Item>
                            <Space size="small" wrap>
                                <Button onClick={handleShowAll}>All</Button>
                                <Button icon={<DownloadOutlined />} onClick={handleExport}>
                                    Export
                                </Button>
                                <Button onClick={handleClearFilter} icon={<ClearOutlined />}>
                                    Clear Filter
                                </Button>
                            </Space>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>

            <div style={{ marginBottom: '24px' }}>
                <ProfitStatCards
                    totalRevenue={totalRevenue}
                    totalExpenses={totalExpenses}
                    totalPurchases={totalPurchases}
                    totalCommissions={totalCommissions}
                    totalSpend={totalSpend}
                    netProfit={netProfit}
                    isProfit={isProfit}
                />
                <ProfitChart
                    totalRevenue={totalRevenue}
                    totalExpenses={totalExpenses}
                    totalPurchases={totalPurchases}
                    totalCommissions={totalCommissions}
                    totalSpend={totalSpend}
                    netProfit={netProfit}
                    isProfit={isProfit}
                />
            </div>
        </div>
    );
}

export default ProfitReportTable;