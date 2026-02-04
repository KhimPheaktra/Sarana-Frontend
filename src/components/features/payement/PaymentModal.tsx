import { Modal } from "antd";
import PaymentForm from "./PaymentForm";
import type { ModalMode, PaymentType } from "./payment.types";



interface Props {
  open: boolean;
  mode: ModalMode;
  payment: PaymentType | null;
  form: any;
  onCancel: () => void;
  onSave: () => void;
  onDelete: () => void;
}

const titleMap = {
  add: "Add Payment",
  edit: "Edit Payment",
  delete: "Delete Payment",
};

const PaymentModal: React.FC<Props> = ({
  open,
  mode,
  payment,
  form,
  onCancel,
  onSave,
  onDelete,
}) => {
  if (!mode) return null;

  return (
    <Modal
      open={open}
      title={titleMap[mode]}
      onCancel={onCancel}
      onOk={mode === "delete" ? onDelete : onSave}
      okText={
        mode === "delete" ? "Delete"
        : mode === "edit" ? "Edit"
        : "Add"
      }
      okButtonProps={{ danger: mode === "delete" }}
    >
      {mode === "delete" ? (
        <p>
          Are you sure you want to delete <b>{payment?.payment_id}</b>?
        </p>
      ) : (
        <PaymentForm form={form} />
      )}
    </Modal>
  );
};

export default PaymentModal;