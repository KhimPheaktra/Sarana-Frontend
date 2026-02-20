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
  Pagination,
  Empty
} from "antd";
import { CalendarOutlined, ClearOutlined } from "@ant-design/icons";
import { useState } from "react";
import { generateQuoteInvoice } from "../invoice/GenerateQuoteInvoice";
import { useSales } from "../sales/SaleContext";

import QuoteCardContent from "./QuoteCardContent";

const { useBreakpoint } = Grid;


interface Props {
  data: QuoteType[];
  onEdit: (quote: QuoteType) => void;
  onDelete: (quote: QuoteType) => void;
  onClose?: () => void;
}

const QuoteTable: React.FC<Props> = ({ data, onEdit, onDelete }) => {
  const [form] = Form.useForm();
  const { invoices, setInvoices, setQuotes } = useSales();
  const screens = useBreakpoint();
  const [loadingQuotes, setLoadingQuotes] = useState<Record<number, boolean>>({});
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
  const animationGen = async (quote: QuoteType) => {
    setLoadingQuotes(prev => ({ ...prev, [quote.quote_id]: true }));
    await new Promise(res => setTimeout(res, 1500));
    handleGenerateInvoice(quote);
    quoteApprove(quote.quote_id);
    setLoadingQuotes(prev => ({ ...prev, [quote.quote_id]: false }));

  }
  const isInvoiceGenerated = (quote: QuoteType) => {
    return invoices.some(inv => inv.quote_id === quote.quote_id);
  };

  const handleGenerateInvoice = (quote: QuoteType) => {
    generateQuoteInvoice(quote, invoices, setInvoices);
  };

  const quoteApprove = (quote_id: number) => {
    setQuotes(prev =>
      prev.map(q => (q.quote_id === quote_id ? { ...q, status: "Approved" } : q))
    );
  };

  return (
     <div style={{ overflow: 'visible', minHeight: '600px' }}>
        <Form form={form} layout="vertical" requiredMark={false}>
          <Row gutter={16} align="bottom">
            {isMobile ? (
              <>
                <Col xs={24} sm={12}>
                  <Form.Item label="From Date" name="quote_date_from">
                    <DatePicker
                      placeholder="From date"
                      format="YYYY-MMMM-DD"
                      style={{ width: '100%' }}
                      suffixIcon={<CalendarOutlined />}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item label="To Date" name="quote_date_to">
                    <DatePicker
                      placeholder="To date"
                      format="YYYY-MMMM-DD"
                      style={{ width: '100%' }}
                      suffixIcon={<CalendarOutlined />}
                    />
                  </Form.Item>
                </Col>
              </>
            ) : (
              <Col xs={24} sm={24} md={8}>
                <Form.Item label="Quote Date Range" name="quote_date_range">
                  <DatePicker.RangePicker
                    placeholder={["From date", "To date"]}
                    format="YYYY-MMMM-DD"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            )}

            <Col xs={24} sm={12} md={4}>
              <Form.Item label="Status" name="status">
                <Select placeholder="Select quote status" allowClear>
                  <Select.Option value="1">Approved</Select.Option>
                  <Select.Option value="2">Pending</Select.Option>
                  <Select.Option value="3">Denied</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={3}>
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
      {paginatedData.length === 0 ? (
        <Card style={{ borderRadius: 12 }}>
          <Empty description="No quotes found" />
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {paginatedData.map((quote) => (
            <Col xs={24} sm={24} md={12} key={quote.quote_id}>
              <QuoteCardContent
                quote={quote}
                loadingQuotes={loadingQuotes}
                isInvoiceGenerated={isInvoiceGenerated}
                getStatusColor={getStatusColor}
                onGenerateInvoice={animationGen}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </Col>
          ))}
        </Row>
      )}

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