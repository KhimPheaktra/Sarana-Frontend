import type { QuoteType } from "./quote.types";
import { Button, Card, Divider, Grid, Space, Tag, Typography } from "antd";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  DollarOutlined,
  EditOutlined,
  FileAddOutlined,
  FileTextOutlined,
  PrinterOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { PrintQuote } from "./PrintQuote";

const { useBreakpoint } = Grid;
const { Text, Title } = Typography;

interface QuoteCardProps {
  quote: QuoteType;
  loadingQuotes: Record<number, boolean>;
  isInvoiceGenerated: (quote: QuoteType) => boolean;
  getStatusColor: (status: string) => string;
  onGenerateInvoice: (quote: QuoteType) => void;
  onEdit: (quote: QuoteType) => void;
  onDelete: (quote: QuoteType) => void;
}

const QuoteCardContent: React.FC<QuoteCardProps> = ({
  quote,
  loadingQuotes,
  isInvoiceGenerated,
  getStatusColor,
  onGenerateInvoice,
  onEdit,
  onDelete,
}) => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  return (
    <Card
      hoverable
      style={{
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        transition: "all 0.3s ease",
        height: "100%",
      }}
      styles={{ body: { padding: "20px" } }}
      className="quote-card"
    >
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        {/* Row 1: ID + Tags */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 8,
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Id
            </Text>
            <Title level={4} style={{ margin: "4px 0" }}>
              {quote.quote_id}
            </Title>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <Tag
              color={getStatusColor(quote.quote_to)}
              style={{
                fontSize: 14,
                padding: "4px 12px",
                borderRadius: 16,
                fontWeight: 500,
                margin: 0,
              }}
            >
              {quote.quote_to}
            </Tag>
            <Tag
              color={getStatusColor(quote.status)}
              style={{
                fontSize: 13,
                padding: "4px 12px",
                borderRadius: 16,
                fontWeight: 500,
                margin: 0,
              }}
            >
              {quote.status}
            </Tag>
          </div>
        </div>

        {/* Row 2: Generate Invoice (Approved only) */}
        {quote.status === "Approved" && (
          <div style={{ marginTop: 4 }}>
            {isInvoiceGenerated(quote) ? (
              <Button
                style={{
                  backgroundColor: "#52c41a",
                  borderColor: "#52c41a",
                  color: "white",
                }}
                icon={<CheckCircleOutlined />}
                disabled
              >
                Generated
              </Button>
            ) : (
              <Button
                type="primary"
                loading={loadingQuotes[quote.quote_id]}
                icon={
                  !loadingQuotes[quote.quote_id] ? (
                    <FileAddOutlined />
                  ) : undefined
                }
                onClick={() => onGenerateInvoice(quote)}
              >
                {loadingQuotes[quote.quote_id] ? "Generating..." : "Generate Invoice"}
              </Button>
            )}
          </div>
        )}
      </div>

      <Divider style={{ margin: "16px 0" }} />

      {/* Content */}
      <Space direction="vertical" size={12} style={{ width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <FileTextOutlined
            style={{ fontSize: 16, color: "#1890ff", marginRight: 8 }}
          />
          <div style={{ flex: 1 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Item
            </Text>
            <div>
              <Text strong>{quote.item}</Text>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <CalendarOutlined
            style={{ fontSize: 16, color: "#52c41a", marginRight: 8 }}
          />
          <div style={{ flex: 1 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Date
            </Text>
            <div>
              <Text>{quote.quote_date}</Text>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <DollarOutlined
            style={{ fontSize: 16, color: "#faad14", marginRight: 8 }}
          />
          <div style={{ flex: 1 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Total Amount
            </Text>
            <div>
              <Text strong style={{ fontSize: 16, color: "#faad14" }}>
                $
                {typeof quote.total_amount === "number"
                  ? quote.total_amount.toFixed(2)
                  : parseFloat(quote.total_amount).toFixed(2)}
              </Text>
            </div>
          </div>
        </div>

        {quote.notes && (
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <TagOutlined
              style={{
                fontSize: 16,
                color: "#8c8c8c",
                marginRight: 8,
                marginTop: 2,
              }}
            />
            <div style={{ flex: 1 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Notes
              </Text>
              <div>
                <Text style={{ fontSize: 13 }}>{quote.notes}</Text>
              </div>
            </div>
          </div>
        )}
      </Space>

      <Divider style={{ margin: "16px 0" }} />

      {/* Actions */}
      <Space
        style={{
          width: "100%",
          justifyContent: isMobile ? "space-between" : "flex-end",
        }}
      >
        <Button
          type="primary"
          style={{ backgroundColor: "#ff14e7", color: "white" }}
          icon={<PrinterOutlined />}
          onClick={() => PrintQuote(quote)}
        >
          {!isMobile && "Print"}
        </Button>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => onEdit(quote)}
        >
          {!isMobile && "Edit"}
        </Button>
        <Button danger icon={<DeleteOutlined />} onClick={() => onDelete(quote)}>
          {!isMobile && "Delete"}
        </Button>
      </Space>
    </Card>
  );
};

export default QuoteCardContent;