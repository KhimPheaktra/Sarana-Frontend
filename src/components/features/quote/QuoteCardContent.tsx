import type { QuoteType } from "./quote.types";
import { Button, Card, Divider, Grid, Space, Tag, Typography } from "antd";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  DollarOutlined,
  EditOutlined,
  EyeOutlined,
  FileAddOutlined,
  FileTextOutlined,
  TagOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";

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
  onView: (quote: QuoteType) => void;
}

const QuoteCardContent: React.FC<QuoteCardProps> = ({
  quote,
  loadingQuotes,
  isInvoiceGenerated,
  getStatusColor,
  onGenerateInvoice,
  onEdit,
  onDelete,
  onView,
}) => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const { t } = useTranslation(["quote", "common"]);

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
        {/* ID + Tags */}
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
              {t("quote.id", { ns: "quote" })}
            </Text>
            <Title level={4} style={{ margin: "4px 0" }}>
              {quote.quote_id}
            </Title>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <Tag
              color={getStatusColor(quote.quote_to)}
              style={{ fontSize: 14, padding: "4px 12px", borderRadius: 16, fontWeight: 500, margin: 0 }}
            >
              {quote.quote_to}
            </Tag>
            <Tag
              color={getStatusColor(quote.status)}
              style={{ fontSize: 13, padding: "4px 12px", borderRadius: 16, fontWeight: 500, margin: 0 }}
            >
              {quote.status}
            </Tag>
          </div>
        </div>

        {/* Generate Invoice (Approved only) */}
        {quote.status === "Approved" && (
          <div style={{ marginTop: 4 }}>
            {isInvoiceGenerated(quote) ? (
              <Button
                style={{ backgroundColor: "#52c41a", borderColor: "#52c41a", color: "white" }}
                icon={<CheckCircleOutlined />}
                disabled
              >
                {t("button.generated", { ns: "quote" })}
              </Button>
            ) : (
              <Button
                type="primary"
                loading={loadingQuotes[quote.quote_id]}
                icon={!loadingQuotes[quote.quote_id] ? <FileAddOutlined /> : undefined}
                onClick={() => onGenerateInvoice(quote)}
              >
                {loadingQuotes[quote.quote_id]
                  ? t("button.generating", { ns: "quote" })
                  : t("button.generateInvoice", { ns: "quote" })}
              </Button>
            )}
          </div>
        )}
      </div>

      <Divider style={{ margin: "16px 0" }} />

      {/* Content */}
      <Space orientation="vertical" size={12} style={{ width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <FileTextOutlined style={{ fontSize: 16, color: "#1890ff", marginRight: 8 }} />
          <div style={{ flex: 1 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {t("quote.item", { ns: "quote" })}
            </Text>
            <div>
              {quote.items.map((row, i) => (
                <Text key={i} strong style={{ display: "block" }}>
                  {row.item_name}
                </Text>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <CalendarOutlined style={{ fontSize: 16, color: "#52c41a", marginRight: 8 }} />
          <div style={{ flex: 1 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {t("quote.date", { ns: "quote" })}
            </Text>
            <div>
              <Text>{quote.quote_date}</Text>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <DollarOutlined style={{ fontSize: 16, color: "#faad14", marginRight: 8 }} />
          <div style={{ flex: 1 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {t("quote.totalAmount", { ns: "quote" })}
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

        {quote.engineer && (
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <UserOutlined style={{ fontSize: 16, color: "#8c8c8c", marginRight: 8, marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {t("quote.engineer", { ns: "quote" })}
              </Text>
              <div>
                <Text style={{ fontSize: 13 }}>{quote.engineer}</Text>
              </div>
            </div>
          </div>
        )}

        {quote.notes && (
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <TagOutlined style={{ fontSize: 16, color: "#8c8c8c", marginRight: 8, marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {t("quote.notes", { ns: "quote" })}
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
      <Space style={{ width: "100%", justifyContent: isMobile ? "space-between" : "flex-end" }}>
        <Button type="primary" icon={<EyeOutlined />} onClick={() => onView(quote)}>
          {!isMobile && t("button.view", { ns: "common" })}
        </Button>
        <Button type="primary" icon={<EditOutlined />} onClick={() => onEdit(quote)}>
          {!isMobile && t("button.edit", { ns: "common" })}
        </Button>
        <Button danger icon={<DeleteOutlined />} onClick={() => onDelete(quote)}>
          {!isMobile && t("button.delete", { ns: "common" })}
        </Button>
      </Space>
    </Card>
  );
};

export default QuoteCardContent;