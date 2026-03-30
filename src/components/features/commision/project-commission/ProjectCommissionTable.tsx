import React, { useState } from "react";
import type { ColumnsType } from "antd/es/table";
import {
  Button, DatePicker, Form, Grid, message,
  Select, Space, Table, Tag,
} from "antd";
import {
  ClearOutlined, DeleteOutlined, EditOutlined, EyeOutlined,
} from "@ant-design/icons";
import type { CommissionStatus, CommissionType } from "../commission.types";
import type { PaymentDetail } from "../../payement/payment.types";
import CommissionViewModal from "./CommissionViewModal";
import { useTranslation } from "react-i18next";
import { useAppModal } from "../../../../shared/modal/AppModalProvider";
import { useSales } from "../../sales/SaleContext";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import AttachPaymentForm, { type AttachEntry } from "../../payement/AttachPaymentForm";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { useBreakpoint } = Grid;

interface Props {
  data: CommissionType[];
  onEdit: (commission: CommissionType) => void;
  onDelete: (commission: CommissionType) => void;
}

const statusColor: Record<CommissionStatus, string> = {
  Pending: "orange",
  Paid: "green",
  Cancelled: "red",
};

// ── Helpers 
const calcPaid = (c: CommissionType): number =>
  c.payment_details?.reduce((sum, d) => sum + (d.paid_amount ?? 0), 0) ?? 0;

const isFullyPaid = (c: CommissionType): boolean =>
  calcPaid(c) >= c.amount;

