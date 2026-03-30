import { Button, Col, DatePicker, Form, Grid, Row, Space, Table, Tag } from "antd";
import { ClearOutlined, DownloadOutlined } from "@ant-design/icons";
import { useSales } from "../../sales/SaleContext";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import Banner from "../../../../assets/images/banner.png";
import { useSaleDateFilter } from "./saleDateFilter";
import { exportSaleToExcel } from "./exportSaleExcel";
import type { ColumnsType } from "antd/es/table";
import { SaleStatCards } from "./SaleStatCards";
import { useTranslation } from "react-i18next";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { useBreakpoint } = Grid;

export function SaleReportTable() {
    const { invoices, quotes } = useSales();
    const [form] = Form.useForm();
    const screens = useBreakpoint();
    const isMobile = !screens.md;
    const { t } = useTranslation(['common', 'saleReport']);

    const {
        filteredInvoices,
        handleFilter,
        handleShowAll,
        handleClearFilter
    } = useSaleDateFilter(invoices, form, isMobile);

    const handleExport = async () => {
        await exportSaleToExcel(filteredInvoices, Banner);
    };

    const tableData = filteredInvoices.flatMap((invoice, index) =>
        (invoice.items ?? []).map((item, itemIndex) => ({
            key: `${index}-${itemIndex}`,
            customer_id: invoice.customer_id,
            quote_id: invoice.quote_id,
            quote_to: invoice.quote_to,
            item_name: item.item_name,
            invoice_date: invoice.invoice_date,
            unit_price: item.unit_price,
            qty: item.qty,
            total_amount: invoice.total_amount,
        }))
    );

    const total_quote_approve = quotes.filter(q => q.status === "Approved").length;
    const total_items_sold = filteredInvoices.reduce((total, invoice) =>
        total + (invoice.items ?? []).reduce((s, item) => s + item.qty, 0), 0
    );
    const total_invoice = filteredInvoices.length;
    const total_revenue = filteredInvoices.reduce((total, invoice) => total + invoice.total_amount, 0);

    const reportColumns: ColumnsType<any> = [
        {
            title: t('table.customer', { ns: 'saleReport' }),
            dataIndex: "customer_id",
            key: "customer_id"
        },
        {
            title: t('table.item', { ns: 'saleReport' }),
            dataIndex: "item_name",
            key: "item_name"
        },
        {
            title: t('table.quoteTo', { ns: 'saleReport' }),
            dataIndex: "quote_to",
            key: "quote_to",
            render: (_, record) => {
                const quoteValue = record.quote_to || record.quote_id;
                if (quoteValue) return quoteValue;
                return <Tag style={{ color: "#a600ff", fontWeight: "bold" }}>{t('table.instantSale', { ns: 'saleReport' })}</Tag>;
            }
        },
        {
            title: t('table.date', { ns: 'saleReport' }),
            dataIndex: "invoice_date",
            key: "invoice_date"
        },
        {
            title: t('table.qty', { ns: 'saleReport' }),
            dataIndex: "qty",
            key: "qty"
        },
        {
            title: t('table.unitPrice', { ns: 'saleReport' }),
            dataIndex: "unit_price",
            key: "unit_price",
            render: (value: number) =>
                new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value),
        },
        {
            title: t('table.total', { ns: 'saleReport' }),
            dataIndex: "total_amount",
            key: "total_amount",
            render: (value: number) =>
                new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value),
        },
    ];

    return (
        <div style={{ overflow: 'visible', minHeight: '600px' }}>
            <Form form={form} layout="vertical" requiredMark={false}>
                <Row gutter={6} align="bottom">
                    {isMobile ? (
                        <>
                            <Col xs={24} sm={12}>
                                <Form.Item label={t("filterDate.from_date", { ns: "common" })} name="report_date_from">
                                    <DatePicker
                                        placeholder={t("filterDate.from_date", { ns: "common" })}
                                        format="YYYY-MMMM-DD"
                                        style={{ width: '100%' }}
                                        onChange={handleFilter}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item label={t("filterDate.to_date", { ns: "common" })} name="report_date_to">
                                    <DatePicker
                                        placeholder={t("filterDate.to_date", { ns: "common" })}
                                        format="YYYY-MMMM-DD"
                                        style={{ width: '100%' }}
                                        onChange={handleFilter}
                                    />
                                </Form.Item>
                            </Col>
                        </>
                    ) : (
                        <Col xs={24} sm={24} md={8}>
                            <Form.Item label={t("dateRange", { ns: "saleReport" })} name="report_date_range">
                                <DatePicker.RangePicker
                                    placeholder={[
                                        t("filterDate.from_date", { ns: "common" }),
                                        t("filterDate.to_date", { ns: "common" }),
                                    ]}
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
                                <Button onClick={handleShowAll}>{t('button.all', { ns: 'common' })}</Button>
                                <Button icon={<DownloadOutlined />} onClick={handleExport}>Export</Button>
                                <Button onClick={handleClearFilter} icon={<ClearOutlined />}></Button>
                            </Space>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>

            <div className="p-6">
                <SaleStatCards
                    total_invoice={total_invoice}
                    total_quote_approve={total_quote_approve}
                    total_items_sold={total_items_sold}
                    total_revenue={total_revenue}
                />
            </div>

            <h3 style={{ marginBottom: '16px' }}>{t('title', { ns: 'saleReport' })}</h3>
            <Table
                columns={reportColumns}
                dataSource={tableData}
                pagination={false}
                scroll={{ x: 'max-content' }}
                size="small"
            />
        </div>
    );
}

export default SaleReportTable;