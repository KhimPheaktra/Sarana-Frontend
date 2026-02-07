import type { ColumnsType } from "antd/es/table";
import type { PurchaseType } from "./purchase.types";
import { Space, Table, Form, Row, Col, DatePicker, Button, Grid } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, ClearOutlined } from "@ant-design/icons";

const { useBreakpoint } = Grid;

interface Props {
    data: PurchaseType[];
    onView: (purchase: PurchaseType) => void;
    onEdit: (purchase: PurchaseType) => void;
    onDelete: (purchase: PurchaseType) => void;
}

const PurchaseTable: React.FC<Props> = ({ data, onView, onEdit, onDelete }) => {
    const [form] = Form.useForm();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const columns: ColumnsType<PurchaseType> = [
        {
            title: "ID",
            dataIndex: "purchase_id",
            key: "purchase_id",
            align: "center",
            sorter: (a, b) => a.purchase_id - b.purchase_id,
            defaultSortOrder: 'ascend',
        },
        {
            title: "Supplier ID",
            dataIndex: "supplier_id",
            key: "supplier_id",
            align: "center",
        },
        {
            title: "Purchase Date",
            dataIndex: "purchase_date",
            key: "purchase_date",
            align: "center",
        },
        {
            title: "Item Id",
            dataIndex: "item_id",
            key: "item_id",
            align: "center",
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
            align: "center",
        },
        {
            title: "Unit Price",
            dataIndex: "unit_price",   
            key: "unit_price",
            align: "center",
            render: (value: number) => {
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }).format(value);
            },
        },
        {
            title: "Subtotal",
            dataIndex: "subtotal",
            key: "subtotal",
            align: "center",
            render: (value: number) => {
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }).format(value);
            },
        },
        {
            title: "Total Amount",
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
            title: "Actions",
            key: "actions",
            align: "center",
            render: (_, record) => (
                <Space>
                    <Button type="primary" onClick={() => onView(record)}>
                        <EyeOutlined /> View
                    </Button>
                    <Button type="primary" onClick={() => onEdit(record)}>
                        <EditOutlined /> Edit
                    </Button>
                    <Button danger onClick={() => onDelete(record)}>
                        <DeleteOutlined /> Delete
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
                                <Form.Item
                                    label="From Date"
                                    name="purchase_date_from"
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
                                    name="purchase_date_to"
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
                                label="Purchase Date Range"
                                name="purchase_date_range"
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
                pagination={{ pageSize: 10, simple: true }}
                scroll={{ x: 'max-content' }}
                rowKey="purchase_id"
            />
        </div>
    );
};

export default PurchaseTable;