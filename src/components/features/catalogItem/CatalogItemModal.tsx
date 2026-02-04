import { Modal } from "antd";
import type { CatalogItemType, ModalMode } from "./catalogItem.types";
import CatalogItemForm from "./CatalogItemForm";



interface Props {
  open: boolean;
  mode: ModalMode;
  item: CatalogItemType | null;
  form: any;
  onCancel: () => void;
  onSave: () => void;
  onDelete: () => void;
}

const titleMap = {
  add: "Add Item",
  edit: "Edit Item",
  delete: "Delete Item",
};

const CatalogItemModal: React.FC<Props> = ({
  open,
  mode,
  item,
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
          Are you sure you want to delete <b>{item?.name}</b>?
        </p>
      ) : (
        <CatalogItemForm form={form} />
      )}
    </Modal>
  );
};

export default CatalogItemModal;
