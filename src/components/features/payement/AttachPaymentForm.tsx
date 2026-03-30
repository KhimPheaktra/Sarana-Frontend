import { Button, Form, InputNumber, Select, Upload } from "antd";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { useState } from "react";

export interface AttachEntry {
  image: string | null;
  paid_amount: number;
  type: string;
}

interface Props {
  entriesRef: { current: AttachEntry[] };
  totalAmount: number;       // total the record owes
  alreadyPaid: number;       // already paid before this modal
}

const AttachPaymentForm: React.FC<Props> = ({ entriesRef, totalAmount, alreadyPaid }) => {
  const [items, setItems] = useState<AttachEntry[]>(entriesRef.current);

  const updateItem = (index: number, field: string, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
    entriesRef.current = updated;
  };

  const addItem = () => {
    const updated = [...items, { image: null, paid_amount: 0, type: "image" }];
    setItems(updated);
    entriesRef.current = updated;
  };

  const removeItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    entriesRef.current = updated;
  };

  const thisSessionTotal = items.reduce((sum, e) => sum + (e.paid_amount || 0), 0);
  const newTotalPaid = alreadyPaid + thisSessionTotal;
  const remaining = totalAmount - newTotalPaid;
  const isFullyPaid = remaining <= 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Summary bar */}
      <div style={{
        background: "#f9f9f9",
        border: "1px solid #e8e8e8",
        borderRadius: 8,
        padding: "10px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        fontSize: 13,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#666" }}>Total Amount:</span>
          <span style={{ fontWeight: 600 }}>${totalAmount.toFixed(2)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#666" }}>Already Paid:</span>
          <span style={{ color: "#52c41a", fontWeight: 600 }}>${alreadyPaid.toFixed(2)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#666" }}>This Session:</span>
          <span style={{ color: "#1677ff", fontWeight: 600 }}>${thisSessionTotal.toFixed(2)}</span>
        </div>
        <div style={{ borderTop: "1px solid #e8e8e8", marginTop: 4, paddingTop: 4, display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#666" }}>Remaining After Save:</span>
          <span style={{ fontWeight: 700, color: isFullyPaid ? "#52c41a" : "#ff4d4f" }}>
            {isFullyPaid ? "✓ Fully Paid" : `$${remaining.toFixed(2)}`}
          </span>
        </div>
      </div>

      {/* Payment entries */}
      {items.map((item, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #f0f0f0",
            borderRadius: 8,
            padding: 12,
            position: "relative",
          }}
        >
          {items.length > 1 && (
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              style={{ position: "absolute", top: 8, right: 8 }}
              onClick={() => removeItem(index)}
            />
          )}

          <div style={{ marginBottom: 8, fontWeight: 500 }}>
            Payment #{index + 1}
          </div>

          <Form.Item label="Type" style={{ marginBottom: 8 }}>
            <Select
              value={item.type}
              onChange={(val) => updateItem(index, "type", val)}
              options={[
                { label: "Bank Transfer (Image)", value: "image" },
                { label: "Cash", value: "cash" },
              ]}
            />
          </Form.Item>

          <Form.Item label="Amount" style={{ marginBottom: 8 }}>
            <InputNumber
              min={0}
              value={item.paid_amount}
              onChange={(val) => updateItem(index, "paid_amount", val ?? 0)}
              style={{ width: "100%" }}
              prefix="$"
            />
          </Form.Item>

          {item.type === "image" && (
            <Upload
              showUploadList={false}
              beforeUpload={(file) => {
                const url = URL.createObjectURL(file);
                updateItem(index, "image", url);
                return false;
              }}
            >
              {item.image ? (
                <div style={{ position: "relative" }}>
                  <img
                    src={item.image}
                    alt="receipt"
                    style={{
                      width: "100%",
                      maxHeight: 150,
                      objectFit: "contain",
                      borderRadius: 4,
                      cursor: "pointer",
                      border: "1px solid #e8e8e8",
                    }}
                  />
                  {/* Amount overlay on image */}
                  <div style={{
                    position: "absolute",
                    bottom: 6,
                    right: 6,
                    background: "rgba(0,0,0,0.6)",
                    color: "#fff",
                    borderRadius: 4,
                    padding: "2px 8px",
                    fontSize: 13,
                    fontWeight: 700,
                  }}>
                    ${item.paid_amount.toFixed(2)}
                  </div>
                </div>
              ) : (
                <Button icon={<UploadOutlined />}>Upload Receipt</Button>
              )}
            </Upload>
          )}

          {item.type === "cash" && (
            <div style={{
              background: "#f6ffed",
              border: "1px solid #b7eb8f",
              borderRadius: 6,
              padding: "6px 10px",
              color: "#389e0d",
              fontSize: 12,
              display: "flex",
              justifyContent: "space-between",
            }}>
              <span>Cash payment — no image required</span>
              <span style={{ fontWeight: 700 }}>${item.paid_amount.toFixed(2)}</span>
            </div>
          )}
        </div>
      ))}

      <Button type="dashed" onClick={addItem} block>
        + Add Another Payment
      </Button>
    </div>
  );
};

export default AttachPaymentForm;