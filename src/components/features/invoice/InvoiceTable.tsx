import type { ColumnsType } from "antd/es/table";
import type { InvoiceType } from "./invoice.types";
import { Grid, Tag, Space, Button, Form, Row, Col, DatePicker, Select, Table } from "antd";
import { EyeOutlined, DeleteOutlined, ClearOutlined } from "@ant-design/icons";

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
            title: "Quote",
            dataIndex: "quote_id",
            key: "quote_id",
            align: "center",
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
            render: (status) => (
                <Tag color={status === "Completed" ? "green" : status === "Pendding" ? "yellow" : "default"}>
                {status}
                </Tag>
            ),
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