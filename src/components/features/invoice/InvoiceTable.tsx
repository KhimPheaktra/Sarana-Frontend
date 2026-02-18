import type { ColumnsType } from "antd/es/table";
import type { InvoiceType } from "./invoice.types";
import { Grid, Tag, Space, Button, Form, Row, Col, DatePicker, Select, Table, message } from "antd";
import { EyeOutlined, DeleteOutlined, ClearOutlined } from "@ant-design/icons";
import { useSales } from "../sales/SaleContext";

const {useBreakpoint} = Grid;

interface Props{
    data: InvoiceType[];
    onView: (invoice: InvoiceType) => void;
    onDelete: (invoice: InvoiceType) => void;
}

const InvoiceTable: React.FC<Props> = ({data, onView, onDelete}) => {
    const [form] = Form.useForm();
    const screens = useBreakpoint();
    const isMobile = !screens.md; 
 

    const columns: ColumnsType<InvoiceType> = [
        
        {
            title: "ID",
            dataIndex: "invoice_id",
            key: "invoice_id",
            align: "center",
            sorter: (a, b) => a.invoice_id - b.invoice_id,
            defaultSortOrder: 'ascend',
        },
        {
            title: "Customer",
            dataIndex: "customer_id",
            key: "customer_id",
            align: "center",
        },
        {
            title: "Engineer",
            dataIndex: "engineer",
            key: "engineer",
            align: "center",
            render: (engineer: string) => {
                if(!engineer || engineer.trim() === ""){
                    return <Tag style={{color: "#0098a9",fontWeight:"bold"}}>N/A</Tag>;
                }
                return <Tag style={{color: "#0000fe",fontWeight:"bold"}}>{engineer}</Tag>;
            }
        },
        {
            title: "Quote",
            dataIndex: "quote_to",
            key: "quote_to",
            align: "center",
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
            key: "invoice_date",
            align: "center",
        },
        {
            title: "Total",
            dataIndex: "total_amount",
            key: "total_amount",
            align: "center",
            render: (value: number) => {
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }).format(value);
            },
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            align: "center",
            render: (status: string , record: InvoiceType) => {
                const color: Record<string,string> ={
                    "Pending": "orange",
                    "Completed": "green",   
                };
                return (
                    <Select 
                        value={status}
                        onChange={(newStatus) => handleStatusChange(record.invoice_id, newStatus)}
                        style={{width: 120, border: "none",boxShadow:"none"}}
                   >
                       {Object.keys(color).map(statusKey => (
                            <Select.Option key={statusKey} value={statusKey}>
                                <Tag color={color[statusKey]} 
                                style={{
                                    display: "block",
                                    width: "100%",
                                    textAlign: "center",
                                    borderRadius: "0",
                                    border: "none",
                                    padding: "4px 0",
                                    fontWeight: "bold",
                                }}
                                >{statusKey}</Tag>
                            </Select.Option>
                       ))}
                    </Select>
                );
            }
        },
        {
            title: "Actions",
            key: "actions",
            align: "center",
            render: (_, record) => (
                <Space>
                <Button type="primary" onClick={() => onView(record)}>
                    <EyeOutlined /> View
                </Button>
                <Button danger onClick={() => onDelete(record)}>
                    <DeleteOutlined /> Delete
                </Button>
                </Space>
            )
        }

    ]
    const { invoices, setInvoices } = useSales(); 
    const handleStatusChange = (invoice_id: number, newStatus: string) => {
    const updatedInvoices = invoices.map(inv =>
        inv.invoice_id === invoice_id ? { ...inv, status: newStatus } : inv
    );

    setInvoices(updatedInvoices);

    message.success(`Status updated to ${newStatus}`);
};

  return (
      <div style={{ overflow: 'visible', minHeight: '600px' }}>
        <Form form={form} layout="vertical" requiredMark={false}>
        <Row gutter={16} align="bottom">  
            {isMobile ? (
            <>
                <Col xs={24} sm={12}>
                <Form.Item
                    label="From Date"
                    name="invoice_date_from"
                >
                    <DatePicker 
                    placeholder="From date"
                    format="YYYY-MM-DD"
                    style={{ width: '100%' }}
                    />
                </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                <Form.Item
                    label="To Date"
                    name="invoice_date_to"
                >
                    <DatePicker 
                    placeholder="To date"
                    format="YYYY-MM-DD"
                    style={{ width: '100%' }}
                    />
                </Form.Item>
                </Col>
            </>
            ) : (
            <Col xs={24} sm={24} md={8}>
                <Form.Item
                label="Invoice Date Range"
                name="invoice_date_range"
                >
                <DatePicker.RangePicker 
                    placeholder={["From date", "To date"]}
                    format="YYYY-MM-DD"
                    style={{ width: '100%' }}
                />
                </Form.Item>
            </Col>
            )}
            <Col xs={24} sm={12} md={5}>
            <Form.Item
                label="Options"
                name="select_option"
            >
                <Select placeholder="Select Option">
                <Select.Option value="1">Sales Invoice</Select.Option>
                <Select.Option value="2">Sales by engineer</Select.Option>
                </Select>
            </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={5}>
            <Form.Item
                label="Status"
                name="status"
            >
                <Select placeholder="Select status">
                <Select.Option value="1">Pending</Select.Option>
                <Select.Option value="2">Completed</Select.Option>
                </Select>
            </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6}>
            <Form.Item>
                <Button 
                onClick={() => form.resetFields()} 
                icon={<ClearOutlined />}
                block={isMobile}
                >
                Clear Filter
                </Button>
            </Form.Item>
            </Col>
        </Row>
        </Form>

        <Table
        columns={columns}
        dataSource={data}
        rowKey="invoice_id"
        pagination={{ pageSize: 10, simple: true }}
        scroll={{ x: 'max-content' }}
        />
    </div>
    );
  
}

export default InvoiceTable;