import React, { useState } from "react";
import type { ColumnsType } from "antd/es/table";
import {
  Button,
  DatePicker,
  Form,
  Grid,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import {
  ClearOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { CommissionStatus, CommissionType } from "../commission.types";
import CommissionViewModal from "./CommissionViewModal";

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

const ProjectCommissionTable: React.FC<Props> = ({ data, onEdit, onDelete }) => {
  const [form] = Form.useForm();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [filterEngineer, setFilterEngineer] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterDateFrom, setFilterDateFrom] = useState<string>("");
  const [filterDateTo, setFilterDateTo] = useState<string>("");
  const [viewRecord, setViewRecord] = useState<CommissionType | null>(null);

  const engineers = Array.from(new Set(data.map(d => d.engineer).filter(Boolean)));

  const filtered = data.filter(item => {
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

  const columns: ColumnsType<CommissionType> = [
    {
      title: "ID",
      dataIndex: "commission_id",
      key: "commission_id",
      align: "center",
      sorter: (a, b) => a.commission_id - b.commission_id,
      defaultSortOrder: "ascend",
      width: 60,
    },
    {
      title: "Project",
      dataIndex: "project",
      key: "project",
      ellipsis: true,
    },
    {
      title: "Engineer",
      dataIndex: "engineer",
      key: "engineer",
    },
    {
      title: "Invoice Total ($)",
      dataIndex: "invoice_total",
      key: "invoice_total",
      align: "right",
      render: (val?: number) =>
        val != null ? `$${val.toFixed(2)}` : <span style={{ color: "#aaa" }}>—</span>,
    },
    {
      title: "Rate",
      dataIndex: "commission_rate",
      key: "commission_rate",
      align: "center",
      render: (val?: number) =>
        val != null ? `${val}%` : <span style={{ color: "#aaa" }}>—</span>,
    },
    {
      title: "Commission ($)",
      dataIndex: "amount",
      key: "amount",
      align: "right",
      render: (val: number) => (
        <span style={{ fontWeight: 600, color: "#1677ff" }}>${val.toFixed(2)}</span>
      ),
    },
    {
      title: "Date",
      dataIndex: "commission_date",
      key: "commission_date",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status?: CommissionStatus) =>
        status ? <Tag color={statusColor[status]}>{status}</Tag> : "—",
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      width: 130,
      render: (_, record) => (
        <Space size="small">
          <Button size="small" icon={<EyeOutlined />} onClick={() => setViewRecord(record)} />
          <Button size="small" icon={<EditOutlined />} onClick={() => onEdit(record)} />
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => onDelete(record)} />
        </Space>
      ),
    },
  ];

  const mobileColumns: ColumnsType<CommissionType> = [
    {
      title: "Commission",
      key: "mobile",
      render: (_, record) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
        </div>
      ),
    },
    {
      title: "Actions",
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

  return (
    <>
      {/* Filters */}
      <Form form={form} layout="inline" style={{ marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <Form.Item name="engineer" style={{ marginBottom: isMobile ? 8 : 0 }}>
          <Select
            placeholder="Filter by Engineer"
            style={{ width: 160 }}
            allowClear
            options={engineers.map(e => ({ value: e, label: e }))}
            onChange={val => setFilterEngineer(val ?? "")}
          />
        </Form.Item>

        <Form.Item name="status" style={{ marginBottom: isMobile ? 8 : 0 }}>
          <Select
            placeholder="Filter by Status"
            style={{ width: 160 }}
            allowClear
            options={[
              { value: "Pending", label: "Pending" },
              { value: "Paid", label: "Paid" },
              { value: "Cancelled", label: "Cancelled" },
            ]}
            onChange={val => setFilterStatus(val ?? "")}
          />
        </Form.Item>
        {isMobile ? (
          <>
            <Form.Item name="date_from" style={{ marginBottom: 8 }}>
              <DatePicker
                placeholder="From date"
                format="YYYY-MM-DD"
                style={{ width: 160 }}
                onChange={val => setFilterDateFrom(val ? val.format("YYYY-MM-DD") : "")}
              />
            </Form.Item>
            <Form.Item name="date_to" style={{ marginBottom: 8 }}>
              <DatePicker
                placeholder="To date"
                format="YYYY-MM-DD"
                style={{ width: 160 }}
                onChange={val => setFilterDateTo(val ? val.format("YYYY-MM-DD") : "")}
              />
            </Form.Item>
          </>
        ) : (
          <Form.Item name="date_range" style={{ marginBottom: 0 }}>
            <DatePicker.RangePicker
              placeholder={["From date", "To date"]}
              format="YYYY-MM-DD"
              style={{ width: 280 }}
              onChange={vals => {
                setFilterDateFrom(vals?.[0] ? vals[0].format("YYYY-MM-DD") : "");
                setFilterDateTo(vals?.[1] ? vals[1].format("YYYY-MM-DD") : "");
              }}
            />
          </Form.Item>
        )}

        <Form.Item>
          <Button icon={<ClearOutlined />} onClick={clearFilters} block={isMobile}>
            Clear
          </Button>
        </Form.Item>
      </Form>

      <Table
        columns={isMobile ? mobileColumns : columns}
        dataSource={filtered}
        rowKey="commission_id"
        size="small"
        pagination={{ pageSize: 10, showSizeChanger: false }}
        scroll={{ x: isMobile ? undefined : 900 }}
      />

      {/* View modal*/}
      <CommissionViewModal
        record={viewRecord}
        onClose={() => setViewRecord(null)}
        isMobile={isMobile}
      />
    </>
  );
};

export default ProjectCommissionTable;