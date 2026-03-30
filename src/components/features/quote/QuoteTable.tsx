import type { QuoteType } from "./quote.types";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Empty,
  Form,
  Grid,
  message,
  Pagination,
  Row,
  Select,
} from "antd";
import { CalendarOutlined, ClearOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useState } from "react";
import { generateQuoteInvoice } from "./GenerateQuoteInvoice";
import { useSales } from "../sales/SaleContext";
import QuoteCardContent from "./QuoteCardContent";
import { useTranslation } from "react-i18next";
import dayjs, { Dayjs } from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
const { useBreakpoint } = Grid;

interface Props {
  data: QuoteType[];
  onEdit: (quote: QuoteType) => void;
  onDelete: (quote: QuoteType) => void;
  onView: (quote: QuoteType) => void;
  onClose?: () => void;
}

const QuoteTable: React.FC<Props> = ({ data, onEdit, onDelete, onView }) => {
  const [form] = Form.useForm();
  const { invoices, setInvoices, setQuotes } = useSales();
  const screens = useBreakpoint();
  const [loadingQuotes, setLoadingQuotes] = useState<Record<number, boolean>>({});
  const isMobile = !screens.md;
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const { t } = useTranslation(["quote", "common"]);
  const [filteredQuote, setFilteredQuote] = useState<QuoteType[]>(data);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredQuote.slice(startIndex, endIndex);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "green";
      case "Pending":
      case "Pendding": return "gold";
      case "Denied": return "red";
      default: return "default";
    }
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  const animationGen = async (quote: QuoteType) => {
    setLoadingQuotes((prev) => ({ ...prev, [quote.quote_id]: true }));
    await new Promise((res) => setTimeout(res, 1500));
    handleGenerateInvoice(quote);
    quoteApprove(quote.quote_id);
    setLoadingQuotes((prev) => ({ ...prev, [quote.quote_id]: false }));
  };

  const isInvoiceGenerated = (quote: QuoteType) =>
    invoices.some((inv) => inv.quote_id === quote.quote_id);

  const handleGenerateInvoice = (quote: QuoteType) => {
    if (!quote.engineer || quote.engineer.trim() === "") {
      message.info("Please assign engineer!");
      return;
    }
    generateQuoteInvoice(quote, invoices, setInvoices);
  };

  const quoteApprove = (quote_id: number) => {
    setQuotes((prev) =>
      prev.map((q) => (q.quote_id === quote_id ? { ...q, status: "Approved" } : q))
    );
  };

  useEffect(() => {
    setFilteredQuote(data);
  }, [data])

  const handleDateChange = useCallback(() => {
    const values = form.getFieldsValue();
    let fromDate: Dayjs | null = null;
    let toDate: Dayjs | null = null;

    if (isMobile) {
      fromDate = values.quote_date_from ?? null;
      toDate = values.quote_date_to ?? null;
    } else {
      if (values.quote_date_range) {
        [fromDate, toDate] = values.quote_date_range;
      }
    }

    if (fromDate && toDate) {
      const filtered = data.filter((quote) => {
        const quoteDate = dayjs(quote.quote_date);
        return (
          quoteDate.isSameOrAfter(fromDate, "day") &&
          quoteDate.isSameOrBefore(toDate, "day")
        );
      });
      setFilteredQuote(filtered);
    } else {
      setFilteredQuote(data);
    }
  }, [form, isMobile, data]);
  const handleStatusChange = useCallback((value: string | undefined) => {
    const filtered = data.filter((quote) => {
      if (!value) return true;
      const statusMap: Record<string, string> = {
        "1": "Approved",
        "2": "Pending",
        "3": "Denied",
      };
      return quote.status === statusMap[value];
    });
    setFilteredQuote(filtered);
  }, [data]);
  const handleClear = useCallback(() => {
    form.resetFields();
    setFilteredQuote(data);
  }, [form, data]);

  return (
    <div style={{ overflow: "visible", minHeight: "600px" }}>
      <Form form={form} layout="vertical" requiredMark={false}>
        <Row gutter={16} align="bottom">
          {isMobile ? (
            <>
              <Col xs={24} sm={12}>
                <Form.Item label={t("filterDate.from_date", { ns: "common" })} name="quote_date_from">
                  <DatePicker
                    placeholder={t("filterDate.from_date", { ns: "common" })}
                    format="YYYY-MMMM-DD"
                    style={{ width: "100%" }}
                    onChange={handleDateChange}
                    suffixIcon={<CalendarOutlined />}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label={t("filterDate.to_date", { ns: "common" })} name="quote_date_to">
                  <DatePicker
                    placeholder={t("filterDate.to_date", { ns: "common" })}
                    format="YYYY-MMMM-DD"
                    style={{ width: "100%" }}
                    onChange={handleDateChange}
                    suffixIcon={<CalendarOutlined />}
                  />
                </Form.Item>
              </Col>
            </>
          ) : (
            <Col xs={24} sm={24} md={8}>
              <Form.Item label={t("quote.dateRange", { ns: "quote" })} name="quote_date_range">
                <DatePicker.RangePicker
                  placeholder={[
                    t("filterDate.from_date", { ns: "common" }),
                    t("filterDate.to_date", { ns: "common" }),
                  ]}
                  format="YYYY-MMMM-DD"
                  style={{ width: "100%" }}
                  onChange={handleDateChange}
                />
              </Form.Item>
            </Col>
          )}

          <Col xs={24} sm={12} md={4}>
            <Form.Item label={t("quote.status", { ns: "quote" })} name="status">
              <Select placeholder={t("placeholder.selectStatus", { ns: "quote" })} allowClear onChange={handleStatusChange}>
                <Select.Option value="1">{t("status.approved", { ns: "quote" })}</Select.Option>
                <Select.Option value="2">{t("status.pending", { ns: "quote" })}</Select.Option>
                <Select.Option value="3">{t("status.denied", { ns: "quote" })}</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={3}>
            <Form.Item>
              <Button
                onClick={handleClear}
                icon={<ClearOutlined />}
                block={isMobile}
                style={{ width: "100%" }}
              >

              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      {paginatedData.length === 0 ? (
        <Card style={{ borderRadius: 12 }}>
          <Empty description={t("table.noData", { ns: "quote" })} />
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
                onView={onView}
              />
            </Col>
          ))}
        </Row>
      )}

      {/* Pagination */}
      <div
        style={{
          marginTop: 24,
          padding: "16px 0",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Pagination
          current={currentPage}
          total={data.length}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger={false}
          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} quotes`}
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