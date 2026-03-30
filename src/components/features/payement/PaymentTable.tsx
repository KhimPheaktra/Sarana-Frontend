import type { PaymentDetail, PaymentType } from "./payment.types";
import {
  Button, Col, DatePicker, Form, Row, Select,
  Space, Table, Tag, Grid, message,
} from "antd";
import {
  ClearOutlined, DeleteOutlined, EditOutlined, EyeOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import { useAppModal } from "../../../shared/modal/AppModalProvider";
import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useSales } from "../sales/SaleContext";
import AttachPaymentForm, { type AttachEntry } from "./AttachPaymentForm";

const { useBreakpoint } = Grid;

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

interface Props {
  data: PaymentType[];
  onEdit: (payment: PaymentType) => void;
  onDelete: (payment: PaymentType) => void;
  onAddPaymentDetail: (paymentId: number, detail: PaymentDetail) => void;
}

// ── Helpers 
const calcPaid = (p: PaymentType): number =>
  p.payment_details?.reduce((sum, d) => sum + (d.paid_amount ?? 0), 0) ?? 0;

const isFullyPaid = (p: PaymentType): boolean =>
  calcPaid(p) >= p.total_amount;

// ── PaymentTable 
const PaymentTable: React.FC<Props> = ({ data, onEdit, onDelete }) => {
  const [form] = Form.useForm();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const { t } = useTranslation(["payment", "common"]);
  const { openModal, closeModal } = useAppModal();
  const { payments, setPayments } = useSales();
  const [filteredPayments, setFilteredPayments] = useState<PaymentType[]>(data);

  useEffect(() => {
    setFilteredPayments(data);
  }, [data]);

  const renderItems = (
    record: PaymentType,
    render: (item: any) => React.ReactNode
  ) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {record.payments.map((item, index) => (
        <div key={index} style={{ lineHeight: "22px" }}>
          {render(item)}
        </div>
      ))}
    </div>
  );

  // ── View details 
  const openPaymentDetail = (payment: PaymentType) => {
    const paid = calcPaid(payment);
    const remaining = payment.total_amount - paid;

    openModal("view", {
      titleMap: { view: "Payment Details" },
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Summary */}
          <div style={{
            background: "#f9f9f9",
            border: "1px solid #e8e8e8",
            borderRadius: 8,
            padding: "10px 14px",
            fontSize: 13,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#666" }}>Total Amount:</span>
              <span style={{ fontWeight: 600 }}>${payment.total_amount.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#666" }}>Total Paid:</span>
              <span style={{ color: "#52c41a", fontWeight: 600 }}>${paid.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #e8e8e8", paddingTop: 4, marginTop: 4 }}>
              <span style={{ color: "#666" }}>Remaining:</span>
              <span style={{ fontWeight: 700, color: remaining <= 0 ? "#52c41a" : "#ff4d4f" }}>
                {remaining <= 0 ? "✓ Fully Paid" : `$${remaining.toFixed(2)}`}
              </span>
            </div>
          </div>

          {/* Detail entries */}
          {payment.payment_details?.map((d, i) => (
            <div
              key={i}
              style={{ border: "1px solid #f0f0f0", borderRadius: 8, padding: 12 }}
            >
              <div style={{ marginBottom: 6, fontWeight: 500 }}>
                Payment #{i + 1} — ${d.paid_amount.toFixed(2)}
              </div>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>
                {d.payment_date}
              </div>
              {d.image ? (
                <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
                  <img
                    src={d.image}
                    alt="receipt"
                    style={{
                      width: "100%",
                      maxHeight: 200,
                      objectFit: "contain",
                      borderRadius: 4,
                      border: "1px solid #e8e8e8",
                    }}
                  />
                  <div style={{
                    position: "absolute", bottom: 6, right: 6,
                    background: "rgba(0,0,0,0.6)", color: "#fff",
                    borderRadius: 4, padding: "2px 8px",
                    fontSize: 13, fontWeight: 700,
                  }}>
                    ${d.paid_amount.toFixed(2)}
                  </div>
                </div>
              ) : (
                <div style={{
                  background: "#f6ffed", border: "1px solid #b7eb8f",
                  borderRadius: 6, padding: "6px 10px",
                  color: "#389e0d", fontSize: 12,
                  display: "flex", justifyContent: "space-between",
                }}>
                  <span>Cash</span>
                  <span style={{ fontWeight: 700 }}>${d.paid_amount.toFixed(2)}</span>
                </div>
              )}
              {d.note && <div style={{ marginTop: 6, color: "#555" }}>{d.note}</div>}
            </div>
          ))}
        </div>
      ),
      onOk: () => closeModal(),
    });
  };

  // ── Attach modal 
  const openAttachModal = (record: PaymentType) => {
    const alreadyPaid = calcPaid(record);
    const entriesRef = {
      current: [{ image: null, paid_amount: 0, type: "image" }] as AttachEntry[],
    };

    openModal("add", {
      titleMap: { add: "Attach Payment" },
      content: (
        <AttachPaymentForm
          entriesRef={entriesRef}
          totalAmount={record.total_amount}
          alreadyPaid={alreadyPaid}
        />
      ),
      onOk: () => {
        const newDetails: PaymentDetail[] = entriesRef.current.map((e) => ({
          id: Math.random(),
          ref_id: record.payment_id,
          ref_type: "payment" as const,
          paid_amount: e.paid_amount,
          payment_date: dayjs().format("YYYY-MM-DD"),
          ...(e.image ? { image: e.image } : {}),
        }));

        const sessionTotal = entriesRef.current.reduce(
          (sum, e) => sum + e.paid_amount, 0
        );
        const newPaid = alreadyPaid + sessionTotal;
        const fullyPaid = newPaid >= record.total_amount;

        setPayments((prev): PaymentType[] =>
          prev.map((p) =>
            p.payment_id === record.payment_id
              ? {
                  ...p,
                  payment_details: [...(p.payment_details ?? []), ...newDetails],
                  paid_amount: newPaid,
                  // auto-complete status when fully paid
                  status: fullyPaid ? "Completed" : p.status,
                }
              : p
          )
        );

        message.success(
          fullyPaid
            ? "Fully paid! Status set to Completed ✓"
            : `${entriesRef.current.length} payment(s) attached`
        );
        closeModal();
      },
    });
  };

  // ── Filters 
  const handleDateChange = useCallback(() => {
    const values = form.getFieldsValue();
    let fromDate: Date | null = null;
    let toDate: Date | null = null;
    if (isMobile) {
      fromDate = values.payment_date_from ?? null;
      toDate = values.payment_date_to ?? null;
    } else {
      if (values.payment_date_range) {
        [fromDate, toDate] = values.payment_date_range;
      }
    }
    if (fromDate && toDate) {
      setFilteredPayments(
        data.filter((p) => {
          const d = dayjs(p.payment_date);
          return (
            d.isSameOrAfter(fromDate, "day") &&
            d.isSameOrBefore(toDate, "day")
          );
        })
      );
    } else {
      setFilteredPayments(data);
    }
  }, [form, data, isMobile]);

  const handleStatusFilter = (value: string) => {
    if (!value) { setFilteredPayments(data); return; }
    setFilteredPayments(
      data.filter((p) => p.status.toLowerCase() === value.toLowerCase())
    );
  };

  const handlePaymentTypeFilter = (value: string) => {
    if (!value) { setFilteredPayments(data); return; }
    setFilteredPayments(
      data.filter((p) => p.payment_type.toLowerCase() === value.toLowerCase())
    );
  };

  const handleClear = useCallback(() => {
    form.resetFields();
    setFilteredPayments(data);
  }, [form, data]);

  const handleStatusChange = (payment_id: number, newStatus: string) => {
    setPayments(
      payments.map((p) =>
        p.payment_id === payment_id ? { ...p, status: newStatus } : p
      )
    );
    message.success(`Status updated to ${newStatus}`);
  };

  // ── Columns 
  const columns: ColumnsType<PaymentType> = [
    {
      title: t("table.id", { ns: "payment" }),
      dataIndex: "payment_id",
      key: "payment_id",
      align: "center",
      sorter: (a, b) => a.payment_id - b.payment_id,
      defaultSortOrder: "ascend",
    },
    {
      title: t("table.customerSupplier", { ns: "payment" }),
      dataIndex: "customer_name",
      key: "customer_name",
      align: "center",
      render: (_: any, record: any) =>
        record.customer_name || record.supplier_name || "—",
    },
    {
      title: t("table.reference", { ns: "payment" }),
      dataIndex: "reference_id",
      key: "reference_id",
      align: "center",
    },
    {
      title: t("table.item", { ns: "payment" }),
      key: "item_name",
      align: "center",
      render: (_, record) => renderItems(record, (item) => item.item_name),
    },
    {
      title: t("table.qty", { ns: "payment" }),
      key: "qty",
      align: "center",
      render: (_, record) => renderItems(record, (item) => item.qty),
    },
    {
      title: t("table.unitPrice", { ns: "payment" }),
      key: "unit_price",
      align: "center",
      render: (_, record) =>
        renderItems(record, (item) =>
          new Intl.NumberFormat("en-US", {
            style: "currency", currency: "USD",
          }).format(item.unit_price)
        ),
    },
    {
      title: t("table.total", { ns: "payment" }),
      dataIndex: "total_amount",
      key: "total_amount",
      align: "center",
      render: (value: number) =>
        new Intl.NumberFormat("en-US", {
          style: "currency", currency: "USD",
        }).format(value),
    },
    {
      title: t("table.date", { ns: "payment" }),
      dataIndex: "payment_date",
      key: "payment_date",
      align: "center",
    },
    {
      title: t("table.payment", { ns: "payment" }),
      dataIndex: "payment_type",
      key: "payment_type",
      align: "center",
    },
    // ── Paid tracker column 
    {
      title: "Paid / Remaining",
      key: "paid_tracker",
      align: "center",
      render: (_, record) => {
        const paid = calcPaid(record);
        const remaining = record.total_amount - paid;
        const pct = Math.min(100, (paid / record.total_amount) * 100);
        const fully = remaining <= 0;

        return (
          <div style={{ fontSize: 12, minWidth: 100 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#52c41a", fontWeight: 600 }}>
                ${paid.toFixed(2)}
              </span>
              <span style={{ color: fully ? "#52c41a" : "#ff4d4f", fontWeight: 600 }}>
                {fully ? "✓ Done" : `-$${remaining.toFixed(2)}`}
              </span>
            </div>
            {/* Progress bar */}
            <div style={{
              marginTop: 4, height: 4, borderRadius: 2,
              background: "#f0f0f0", overflow: "hidden",
            }}>
              <div style={{
                height: "100%",
                width: `${pct}%`,
                background: fully ? "#52c41a" : "#1677ff",
                borderRadius: 2,
                transition: "width 0.3s",
              }} />
            </div>
          </div>
        );
      },
    },
    // ── Payment detail / attach column ─────────────────────────────────────
    {
      title: t("table.paymentDetail", { ns: "payment" }),
      key: "payment_detail",
      align: "center",
      render: (_, record) => {
        const hasDetails = (record.payment_details?.length ?? 0) > 0;
        const count = record.payment_details?.length ?? 0;
        const fully = isFullyPaid(record);

        return (
          <Space size="small">
            {/* Hide "Add" button when fully paid */}
            {!fully && (
              <Button
                size="small"
                type={hasDetails ? "default" : "primary"}
                onClick={() => openAttachModal(record)}
              >
                {hasDetails ? "+ Add" : "Attach"}
              </Button>
            )}
            {hasDetails && (
              <Button
                size="small"
                icon={<EyeOutlined />}
                onClick={() => openPaymentDetail(record)}
              >
                {count}
              </Button>
            )}
            {fully && (
              <Tag color="green" style={{ margin: 0 }}>Fully Paid</Tag>
            )}
          </Space>
        );
      },
    },
    {
      title: t("table.status", { ns: "payment" }),
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status: string, record: PaymentType) => {
        const color: Record<string, string> = {
          Pending: "orange",
          Completed: "green",
        };
        return (
          <Select
            value={status}
            onChange={(newStatus) =>
              handleStatusChange(record.payment_id, newStatus)
            }
            style={{ width: 120, border: "none", boxShadow: "none" }}
          >
            {Object.keys(color).map((statusKey) => (
              <Select.Option key={statusKey} value={statusKey}>
                <Tag
                  color={color[statusKey]}
                  style={{
                    display: "block", width: "100%", textAlign: "center",
                    borderRadius: "0", border: "none",
                    padding: "4px 0", fontWeight: "bold",
                  }}
                >
                  {statusKey}
                </Tag>
              </Select.Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: t("table.engineer", { ns: "payment" }),
      dataIndex: "engineer",
      key: "engineer",
      align: "center",
    },
    {
      title: t("table.note", { ns: "payment" }),
      dataIndex: "note",
      key: "note",
      align: "center",
    },
    {
      title: t("table.actions", { ns: "payment" }),
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Button size="small" type="primary" onClick={() => onEdit(record)}>
            <EditOutlined /> {t("button.edit", { ns: "common" })}
          </Button>
          <Button size="small" danger onClick={() => onDelete(record)}>
            <DeleteOutlined /> {t("button.delete", { ns: "common" })}
          </Button>
        </Space>
      ),
    },
  ];

  // ── Render 
  return (
    <div style={{ overflow: "visible", minHeight: "600px" }}>
      <Form form={form} layout="vertical" requiredMark={false}>
        <Row gutter={16} align="bottom">
          {isMobile ? (
            <>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={t("filterDate.from_date", { ns: "common" })}
                  name="payment_date_from"
                >
                  <DatePicker
                    placeholder={t("filterDate.from_date", { ns: "common" })}
                    format="YYYY-MMMM-DD"
                    style={{ width: "100%" }}
                    onChange={handleDateChange}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={t("filterDate.to_date", { ns: "common" })}
                  name="payment_date_to"
                >
                  <DatePicker
                    placeholder={t("filterDate.to_date", { ns: "common" })}
                    format="YYYY-MMMM-DD"
                    style={{ width: "100%" }}
                    onChange={handleDateChange}
                  />
                </Form.Item>
              </Col>
            </>
          ) : (
            <Col xs={24} sm={24} md={8}>
              <Form.Item
                label={t("payment.dateRange", { ns: "payment" })}
                name="payment_date_range"
              >
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

          <Col xs={24} sm={12} md={5}>
            <Form.Item
              label={t("table.status", { ns: "payment" })}
              name="status"
            >
              <Select
                placeholder={t("status.selectStatus", { ns: "payment" })}
                onChange={handleStatusFilter}
              >
                <Select.Option value="pending">
                  {t("status.pending", { ns: "payment" })}
                </Select.Option>
                <Select.Option value="completed">
                  {t("status.completed", { ns: "payment" })}
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={5}>
            <Form.Item
              label={t("payment.paymentType", { ns: "payment" })}
              name="payment_type"
            >
              <Select
                placeholder={t("placeholder.selectPaymentType", { ns: "payment" })}
                onChange={handlePaymentTypeFilter}
              >
                <Select.Option value="cash">
                  {t("paymentType.cash", { ns: "payment" })}
                </Select.Option>
                <Select.Option value="creditCard">
                  {t("paymentType.creditCard", { ns: "payment" })}
                </Select.Option>
                <Select.Option value="bakor">
                  {t("paymentType.bakor", { ns: "payment" })}
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item>
              <Button
                onClick={handleClear}
                icon={<ClearOutlined />}
                block={isMobile}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Table
        columns={columns}
        dataSource={filteredPayments}
        size="small"
        rowKey="payment_id"
        pagination={{ pageSize: 10, simple: true }}
        scroll={{ x: "max-content" }}
        locale={{ emptyText: t("table.noData", { ns: "payment" }) }}
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