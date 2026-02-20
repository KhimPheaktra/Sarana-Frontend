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
import ExpenseCardContent from "./ExpensesCardContent"
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
  
  const [currentPage] = useState(1);
  const pageSize = 6; 
  
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = data.slice(startIndex, endIndex);


  return (
      <div style={{ overflow: 'visible', minHeight: '600px' }}>
      {/* Filter date section */}
        <Form form={form} layout="vertical" requiredMark={false}>
          <Row gutter={16} align="bottom">
            {isMobile ? (
              <>
                <Col xs={24} sm={12}>
                  <Form.Item label="From Date" name="expenses_date_from">
                    <DatePicker
                      placeholder="From date"
                      format="YYYY-MMMM-DD"
                      style={{ width: '100%' }}
                      suffixIcon={<CalendarOutlined />}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item label="To Date" name="expenses_date_to">
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
                <Form.Item label="Expenses Date Range" name="expenses_date_range">
                  <DatePicker.RangePicker
                    placeholder={["From date", "To date"]}
                    format="YYYY-MMMM-DD"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            )}

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