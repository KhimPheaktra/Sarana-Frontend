import type { ExpensesType } from "./expenses.types";
import { Button, Card, Divider, Space, Tag, Typography } from "antd";
import {
  CalendarOutlined,
  DeleteOutlined,
  DollarOutlined,
  EditOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

interface ExpenseCardProps {
  expense: ExpensesType;
  onEdit: (expense: ExpensesType) => void;
  onDelete: (expense: ExpensesType) => void;
}

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    Office: "blue",
    Travel: "green",
    Utilities: "orange",
    Supplies: "purple",
    Marketing: "magenta",
    Equipment: "cyan",
    Maintenance: "gold",
    Other: "default",
  };
  return colors[category] || "default";
};

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onEdit, onDelete }) => {
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
      className="expense-card"
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
        }}
      >
        <div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Expense ID
          </Text>
          <Title level={4} style={{ margin: "4px 0" }}>
            {expense.expenses_id}
          </Title>
        </div>
        <Tag
          color={getCategoryColor(expense.category)}
          style={{
            fontSize: 13,
            padding: "4px 12px",
            borderRadius: 16,
            fontWeight: 500,
          }}
        >
          {expense.category}
        </Tag>
      </div>

      <Divider style={{ margin: "16px 0" }} />

      {/* Content */}
      <Space direction="vertical" size={12} style={{ width: "100%" }}>
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <FileTextOutlined
            style={{ fontSize: 16, color: "#1890ff", marginRight: 8, marginTop: 2 }}
          />
          <div style={{ flex: 1 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Description
            </Text>
            <div>
              <Text strong>{expense.description}</Text>
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
              <Text>{expense.expenses_date}</Text>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <DollarOutlined
            style={{ fontSize: 16, color: "#faad14", marginRight: 8 }}
          />
          <div style={{ flex: 1 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Amount
            </Text>
            <div>
              <Text strong style={{ fontSize: 16, color: "#faad14" }}>
                $
                {typeof expense.amount === "number"
                  ? expense.amount.toFixed(2)
                  : parseFloat(expense.amount).toFixed(2)}
              </Text>
            </div>
          </div>
        </div>
      </Space>

      <Divider style={{ margin: "16px 0" }} />

      {/* Actions */}
      <Space style={{ width: "100%", justifyContent: "flex-end" }}>
        <Button type="primary" icon={<EditOutlined />} onClick={() => onEdit(expense)}>
          Edit
        </Button>
        <Button danger icon={<DeleteOutlined />} onClick={() => onDelete(expense)}>
          Delete
        </Button>
      </Space>
    </Card>
  );
};

export default ExpenseCard;