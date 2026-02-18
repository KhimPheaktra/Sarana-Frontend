import { Button, Col, DatePicker, Form, Row, Space, Table } from "antd";
import { ClearOutlined, DownloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import Banner from "../../../../assets/images/banner.png";
import { useExpenseDateFilter } from "./expenseDateFilter";
import { exportExpenseToExcel } from "./exportExpense";
import type { ColumnsType } from "antd/es/table";
import type { ExpensesType } from "../../expenses/expenses.types";
import type { PurchaseType } from "../../purchase/purchase.types";
import { ExpenseStatCards } from "./ExpenseStatCard";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

interface ExpenseReportTableProps {
    expenses: ExpensesType[];
    purchases: PurchaseType[];
}

interface CombinedExpenseType {
    key: string;
    type: 'Expense' | 'Purchase';
    id: number;
    description: string;
    date: string;
    amount: number;
    category?: string;
    supplier_id?: number;
    item_id?: number;
    qty?: number;
    unit_price?: number;
}

export function ExpenseReportTable({ expenses = [], purchases = [] }: ExpenseReportTableProps) {
    const [form] = Form.useForm();

    const {
        filteredExpenses,
        filteredPurchases,
        handleFilter,
        handleShowAll,
        handleClearFilter,
        isMobile
    } = useExpenseDateFilter(expenses, purchases, form);

    const handleExport = async () => {
        await exportExpenseToExcel(filteredExpenses, filteredPurchases, Banner);
    };
    const total_expenses = (filteredExpenses || []).reduce((total, expense) => total + expense.amount, 0);
    const total_purchases = (filteredPurchases || []).reduce((total, purchase) => total + purchase.total_amount, 0);
    const total_spend = total_expenses + total_purchases;
    const combinedTableData: CombinedExpenseType[] = [
        ...(filteredExpenses || []).map((expense) => ({
            key: `expense-${expense.expenses_id}`,
            type: 'Expense' as const,
            id: expense.expenses_id,
            description: expense.description,
            date: expense.expenses_date,
            amount: expense.amount,
            category: expense.category,
        })),
        ...(filteredPurchases || []).map((purchase) => ({
            key: `purchase-${purchase.purchase_id}`,
            type: 'Purchase' as const,
            id: purchase.purchase_id,
            description: `Item: ${purchase.item_id} (Qty: ${purchase.qty})`,
            date: purchase.purchase_date,
            amount: purchase.total_amount,
            supplier_id: purchase.supplier_id,
            item_id: purchase.item_id,
            qty: purchase.qty,
            unit_price: purchase.unit_price,
        }))
    ].sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf()); 

    const combinedColumns: ColumnsType<CombinedExpenseType> = [
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            render: (type: string) => (
                <span style={{
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    backgroundColor: type === 'Expense' ? '#fff1f0' : '#fffbe6',
                    color: type === 'Expense' ? '#ff4d4f' : '#faad14',
                }}>
                    {type}
                </span>
            ),
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description"
        },
        {
            title: "Category/Supplier",
            key: "category_supplier",
            render: (_, record) => {
                if (record.type === 'Expense') {
                    return record.category || '-';
                } else {
                    return `Supplier: ${record.supplier_id}`;
                }
            },
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (date: string) => dayjs(date).format('DD-MMM-YYYY'),
        },
        {
            title: "Qty",
            key: "qty",
            render: (_, record) => {
                return record.type === 'Purchase' ? record.qty : '-';
            },
        },
        {
            title: "Unit Price",
            key: "unit_price",
            render: (_, record) => {
                if (record.type === 'Purchase' && record.unit_price) {
                    return new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                    }).format(record.unit_price);
                }
                return '-';
            },
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (value: number) => {
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }).format(value);
            },
        },
    ];

    return (
        <div style={{ overflow: 'visible', minHeight: '600px' }}>
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
                                    placeholder={["From Date", "To Date"]}
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
                                <Button icon={<DownloadOutlined  />} onClick={handleExport}>
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
            <ExpenseStatCards 
                total_expenses={total_expenses}
                total_purchases={total_purchases}
                total_spend={total_spend}
                />
            <div>
                <h3 style={{ marginBottom: '16px' }}>Expenses & Purchases</h3>
                <Table
                    columns={combinedColumns}
                    dataSource={combinedTableData}
                    pagination={false}
                    scroll={{ x: 'max-content' }}
                />
            </div>
        </div>
    );
}

export default ExpenseReportTable;