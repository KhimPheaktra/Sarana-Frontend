import { Modal } from "antd";
import type { ModalMode, PurchaseType } from "./purchase.types";
import PurchaseForm from "./purchaseForm";



interface Props {
  open: boolean;
  mode: ModalMode;
  purchase: PurchaseType | null;
  form: any;
  onCancel: () => void;
  onSave: () => void;
  onDelete: () => void;
}

const titleMap = {
  add: "Add Purchase",
  edit: "Edit Purchase",
  delete: "Delete Purchase",
  view: "View Purchase"
};

const PurchaseModal: React.FC<Props> = ({
  open,
  mode,
  purchase,
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
      okButtonProps={{ danger: mode === "delete" , style: mode === "view" ? { display: 'none' } : {} }}
    >
      {mode === "delete" ? (
        <p>
          Are you sure you want to delete <b>{purchase?.purchase_id}</b>?
        </p>
      ) : (
        <PurchaseForm form={form} />
      )}
    </Modal>
  );
};

export default PurchaseModal;