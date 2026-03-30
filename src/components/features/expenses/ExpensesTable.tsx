import type { ExpensesType } from "./expenses.types";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Grid,
  Row,
} from "antd";
import {
  ClearOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import ExpenseCardContent from "./ExpensesCardContent";
import { useTranslation } from "react-i18next";

const { useBreakpoint } = Grid;

interface Props {
  data: ExpensesType[];
  onEdit: (expenses: ExpensesType) => void;
  onDelete: (expenses: ExpensesType) => void;
}

const ExpensesTable: React.FC<Props> = ({ data, onEdit, onDelete }) => {
  const [form] = Form.useForm();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const { t } = useTranslation(["expenses", "common"]);
  const [currentPage] = useState(1);
  const pageSize = 6;

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = data.slice(startIndex, endIndex);

  return (
    <div style={{ overflow: "visible", minHeight: "600px" }}>
      {/* Filter date section */}
      <Form form={form} layout="vertical" requiredMark={false}>
        <Row gutter={16} align="bottom">
          {isMobile ? (
            <>
              <Col xs={24} sm={12}>
                <Form.Item label={t("filterDate.from_date", { ns: "common" })} name="expenses_date_from">
                  <DatePicker
                    placeholder={t("filterDate.from_date", { ns: "common" })}
                    format="YYYY-MMMM-DD"
                    style={{ width: "100%" }}
                    suffixIcon={<CalendarOutlined />}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label={t("filterDate.to_date", { ns: "common" })} name="expenses_date_to">
                  <DatePicker
                    placeholder={t("filterDate.to_date", { ns: "common" })}
                    format="YYYY-MMMM-DD"
                    style={{ width: "100%" }}
                    suffixIcon={<CalendarOutlined />}
                  />
                </Form.Item>
              </Col>
            </>
          ) : (
            <Col xs={24} sm={24} md={8}>
              <Form.Item label={t("expenses.dateRange", { ns: "expenses" })} name="expenses_date_range">
                <DatePicker.RangePicker
                  placeholder={[
                    t("filterDate.from_date", { ns: "common" }),
                    t("filterDate.to_date", { ns: "common" }),
                  ]}
                  format="YYYY-MMMM-DD"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          )}

          <Col xs={24} sm={12} md={2}>
            <Form.Item>
              <Button
                onClick={() => form.resetFields()}
                icon={<ClearOutlined />}
                block={isMobile}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      {paginatedData.map((expense) => (
        <Col xs={24} sm={24} md={12} key={expense.expenses_id}>
          <ExpenseCardContent
            expense={expense}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </Col>
      ))}

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