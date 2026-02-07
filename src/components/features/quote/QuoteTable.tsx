import type { QuoteType } from "./quote.types";
import { 
  Button, 
  Card, 
  Col, 
  DatePicker, 
  Form, 
  Grid, 
  Row, 
  Select, 
  Space, 
  Tag, 
  Pagination,
  Typography,
  Divider,
  Empty
} from "antd";
import { 
  ClearOutlined, 
  DeleteOutlined, 
  EditOutlined,
  CalendarOutlined,
  DollarOutlined,
  FileTextOutlined,
  TagOutlined,
  EyeOutlined
} from "@ant-design/icons";
import { useState } from "react";

const { useBreakpoint } = Grid;
const { Text, Title } = Typography;

interface Props {
  data: QuoteType[];
  onView: (quote: QuoteType) => void;
  onEdit: (quote: QuoteType) => void;
  onDelete: (quote: QuoteType) => void;
}

const QuoteTable: React.FC<Props> = ({ data,onView ,onEdit, onDelete }) => {
  const [form] = Form.useForm();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = data.slice(startIndex, endIndex);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "green";
      case "Pending":
      case "Pendding":
        return "gold";
      case "Denied":
        return "red";
      default:
        return "default";
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div style={{ minHeight: '300px' }}>
      {/* Filter date and status section */}
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
                  <Form.Item label="From Date" name="quote_date_from">
                    <DatePicker
                      placeholder="From date"
                      format="YYYY-MM-DD"
                      style={{ width: '100%' }}
                      suffixIcon={<CalendarOutlined />}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item label="To Date" name="quote_date_to">
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
              <Col xs={24} sm={24} md={10}>
                <Form.Item label="Quote Date Range" name="quote_date_range">
                  <DatePicker.RangePicker
                    placeholder={["From date", "To date"]}
                    format="YYYY-MM-DD"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            )}

            <Col xs={24} sm={12} md={6}>
              <Form.Item label="Status" name="status">
                <Select placeholder="Select quote status" allowClear>
                  <Select.Option value="1">Approved</Select.Option>
                  <Select.Option value="2">Pending</Select.Option>
                  <Select.Option value="3">Denied</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={4}>
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
          <Empty description="No quotes found" />
        </Card>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {paginatedData.map((quote) => (
              <Col xs={24} sm={24} md={12} key={quote.quote_id}>
                <Card
                  hoverable
                  style={{
                    borderRadius: 12,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    height: '100%',
                  }}
                  styles={{
                    body: { padding: '20px' }
                  }}

                  className="quote-card"
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
                        Quote ID
                      </Text>
                      <Title level={4} style={{ margin: '4px 0' }}>
                        {quote.quote_id}
                      </Title>
                    </div>
                    <Tag 
                      color={getStatusColor(quote.status)} 
                      style={{ 
                        fontSize: 13, 
                        padding: '4px 12px',
                        borderRadius: 16,
                        fontWeight: 500
                      }}
                    >
                      {quote.status}
                    </Tag>
                  </div>

                  <Divider style={{ margin: '16px 0' }} />

                  {/* Card Content */}
                  <Space orientation="vertical" size={12} style={{ width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <FileTextOutlined style={{ 
                        fontSize: 16, 
                        color: '#1890ff', 
                        marginRight: 8 
                      }} />
                      <div style={{ flex: 1 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>Item</Text>
                        <div>
                          <Text strong>{quote.item}</Text>
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
                          <Text>{quote.quote_date}</Text>
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
                        <Text type="secondary" style={{ fontSize: 12 }}>Total Amount</Text>
                        <div>
                          <Text strong style={{ fontSize: 16, color: '#faad14' }}>
                            ${typeof quote.total_amount === 'number' 
                              ? quote.total_amount.toFixed(2) 
                              : parseFloat(quote.total_amount).toFixed(2)}
                          </Text>
                        </div>
                      </div>
                    </div>

                    {quote.notes && (
                      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                        <TagOutlined style={{ 
                          fontSize: 16, 
                          color: '#8c8c8c', 
                          marginRight: 8,
                          marginTop: 2
                        }} />
                        <div style={{ flex: 1 }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>Notes</Text>
                          <div>
                            <Text style={{ fontSize: 13 }}>{quote.notes}</Text>
                          </div>
                        </div>
                      </div>
                    )}
                  </Space>

                  <Divider style={{ margin: '16px 0' }} />

                  {/* Card actions */}
                  <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                    <Button type="primary" onClick={() => onView(quote)}>
                    <EyeOutlined /> View
                  </Button>
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => onEdit(quote)}
                    >
                      Edit
                    </Button>
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => onDelete(quote)}
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
            padding: '16px 0',
            display: 'flex',
            justifyContent: 'center',
          }}>
            <Pagination
              current={currentPage}
              total={data.length}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger={false}
              showTotal={(total, range) => 
                `${range[0]}-${range[1]} of ${total} quotes`
              }
            />
          </div>
        </>
      )}

      <style>{`
        .quote-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.12) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default QuoteTable;