import type { ExpensesType } from "./expenses.types";
import { 
  Button, 
  Card, 
  Col, 
  DatePicker, 
  Form, 
  Grid, 
  Row, 
  Space, 
  Pagination,
  Typography,
  Divider,
  Empty,
  Tag
} from "antd";
import { 
  ClearOutlined, 
  DeleteOutlined, 
  EditOutlined,
  CalendarOutlined,
  DollarOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const { useBreakpoint } = Grid;
const { Text, Title } = Typography;

interface Props {
  data: ExpensesType[];
  onEdit: (expenses: ExpensesType) => void;
  onDelete: (expenses: ExpensesType) => void;
}

const ExpensesTable: React.FC<Props> = ({ data, onEdit, onDelete }) => {
  const [form] = Form.useForm();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6; 
  
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = data.slice(startIndex, endIndex);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Office': 'blue',
      'Travel': 'green',
      'Utilities': 'orange',
      'Supplies': 'purple',
      'Marketing': 'magenta',
      'Equipment': 'cyan',
      'Maintenance': 'gold',
      'Other': 'default'
    };
    return colors[category] || 'default';
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div style={{ minHeight: '300px' }}>
      {/* Filter date section */}
      <Card 
        style={{ 
          marginBottom: 24, 
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <Form form={form} layout="vertical" requiredMark={false}>
          <Row gutter={16} align="bottom">
            {isMobile ? (
              <>
                <Col xs={24} sm={12}>
                  <Form.Item label="From Date" name="expenses_date_from">
                    <DatePicker
                      placeholder="From date"
                      format="YYYY-MM-DD"
                      style={{ width: '100%' }}
                      suffixIcon={<CalendarOutlined />}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item label="To Date" name="expenses_date_to">
                    <DatePicker
                      placeholder="To date"
                      format="YYYY-MM-DD"
                      style={{ width: '100%' }}
                      suffixIcon={<CalendarOutlined />}
                    />
                  </Form.Item>
                </Col>
              </>
            ) : (
              <Col xs={24} sm={24} md={8}>
                <Form.Item label="Expenses Date Range" name="expenses_date_range">
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
                  style={{ width: '100%' }}
                >
                  Clear Filter
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Cards Grid */}
      {paginatedData.length === 0 ? (
        <Card style={{ borderRadius: 12 }}>
          <Empty description="No expenses found" />
        </Card>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {paginatedData.map((expense) => (
              <Col xs={24} sm={24} md={12} key={expense.expenses_id}>
                <Card
                  hoverable
                  style={{
                    borderRadius: 12,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    height: '100%',
                  }}
                  styles={{
                    body:{ padding: '20px' }}
                }
                  className="expense-card"
                >
                  {/* Card Header */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: 16 
                  }}>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Expense ID
                      </Text>
                      <Title level={4} style={{ margin: '4px 0' }}>
                        {expense.expenses_id}
                      </Title>
                    </div>
                    <Tag 
                      color={getCategoryColor(expense.category)} 
                      style={{ 
                        fontSize: 13, 
                        padding: '4px 12px',
                        borderRadius: 16,
                        fontWeight: 500
                      }}
                    >
                      {expense.category}
                    </Tag>
                  </div>

                  <Divider style={{ margin: '16px 0' }} />

                  {/* Card Content */}
                  <Space orientation="vertical" size={12} style={{ width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <FileTextOutlined style={{ 
                        fontSize: 16, 
                        color: '#1890ff', 
                        marginRight: 8,
                        marginTop: 2
                      }} />
                      <div style={{ flex: 1 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>Description</Text>
                        <div>
                          <Text strong>{expense.description}</Text>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarOutlined style={{ 
                        fontSize: 16, 
                        color: '#52c41a', 
                        marginRight: 8 
                      }} />
                      <div style={{ flex: 1 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>Date</Text>
                        <div>
                          <Text>{expense.expenses_date}</Text>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <DollarOutlined style={{ 
                        fontSize: 16, 
                        color: '#faad14', 
                        marginRight: 8 
                      }} />
                      <div style={{ flex: 1 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>Amount</Text>
                        <div>
                          <Text strong style={{ fontSize: 16, color: '#faad14' }}>
                            ${typeof expense.amount === 'number' 
                              ? expense.amount.toFixed(2) 
                              : parseFloat(expense.amount).toFixed(2)}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </Space>

                  <Divider style={{ margin: '16px 0' }} />

                  {/* Card Actions */}
                  <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => onEdit(expense)}
                    >
                      Edit
                    </Button>
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => onDelete(expense)}
                    >
                      Delete
                    </Button>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          <div style={{ 
            marginTop: 24, 
            display: "flex",
            justifyContent: "center",
            padding: '16px 0',
          }}>
            <Pagination
              current={currentPage}
              total={data.length}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger={false}
              showTotal={(total, range) => 
                `${range[0]}-${range[1]} of ${total} expenses`
              }
            />
          </div>
        </>
      )}

      <style>{`
        .expense-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.12) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default ExpensesTable;