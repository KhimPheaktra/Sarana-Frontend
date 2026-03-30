import type { ColumnsType } from "antd/es/table";
import type { InvoiceType } from "./invoice.types";
import { Grid, Tag, Space, Button, Form, Row, Col, DatePicker, Select, Table, message } from "antd";
import { EyeOutlined, DeleteOutlined, ClearOutlined, DollarOutlined } from "@ant-design/icons";
import { useSales } from "../sales/SaleContext";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
const { useBreakpoint } = Grid;
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
interface Props {
    data: InvoiceType[];
    onView: (invoice: InvoiceType) => void;
    onAddCommission: (invoice: InvoiceType) => void;
    onDelete: (invoice: InvoiceType) => void;
}

const InvoiceTable: React.FC<Props> = ({ data, onView, onDelete, onAddCommission }) => {
    const [form] = Form.useForm();
    const screens = useBreakpoint();
    const isMobile = !screens.md;
    const { invoices, setInvoices } = useSales();
    const [filteredInvoices, setFilteredInvoices] = useState<InvoiceType[]>(data);
    const { t } = useTranslation(["invoices", "common"])
    const handleStatusChange = (invoice_id: number, newStatus: string) => {
        const updatedInvoices = invoices.map(inv =>
            inv.invoice_id === invoice_id ? { ...inv, status: newStatus } : inv
        );
        setInvoices(updatedInvoices);
        message.success(`Status updated to ${newStatus}`);
    };
    useEffect(() => {
        setFilteredInvoices(data);
    }, [data]);

    const handleDateChange = useCallback(() => {
        const values = form.getFieldsValue();
        let fromDate: Dayjs | null = null;
        let toDate: Dayjs | null = null;

        if (isMobile) {
            fromDate = values.invoice_date_from ?? null;
            toDate = values.invoice_date_to ?? null;
        } else {
            if (values.invoice_date_range) {
                [fromDate, toDate] = values.invoice_date_range;
            }
        }
        if (fromDate && toDate) {
            const filtered = data.filter((invoices) => {
                const invoiceDate = dayjs(invoices.invoice_date);
                return (
                    invoiceDate.isSameOrAfter(fromDate, "day") &&
                    invoiceDate.isSameOrBefore(toDate, "day")
                );
            })
            setFilteredInvoices(filtered);
        } else {
            setFilteredInvoices(data);
        }
    }, [form, data, isMobile]);

    const handleOption = (value: string) => {
        if (!value) {
            setFilteredInvoices(data);
            return;
        }
        if (value === "invoice") {
            const result = data.filter(invoice => invoice.type === "invoice");
            setFilteredInvoices(result);
        }
        else if (value === "quote") {
            const result = data.filter(invoice => invoice.type === "quote");
            setFilteredInvoices(result);
        }
    }
    const handleStatusFilter = (value: string) => {
        if (!value) {
            setFilteredInvoices(data);
            return;
        }
        const result = data.filter(
            invoice => invoice.status?.toLowerCase() === value.toLowerCase()
        );
        setFilteredInvoices(result)
    }

    const handleClear = useCallback(() => {
        form.resetFields();
        setFilteredInvoices(data);
    }, [form, data]);
    
    const columns: ColumnsType<InvoiceType> = [
        {
            title: t("table.id", { ns: "invoice" }),
            dataIndex: "invoice_id",
            key: "invoice_id",
            align: "center",
            sorter: (a, b) => a.invoice_id - b.invoice_id,
            defaultSortOrder: 'ascend',
        },
        {
            title: t("table.customer", { ns: "invoice" }),
            dataIndex: "customer_name",
            key: "customer_name",
            align: "center",
            render: (_: any, record: any) => (
                record.customer_name || record.quote_to || "_"
            ),
        },
        {
            title: t("table.engineer", { ns: "invoice" }),
            dataIndex: "engineer",
            key: "engineer",
            align: "center",
            render: (engineer: string) => {
                if (!engineer || engineer.trim() === "") {
                    return <Tag style={{ color: "#0098a9", fontWeight: "bold" }}>N/A</Tag>;
                }
                return <Tag style={{ color: "#0000fe", fontWeight: "bold" }}>{engineer}</Tag>;
            }
        },
        {
            title: t("table.quote", { ns: "invoice" }),
            dataIndex: "quote_to",
            key: "quote_to",
            align: "center",
            render: (_, record) => {
                const quoteValue = record.quote_to || record.quote_id;
                if (quoteValue) return quoteValue;
                return <Tag style={{ color: "#a600ff", fontWeight: "bold" }}>Instant Sale</Tag>;
            }
        },
        {
            title: t("table.date", { ns: "invoice" }),
            dataIndex: "invoice_date",
            key: "invoice_date",
            align: "center",
        },
        {
            title: t("table.total", { ns: "invoice" }),
            dataIndex: "total_amount",
            key: "total_amount",
            align: "center",
            render: (value: number) =>
                new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value),
        },
        {
            title: t("table.status", { ns: "invoice" }),
            dataIndex: "status",
            key: "status",
            align: "center",
            render: (status: string, record: InvoiceType) => {
                const color: Record<string, string> = {
                    "Pending": "orange",
                    "Completed": "green",
                };
                return (
                    <Select
                        value={status}
                        onChange={(newStatus) => handleStatusChange(record.invoice_id, newStatus)}
                        style={{ width: 120, border: "none", boxShadow: "none" }}
                    >
                        {Object.keys(color).map(statusKey => (
                            <Select.Option key={statusKey} value={statusKey}>
                                <Tag color={color[statusKey]} style={{
                                    display: "block", width: "100%", textAlign: "center",
                                    borderRadius: "0", border: "none", padding: "4px 0", fontWeight: "bold",
                                }}>
                                    {statusKey}
                                </Tag>
                            </Select.Option>
                        ))}
                    </Select>
                );
            }
        },
        {
            title: t("table.actions", { ns: "invoice" }),
            key: "actions",
            align: "center",
            render: (_, record) => (
                <Space>
                    <Button type="primary" onClick={() => onView(record)}>
                        <EyeOutlined /> {t("button.view", { ns: "common" })}
                    </Button>
                    <Button
                        icon={<DollarOutlined />}
                        onClick={() => onAddCommission(record)}
                        style={{ color: "#1677ff", borderColor: "#1677ff" }}
                    >
                        Commission
                    </Button>
                    <Button danger onClick={() => onDelete(record)}>
                        <DeleteOutlined /> {t("button.delete", { ns: "common" })}
                    </Button>
                </Space>
            )
        }
    ];

    return (
        <div style={{ overflow: 'visible', minHeight: '600px' }}>
            <Form form={form} layout="vertical" requiredMark={false}>
                <Row gutter={16} align="bottom">
                    {isMobile ? (
                        <>
                            <Col xs={24} sm={12}>
                                <Form.Item label={t("filterDate.from_date", { ns: "common" })} name="invoice_date_from">
                                    <DatePicker placeholder={t("filterDate.from_date", { ns: "common" })} format="YYYY-MM-DD" style={{ width: '100%' }} onChange={handleDateChange} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item label={t("filterDate.to_date", { ns: "common" })} name="invoice_date_to">
                                    <DatePicker placeholder={t("filterDate.to_date", { ns: "common" })} format="YYYY-MM-DD" style={{ width: '100%' }} onChange={handleDateChange} />
                                </Form.Item>
                            </Col>
                        </>
                    ) : (
                        <Col xs={24} sm={24} md={8}>
                            <Form.Item label={t("dateRange.selectDateRange", { ns: "common" })} name="invoice_date_range">
                                <DatePicker.RangePicker placeholder={[t("filterDate.from_date", { ns: "common" }), t("filterDate.to_date", { ns: "common" })]} format="YYYY-MM-DD" style={{ width: '100%' }} onChange={handleDateChange} />
                            </Form.Item>
                        </Col>
                    )}
                    <Col xs={24} sm={12} md={5}>
                        <Form.Item label={t("options.selectOptions", { ns: "common" })} name="select_option">
                            <Select placeholder={t("options.selectOptions", { ns: "common" })} onChange={handleOption} allowClear>
                                <Select.Option value="invoice">Sales Invoice</Select.Option>
                                <Select.Option value="quote">Sales by Quote</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={5}>
                        <Form.Item label={t("status.selectStatus", { ns: "common" })} name="status">
                            <Select placeholder={t("status.selectStatus", { ns: "common" })} onChange={handleStatusFilter}>
                                <Select.Option value="pending">Pending</Select.Option>
                                <Select.Option value="completed">Completed</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={2}>
                        <Form.Item>
                            <Button onClick={handleClear} icon={<ClearOutlined />} block={isMobile}>
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>

            <Table
                columns={columns}
                dataSource={filteredInvoices}
                rowKey="invoice_id"
                pagination={{ pageSize: 10, simple: true }}
                scroll={{ x: 'max-content' }}
                locale={{ emptyText: t("table.noData") }}
                size="small"
            />
        </div>
    );
};

export default InvoiceTable;