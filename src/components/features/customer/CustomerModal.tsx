import { Modal } from "antd";
import type { ModalMode,CusType } from "./cus.types";
import CustomerForm from "./CustomerForm";


interface Props {
  open: boolean;
  mode: ModalMode;
  customer: CusType | null;
  form: any;
  onCancel: () => void;
  onSave: () => void;
  onDelete: () => void;
}

const titleMap = {
  add: "Add Customer",
  edit: "Edit Customer",
  delete: "Delete Customer",
};

const CustomerModal: React.FC<Props> = ({
  open,
  mode,
  customer,
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
          Are you sure you want to delete <b>{customer?.name}</b>?
        </p>
      ) : (
        <CustomerForm form={form} />
      )}
    </Modal>
  );
};

export default CustomerModal;