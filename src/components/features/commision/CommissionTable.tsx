import type { ColumnsType } from "antd/es/table";
import type { CommissionType } from "./commission.types";
import { Button, Col, DatePicker, Form, Grid, Row, Space, Table } from "antd";
import { ClearOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";

const { useBreakpoint } = Grid;

interface Props{
    data: CommissionType[];
    onEdit: (commission: CommissionType) => void;
    onDelete: (commission: CommissionType) => void;
}

const CommissionTable:React.FC<Props> = ({ data, onEdit, onDelete }) => {
    const [form] = Form.useForm();
    const screens = useBreakpoint();
    const isMobile = !screens.md; 
    const columns: ColumnsType<CommissionType> = [
        {
            title: "ID",
            dataIndex: "commission_id",
            key: "commission_id",
            align: "center",
            sorter: (a, b) => a.commission_id - b.commission_id,
            defaultSortOrder: 'ascend',
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            align: "center",
        },
        {
            title: "Date",
            dataIndex: "commission_date",
            key: "commission_date",
            align: "center",  
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            align: "center",
        },
        {
            title: "Engineer",
            dataIndex: "engineer",
            key: "engineer",
        },
        {
            title: "Actions",
            key: "actions",
            align: "center",
            render: (_, record) => (
                <Space>
                    <Button type="primary" onClick={() => onEdit(record)}>
                        <EditOutlined /> Edit
                    </Button>
                    <Button danger onClick={() => onDelete(record)}>
                        <DeleteOutlined />    
                        Delete
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
                    name="payment_date_from"
                >
                    <DatePicker 
                    placeholder="From date"
                    format="YYYY-MMMM-DD"
                    style={{ width: '100%' }}
                    />
                </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                <Form.Item
                    label="To Date"
                    name="payment_date_to"
                >
                    <DatePicker 
                    placeholder="To date"
                    format="YYYY-MMMM-DD"
                    style={{ width: '100%' }}
                    />
                </Form.Item>
                </Col>
            </>
            ) : (
            <Col xs={24} sm={24} md={8}>
                <Form.Item
                label="Payment Date Range"
                name="payment_date_range"
                >
                <DatePicker.RangePicker 
                    placeholder={["From date", "To date"]}
                    format="YYYY-MMMM-DD"
                    style={{ width: '100%' }}
                />
                </Form.Item>
            </Col>
            )}
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
            pagination={{ pageSize: 10, simple: true }}
            rowKey="commission_id"
            scroll={{x: 'max-content'}}
            />

        </div>
    )
};

export default CommissionTable;
