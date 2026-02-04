import type { ExpensesType } from "./expenses.types";
import { Button, Space, Table, Form, Row, Col, DatePicker, Grid } from "antd";
import { DeleteOutlined, EditOutlined, ClearOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

const { useBreakpoint } = Grid;

interface Props{
    data: ExpensesType[];
    onEdit: (expenses: ExpensesType) => void;
    onDelete: (expenses: ExpensesType) => void;
}

const ExpensesTable: React.FC<Props> = ({data, onEdit, onDelete}) => {
    const [form] = Form.useForm();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const columns: ColumnsType<ExpensesType> = [
        {
            title: "Expenses ID",
            dataIndex: "expenses_id",
            align: "center",
            key: "expenses_id",
            sorter: (a, b) => a.expenses_id - b.expenses_id,
            defaultSortOrder: 'ascend',
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            align: "center",
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            align: "center",
        },
        {
            title: "Date",
            dataIndex: "expenses_date",
            key: "expenses_date",
            align: "center",
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            align: "center",
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
                        <DeleteOutlined /> Delete
                    </Button>
                </Space>
            )
        }  
    ];

    return(
        <div style={{ overflow: 'visible', minHeight: '600px' }}>
            <Form form={form} layout="vertical" requiredMark={false}>
                <Row gutter={16} align="bottom">  
                    {isMobile ? (
                        <>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    label="From Date"
                                    name="expenses_date_from"
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
                                    name="expenses_date_to"
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
                        <Col xs={24} sm={24} md={18}>
                            <Form.Item
                                label="Expenses Date Range"
                                name="expenses_date_range"
                            >
                                <DatePicker.RangePicker 
                                    placeholder={["From date", "To date"]}
                                    format="YYYY-MM-DD"
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
                rowKey="expenses_id"
                pagination={{pageSize: 10, simple: true}}
                scroll={{x: 'max-content'}}
            />
        </div>
    );
};

export default ExpensesTable;