import { Button, Card, Col, DatePicker, Form, Grid, Row, Space, Statistic, Table, Tag } from "antd";
import { ClearOutlined, DollarOutlined, DownloadOutlined, FileDoneOutlined, FileTextOutlined, TagsOutlined } from "@ant-design/icons";
import { useSales } from "../../sales/SaleContext";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import Banner from "../../../../assets/images/banner.png";
import {useSaleDateFilter } from "./saleDateFilter";
import { exportSaleToExcel } from "./exportSaleExcel";
import type { ColumnsType } from "antd/es/table";


dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { useBreakpoint } = Grid;

export function SaleReportTable() {
    const { invoices, quotes } = useSales();
    const [form] = Form.useForm();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const {
        filteredInvoices,
        handleFilter,
        handleShowAll,
        handleClearFilter
    } = useSaleDateFilter(invoices, form, isMobile);

    const handleExport = async () => {
        await exportSaleToExcel(filteredInvoices, Banner);
    };

    const tableData = filteredInvoices.map((invoice, index) => ({
        key: index,
        customer_id: invoice.customer_id,
        quote_id: invoice.quote_id,
        quote_to: invoice.quote_to,
        item_name: invoice.item_name,
        invoice_date: invoice.invoice_date,
        unit_price: invoice.unit_price,
        qty: invoice.qty,
        total_amount: invoice.total_amount,
    }));

    const total_invoice = filteredInvoices.length;
    const total_quote_approve = quotes.filter(q => q.status === "Approved").length;
    const total_items_sold = filteredInvoices.reduce((total, invoice) => total + invoice.qty, 0);
    const total_revenue = filteredInvoices.reduce((total, invoice) => total + invoice.total_amount, 0);


     const reportColumns: ColumnsType<any> = [
    {
        title: "Customer",
        dataIndex: "customer_id",
        key: "customer_id"
    },
    {
        title: "Item",
        dataIndex: "item_name",
        key: "item_name"
    },

    {
        title: "Quote To",
        dataIndex: "quote_to",
        key: "quote_to",
        render: (_, record) => {
            const quoteValue = record.quote_to || record.quote_id;
            if(quoteValue) {
                return quoteValue;
            }
            return <Tag style={{color: "#a600ff",fontWeight:"bold"}}>Instant Sale</Tag>;
        }
    },
    {
        title: "Date",
        dataIndex: "invoice_date",
        key: "invoice_date"
    },
    {
        title: "Qty",
        dataIndex: "qty",
        key: "qty"
    },
    {
        title: "Unit Price",
        dataIndex: "unit_price",
        key: "unit_price",
        render: (value: number) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            }).format(value);
        },
    },
    {
        title: "Total",
        dataIndex: "total_amount",
        key: "total_amount",
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

            <div className="p-6">
                <Row gutter={[16, 16]} className="stats-row">
                    <Col xs={24} sm={12} md={12} lg={6}>
                        <Card style={{ backgroundColor: '#519ee1', color: '#2f2f2f' }} variant="borderless">
                            <Statistic
                                prefix={
                                    <span style={{
                                        fontSize: 24,
                                        color: '#1890ff',
                                        backgroundColor: '#e6f7ff',
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        marginRight: '8px'
                                    }}>
                                        <FileDoneOutlined />
                                    </span>
                                }
                                title={<span style={{ fontSize: 14, color: '#2f2f2f', fontWeight: 'bold' }}>Total Invoices</span>}
                                value={total_invoice}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={6}>
                        <Card style={{ backgroundColor: '#f300df', color: '#2f2f2f' }} variant="borderless">
                            <Statistic
                                title={<span style={{ fontSize: 14, color: '#2f2f2f',fontWeight: 'bold' }}>Total Quote Approve</span>}
                                value={total_quote_approve}
                                prefix={
                                    <span style={{
                                        fontSize: 24,
                                        color: '#f300df',
                                        backgroundColor: '#f6ffed',
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        marginRight: '8px'
                                    }}>
                                        <FileTextOutlined />
                                    </span>
                                }
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={6}>
                        <Card style={{ backgroundColor: '#722ed1', color: '#2f2f2f' }} variant="borderless">
                            <Statistic
                                title={<span style={{ fontSize: 14, color: '#2f2f2f',fontWeight: 'bold' }}>Total Item Sold</span>}
                                prefix={
                                    <span style={{
                                        fontSize: 24,
                                        color: '#722ed1',
                                        backgroundColor: '#f9f0ff',
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        marginRight: '8px'
                                    }}>
                                        <TagsOutlined />
                                    </span>
                                }
                                value={total_items_sold}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={6}>
                        <Card style={{ backgroundColor: '#52c41a', color: '#2f2f2f' }} variant="borderless">
                            <Statistic
                                title={<span style={{ fontSize: 14, color: '#2f2f2f',fontWeight: 'bold' }}>Total Revenue</span>}
                                prefix={
                                    <span style={{
                                        fontSize: 24,
                                        color: '#52c41a',
                                        backgroundColor: '#f6ffed',
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        marginRight: '8px'
                                    }}>
                                        <DollarOutlined />
                                    </span>
                                }
                                value={total_revenue.toFixed(2)}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>

            <Table
                columns={reportColumns}
                dataSource={tableData}
                pagination={false}
                scroll={{ x: 'max-content' }}
            />
        </div>
    );
}

export default SaleReportTable;