// ── ProjectCommissionTable 
const ProjectCommissionTable: React.FC<Props> = ({ data, onEdit, onDelete }) => {
  const [form] = Form.useForm();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const { t } = useTranslation(["commission", "common", "payment"]);
  const { openModal, closeModal } = useAppModal();
  const { commissions, setCommissions } = useSales();
  const [filterEngineer, setFilterEngineer] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterDateFrom, setFilterDateFrom] = useState<string>("");
  const [filterDateTo, setFilterDateTo] = useState<string>("");
  const [viewRecord, setViewRecord] = useState<CommissionType | null>(null);

  const engineers = Array.from(
    new Set(data.map((d) => d.engineer).filter(Boolean))
  );

  const filtered = data.filter((item) => {
    const matchEngineer = !filterEngineer || item.engineer === filterEngineer;
    const matchStatus = !filterStatus || item.status === filterStatus;
    const matchDate =
      (!filterDateFrom || item.commission_date >= filterDateFrom) &&
      (!filterDateTo || item.commission_date <= filterDateTo);
    return matchEngineer && matchStatus && matchDate;
  });

  const clearFilters = () => {
    setFilterEngineer("");
    setFilterStatus("");
    setFilterDateFrom("");
    setFilterDateTo("");
    form.resetFields();
  };

  // ── View payment details 
  const openPaymentDetail = (commission: CommissionType) => {
    const paid = calcPaid(commission);
    const remaining = commission.amount - paid;

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
              <span style={{ color: "#666" }}>Commission Amount:</span>
              <span style={{ fontWeight: 600 }}>${commission.amount.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#666" }}>Total Paid:</span>
              <span style={{ color: "#52c41a", fontWeight: 600 }}>${paid.toFixed(2)}</span>
            </div>
            <div style={{
              display: "flex", justifyContent: "space-between",
              borderTop: "1px solid #e8e8e8", paddingTop: 4, marginTop: 4,
            }}>
              <span style={{ color: "#666" }}>Remaining:</span>
              <span style={{ fontWeight: 700, color: remaining <= 0 ? "#52c41a" : "#ff4d4f" }}>
                {remaining <= 0 ? "✓ Fully Paid" : `$${remaining.toFixed(2)}`}
              </span>
            </div>
          </div>

          {/* Detail entries */}
          {commission.payment_details?.map((d, i) => (
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
  const openAttachModal = (record: CommissionType) => {
    const alreadyPaid = calcPaid(record);
    const entriesRef = {
      current: [{ image: null, paid_amount: 0, type: "image" }] as AttachEntry[],
    };

    openModal("view", {
      titleMap: { view: "Attach Payment" },
      content: (
        <AttachPaymentForm
          entriesRef={entriesRef}
          totalAmount={record.amount}
          alreadyPaid={alreadyPaid}
        />
      ),
      onOk: () => {
        const newDetails: PaymentDetail[] = entriesRef.current.map((e) => ({
          id: Math.random(),
          ref_id: record.commission_id,
          ref_type: "commission" as const,
          paid_amount: e.paid_amount,
          payment_date: dayjs().format("YYYY-MM-DD"),
          ...(e.image ? { image: e.image } : {}),
        }));

        const sessionTotal = entriesRef.current.reduce(
          (sum, e) => sum + e.paid_amount, 0
        );
        const newPaid = alreadyPaid + sessionTotal;
        const fullyPaid = newPaid >= record.amount;

        setCommissions((prev): CommissionType[] =>
          prev.map((c) =>
            c.commission_id === record.commission_id
              ? {
                  ...c,
                  payment_details: [...(c.payment_details ?? []), ...newDetails],
                  paid_amount: newPaid,
                  // auto-set status to Paid when fully paid
                  status: fullyPaid ? "Paid" : c.status,
                }
              : c
          )
        );

        message.success(
          fullyPaid
            ? "Fully paid! Status set to Paid ✓"
            : `${entriesRef.current.length} payment(s) attached`
        );
        closeModal();
      },
    });
  };

  // ── Status change 
  const handleStatusChange = (commission_id: number, newStatus: string) => {
    setCommissions(
      commissions.map((c) =>
        c.commission_id === commission_id
          ? { ...c, status: newStatus as CommissionStatus }
          : c
      )
    );
    message.success(`Status updated to ${newStatus}`);
  };

  // ── Columns 
  const columns: ColumnsType<CommissionType> = [
    {
      title: t("table.id", { ns: "commission" }),
      dataIndex: "commission_id",
      key: "commission_id",
      align: "center",
      sorter: (a, b) => a.commission_id - b.commission_id,
      defaultSortOrder: "ascend",
      width: 60,
    },
    {
      title: t("table.project", { ns: "commission" }),
      dataIndex: "project",
      key: "project",
      ellipsis: true,
    },
    {
      title: t("table.engineer", { ns: "commission" }),
      dataIndex: "engineer",
      key: "engineer",
    },
    {
      title: t("table.invoiceTotal", { ns: "commission" }),
      dataIndex: "invoice_total",
      key: "invoice_total",
      align: "right",
      render: (val?: number) =>
        val != null ? `$${val.toFixed(2)}` : <span style={{ color: "#aaa" }}>—</span>,
    },
    {
      title: t("table.rate", { ns: "commission" }),
      dataIndex: "commission_rate",
      key: "commission_rate",
      align: "center",
      render: (val?: number) =>
        val != null ? `${val}%` : <span style={{ color: "#aaa" }}>—</span>,
    },
    {
      title: t("table.commissionAmount", { ns: "commission" }),
      dataIndex: "amount",
      key: "amount",
      align: "right",
      render: (val: number) => (
        <span style={{ fontWeight: 600, color: "#1677ff" }}>
          ${val.toFixed(2)}
        </span>
      ),
    },
    {
      title: t("table.date", { ns: "commission" }),
      dataIndex: "commission_date",
      key: "commission_date",
      align: "center",
    },
    // ── Paid tracker column 
    {
      title: "Paid / Remaining",
      key: "paid_tracker",
      align: "center",
      render: (_, record) => {
        const paid = calcPaid(record);
        const remaining = record.amount - paid;
        const pct = Math.min(100, (paid / record.amount) * 100);
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
    // ── Payment detail / attach column 
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
      title: t("table.status", { ns: "commission" }),
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status: string, record: CommissionType) => {
        const color: Record<string, string> = {
          Pending: "orange",
          Paid: "green",
          Cancelled: "red",
        };
        return (
          <Select
            value={status}
            onChange={(newStatus) =>
              handleStatusChange(record.commission_id, newStatus)
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
      title: t("table.actions", { ns: "commission" }),
      key: "actions",
      align: "center",
      width: 130,
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => setViewRecord(record)}
          />
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          />
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(record)}
          />
        </Space>
      ),
    },
  ];

  const mobileColumns: ColumnsType<CommissionType> = [
    {
      title: t("table.commission", { ns: "commission" }),
      key: "mobile",
      render: (_, record) => {
        const paid = calcPaid(record);
        const remaining = record.amount - paid;
        const fully = remaining <= 0;
        const pct = Math.min(100, (paid / record.amount) * 100);

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontWeight: 600 }}>{record.project}</div>
            <div style={{ color: "#666", fontSize: 12 }}>
              {record.engineer} · {record.commission_date}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              <Tag color={record.status ? statusColor[record.status] : "default"}>
                {record.status || "—"}
              </Tag>
              <span style={{ fontWeight: 600, color: "#1677ff" }}>
                ${record.amount.toFixed(2)} ({record.commission_rate ?? "—"}%)
              </span>
            </div>
            <div style={{ fontSize: 12, display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#52c41a" }}>Paid: ${paid.toFixed(2)}</span>
              <span style={{ color: fully ? "#52c41a" : "#ff4d4f" }}>
                {fully ? "✓ Fully Paid" : `Rem: $${remaining.toFixed(2)}`}
              </span>
            </div>
            <div style={{ height: 4, borderRadius: 2, background: "#f0f0f0", overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${pct}%`,
                background: fully ? "#52c41a" : "#1677ff",
                borderRadius: 2, transition: "width 0.3s",
              }} />
            </div>
          </div>
        );
      },
    },
    {
      title: t("table.actions", { ns: "commission" }),
      key: "actions",
      align: "center",
      width: 110,
      render: (_, record) => (
        <Space size="small">
          <Button size="small" icon={<EyeOutlined />} onClick={() => setViewRecord(record)} />
          <Button size="small" icon={<EditOutlined />} onClick={() => onEdit(record)} />
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => onDelete(record)} />
        </Space>
      ),
    },
  ];

  // ── Render 
  return (
    <>
      <Form form={form} layout="inline" style={{ marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <Form.Item name="engineer" style={{ marginBottom: isMobile ? 8 : 0 }}>
          <Select
            placeholder={t("placeholder.filterEngineer", { ns: "commission" })}
            style={{ width: 160 }}
            allowClear
            options={engineers.map((e) => ({ value: e, label: e }))}
            onChange={(val) => setFilterEngineer(val ?? "")}
          />
        </Form.Item>

        <Form.Item name="status" style={{ marginBottom: isMobile ? 8 : 0 }}>
          <Select
            placeholder={t("placeholder.filterStatus", { ns: "commission" })}
            style={{ width: 160 }}
            allowClear
            options={[
              { value: "Pending", label: t("status.pending", { ns: "commission" }) },
              { value: "Paid", label: t("status.paid", { ns: "commission" }) },
              { value: "Cancelled", label: t("status.cancelled", { ns: "commission" }) },
            ]}
            onChange={(val) => setFilterStatus(val ?? "")}
          />
        </Form.Item>

        {isMobile ? (
          <>
            <Form.Item name="date_from" style={{ marginBottom: 8 }}>
              <DatePicker
                placeholder={t("filterDate.from_date", { ns: "common" })}
                format="YYYY-MM-DD"
                style={{ width: 160 }}
                onChange={(val) => setFilterDateFrom(val ? val.format("YYYY-MM-DD") : "")}
              />
            </Form.Item>
            <Form.Item name="date_to" style={{ marginBottom: 8 }}>
              <DatePicker
                placeholder={t("filterDate.to_date", { ns: "common" })}
                format="YYYY-MM-DD"
                style={{ width: 160 }}
                onChange={(val) => setFilterDateTo(val ? val.format("YYYY-MM-DD") : "")}
              />
            </Form.Item>
          </>
        ) : (
          <Form.Item name="date_range" style={{ marginBottom: 0 }}>
            <DatePicker.RangePicker
              placeholder={[
                t("filterDate.from_date", { ns: "common" }),
                t("filterDate.to_date", { ns: "common" }),
              ]}
              format="YYYY-MM-DD"
              style={{ width: 280 }}
              onChange={(vals) => {
                setFilterDateFrom(vals?.[0] ? vals[0].format("YYYY-MM-DD") : "");
                setFilterDateTo(vals?.[1] ? vals[1].format("YYYY-MM-DD") : "");
              }}
            />
          </Form.Item>
        )}

        <Form.Item>
          <Button icon={<ClearOutlined />} onClick={clearFilters} block={isMobile} />
        </Form.Item>
      </Form>

      <Table
        columns={isMobile ? mobileColumns : columns}
        dataSource={filtered}
        rowKey="commission_id"
        size="small"
        pagination={{ pageSize: 10, showSizeChanger: false }}
        scroll={{ x: "max-content" }}
        locale={{ emptyText: t("table.noDataProject", { ns: "commission" }) }}
      />

      <CommissionViewModal
        record={viewRecord}
        onClose={() => setViewRecord(null)}
        isMobile={isMobile}
      />
    </>
  );
};

export default ProjectCommissionTable;