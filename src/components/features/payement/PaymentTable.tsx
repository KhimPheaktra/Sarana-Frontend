import type { PaymentType } from "./payment.types";
import { Button, Col, DatePicker, Form, Row, Select, Space, Table, Tag, Grid } from "antd";
import { ClearOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

const { useBreakpoint } = Grid;

interface Props {
  data: PaymentType[];
  onEdit: (payment: PaymentType) => void;
  onDelete: (payment: PaymentType) => void;
}

const PaymentTable: React.FC<Props> = ({ data, onEdit, onDelete }) => {
  const [form] = Form.useForm();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const renderItems = (record: PaymentType, render: (item: any) => React.ReactNode) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {record.payments.map((item, index) => (
        <div key={index} style={{ lineHeight: "22px" }}>
          {render(item)}
        </div>
      ))}
    </div>
  );
  const columns: ColumnsType<PaymentType> = [
    {
      title: "ID",
      dataIndex: "payment_id",
      key: "payment_id",
      align: "center",
      sorter: (a, b) => a.payment_id - b.payment_id,
      defaultSortOrder: "ascend",
    },
    {
      title: "Customer / Supplier",
      dataIndex: "customer_name",
      key: "customer_name",
      align: "center",
      render: (_: any, record: any) => (
        record.customer_name || record.supplier_name || "—"
      ),
    },
    {
      title: "Reference",
      dataIndex: "reference_id",
      key: "reference_id",
      align: "center",
    },
    {
      title: "Item",
      key: "item_name",
      align: "center",
      render: (_, record) => renderItems(record, (item) => item.item_name),
    },
    {
      title: "Qty",
      key: "qty",
      align: "center",
      render: (_, record) => renderItems(record, (item) => item.qty),
    },
    {
      title: "Unit Price",
      key: "unit_price",
      align: "center",
      render: (_, record) =>
        renderItems(record, (item) =>
          new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(item.unit_price)
        ),
    },
    {
      title: "Total",
      dataIndex: "total_amount",
      key: "total_amount",
      align: "center",
      render: (value: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value),
    },
    {
      title: "Date",
      dataIndex: "payment_date",
      key: "payment_date",
      align: "center",
    },
    {
      title: "Payment",
      dataIndex: "payment_type",
      key: "payment_type",
      align: "center",
    },
    {
      title: "Payment Detail",
      dataIndex: "payment_detail",
      key: "payment_detail",
      align: "center",
      render: (_, payment_detail) => {
        return (
          <Space size={"small"}>
            <Button size="small" icon={<EyeOutlined />} onClick={() => { payment_detail }} />
          </Space>
        )
      }

    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => (
        <Tag color={status === "Completed" ? "green" : status === "Pending" ? "yellow" : "default"}>
          {status}
        </Tag>
      ),
    },
    // {
    //   title: "Partial",
    //   dataIndex: "partial_percentage",
    //   key: "partial_percentage",
    //   align: "center",
    // },
    {
      title: "Engineer",
      dataIndex: "engineer",
      key: "engineer",
      align: "center",
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      align: "center",
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space size={"small"}>
          <Button size={"small"} type="primary" onClick={() => onEdit(record)}>
            <EditOutlined /> Edit
          </Button>
          <Button size={"small"} danger onClick={() => onDelete(record)}>
            <DeleteOutlined /> Delete
          </Button>
        </Space>
      ),
    },
  ];


  return (
    <div style={{ overflow: 'visible', minHeight: '600px' }}>
      <Form form={form} layout="vertical" requiredMark={false}>
        <Row gutter={16} align="bottom">
          {isMobile ? (
            <>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="From Date"
                  name="payment_date_from"
                >
                  <DatePicker
                    placeholder="From date"
                    format="YYYY-MMMM-DD"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label="To Date"
                  name="payment_date_to"
                >
                  <DatePicker
                    placeholder="To date"
                    format="YYYY-MMMM-DD"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </>
          ) : (
            <Col xs={24} sm={24} md={8}>
              <Form.Item
                label="Payment Date Range"
                name="payment_date_range"
              >
                <DatePicker.RangePicker
                  placeholder={["From date", "To date"]}
                  format="YYYY-MMMM-DD"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          )}

          <Col xs={24} sm={12} md={5}>
            <Form.Item
              label="Status"
              name="status"
            >
              <Select placeholder="Select status">
                <Select.Option value="1">Pending</Select.Option>
                <Select.Option value="2">Completed</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={5}>
            <Form.Item
              label="Payment Type"
              name="payment_type"
            >
              <Select placeholder="Select payment type">
                <Select.Option value="1">Cash</Select.Option>
                <Select.Option value="2">Credit Card</Select.Option>
                <Select.Option value="3">Bakor</Select.Option>
              </Select>
            </Form.Item>
          </Col>

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
        size="small"
        rowKey="payment_id"
        pagination={{ pageSize: 10, simple: true }}
        scroll={{ x: 'max-content' }}
        locale={{ emptyText: "No Payment Found" }}
        components={{
          body: {
            cell: (props: any) => (
              <td
                {...props}
                style={{
                  ...props.style,
                  verticalAlign: "middle",
                  padding: "8px 12px",
                }}
              />
            ),
          },
        }}
      />
    </div>
  );
};

export default PaymentTable;