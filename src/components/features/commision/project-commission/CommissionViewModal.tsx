import React from "react";
import { Button, Descriptions, Divider, Modal, Tag } from "antd";
import type { CommissionStatus, CommissionType } from "../commission.types";

interface Props {
  record: CommissionType | null;
  onClose: () => void;
  isMobile: boolean;
}

const statusColor: Record<CommissionStatus, string> = {
  Pending: "orange",
  Paid: "green",
  Cancelled: "red",
};

const CommissionViewModal: React.FC<Props> = ({ record, onClose, isMobile }) => {
  return (
    <Modal
      title="Commission Details"
      open={!!record}
      onCancel={onClose}
      footer={<Button onClick={onClose}>Close</Button>}
      width={isMobile ? "100%" : 520}
    >
      {record && (
        <>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Commission ID">
              #{record.commission_id}
            </Descriptions.Item>
            <Descriptions.Item label="INV / Project">
              {record.project ?? "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Invoice ID">
              {record.invoice_id != null ? `INV-${record.invoice_id}` : "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Engineer">
              {record.engineer ?? "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Date">
              {record.commission_date}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {record.status ? (
                <Tag color={statusColor[record.status]}>{record.status}</Tag>
              ) : "—"}
            </Descriptions.Item>
          </Descriptions>

          <Divider plain>
            Commission Breakdown
          </Divider>

          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Invoice Total">
              {record.invoice_total != null
                ? `$${record.invoice_total.toFixed(2)}`
                : "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Commission Rate">
              {record.commission_rate != null ? `${record.commission_rate}%` : "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Commission Amount">
              <span style={{ fontWeight: 700, fontSize: 15, color: "#1677ff" }}>
                ${record.amount.toFixed(2)}
              </span>
            </Descriptions.Item>
            {record.description && (
              <Descriptions.Item label="Description">
                {record.description}
              </Descriptions.Item>
            )}
          </Descriptions>
        </>
      )}
    </Modal>
  );
};

export default CommissionViewModal;