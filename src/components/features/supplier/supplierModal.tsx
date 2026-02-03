import { Modal } from "antd";
import type { ModalMode, SupplierType } from "./supplier.types";
import SupplierForm from "./supplierForm";


interface Props {
  open: boolean;
  mode: ModalMode;
  supplier: SupplierType | null;
  form: any;
  onCancel: () => void;
  onSave: () => void;
  onDelete: () => void;
}

const titleMap = {
  add: "Add Supplier",
  edit: "Edit Supplier",
  delete: "Delete Supplier",
};

const SupplierModal: React.FC<Props> = ({
  open,
  mode,
  supplier,
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
          Are you sure you want to delete <b>{supplier?.name}</b>?
        </p>
      ) : (
        <SupplierForm form={form} />
      )}
    </Modal>
  );
};

export default SupplierModal;